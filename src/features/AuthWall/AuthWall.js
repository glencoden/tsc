import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, TextField } from '@material-ui/core';
import { requestService } from '../../services/requestService';

const O_AUTH_2_USER_NAME = 'michi_mueller';


function AuthWall() {
    const [ open, setOpen ] = useState(true);
    const [ password, setPassword ] = useState('');
    const [ errorText, setErrorText ] = useState('');

    const resetTextField = () => {
        setPassword('');
        setErrorText('');
    };

    const onLoginButtonClick = () => {
        requestService.login(O_AUTH_2_USER_NAME, password)
            .then(response => {
                if (!response.success) {
                    setErrorText('Unbekannter Fehler');
                    return;
                }
                setOpen(false);
            })
            .catch(() => {
                setErrorText('Falsches Passwort');
            });
    };

    return (
        <Dialog
            open={open}
            onClose={() => {}}
            aria-labelledby="form-dialog-title"
        >
            <DialogContent>
                <TextField
                    autoFocus
                    margin="normal"
                    id="pw"
                    label={<span className="material-icons">vpn_key</span>}
                    type="password"
                    fullWidth
                    value={password}
                    onChange={({ target }) => setPassword(target.value)}
                    onFocus={resetTextField}
                    error={!!errorText}
                    helperText={errorText}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onLoginButtonClick}
                >
                    Login
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AuthWall;