import { getPoints } from '../../../app/lib/points';
import { AgesPerGroup, Gender, Group } from '../../../app/lib/values';
import { getAge } from '../../../app/lib/year';

function addRanks(competitors, eventId) {
    const eventIds = Array.isArray(eventId) ? eventId : [ eventId ];
    let curPoints = -1;
    let curRank = 1;
    const rankings = competitors
        .reduce((r, e) => {
            const results = eventIds.reduce((res, id) => {
                const curResults = e.results[id];
                if (!curResults) {
                    return r;
                }
                Object.keys(curResults).forEach(curRes => {
                    if (typeof r[curRes] !== 'number') {
                        r[curRes] = curResults[curRes];
                        return;
                    }
                    r[curRes] = r[curRes] + curResults[curRes];
                });
                return r;
            }, {});
            return [
                ...r,
                {
                    id: e.id,
                    points: Object.keys(results).reduce((r, k) => results[k] ? r + getPoints(k, results[k]) : r, 0)
                }
            ];
        }, [])
        .sort((a, b) => b.points - a.points)
        .map(e => {
            if (curPoints > e.points) {
                curRank++;
                curPoints = e.points;
            }
            if (curPoints === -1) {
                curPoints = e.points;
            }
            return {
                ...e,
                rank: curRank
            };
        });
    return competitors.map(c => {
        const ranking = rankings.find(e => e.id === c.id);
        const { points, rank } = ranking;
        return {
            ...c,
            points,
            rank
        };
    });
}

export function getRanks(competitors, eventIds) {
    const competitionClasses = [];
    Object.values(Group).forEach(groupKey => {
        const ageClass = competitors.filter(e => AgesPerGroup[groupKey].includes(getAge(e.year)));
        Object.values(Gender).forEach(genderKey => {
            competitionClasses.push(ageClass.filter(e => genderKey === e.gender));
        });
    });
    return competitionClasses.reduce((r, e) => [ ...r, ...addRanks(e, eventIds) ], []);
}
