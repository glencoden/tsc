import { getRanks } from './getRanks';
import { AgesPerGroup, MeasureUnit } from '../competition-logic/values';
import { isObject } from './helpers';
import { getPoints } from '../competition-logic/points';

export function getPrintable({ competitors, activeEvent, activeEventIds }) {
    const ranked = getRanks(competitors, activeEventIds);

    return ranked.map(competitor => {
        const { name, gender, club, points, rank, year } = competitor;

        const { name: eventName, place: eventPlace, date: eventDate, start: eventStart, final: eventIsFinal } = activeEvent;

        const weightAtEvent = competitor.weight[activeEvent.id];

        const ageAtEvent = new Date(activeEvent.date).getFullYear() - competitor.year;
        const ageGroupAtEvent = Object.keys(AgesPerGroup).find(group => AgesPerGroup[group].includes(ageAtEvent));

        const rawResults = { ...competitor.results[activeEvent.id] } || {};
        const resultsForEvent = Object.keys(rawResults).map(discipline => {
            const result = rawResults[discipline];
            if (!isObject(result)) {
                return {
                    discipline,
                    result: `${result} ${MeasureUnit[discipline]}`,
                    points: `${getPoints(discipline, result)} Punkte`
                };
            }
            // gymnastics results
            return {
                discipline,
                result: `${Object.keys(result).length} ${MeasureUnit[discipline]}`,
                points: `${Object.values(result).reduce((r, e) => r + parseInt(e), 0)} Punkte`
            }
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