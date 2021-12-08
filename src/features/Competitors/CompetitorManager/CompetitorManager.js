import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import {
    resetCompetitors,
    setName,
    setGender,
    setYear,
    setClub,
    saveCompetitor
} from '../competitorsSlice';
import { ActiveContent, setActiveContent } from '../../Navigation/navigationSlice';
import { Gender, Ages } from '../../../competition-logic/values';
import { getBirthYear } from '../../../competition-logic/year';
import { useManagerStyles } from '../../../styles/styleHooks';
import { parseCommaSeparation } from '../../Events/EventManager/util';
import { MUI_INPUT_FIELD_MARGIN } from '../../../constants';


function CompetitorManager() {
    const dispatch = useDispatch();
    const id = useSelector(state => state.competitors.draft.id);
    const name = useSelector(state => state.competitors.draft.name);
    const gender = useSelector(state => state.competitors.draft.gender);
    const year = useSelector(state => state.competitors.draft.year);
    const weight = useSelector(state => state.competitors.draft.weight);
    const club = useSelector(state => state.competitors.draft.club);
    const results = useSelector(state => state.competitors.draft.results);

    const classes = useManagerStyles();

    useEffect(() => () => dispatch(resetCompetitors()), [ dispatch ]);

    const saveAndExit = () => {
        dispatch(saveCompetitor({
            id,
            name: parseCommaSeparation(name),
            gender,
            year,
            weight,
            club: parseCommaSeparation(club),
            results
        }));
        dispatch(setActiveContent(ActiveContent.COMPETITOR_LIST));
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
                    <TextField
                        id="filled-name"
                        label="Name"
                        variant="filled"
                        value={name}
                        onChange={event => dispatch(setName(event.target.value))}
                        margin={MUI_INPUT_FIELD_MARGIN}
                        fullWidth
                    />
                    <TextField
                        id="filled-club"
                        label="Verein"
                        variant="filled"
                        value={club}
                        onChange={event => dispatch(setClub(event.target.value))}
                        margin={MUI_INPUT_FIELD_MARGIN}
                        fullWidth
                    />
                    <div className={classes.gridRow}>
                        <FormControl margin={MUI_INPUT_FIELD_MARGIN}>
                            <InputLabel id="demo-simple-select-label-gender">Geschlecht</InputLabel>
                            <Select
                                labelId="demo-simple-select-label-gender"
                                id="demo-simple-select-gender"
                                value={gender}
                                onChange={event => dispatch(setGender(event.target.value))}
                            >
                                {Object.values(Gender).map(e => (
                                    <MenuItem key={e} value={e}>{e}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl margin={MUI_INPUT_FIELD_MARGIN}>
                            <InputLabel id="demo-simple-select-label-year">Jahrgang</InputLabel>
                            <Select
                                labelId="demo-simple-select-label-year"
                                id="demo-simple-select-year"
                                value={year}
                                onChange={event => dispatch(setYear(event.target.value))}
                            >
                                {Ages.map(age => getBirthYear(age)).map(e => (
                                    <MenuItem key={e} value={e}>{e}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>

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

export default CompetitorManager;