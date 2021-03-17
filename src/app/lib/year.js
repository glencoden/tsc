export function getAge(birthYear) {
    return new Date().getFullYear() - Number(birthYear);
}

export function getBirthYear(age) {
    return new Date().getFullYear() - age;
}