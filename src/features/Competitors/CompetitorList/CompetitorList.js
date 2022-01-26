import { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardActions, Typography, Button, IconButton } from '@material-ui/core';
import { ActiveContent, setActiveContent } from '../../Navigation/navigationSlice';
import { saveEvent, addCompetitorId, removeCompetitorId } from '../../Events/eventsSlice';
import { deleteCompetitor, editCompetitor, getCompetitors } from '../competitorsSlice';
import { useListStyles } from '../../../styles/styleHooks';
import { selectActiveEvent } from '../../../redux/selectors';
import { defaultValues, isObject } from '../../../utils/helpers';
import useInterval from '../../../hooks/useInterval';
import { COMPETITOR_LIST_REFRESH_INTERVAL } from '../../../constants';


function CompetitorList() {
    const dispatch = useDispatch();
    const competitors = useSelector(state => state.competitors.all);
    const activeEvent = useSelector(selectActiveEvent);
    const selectedCompetitorIds = activeEvent.competitorIds || defaultValues.ARRAY;

    const classes = useListStyles();

    const [ competitorList, setCompetitorList ] = useState([]);
    const [ deleteIndex, setDeleteIndex ] = useState(-1);
    const [ doSave, setDoSave ] = useState(false);

    const refresh = useCallback(() => dispatch(getCompetitors()), [ dispatch ]);
    const getCompetitorsOnMount = !isObject(competitors) || Object.keys(competitors).length === 0; // only get competitors on mount if there's no current data set
    useInterval(COMPETITOR_LIST_REFRESH_INTERVAL, refresh, getCompetitorsOnMount);

    useEffect(() => {
        if (!isObject(competitors)) {
            return;
        }
        setCompetitorList(
            Object.values(competitors).sort((a, b) => a.name.charCodeAt(0) - b.name.charCodeAt(0))
        );
    }, [ competitors ]);

    useEffect(() => {
        if (!doSave) {
            return;
        }
        dispatch(saveEvent(activeEvent));
        setDoSave(false);
    }, [ dispatch, activeEvent, doSave ]);

    if (!competitorList.length) {
        return null;
    }

    return (
        <div>
            {competitorList.map((competitor, index) => {
                const noActiveEvent = !activeEvent.id;
                const selected = selectedCompetitorIds.includes(competitor.id);
                return (
                    <Card
                        key={competitor.id}
                        className={`${classes.card} ${selected && classes.cardActive}`}
                        elevation={3}
                        onClick={() => {
                            if (noActiveEvent) {
                                return;
                            }
                            dispatch(selected ? removeCompetitorId(competitor.id) : addCompetitorId(competitor.id));
                            setDoSave(true);
                        }}
                    >
                        <CardContent>
                            <div className={classes.cardContent}>
                                <div>
                                    <Typography variant="overline" color="textSecondary" display="block">
                                        {`${competitor.year} | ${competitor.gender}`}
                                    </Typography>
                                    <Typography variant="h6" color="textPrimary">
                                        {competitor.name}
                                    </Typography>
                                </div>
                                <CardActions className={classes.cardActions}>
                                    {deleteIndex === index ? (
                                        <>
                                            <IconButton
                                                className={selected ? classes.contrastText : ''}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    setDeleteIndex(-1);
                                                }}
                                            >
                                                <span className="material-icons">clear</span>
                                            </IconButton>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    dispatch(deleteCompetitor(competitor.id));
                                                    setDeleteIndex(-1);
                                                }}
                                            >
                                                <span className="material-icons">delete</span>
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <IconButton
                                                className={selected ? classes.contrastText : ''}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    dispatch(editCompetitor(competitor.id));
                                                    dispatch(setActiveContent(ActiveContent.COMPETITOR_MANAGER));
                                                }}
                                            >
                                                <span className="material-icons">edit</span>
                                            </IconButton>
                                            <IconButton
                                                className={selected ? classes.contrastText : ''}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    setDeleteIndex(index);
                                                }}
                                            >
                                                <span className="material-icons">delete</span>
                                            </IconButton>
                                        </>
                                    )}
                                </CardActions>
                            </div>
                            <Typography variant="caption" color="textSecondary" display="block">
                                {competitor.club || 'Kein Verein'}
                            </Typography>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

export default CompetitorList;