import { useState } from 'react';
import { Dialog, DialogContent, TextField } from '@material-ui/core';

const auth = 'fest';


function AuthWall() {
    const [ open, setOpen ] = useState(true);

    return (
        <Dialog open={open} onClose={() => {}} aria-labelledby="form-dialog-title">
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="pw"
                    label={<span className="material-icons">vpn_key</span>}
                    type="password"
                    fullWidth
                    onChange={event => {
                        if (event.target.value !== auth) {
                            return;
                        }
                        setOpen(false);
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}

export default AuthWall;