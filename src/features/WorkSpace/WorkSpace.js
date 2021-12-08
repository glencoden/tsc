import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Card, CardActions, CardContent, TextField, Typography } from '@material-ui/core';
import { selectActiveEvent, selectActiveCompetitors, selectEventIdsForYear } from '../../redux/selectors';
import { getCompetitors, saveCompetitor, setResult, setWeight, setRanked } from '../Competitors/competitorsSlice';
import { useWorkSpaceStyles } from '../../styles/styleHooks';
import { getPoints } from '../../competition-logic/points';
import { defaultValues } from '../../util/helpers';
import { AgesPerGroup, Gender, Group, Exceptional } from '../../competition-logic/values';
import { getAge } from '../../competition-logic/year';
import { getWeight } from '../../competition-logic/weights';
import useFilters from '../../hooks/useFilters';
import useInterval from '../../hooks/useInterval';
import GymnasticsList from './GymnasticsList/GymnasticsList';
import { MUI_INPUT_FIELD_MARGIN, WORK_SPACE_SYNCH_INTERVAL } from '../../constants';

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


function WorkSpace() {
    const dispatch = useDispatch();

    const competitors = useSelector(selectActiveCompetitors);
    const rankedCompetitorList = useSelector(state => state.competitors.rankedList);

    const activeEvent = useSelector(selectActiveEvent);
    const eventIdsForYear = useSelector(selectEventIdsForYear);
    const eventIds = activeEvent.final ? eventIdsForYear : activeEvent.id;

    const classes = useWorkSpaceStyles();

    const [ activeCompetitorId, setActiveCompetitorId ] = useState(0);

    const [ filterCallback, FilterComponent ] = useFilters(filters);

    const competitorIds = activeEvent?.competitorIds || defaultValues.ARRAY;
    const sync = useCallback(() => dispatch(getCompetitors(competitorIds.filter(id => id !== activeCompetitorId))), [ dispatch, activeCompetitorId, competitorIds ]);

    useInterval(WORK_SPACE_SYNCH_INTERVAL, sync);

    useEffect(() => {
        dispatch(setRanked({ competitors, eventIds }));
    }, [ Object.keys(competitors).length ]); // eventIds will be the same unless usage around new year

    if (!activeEvent.id) {
        return null;
    }

    return (
        <div>
            <FilterComponent />
            {!!rankedCompetitorList.length && rankedCompetitorList.filter(filterCallback).map((competitor, i) => {
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
                                                        margin={MUI_INPUT_FIELD_MARGIN}
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