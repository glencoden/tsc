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
    SW: 'SW',
    SD: 'SD',
    PL: 'PL',
    GYM: 'Turnen'
};

export const Exceptional = {
    GYMNASTICS: Discipline.GYM
};