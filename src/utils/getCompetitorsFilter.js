import { AgesPerGroup, Gender, Group } from '../competition-logic/values';
import { getAge } from '../competition-logic/year';

function getCompetitorsFilter(filterName) {
    switch (filterName) {
        case Gender.FEMALE:
            return competitor => competitor.gender === Gender.FEMALE;
        case Gender.MALE:
            return competitor => competitor.gender === Gender.MALE;
        case Group.A:
            return competitor => AgesPerGroup[Group.A].includes(getAge(competitor.year));
        case Group.B:
            return competitor => AgesPerGroup[Group.B].includes(getAge(competitor.year));
        default:
            return () => true;
    }
}

export default getCompetitorsFilter;