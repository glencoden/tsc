import { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardActions, Typography, Button, IconButton } from '@material-ui/core';
import { ActiveContent, setActiveContent } from '../../Navigation/navigationSlice';
import { deleteEvent, setEventId, editEvent, getEvents } from '../eventsSlice';
import { Exceptional } from '../../../app/lib/values';
import { isObject } from '../../../app/lib/helpers';
import { useListStyles } from '../../../app/styleHooks';
import useInterval from '../../../app/hooks/useInterval';

const refreshTime = 15;


function EventList() {
    const dispatch = useDispatch();
    const events = useSelector(state => state.events.all);
    const activeEventId = useSelector(state => state.events.activeId);
    const classes = useListStyles();

    const [ eventList, setEventList ] = useState([]);
    const [ deleteIndex, setDeleteIndex ] = useState(-1);

    const refresh = useCallback(() => dispatch(getEvents()), [ dispatch ]);
    useInterval(refreshTime, refresh);

    useEffect(() => {
        if (!isObject(events)) {
            return;
        }
        setEventList(
            Object.values(events).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        );
    }, [ events ]);

    return (
        <div>
            {!!eventList.length && eventList.map((event, i) => {
                const active = event.id === activeEventId;
                return (
                    <Card
                        key={i}
                        className={`${classes.card} ${active && classes.cardActive}`}
                        elevation={3}
                        onClick={() => {
                            dispatch(setEventId(event.id));
                            dispatch(setActiveContent(ActiveContent.WORK_SPACE));
                        }}
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
                                    {deleteIndex === i ? (
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
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    dispatch(editEvent(event.id));
                                                    dispatch(setActiveContent(ActiveContent.EVENT_MANAGER));
                                                }}
                                            >
                                                <span className="material-icons">edit</span>
                                            </IconButton>
                                            <IconButton
                                                className={active ? classes.contrastText : ''}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    setDeleteIndex(i);
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