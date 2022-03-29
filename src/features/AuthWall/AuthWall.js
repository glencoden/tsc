import { useState, useEffect, useCallback } from 'react';
import { Button, Dialog, DialogActions, DialogContent, TextField } from '@material-ui/core';
import { requestService } from '../../services/requestService';
import useInterval from '../../hooks/useInterval';
import { WAKE_LOCK_TIME, O_AUTH_2_USER_NAME, TOKEN_EXPIRY_SAFETY_MARGIN } from '../../constants';
import useWakeLock from '../../hooks/useWakeLock';


function AuthWall() {
    const [ open, setOpen ] = useState(true);
    const [ password, setPassword ] = useState('');
    const [ errorText, setErrorText ] = useState('');

    // wake lock

    const { setWakeLock, releaseWakeLock } = useWakeLock(WAKE_LOCK_TIME * 60 * 1000);

    useEffect(() => {
        if (open) {
            releaseWakeLock();
            return;
        }
        setWakeLock();
        window.addEventListener('pointerdown', setWakeLock);
        return () => {
            releaseWakeLock();
            window.removeEventListener('pointerdown', setWakeLock);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ open ]);

    // authentication

    const validateAuth = useCallback(
        () => {
            if (requestService.isAuthTokenValid()) {
                return;
            }
            setOpen(true);
        },
        []
    );

    useInterval(TOKEN_EXPIRY_SAFETY_MARGIN / 2, validateAuth);

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
                resetTextField();
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