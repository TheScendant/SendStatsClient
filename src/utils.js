
const microWeights = new Map([["-", 1], ["a", 2], ["a/b", 3], ["b", 4], ["b/c", 5], ["c", 6], ["c/d", 7], ["d", 8], ["+", 9]]);

const addOrIncrement = (mapName, key) => {
    const oldValue = mapName.get(key);
    mapName.set(key, oldValue ? oldValue + 1 : 1);
}
const getGradeKeys = () => ["5.4", "5.5", "5.6", "5.7", "5.8", "5.9", "5.10", "5.11", "5.12", "5.13", "5.14"];
const getMicroRating = (grade) => microWeights.get(grade.match(/5\.\d+(.*)/)[1]); // matches anything after 5.numbers
const getMacroRating = (grade) => parseInt(grade.match(/5\.(\d+)/)[1]); // matches the number after '5'
const gradeSorter = (a, b) => {
    const macroA = getMacroRating(a);
    const macroB = getMacroRating(b);
    if (macroA > macroB) {
        return 1;
    }
    if (macroA < macroB) {
        return -1;
    }
    const microA = getMicroRating(a);
    const microB = getMicroRating(b);
    if (microA > microB) {
        return 1;
    }
    if (microA < microB) {
        return -1;
    }
    return 0;
}
const monthSorter = (a, b) => {
    if (a.Year < b.Year) {
        return -1
    } else if (a.Year > b.Year) {
        return 1
    } else if (a.Month < b.Month) {
        return -1;
    } else if (a.Month > b.Month) {
        return 1;
    }
    return 0;
}

const postJSON = async (data, url) => {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const body = await response.json();
        if (response.status !== 200) {
            throw Error("ERROR");
        }
        return body;
    } catch (e) {
        console.error(e);
        return;
    }
};

const isValidRating = (send) => ((!send.rating.toLowerCase().includes("v")) && send.rating.toLowerCase().includes("5"))


export {
    addOrIncrement,
    getGradeKeys,
    getMacroRating,
    getMicroRating,
    gradeSorter,
    isValidRating,
    monthSorter,
    postJSON,
};