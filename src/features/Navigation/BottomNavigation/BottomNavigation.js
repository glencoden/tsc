import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import s from './BottomNavigation.module.css';
import { Fab } from '@material-ui/core';
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@material-ui/lab';
import { ActiveContent, setActiveContent } from '../navigationSlice';
import { saveCompetitor } from '../../Competitors/competitorsSlice';
import { getCenterContentStyle } from '../../../util/getCenterContentStyle';
import { MOBILE_BREAKPOINT } from '../../../constants';
import { PrintLayout, requestService } from '../../../services/requestService';

const speedDialActions = [
    {
        icon: <span className="material-icons">event_note</span>,
        name: 'Protokoll',
        layout: PrintLayout.PROTOCOL
    },
    {
        icon: <span className="material-icons">people_alt</span>,
        name: 'Urkunden',
        layout: PrintLayout.CERTIFICATES
    }
];


function BottomNavigation() {
    const dispatch = useDispatch();
    const activeContent = useSelector(state => state.navigation.activeContent);
    const rankedCompetitorList = useSelector(state => state.competitors.rankedList);

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
            style={getCenterContentStyle()}
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
                {activeContent === ActiveContent.WORK_SPACE && window.innerWidth > MOBILE_BREAKPOINT && (
                    <SpeedDial
                        ariaLabel="SpeedDial example"
                        hidden={false}
                        icon={<SpeedDialIcon/>}
                        onClose={() => setSpeedDialOpen(false)}
                        onOpen={() => setSpeedDialOpen(true)}
                        open={speedDialOpen}
                        direction="up"
                    >
                        {speedDialActions.map(action => (
                            <SpeedDialAction
                                key={action.name}
                                icon={action.icon}
                                tooltipTitle={action.name}
                                onClick={() => {
                                    requestService.fetchPrint(action.layout, rankedCompetitorList);
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