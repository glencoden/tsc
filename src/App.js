import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ActiveContent } from './features/Navigation/navigationSlice';
import { selectActiveEvent } from './redux/selectors';

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

    const [ , triggerRerender ] = useState(false);

    useEffect(() => {
        console.log(
            `%cglencoden ❤️ version 4.2 on ${process.env.REACT_APP_HOST_ENV}`,
            `font-size: 1rem;
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 0.5rem;
            color: white;
            background:linear-gradient(#E66465, #9198E5);`
        );
        const resize = () => triggerRerender(prevState => !prevState);
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
