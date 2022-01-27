export const Gender = {
    FEMALE: 'W',
    MALE: 'M'
};

export const Ages = [ 9, 10, 11, 12, 13, 14 ];

export const Group = {
    A: 'Kinder',
    B: 'Schüler'
};

export const AgesPerGroup = {
    [Group.A]: [ 9, 10, 11, 12 ],
    [Group.B]: [ 13, 14 ]
};

export const Discipline = {
    PUSH: 'Bankdrücken',
    PULL: 'Zug liegend',
    SNATCH: 'Reißen',
    CLEAN_AND_JERK: 'Stoßen',
    PULL_UP: 'Klimmziehen',
    T2B: 'Anristen',
    SCHO: 'SCHO',
    H1: 'H1',
    LT: 'LT',
    DR_M: '30m',
    SW: 'SWS',
    SD: 'SDS',
    GYM: 'Turnen'
};

export const Exceptional = {
    GYMNASTICS: Discipline.GYM
};

export const MeasureUnit = {
    [Discipline.PUSH]: 'Wdh',
    [Discipline.PULL]: 'Wdh',
    [Discipline.SNATCH]: 'Kg',
    [Discipline.CLEAN_AND_JERK]: 'Kg',
    [Discipline.PULL_UP]: 'Wdh',
    [Discipline.T2B]: 'Wdh',
    [Discipline.SCHO]: 'Meter',
    [Discipline.H1]: 'Sek',
    [Discipline.LT]: 'Sek',
    [Discipline.DR_M]: 'Sek',
    [Discipline.SW]: 'Meter',
    [Discipline.SD]: 'Meter',
    [Discipline.GYM]: 'Übungen',
};