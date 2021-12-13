import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Card, CardActions, CardContent, TextField, Typography } from '@material-ui/core';
import { selectActiveEvent, selectActiveCompetitors, selectEventIdsForYear } from '../../redux/selectors';
import { getCompetitors, saveCompetitor, setResult, setWeight, setActiveEventIds } from '../Competitors/competitorsSlice';
import { useWorkSpaceStyles } from '../../styles/styleHooks';
import { getPoints } from '../../competition-logic/points';
import { defaultValues } from '../../util/helpers';
import { AgesPerGroup, Gender, Group, Exceptional } from '../../competition-logic/values';
import { getAge } from '../../competition-logic/year';
import { getWeight } from '../../competition-logic/weights';
import useInterval from '../../hooks/useInterval';
import ListFilters from './ListFilters/ListFilters';
import GymnasticsList from './GymnasticsList/GymnasticsList';
import { MUI_INPUT_FIELD_MARGIN, WORK_SPACE_SYNCH_INTERVAL } from '../../constants';
import { getRanks } from './util';

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
    // util
    const dispatch = useDispatch();
    const classes = useWorkSpaceStyles();

    // set active event ids on mount

    const activeEvent = useSelector(selectActiveEvent);
    const eventIdsForYear = useSelector(selectEventIdsForYear);

    useEffect(() => {
        dispatch(setActiveEventIds(
            activeEvent.final ? eventIdsForYear : [ activeEvent.id ]
        ))
    }, []);

    // get competitors and active event ids to create ranked list

    const competitors = useSelector(selectActiveCompetitors);
    const activeEventIds = useSelector(state => state.competitors.activeEventIds);

    // local state for user work

    const [ activeCompetitorId, setActiveCompetitorId ] = useState(0);
    const [ filter, setFilter ] = useState(() => () => true);

    // BE state synch logic

    const competitorIds = activeEvent?.competitorIds || defaultValues.ARRAY;
    const sync = useCallback(() => dispatch(getCompetitors(competitorIds.filter(id => id !== activeCompetitorId))), [ dispatch, activeCompetitorId, competitorIds ]);

    useInterval(WORK_SPACE_SYNCH_INTERVAL, sync);

    // render

    if (!activeEvent.id || activeEventIds.length === 0) {
        return null;
    }

    const rankedCompetitorList = getRanks(competitors, activeEventIds);

    return (
        <div>
            <ListFilters
                filters={filters}
                setFilter={setFilter}
            />
            {!!rankedCompetitorList.length && rankedCompetitorList.filter(filter).map((competitor, i) => {
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