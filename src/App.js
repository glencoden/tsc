import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Page, Header } from 'harbor-js';
import { ActiveContent } from './features/Navigation/navigationSlice';
import { selectActiveEvent } from './app/selectors';

import AuthWall from './features/AuthWall/AuthWall';
import TopNavigation from './features/Navigation/TopNavigation/TopNavigation';
import BottomNavigation from './features/Navigation/BottomNavigation/BottomNavigation';
import EventList from './features/Events/EventList/EventList';
import EventManager from './features/Events/EventManager/EventManager';
import CompetitorList from './features/Competitors/CompetitorList/CompetitorList';
import CompetitorManager from './features/Competitors/CompetitorManager/CompetitorManager';
import WorkSpace from './features/WorkSpace/WorkSpace';
import NoInternetWall from './features/NoInternetWall/NoInternetWall';

function getContent(activeContent) {
    switch (activeContent) {
        case ActiveContent.EVENT_LIST:
            return <EventList />;
        case ActiveContent.EVENT_MANAGER:
            return <EventManager />;
        case ActiveContent.COMPETITOR_LIST:
            return <CompetitorList />;
        case ActiveContent.COMPETITOR_MANAGER:
            return <CompetitorManager />;
        case ActiveContent.WORK_SPACE:
            return <WorkSpace />;
        default:
            return <div>unknown active content</div>;
    }
}


function App() {
    const vh = useSelector(state => state.harbor.vh);
    const activeEvent = useSelector(selectActiveEvent);
    const activeEventName = activeEvent.name || '';
    const activeContent = useSelector(state => state.navigation.activeContent);

    useEffect(() => {
        if (!activeEventName) {
            document.title = 'TSC';
            return;
        }
        document.title = activeEventName;
    }, [ activeEventName ]);

    return (
        <>
            <AuthWall />
            <NoInternetWall />
            <Header
                height={Math.min(0.14 * vh, 110)}
                bg="white"
                css={{
                    overflow: 'hidden',
                    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)' // default theme shadow 4
                }}
            >
                <TopNavigation />
            </Header>
            <Page>
                {getContent(activeContent)}
                <div style={{ height: '112px' }} />
            </Page>
            <BottomNavigation />
        </>
    );
}

export default App;
