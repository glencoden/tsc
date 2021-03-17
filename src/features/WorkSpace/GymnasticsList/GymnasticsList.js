import { useDispatch } from 'react-redux';
import { useWorkSpaceStyles } from '../../../app/styleHooks';
import { AgesPerGroup, Exceptional, Group } from '../../../app/lib/values';
import { getAge } from '../../../app/lib/year';
import { useEffect, useState } from 'react';
import { setResult } from '../../Competitors/competitorsSlice';
import { getPoints } from '../../../app/lib/points';
import { FormControl, InputLabel, MenuItem, Select, Typography } from '@material-ui/core';


function GymnasticsList({ event, competitor }) {
    const dispatch = useDispatch();
    const classes = useWorkSpaceStyles();

    const results = competitor.results?.[event.id]?.[Exceptional.GYMNASTICS];
    const gymnastics = event.gymnastics[Object.values(Group).find(e => AgesPerGroup[e].includes(getAge(competitor.year)))];
    const gymnasticsList = gymnastics.split(', ').filter(e => !!e);

    const [ gymResults, setGymResults ] = useState(results ? results : gymnasticsList.reduce((r, e) => ({ ...r, [e]: 0 }), {}));

    useEffect(() => {
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
            <Typography variant="overline" paragraph className={classes.marginTop}>
                {Exceptional.GYMNASTICS}
            </Typography>
            <div className={classes.editor}>
                {gymnasticsList
                    .map(name => (
                        <FormControl key={name} style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <InputLabel id={`${name}-label`}>{name}</InputLabel>
                            <Select
                                labelId={`${name}-label`}
                                id={`${name}`}
                                value={gymResults[name]}
                                onChange={event => setGymResults(prevState => {
                                    const result = { ...prevState };
                                    result[name] = event.target.value;
                                    return result;
                                })}
                            >
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={1.5}>1,5</MenuItem>
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={0.5}>0,5</MenuItem>
                                <MenuItem value={0}>0</MenuItem>
                            </Select>
                        </FormControl>
                    ))
                }
                <div className={classes.gymnasticsResult}>
                    <span className={`material-icons ${classes.editorIcon}`}>
                        play_arrow
                    </span>
                    <Typography color="primary" display="inline" className={classes.editorPoints}>
                        {points ? points : '--'}
                    </Typography>
                </div>
            </div>
        </>
    );
}

export default GymnasticsList;