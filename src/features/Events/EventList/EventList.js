import { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardActions, Typography, Button, IconButton } from '@material-ui/core';
import { ActiveContent, setActiveContent } from '../../Navigation/navigationSlice';
import { deleteEvent, setEventId, editEvent, getEvents } from '../eventsSlice';
import { Exceptional } from '../../../competition-logic/values';
import { isObject } from '../../../utils/helpers';
import { useListStyles } from '../../../styles/styleHooks';
import useInterval from '../../../hooks/useInterval';
import { EVENT_LIST_REFRESH_INTERVAL } from '../../../constants';


function EventList() {
    const dispatch = useDispatch();
    const events = useSelector(state => state.events.all);
    const activeEventId = useSelector(state => state.events.activeId);
    const classes = useListStyles();

    const [ eventList, setEventList ] = useState([]);
    const [ deleteIndex, setDeleteIndex ] = useState(-1);

    const refresh = useCallback(() => dispatch(getEvents()), [ dispatch ]);
    const getEventsOnMount = !isObject(events) || Object.keys(events).length === 0;  // only get events on mount if there's no current data set
    useInterval(EVENT_LIST_REFRESH_INTERVAL, refresh, getEventsOnMount);

    useEffect(() => {
        if (!isObject(events)) {
            return;
        }
        setEventList(
            Object.values(events).sort((a, b) => new Date(a.date) - new Date(b.date))
        );
    }, [ events ]);

    const onEdit = (e, id) => {
        e.stopPropagation();
        dispatch(editEvent(id));
        dispatch(setActiveContent(ActiveContent.EVENT_MANAGER));
    }

    if (!eventList.length) {
        return null;
    }

    return (
        <div>
            {eventList.map((event, index) => {
                const active = event.id === activeEventId;
                return (
                    <Card
                        key={event.id}
                        className={`${classes.card} ${active && classes.cardActive}`}
                        elevation={3}
                        onClick={() => dispatch(setEventId(event.id))}
                        onDoubleClick={e => onEdit(e, event.id)}
                    >
                        <CardContent>
                            <div className={classes.cardContent}>
                                <div>
                                    {event.final && (
                                        <Typography variant="overline" color="primary" display="block">
                                            {`Jahresabschluss ${event.date.split('-')[0]}`}
                                        </Typography>
                                    )}
                                    <Typography variant="overline" color="textSecondary" display="block">
                                        {event.date.split('-').reverse().join('.')} / {event.start} Uhr
                                    </Typography>
                                    <Typography variant="h6" color="textPrimary">
                                        {event.name}
                                    </Typography>
                                </div>
                                <CardActions className={classes.cardActions}>
                                    {deleteIndex === index ? (
                                        <>
                                            <IconButton
                                                className={active ? classes.contrastText : ''}
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
                                                    dispatch(deleteEvent(event.id));
                                                    setDeleteIndex(-1);
                                                }}
                                            >
                                                <span className="material-icons">delete</span>
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <IconButton
                                                className={active ? classes.contrastText : ''}
                                                onClick={e => onEdit(e, event.id)}
                                            >
                                                <span className="material-icons">edit</span>
                                            </IconButton>
                                            <IconButton
                                                className={active ? classes.contrastText : ''}
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
                            {(event.place || event.host) && (
                                <Typography variant="caption" color="textSecondary" display="block" paragraph>
                                    {`${event.place}${(event.place && event.host) ? ' | ' : ''}${event.host}`}
                                </Typography>
                            )}
                            <Typography variant="body1">
                                {Object.keys(event.disciplines).reduce((r, e) => event.disciplines[e] ? `${r}${r.length ? ', ' : ''}${e}` : r, '')}
                            </Typography>
                            {event.disciplines[Exceptional.GYMNASTICS] && Object.keys(event.gymnastics).map(key => (
                                <Typography key={key} variant="caption" color="textSecondary" display="block">
                                    <span className={classes.gymnasticsTag}>Turnen {key}:</span> {event.gymnastics[key]}
                                </Typography>
                            ))}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

export default EventList;