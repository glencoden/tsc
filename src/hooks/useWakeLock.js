import { useCallback, useRef } from 'react';

const fallbackTime = 5 * 60 * 1000;


function useWakeLock(time = fallbackTime) {
    const wakeLockRef = useRef(null);
    const timeoutIdRef = useRef(0);

    const releaseWakeLock = useCallback(
        () => {
            clearTimeout(timeoutIdRef.current);
            if (wakeLockRef.current === null) {
                return;
            }
            wakeLockRef.current.release()
                .catch((err) => console.log(`${err.name}, ${err.message}`));
        },
        []
    );

    const setWakeLock = useCallback(
        () => {
            navigator.wakeLock?.request('screen')
                .then(currentWakeLock => {
                    clearTimeout(timeoutIdRef.current);
                    wakeLockRef.current = currentWakeLock;
                    timeoutIdRef.current = setTimeout(releaseWakeLock, time);
                })
                // the wake lock request fails - usually system related, such being low on battery
                .catch((err) => console.log(`${err.name}, ${err.message}`));
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [ time ]
    );

    return {
        setWakeLock,
        releaseWakeLock
    };
}

export default useWakeLock;