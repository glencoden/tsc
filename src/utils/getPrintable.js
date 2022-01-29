import { getRanks } from './getRanks';
import { AgesPerGroup, Exceptional, MeasureUnit } from '../competition-logic/values';
import { getPoints } from '../competition-logic/points';

const fallbackPrintValue = '-';
const maxResultsForEventLength = 5;


export function getPrintable({ competitors, activeEvent, activeEventIds }) {
    return getRanks(competitors, activeEventIds)
        .map(competitor => {
            const { name, gender, club, points, rank, year } = competitor;

            const { name: eventName, date: eventDate, final: eventIsFinal } = activeEvent;

            const weightAtEvent = competitor.weight[activeEvent.id] || fallbackPrintValue;

            const ageAtEvent = new Date(activeEvent.date).getFullYear() - competitor.year;
            const ageGroupAtEvent = Object.keys(AgesPerGroup).find(group => AgesPerGroup[group].includes(ageAtEvent));

            const rawResults = { ...competitor.results[activeEvent.id] } || {};
            const resultsForEvent = Object.keys(rawResults)
                .reduce((acc, discipline) => {
                    const result = rawResults[discipline];
                    switch (discipline) {
                        case Exceptional.GYMNASTICS: {
                            const numGymnastics = Object.keys(result).length;
                            if (numGymnastics === 0) {
                                return acc;
                            }
                            return [
                                ...acc,
                                {
                                    discipline,
                                    result: `${numGymnastics} ${MeasureUnit[discipline]}`,
                                    points: `${Object.values(result).reduce((r, e) => r + parseInt(e), 0)} Punkte`
                                }
                            ];
                        }
                        default:
                            return [
                                ...acc,
                                {
                                    discipline,
                                    result: typeof result !== 'undefined' ? `${result} ${MeasureUnit[discipline]}` : fallbackPrintValue,
                                    points: typeof result !== 'undefined' ? `${getPoints(discipline, result)} Punkte` : fallbackPrintValue
                                }
                            ];
                    }
                }, [])
                .slice(0, maxResultsForEventLength);

            return {
                name,
                gender,
                club,
                points,
                rank,
                year,
                eventName,
                eventDate,
                eventIsFinal,
                weightAtEvent,
                ageGroupAtEvent,
                resultsForEvent
            };
        })
        .filter(e => !!e.name && !!e.gender && !!e.club && !!e.year);
}