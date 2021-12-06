import { defaultValues } from '../util/helpers';

export const selectActiveEvent = state => state.events.activeId ? state.events.all[state.events.activeId] : defaultValues.OBJECT;

export const selectActiveCompetitors = state => {
    const activeEvent = selectActiveEvent(state);
    const competitorIds = activeEvent.competitorIds || [];
    return Object.keys(state.competitors.all).reduce((r, e) => competitorIds.includes(Number(e)) ? [ ...r, state.competitors.all[e] ] : r, []);
};

export const selectEventIdsForYear = state => {
    const activeYear = selectActiveEvent(state).date?.split('-')[0];
    if (!activeYear) {
        return defaultValues.ARRAY;
    }
    return Object.values(state.events.all)
        .filter(e => e.date?.split('-')[0] === activeYear)
        .map(e => e.id);
};