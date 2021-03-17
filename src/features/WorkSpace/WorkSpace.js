import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Card, CardActions, CardContent, TextField, Typography } from '@material-ui/core';
import { selectActiveEvent, selectActiveCompetitors, selectEventIdsForYear } from '../../app/selectors';
import { getCompetitors, saveCompetitor, setResult, setWeight } from '../Competitors/competitorsSlice';
import { useWorkSpaceStyles } from '../../app/styleHooks';
import { getPoints } from '../../app/lib/points';
import { getRanks } from './lib/util';
import { defaultValues } from '../../app/lib/helpers';
import { AgesPerGroup, Gender, Group, Exceptional } from '../../app/lib/values';
import { getAge } from '../../app/lib/year';
import { getWeight } from '../../app/lib/weights';
import useFilters from '../../app/hooks/useFilters';
import useInterval from '../../app/hooks/useInterval';
import GymnasticsList from './GymnasticsList/GymnasticsList';
import { requestService } from 'harbor-js';

export const PrintActionTypes = {
    CERTIFICATES: 'certificates',
    PROTOCOL: 'protocol'
};

let competitorsForPrint = [];

export function fetchPrint(type) {
    const body = {};
    let url;
    switch (type) {
        case PrintActionTypes.CERTIFICATES:
            body.competitors = competitorsForPrint;
            url = `${requestService.baseUrl}/tsc/print_certificates`;
            break;
        case PrintActionTypes.PROTOCOL:
            body.competitors = competitorsForPrint;
            url = `${requestService.baseUrl}/tsc/print_protocol`;
            break;
        default:
    }
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(body)
    })
        .then(response => response.blob())
        .then(blob => {
            const url = URL.createObjectURL(new Blob([ blob ], { type: 'application/pdf' }));
            const a = document.createElement('a');
            a.href = url;
            a.target = '_blank';
            a.click();
            setTimeout(() => URL.revokeObjectURL(url), 100);
        })
        .catch(err => console.error(err));
}

const filters = [
    {
        [Gender.FEMALE]: competitor => competitor.gender === Gender.FEMALE,
        [Gender.MALE]: competitor => competitor.gender === Gender.MALE
    },
    {
        [Group.A]: competitor => AgesPerGroup[Group.A].includes(getAge(competitor.year)),
        [Group.B]: competitor => AgesPerGroup[Group.B].includes(getAge(competitor.year))
    }
];

const inputMargin = 'dense';
const syncTime = 5;


function WorkSpace() {
    const dispatch = useDispatch();
    const activeEvent = useSelector(selectActiveEvent);
    const competitors = useSelector(selectActiveCompetitors);
    const eventIdsForYear = useSelector(selectEventIdsForYear);
    const classes = useWorkSpaceStyles();

    const [ competitorList, setCompetitorList ] = useState([]);
    const [ activeCompetitorId, setActiveCompetitorId ] = useState(0);

    const [ filterCallback, FilterComponent ] = useFilters(filters);

    const competitorIds = activeEvent?.competitorIds || defaultValues.ARRAY;
    const sync = useCallback(() => dispatch(getCompetitors(competitorIds.filter(id => id !== activeCompetitorId))), [ dispatch, activeCompetitorId, competitorIds ]);

    useInterval(syncTime, sync);

    useEffect(() => {
        if (!Array.isArray(competitors)) {
            return;
        }
        const curCompetitorList = getRanks(competitors, activeEvent.final ? eventIdsForYear : activeEvent.id)
            .sort((a, b) => a.name.charCodeAt(0) - b.name.charCodeAt(0));
        setCompetitorList(curCompetitorList);
    }, [ activeEvent.id, competitors ]);

    competitorsForPrint = competitorList;

    if (!activeEvent.id) {
        return null;
    }

    return (
        <div>
            <FilterComponent />
            {!!competitorList.length && competitorList.filter(filterCallback).map((competitor, i) => {
                const active = activeCompetitorId === competitor.id;
                return (
                    <Card
                        key={i}
                        className={`${classes.card}`}
                        elevation={3}
                        onClick={() => {
                            if (active) {
                                return;
                            }
                            if (activeCompetitorId) {
                                dispatch(saveCompetitor(competitors.find(e => e.id === activeCompetitorId)));
                            }
                            setActiveCompetitorId(competitor.id);
                        }}
                    >
                        <CardContent>
                            <div className={classes.row}>
                                <Typography variant="overline" color="textSecondary" display="block">
                                    {`${competitor.year} | ${competitor.gender}${competitor.weight[activeEvent.id] ? ` | ${competitor.weight[activeEvent.id]} kg` : ''}`}
                                </Typography>
                                <Typography variant="overline" color="textSecondary" display="block">
                                    Punkte {competitor.points}
                                </Typography>
                            </div>
                            <div className={classes.row}>
                                <Typography variant="h6" color="textPrimary">
                                    {competitor.name}
                                </Typography>
                                <Typography variant="h6" color="primary">
                                    Platz {competitor.rank}
                                </Typography>
                            </div>
                            {active && (
                                <>
                                    <div className={classes.editor}>
                                        <div className={classes.editorEntry}>
                                            <TextField
                                                id="filled-weight"
                                                label="Körpergewicht"
                                                type="number"
                                                variant="outlined"
                                                value={competitor.weight[activeEvent.id]}
                                                onChange={event => dispatch(setWeight({
                                                    eventId: activeEvent.id,
                                                    competitorId: competitor.id,
                                                    weight: event.target.value
                                                }))}
                                                margin="dense"
                                            />
                                        </div>
                                        {Object.keys(activeEvent.disciplines).filter(e => e !== Exceptional.GYMNASTICS).map(discipline => {
                                            if (!activeEvent.disciplines[discipline]) {
                                                return null;
                                            }
                                            const value = competitor.results[activeEvent.id]?.[discipline];
                                            const weight = getWeight(competitor.year, competitor.gender, competitor.weight[activeEvent.id], discipline);
                                            return (
                                                <div key={discipline} className={classes.editorEntry}>
                                                    <TextField
                                                        id={`filled-${discipline}`}
                                                        label={`${discipline}${weight ? ` ${weight} kg` : ''}`}
                                                        type="number"
                                                        variant="filled"
                                                        value={value}
                                                        onChange={event => dispatch(setResult({
                                                            eventId: activeEvent.id,
                                                            competitorId: competitor.id,
                                                            discipline,
                                                            result: event.target.value
                                                        }))}
                                                        margin={inputMargin}
                                                    />
                                                    <span className={`material-icons ${classes.editorIcon}`}>
                                                        play_arrow
                                                    </span>
                                                    <Typography color="primary" display="inline" className={classes.editorPoints}>
                                                        {value ? getPoints(discipline, value) : '--'}
                                                    </Typography>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <GymnasticsList event={activeEvent} competitor={competitor} />
                                    <CardActions className={classes.marginTop}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => {
                                                dispatch(saveCompetitor(competitors.find(e => e.id === competitor.id)));
                                                setActiveCompetitorId(0);
                                            }}
                                        >
                                            Fertig
                                        </Button>
                                    </CardActions>
                                </>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

export default WorkSpace;