import { Discipline, Exceptional } from './values';

function createTable(inStart, inEnd, outStart, outEnd, roundTo = 1) {
    const inputIncrement =  (outEnd - outStart) / (inEnd - inStart) / roundTo;
    const inputParser = input => (Math.floor(input * inputIncrement) / inputIncrement);

    return function(input) {
        const val = inputParser(input);
        return Math.max(Math.round(((outStart - outEnd) * (val - inStart) / (inStart - inEnd) + outStart) / roundTo), 0) * roundTo;
    }
}

const getters = {
    // Jan 2021: 15 reps with 2 points each
    [Discipline.PUSH]: createTable(0, 15, 0, 30),
    [Discipline.PULL]: createTable(0, 15, 0, 30),
    [Discipline.PULL_UP]: createTable(0, 15, 0, 30),
    [Discipline.T2B]: createTable(0, 15, 0, 30),
    // Jan 2021: values from printed table
    [Discipline.H1]: createTable(11, 14, 30, 0, 2),
    [Discipline.LT]: createTable(11, 16, 50, 0),
    [Discipline.DR_M]: createTable(4.3, 6.3, 40, 0),
    [Discipline.SW]: createTable(1.35, 2.85, 0, 50),
    [Discipline.SD]: createTable(4, 9, 0, 50, 1),
    [Discipline.SCHO]: createTable(3, 13, 0, 50),
    // Jan 2021: coach inputs gymnastics points sum, result outputs x3
    [Discipline.GYM]: createTable(0, 10, 0, 30, 0.5),
    [Discipline.SNATCH]: createTable(0, 10, 0, 30, 0.5),
    [Discipline.CLEAN_AND_JERK]: createTable(0, 10, 0, 30, 0.5),
};

export const calcPointsForExceptional = {
    [Exceptional.GYMNASTICS]: result => Object.values(result).reduce((r, e) => r + e, 0)
};

export function getPoints(disc, result) {
    const fn = getters[disc];
    if (typeof fn !== 'function') {
        return 0;
    }
    if (Object.values(Exceptional).includes(disc)) {
        result = calcPointsForExceptional[disc](result);
    }
    return fn(result);
}
