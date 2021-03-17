import { createSlice } from '@reduxjs/toolkit';

export const steps = [ 'Erstellen', 'Teilnehmer', 'Wettbewerb' ];

export const ActiveContent = {
    EVENT_LIST: 'event-list',
    EVENT_MANAGER: 'event-manager',
    COMPETITOR_LIST: 'competitor-list',
    COMPETITOR_MANAGER: 'competitor-manager',
    WORK_SPACE: 'work-space'
};

const ContentToStep = {
    [ActiveContent.EVENT_LIST]: 'Erstellen',
    [ActiveContent.EVENT_MANAGER]: 'Erstellen',
    [ActiveContent.COMPETITOR_LIST]: 'Teilnehmer',
    [ActiveContent.COMPETITOR_MANAGER]: 'Teilnehmer',
    [ActiveContent.WORK_SPACE]: 'Wettbewerb'
};

function getStepFromContent(content) {
    return ContentToStep[content];
}

function getContentFromStep(step) {
    const keys = Object.keys(ContentToStep);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (ContentToStep[key] === step) {
            return key;
        }
    }
}

export const navigationSlice = createSlice({
    name: 'navigation',
    initialState: {
        activeContent: ActiveContent.EVENT_LIST,
        activeStep: getStepFromContent(ActiveContent.EVENT_LIST)
    },
    reducers: {
        setActiveContent: (state, action) => {
            state.activeContent = action.payload;
            state.activeStep = getStepFromContent(action.payload);
        },
        setActiveStep: (state, action) => {
            state.activeContent = getContentFromStep(action.payload);
            state.activeStep = action.payload;
        }
    }
});

export const {
    setActiveContent,
    setActiveStep
} = navigationSlice.actions;

export default navigationSlice.reducer;
