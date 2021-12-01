import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
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
import MainView from './features/MainView/MainView';

const mainView = {
    [ActiveContent.EVENT_LIST]: <EventList />,
    [ActiveContent.EVENT_MANAGER]: <EventManager />,
    [ActiveContent.COMPETITOR_LIST]: <CompetitorList />,
    [ActiveContent.COMPETITOR_MANAGER]: <CompetitorManager />,
    [ActiveContent.WORK_SPACE]: <WorkSpace />
};


function App() {
    const activeEvent = useSelector(selectActiveEvent);
    const activeEventName = activeEvent.name || '';
    const activeContent = useSelector(state => state.navigation.activeContent);

    const [ , triggerResize ] = useState(false);

    useEffect(() => {
        const resize = () => triggerResize(prevState => !prevState);
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

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
            <TopNavigation />
            <MainView>
                {mainView[activeContent]}
            </MainView>
            <BottomNavigation />
        </>
    );
}

export default App;
