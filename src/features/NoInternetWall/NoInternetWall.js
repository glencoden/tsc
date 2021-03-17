import { useState, useEffect } from 'react';
import { Dialog, DialogContent, Typography } from '@material-ui/core';


function NoInternetWall() {
    const [ open, setOpen ] = useState(false);

    useEffect(() => {
        window.addEventListener('offline', () => setOpen(true));
        window.addEventListener('online', () => setOpen(false));
    }, []);

    return (
        <Dialog open={open} onClose={() => {}} aria-labelledby="form-dialog-title">
            <DialogContent>
                <Typography>
                    Kein Internet
                </Typography>
                <div style={{ textAlign: 'center' }}>
                    <span className="material-icons">perm_scan_wifi</span>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default NoInternetWall;