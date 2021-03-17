import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import s from './BottomNavigation.module.css';
import { Fab } from '@material-ui/core';
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@material-ui/lab';
import { ActiveContent, setActiveContent } from '../navigationSlice';
import { saveCompetitor } from '../../Competitors/competitorsSlice';
import { fetchPrint, PrintActionTypes } from '../../WorkSpace/WorkSpace';

const actions = [
    {
        icon: <span className="material-icons">event_note</span>,
        name: 'Protokoll',
        type: PrintActionTypes.PROTOCOL
    },
    {
        icon: <span className="material-icons">people_alt</span>,
        name: 'Urkunden',
        type: PrintActionTypes.CERTIFICATES
    }
];


function BottomNavigation() {
    const dispatch = useDispatch();
    const vw = useSelector(state => state.harbor.vw);
    const cw = useSelector(state => state.harbor.cw);
    const activeContent = useSelector(state => state.navigation.activeContent);

    const [ speedDialOpen, setSpeedDialOpen ] = useState(false);

    let onCta = null;
    let ctaIcon = '';
    let ctaColor = '';

    switch (activeContent) {
        case ActiveContent.EVENT_LIST:
            onCta = () => dispatch(setActiveContent(ActiveContent.EVENT_MANAGER));
            ctaIcon = 'add';
            ctaColor = 'primary';
            break;
        case ActiveContent.EVENT_MANAGER:
            onCta = () => dispatch(setActiveContent(ActiveContent.EVENT_LIST));
            ctaIcon = 'clear';
            ctaColor = 'secondary';
            break;
        case ActiveContent.COMPETITOR_LIST:
            onCta = () => dispatch(setActiveContent(ActiveContent.COMPETITOR_MANAGER));
            ctaIcon = 'add';
            ctaColor = 'primary';
            break;
        case ActiveContent.COMPETITOR_MANAGER:
            onCta = () => {
                dispatch(saveCompetitor());
                dispatch(setActiveContent(ActiveContent.COMPETITOR_LIST));
            };
            ctaIcon = 'clear';
            ctaColor = 'secondary';
            break;
        default:
            ctaIcon = 'add';
            ctaColor = 'primary';
    }

    return (
        <footer
            className={s.BottomNavigation}
            style={{ width: `${cw}px`, margin: `0 ${(vw - cw) / 2}px` }}
        >
            <div className={s.Cta}>
                {activeContent !== ActiveContent.WORK_SPACE && (
                    <Fab
                        color={ctaColor}
                        aria-label="add"
                        onClick={onCta}
                    >
                        <span className="material-icons">
                            {ctaIcon}
                        </span>
                    </Fab>
                )}
                {activeContent === ActiveContent.WORK_SPACE && vw > 576 && (
                    <SpeedDial
                        ariaLabel="SpeedDial example"
                        hidden={false}
                        icon={<SpeedDialIcon/>}
                        onClose={() => setSpeedDialOpen(false)}
                        onOpen={() => setSpeedDialOpen(true)}
                        open={speedDialOpen}
                        direction="up"
                    >
                        {actions.map(action => (
                            <SpeedDialAction
                                key={action.name}
                                icon={action.icon}
                                tooltipTitle={action.name}
                                onClick={() => {
                                    fetchPrint(action.type);
                                    setSpeedDialOpen(false);
                                }}
                            />
                        ))}
                    </SpeedDial>
                )}
            </div>
        </footer>
    );
}

export default BottomNavigation;