import { useState, useRef, useEffect } from 'react';


function useInterval(interval, cb, invokeInitially = true) {
    const [ active, setActive ] = useState(true);
    const idRef = useRef({ id: 0 });

    useEffect(() => {
        if (!active) {
            return;
        }
        const req = () => {
            cb();
            idRef.current.id = setTimeout(() => req(), interval * 1000);
        };
        if (invokeInitially) {
            req();
        }
        return () => clearTimeout(idRef.current.id);
    }, [ active, interval, cb, invokeInitially ]);

    return [ active, setActive ];
}

export default useInterval;