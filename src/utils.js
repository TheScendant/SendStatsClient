
const microWeights = new Map([["-", 1], ["a", 2], ["a/b", 3], ["b", 4], ["b/c", 5], ["c", 6], ["c/d", 7], ["d", 8], ["+", 9]]);

const addOrIncrement = (mapName, key) => {
    const oldValue = mapName.get(key);
    mapName.set(key, oldValue ? oldValue + 1 : 1);
}

const getMacroValue = function (grade) {
    return parseInt(grade.match(/5\.(\d+)/)[1]); // matches the number after '5.'
}

const getMicroValue = (grade) => microWeights.get(grade.match(/5\.\d+(.*)/)[1]); // matches anything after 5.numbers

const gradeSorter = (a, b) => {
    const macroA = getMacroValue(a);
    const macroB = getMacroValue(b);
    if (macroA > macroB) {
        return 1;
    }
    if (macroA < macroB) {
        return -1;
    }
    const microA = getMicroValue(a);
    const microB = getMicroValue(b);
    console.warn(`micros: ${a} ${b}`);
    if (microA > microB) {
        return 1;
    }
    if (microA < microB) {
        return -1;
    }
    return 0;
}

export default {
    addOrIncrement,
    gradeSorter
};