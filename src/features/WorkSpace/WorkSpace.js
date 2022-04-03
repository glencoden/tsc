import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Card, CardActions, CardContent, TextField, Typography } from '@material-ui/core';
import { selectActiveEvent, selectActiveCompetitors, selectEventIdsForYear } from '../../redux/selectors';
import { getCompetitors, saveCompetitor, setResult, setWeight, setActiveEventIds } from '../Competitors/competitorsSlice';
import { useWorkSpaceStyles } from '../../styles/styleHooks';
import { getPoints } from '../../competition-logic/points';
import { Exceptional, Discipline } from '../../competition-logic/values';
import { getWeight } from '../../competition-logic/weights';
import useInterval from '../../hooks/useInterval';
import ListFilters from './ListFilters/ListFilters';
import GymnasticsList from './GymnasticsList/GymnasticsList';
import { MUI_INPUT_FIELD_MARGIN, WORK_SPACE_SYNC_INTERVAL } from '../../constants';
import { getRanks } from '../../utils/getRanks';

const sortAlphabetically = (a, b) => a.name.charCodeAt(0) - b.name.charCodeAt(0);

function getSortByWeightDisc(discipline, activeEventId) {
    return (a, b) => getWeight(a.year, a.gender, a.weight[activeEventId], discipline) - getWeight(b.year, b.gender, b.weight[activeEventId], discipline);
}


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
        ));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // get competitors and active event ids to create ranked list

    const competitors = useSelector(selectActiveCompetitors);
    const activeEventIds = useSelector(state => state.competitors.activeEventIds);

    // local state for user work

    const [ activeCompetitorId, setActiveCompetitorId ] = useState(null);

    // BE state synch logic

    const sync = useCallback(() => dispatch(getCompetitors(activeCompetitorId)), [ dispatch, activeCompetitorId ]);

    useInterval(WORK_SPACE_SYNC_INTERVAL, sync);

    // early exit

    if (!activeEvent.id || activeEventIds.length === 0) {
        return null;
    }

    // generate and sort competitors list

    let sortCallback = sortAlphabetically;

    if (activeEvent.disciplines[Discipline.PUSH]) {
        sortCallback = getSortByWeightDisc(Discipline.PUSH, activeEvent.id);
    } else if (activeEvent.disciplines[Discipline.PULL]) {
        sortCallback = getSortByWeightDisc(Discipline.PULL, activeEvent.id);
    }

    const rankedCompetitorList = getRanks(competitors, activeEventIds).sort(sortCallback);

    // render

    return (
        <div>
            <ListFilters />
            {!!rankedCompetitorList.length && rankedCompetitorList.map((competitor, i) => {
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
                            if (activeCompetitorId !== null) {
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