export function parseCommaSeparation(input) {
    const matchDoubleSpace = /\s+/gm;
    const matchCommaSpaces = /[,\s]*,[,\s]*/gm;
    return input
        .replace(matchDoubleSpace, ' ')
        .replace(matchCommaSpaces, ', ');
}