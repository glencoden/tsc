import { getCenterContentStyle } from '../../util/getCenterContentStyle';
import styles from './MainView.module.css';


function MainView({ children }) {
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