import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { requestService } from 'harbor-js';
import { Gender } from '../../app/lib/values';

function getDraftCompetitor() {
    return {
        id: 0,
        name: '',
        gender: Gender.FEMALE,
        year: new Date().toISOString().split('T')[0].split('-')[0] - 9,
        weight: {},
        club: '',
        results: {}
    };
}

export const getCompetitors = createAsyncThunk(
    'competitors/getCompetitors',
    async ids => {
        return await requestService.post(`${requestService.baseUrl}/tsc/get_competitors`, ids);
    }
);

export const deleteCompetitor = createAsyncThunk(
    'competitors/deleteCompetitor',
    async id => {
        return await requestService.get(`${requestService.baseUrl}/tsc/delete_competitor/${id}`);
    }
);

export const saveCompetitor = createAsyncThunk(
    'competitors/saveCompetitor',
    async competitor => {
        return await requestService.post(`${requestService.baseUrl}/tsc/upsert_competitor`, competitor);
    }
);

export const competitorsSlice = createSlice({
    name: 'competitors',
    initialState: {
        all: {},
        draft: getDraftCompetitor()
    },
    reducers: {
        resetCompetitors: state => {
            state.draft = getDraftCompetitor();
        },
        editCompetitor: (state, action) => {
            state.draft = state.all[action.payload];
        },
        setName: (state, action) => {
            state.draft.name = action.payload;
        },
        setGender: (state, action) => {
            state.draft.gender = action.payload;
        },
        setYear: (state, action) => {
            state.draft.year = action.payload;
        },
        setWeight: (state, action) => {
            if (!action.payload.eventId) {
                console.warn('you tried to set a weight without an event id');
                return;
            }
            if (!action.payload.competitorId) {
                console.warn('you tried to set a weight without a competitor id');
                return;
            }
            state.all[action.payload.competitorId].weight[action.payload.eventId] = action.payload.weight;
        },
        setClub: (state, action) => {
            state.draft.club = action.payload;
        },
        setResult: (state, action) => {
            if (!action.payload.eventId) {
                console.warn('you tried to set a result without an event id');
                return;
            }
            if (!action.payload.competitorId) {
                console.warn('you tried to set a result without a competitor id');
                return;
            }
            if (!state.all[action.payload.competitorId].results[action.payload.eventId]) {
                state.all[action.payload.competitorId].results[action.payload.eventId] = {};
            }
            state.all[action.payload.competitorId].results[action.payload.eventId][action.payload.discipline] = action.payload.result;
        }
    },
    extraReducers: {
        [getCompetitors.fulfilled]: (state, action) => {
            if (!Array.isArray(action.payload)) {
                console.warn('error getting competitors');
                return;
            }
            state.all = action.payload.reduce((r, e) => ({ ...r, [e.id]: e }), state.all);
        },
        [deleteCompetitor.fulfilled]: (state, action) => {
            if (!action.payload?.success) {
                console.warn('error deleting competitor');
                return;
            }
            delete state.all[action.payload.id];
        },
        [saveCompetitor.fulfilled]: (state, action) => {
            if (!action.payload?.success) {
                console.warn('error saving competitor');
                return;
            }
            state.all[action.payload.competitor.id] = action.payload.competitor;
            state.draft = getDraftCompetitor();
        }
    }
});

export const {
    resetCompetitors,
    editCompetitor,
    setName,
    setGender,
    setYear,
    setWeight,
    setClub,
    setResult
} = competitorsSlice.actions;

export default competitorsSlice.reducer;
