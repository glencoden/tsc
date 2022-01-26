import { getRanks } from './getRanks';
import { AgesPerGroup } from '../competition-logic/values';
import { isObject } from './helpers';

export function getPrintable({ competitors, activeEvent, activeEventIds }) {
    const ranked = getRanks(competitors, activeEventIds);

    return ranked.map(competitor => {
        const { name, gender, club, points, rank, year } = competitor;

        const { name: eventName, place: eventPlace, date: eventDate, start: eventStart, final: eventIsFinal } = activeEvent;

        const weightAtEvent = competitor.weight[activeEvent.id];

        const ageAtEvent = new Date(activeEvent.date).getFullYear() - competitor.year;
        const ageGroupAtEvent = Object.keys(AgesPerGroup).find(group => AgesPerGroup[group].includes(ageAtEvent));

        const resultsForEvent = { ...competitor.results[activeEvent.id] } || {};
        Object.keys(resultsForEvent).forEach(discipline => {
            const result = resultsForEvent[discipline];
            if (!isObject(result)) {
                return
            }
            // add up gymnastics results
            resultsForEvent[discipline] = `${Object.values(result).reduce((r, e) => r + parseInt(e), 0)}`;
        });

        return {
            name,
            gender,
            club,
            points,
            rank,
            year,
            eventName,
            eventPlace,
            eventDate,
            eventStart,
            eventIsFinal,
            weightAtEvent,
            ageGroupAtEvent,
            resultsForEvent
        };
    });
}