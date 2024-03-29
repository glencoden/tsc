import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { requestService } from '../../services/requestService';
import { Discipline, Group } from '../../competition-logic/values';

function getDraftEvent() {
    return {
        id: null,
        name: '',
        date: new Date().toISOString().split('T')[0],
        place: '',
        host: '',
        start: '16:30',
        final: false,
        disciplines: Object.values(Discipline).reduce((r, e) => ({ ...r, [e]: false }), {}),
        gymnastics: {
            [Group.A]: '',
            [Group.B]: ''
        },
        competitorIds: []
    };
}

const eventsEndpoint = '/api/events';

export const getEvents = createAsyncThunk(
    'events/getEvents',
    async () => {
        return await requestService.get(`${requestService.baseUrl}${eventsEndpoint}`);
    }
);

export const saveEvent = createAsyncThunk(
    'events/saveEvent',
    async event => {
        if (event.id === null) {
            return await requestService.post(`${requestService.baseUrl}${eventsEndpoint}`, event);
        }
        return await requestService.put(`${requestService.baseUrl}${eventsEndpoint}`, event);
    }
);

export const deleteEvent = createAsyncThunk(
    'events/deleteEvent',
    async id => {
        return await requestService.delete(`${requestService.baseUrl}${eventsEndpoint}?id=${id}`);
    }
);

export const eventsSlice = createSlice({
    name: 'events',
    initialState: {
        all: {},
        activeId: null,
        draft: getDraftEvent()
    },
    reducers: {
        resetDraft: state => {
            state.draft = getDraftEvent();
        },
        setEventId: (state, action) => {
            state.activeId = action.payload;
        },
        addCompetitorId: (state, action) => {
            if (state.activeId === null) {
                return;
            }
            state.all[state.activeId].competitorIds.push(action.payload);
        },
        removeCompetitorId: (state, action) => {
            if (state.activeId === null) {
                return;
            }
            const activeEvent = state.all[state.activeId];
            activeEvent.competitorIds.splice(activeEvent.competitorIds.indexOf(action.payload), 1);
        },
        editEvent: (state, action) => {
            state.draft = state.all[action.payload];
        },
        setName: (state, action) => {
            state.draft.name = action.payload;
        },
        setDate: (state, action) => {
            state.draft.date = action.payload;
        },
        setPlace: (state, action) => {
            state.draft.place = action.payload;
        },
        setHost: (state, action) => {
            state.draft.host = action.payload;
        },
        setStart: (state, action) => {
            state.draft.start = action.payload;
        },
        toggleFinal: state => {
            state.draft.final = !state.draft.final;
        },
        toggleDiscipline: (state, action) => {
            state.draft.disciplines[action.payload] = !state.draft.disciplines[action.payload];
        },
        setGymnastics: (state, action) => {
            if (!action.payload.group) {
                return;
            }
            state.draft.gymnastics[action.payload.group] = action.payload.gymnastics;
        }
    },
    extraReducers: {
        [getEvents.fulfilled]: (state, action) => {
            if (!Array.isArray(action.payload)) {
                console.warn('error getting events');
                return;
            }
            state.all = action.payload.reduce((r, e) => ({ ...r, [e.id]: e }), {});
        },
        [deleteEvent.fulfilled]: (state, action) => {
            if (!action.payload?.success) {
                console.warn('error deleting event');
                return;
            }
            if (state.activeId === Number(action.payload.id)) {
                state.activeId = null;
            }
            delete state.all[action.payload.id];
        },
        [saveEvent.fulfilled]: (state, action) => {
            if (!action.payload?.success) {
                console.warn('error saving event');
                return;
            }
            state.all[action.payload.event.id] = action.payload.event;
            state.activeId = action.payload.event.id;
            state.draft = getDraftEvent();
        }
    }
});

export const {
    resetDraft,
    setEventId,
    addCompetitorId,
    removeCompetitorId,
    editEvent,
    setName,
    setDate,
    setPlace,
    setHost,
    setStart,
    toggleFinal,
    toggleDiscipline,
    setGymnastics
} = eventsSlice.actions;

export default eventsSlice.reducer;
