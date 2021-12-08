import { Gender, Ages, Discipline } from './values';
import { getAge } from './year';

const weights = {
    [Gender.FEMALE]: {
        [Discipline.SCHO]: [ 2, 2, 2, 2, 3, 3 ],
        [Discipline.PUSH]: [ 40, 45, 50, 55, 60, 65 ],
        [Discipline.PULL]: [ 40, 45, 50, 50, 55, 60 ]
    },
    [Gender.MALE]: {
        [Discipline.SCHO]: [ 2, 2, 3, 3, 4, 4 ],
        [Discipline.PUSH]: [ 45, 50, 60, 65, 70, 75 ],
        [Discipline.PULL]: [ 45, 50, 55, 60, 65, 70 ]
    }
};

const WeightType = {
    KG: 'kg',
    PERCENT: 'percent'
};

const weightDisciplines = {
    [Discipline.SCHO]: WeightType.KG,
    [Discipline.PUSH]: WeightType.PERCENT,
    [Discipline.PULL]: WeightType.PERCENT
};

export function getWeight(birthYear, gender, bodyWeight, discipline) {
    if (!weightDisciplines[discipline]) {
        return 0;
    }
    const age = getAge(birthYear);
    const weightValue = weights[gender][discipline][Ages.indexOf(age)];
    switch (weightDisciplines[discipline]) {
        case WeightType.KG:
            return weightValue;
        case WeightType.PERCENT:
            return Math.round(bodyWeight * weightValue / 100);
        default:
    }
}
