import { useState, useRef, useEffect } from 'react';


function useInterval(interval, cb, invokeInitially = true) {
    const [ active, setActive ] = useState(true);
    const idRef = useRef(0);

    useEffect(() => {
        if (!active) {
            return;
        }
        const req = () => {
            cb();
            idRef.current = setTimeout(() => req(), interval * 1000);
        };
        if (invokeInitially) {
            req();
        } else {
            idRef.current = setTimeout(() => req(), interval * 1000);
        }
        return () => clearTimeout(idRef.current);
    }, [ active, interval, cb, invokeInitially ]);

    return [ active, setActive ];
}

export default useInterval;