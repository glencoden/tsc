import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Stepper, Step, StepLabel, StepConnector } from '@material-ui/core';
import { steps, setActiveStep } from '../navigationSlice';
import styles from './TopNavigation.module.css';
import { getCenterContentStyle } from '../../../utils/getCenterContentStyle';

const topNavBackgroundColor = '#fff';

const ColorlibConnector = withStyles({
    alternativeLabel: {
        top: 22
    },
    active: {
        '& $line': {
            backgroundImage: 'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)'
        }
    },
    completed: {
        '& $line': {
            backgroundImage: 'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)'
        }
    },
    line: {
        height: 3,
        border: 0,
        backgroundColor: '#eaeaf0',
        borderRadius: 1
    }
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
    root: {
        backgroundColor: '#ccc',
        zIndex: 1,
        color: topNavBackgroundColor,
        width: 50,
        height: 50,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer'
    },
    active: {
        backgroundImage: 'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)'
    },
    completed: {
        backgroundImage: 'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)'
    }
});

function ColorlibStepIcon(props) {
    const classes = useColorlibStepIconStyles();
    const { active, completed } = props;

    const icons = {
        1: <span className="material-icons">event_note</span>,
        2: <span className="material-icons">people_alt</span>,
        3: <span className="material-icons">emoji_events</span>
    };

    return (
        <div
            className={`${classes.root}${active ? ` ${classes.active}` : ''}${completed ? ` ${classes.completed}` : ''}`}>
            {icons[String(props.icon)]}
        </div>
    );
}


function TopNavigation() {
    const dispatch = useDispatch();
    const activeStep = useSelector(state => state.navigation.activeStep);

    return (
        <>
            <div className={styles.TopNavigation}>
                <Stepper
                    className={styles.TopNavigationStepper}
                    style={getCenterContentStyle()}
                    alternativeLabel
                    activeStep={steps.indexOf(activeStep)}
                    connector={<ColorlibConnector/>}
                >
                    {steps.map(step => (
                        <Step
                            key={step}
                            onClick={() => dispatch(setActiveStep(step))}
                        >
                            <StepLabel StepIconComponent={ColorlibStepIcon}/>
                        </Step>
                    ))}
                </Stepper>
            </div>
            <div className={styles.TopNavigationSpacer}/>
        </>
    );
}

export default TopNavigation;