import { useEffect } from 'react';
import { getCenterContentStyle } from '../../utils/getCenterContentStyle';
import styles from './MainView.module.css';


function MainView({ children }) {
    useEffect(() => {
        window.scroll(0, 0);
    }, [ children ]);

    return (
        <div
            className={styles.MainView}
            style={getCenterContentStyle()}
        >
            {children}
        </div>
    );
}

export default MainView;