import { useDispatch } from 'react-redux';
import { useWorkSpaceStyles } from '../../../styles/styleHooks';
import { AgesPerGroup, Exceptional, Group } from '../../../competition-logic/values';
import { getAge } from '../../../competition-logic/year';
import { useEffect, useState } from 'react';
import { setResult } from '../../Competitors/competitorsSlice';
import { getPoints } from '../../../competition-logic/points';
import { Button, ButtonGroup, Typography } from '@material-ui/core';

const possibleResults = [ 0, 0.5, 1, 1.5, 2 ];


function GymnasticsList({ event, competitor }) {
    const dispatch = useDispatch();
    const classes = useWorkSpaceStyles();

    const results = competitor.results?.[event.id]?.[Exceptional.GYMNASTICS];
    const gymnastics = event.gymnastics[Object.values(Group).find(e => AgesPerGroup[e].includes(getAge(competitor.year)))];
    const gymnasticsList = gymnastics.split(', ').filter(e => !!e);

    const [ gymResults, setGymResults ] = useState(results ? results : gymnasticsList.reduce((r, e) => ({ ...r, [e]: possibleResults[0] }), {}));

    useEffect(() => {
        if (Object.keys(gymResults).length === 0) {
            return
        }
        dispatch(setResult({
            eventId: event.id,
            competitorId: competitor.id,
            discipline: Exceptional.GYMNASTICS,
            result: gymResults
        }))
    }, [ event.id, competitor.id, dispatch, gymResults ]);

    if (!gymnastics.length) {
        return null;
    }

    const points = getPoints(Exceptional.GYMNASTICS, gymResults);

    return (
        <>
            <Typography
                className={classes.marginTop}
                variant="subtitle1"
                paragraph
            >
                {Exceptional.GYMNASTICS}
            </Typography>
                {gymnasticsList.map(name => (
                    <div
                        key={name}
                        className={`${classes.editor} ${classes.gymnasticsInput}`}
                    >
                        <Typography
                            className={classes.gymnasticsInputTitle}
                            variant="body2"
                            color="textSecondary"
                        >
                            {name}
                        </Typography>
                        <ButtonGroup>
                            {possibleResults.map(possibleResult => {
                                const active = gymResults[name] === possibleResult;
                                return (
                                    <Button
                                        key={`${name}${possibleResult}`}
                                        className={classes.gymnasticsInputButton}
                                        variant={active ? 'contained' : 'outlined'}
                                        color={active ? 'secondary' : 'default'}
                                        onClick={() => setGymResults(prevState => {
                                            const result = { ...prevState };
                                            result[name] = possibleResult;
                                            return result;
                                        })}
                                    >
                                        {possibleResult}
                                    </Button>
                                );
                            })}
                        </ButtonGroup>
                    </div>
                ))}
                <div className={classes.gymnasticsResult}>
                    <span className={`material-icons ${classes.editorIcon}`}>
                        play_arrow
                    </span>
                    <Typography color="primary" display="inline" className={classes.editorPoints}>
                        {points ? points : '--'}
                    </Typography>
                </div>
        </>
    );
}

export default GymnasticsList;