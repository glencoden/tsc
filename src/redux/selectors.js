import { defaultValues } from '../utils/helpers';
import getCompetitorsFilter from '../utils/getCompetitorsFilter';

export const selectActiveEvent = state => state.events.activeId ? state.events.all[state.events.activeId] : defaultValues.OBJECT;

export const selectActiveCompetitors = state => {
    const activeEvent = selectActiveEvent(state);
    const competitorIds = activeEvent.competitorIds || [];
    const activeCompetitors = Object.keys(state.competitors.all)
        .reduce(
            (r, e) => competitorIds.includes(Number(e)) ? [ ...r, state.competitors.all[e] ] : r,
            []
        );
    if (state.competitors.filter === null) {
        return activeCompetitors;
    }
    const filterFn = element => state.competitors.filter.map(getCompetitorsFilter).every(fn => fn(element));
    return activeCompetitors.filter(filterFn);
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