import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Card,
    CardContent,
    CardActions,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    TextField,
    Switch
} from '@material-ui/core';
import {
    saveEvent,
    resetDraft,
    setName,
    setDate,
    setPlace,
    setHost,
    setStart,
    toggleDiscipline,
    setGymnastics,
    toggleFinal
} from '../eventsSlice';
import { ActiveContent, setActiveContent } from '../../Navigation/navigationSlice';
import { AgesPerGroup, deprecatedDisciplines, Exceptional } from '../../../competition-logic/values';
import { getBirthYear } from '../../../competition-logic/year';
import { useManagerStyles } from '../../../styles/styleHooks';
import { parseCommaSeparation } from './util';
import { MUI_INPUT_FIELD_MARGIN } from '../../../constants';


function EventManager() {
    const dispatch = useDispatch();
    const id = useSelector(state => state.events.draft.id);
    const name = useSelector(state => state.events.draft.name);
    const date = useSelector(state => state.events.draft.date);
    const place = useSelector(state => state.events.draft.place);
    const host = useSelector(state => state.events.draft.host);
    const start = useSelector(state => state.events.draft.start);
    const final = useSelector(state => state.events.draft.final);
    const disciplines = useSelector(state => state.events.draft.disciplines);
    const gymnastics = useSelector(state => state.events.draft.gymnastics);
    const competitorIds = useSelector(state => state.events.draft.competitorIds);

    const classes = useManagerStyles();

    // reset draft on unmount
    useEffect(() => () => dispatch(resetDraft()), [ dispatch ]);

    const saveAndExit = () => {
        const parsedGymnastics = Object.keys(gymnastics)
            .reduce((result, key) => ({ ...result, [key]: parseCommaSeparation(gymnastics[key]) }), {});
        dispatch(saveEvent({
            id,
            name,
            date,
            place,
            host,
            start,
            final,
            disciplines,
            gymnastics: parsedGymnastics,
            competitorIds
        }));
        dispatch(setActiveContent(ActiveContent.EVENT_LIST));
    };

    return (
        <Card
            elevation={3}
            className={classes.card}
            onKeyDown={event => {
                if (event.key !== 'Enter') {
                    return;
                }
                saveAndExit();
            }}
        >
            <CardContent>
                <form noValidate autoComplete="off">
                    <div className={classes.flexRow}>
                        <TextField
                            id="filled-name"
                            label="Wettbewerb"
                            variant="filled"
                            value={name}
                            onChange={event => dispatch(setName(event.target.value))}
                            margin={MUI_INPUT_FIELD_MARGIN}
                            fullWidth
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={final}
                                    onChange={() => dispatch(toggleFinal())}
                                    name="Jahresabschluss"
                                    color="primary"
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                            }
                            label="Jahresab."
                            labelPlacement="top"
                        />
                    </div>
                    <div className={classes.flexRow}>
                        <TextField
                            id="date"
                            label="Datum"
                            type="date"
                            variant="filled"
                            value={date}
                            onChange={event => dispatch(setDate(event.target.value))}
                            margin={MUI_INPUT_FIELD_MARGIN}
                            fullWidth
                        />
                        <div className={classes.spacer}/>
                        <TextField
                            id="time"
                            label="Beginn"
                            type="time"
                            variant="filled"
                            value={start}
                            onChange={event => dispatch(setStart(event.target.value))}
                            margin={MUI_INPUT_FIELD_MARGIN}
                            fullWidth
                            inputProps={{
                                step: 300 // 5 min
                            }}
                        />
                    </div>
                    <div className={classes.flexRow}>
                        <TextField
                            id="filled-place"
                            label="Wettkampf Ort"
                            variant="filled"
                            value={place}
                            onChange={event => dispatch(setPlace(event.target.value))}
                            margin={MUI_INPUT_FIELD_MARGIN}
                            fullWidth
                        />
                        <div className={classes.spacer}/>
                        <TextField
                            id="filled-host"
                            label="Ausrichter"
                            variant="filled"
                            value={host}
                            onChange={event => dispatch(setHost(event.target.value))}
                            margin={MUI_INPUT_FIELD_MARGIN}
                            fullWidth
                        />
                    </div>

                    <FormGroup row>
                        {Object.keys(disciplines)
                            .filter(key => !deprecatedDisciplines.find(deprecated => deprecated === key) || disciplines[key])
                            .map(key => (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={disciplines[key]}
                                            onChange={() => dispatch(toggleDiscipline(key))}
                                            name={key}
                                            color={key === Exceptional.GYMNASTICS ? 'primary' : 'secondary'}
                                        />
                                    }
                                    label={key}
                                    key={key}
                                />
                            ))}
                    </FormGroup>

                    {disciplines[Exceptional.GYMNASTICS] && Object.keys(gymnastics).map(key => {
                        const ages = AgesPerGroup[key];
                        return (
                            <div key={key} className={classes.marginTop}>
                                <h3>{`Turnen ${key} (Jahrgang ${getBirthYear(ages[ages.length - 1])} - ${getBirthYear(ages[0])})`}</h3>
                                <TextField
                                    id="outlined-multiline-flexible"
                                    label="Übungen"
                                    multiline
                                    rowsMax={4}
                                    variant="outlined"
                                    value={gymnastics[key]}
                                    onChange={event => dispatch(setGymnastics({
                                        group: key,
                                        gymnastics: event.target.value
                                    }))}
                                    margin={MUI_INPUT_FIELD_MARGIN}
                                    fullWidth
                                />
                            </div>
                        );
                    })}

                    <CardActions className={classes.marginTop}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={saveAndExit}
                        >
                            Fertig
                        </Button>
                    </CardActions>
                </form>
            </CardContent>
        </Card>
    );
}

export default EventManager;