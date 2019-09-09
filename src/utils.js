
const microGrades = ["-", "a", "b", "c", "d", "+", "/"];

const addOrIncrement = (mapName, key) => {
    const oldValue = mapName.get(key);
    mapName.set(key, oldValue ? oldValue + 1: 1);
}

const clean = (grade) => {
    for (let x = 0; x < microGrades.length; x++) {
        grade = grade.replace(microGrades[x], "");
    }
    grade.replace("5","").replace(".","");
    return grade;
}

const gradeSorter = (a, b) => {
    let aa = a;
    let bb = b;
    if (microGrades.some(micro => a.includes(micro))) {
        aa = clean(a);
    }
    if (microGrades.some(micro => b.includes(micro))) {
        bb = clean(b);
    }
    let intA = parseInt(aa);
    let intB = parseInt(bb);

    if (intA > intB) {
        return 1;
    }
    if (intA < intB) {
        return -1;
    }
    // intA === intB. Need to use sub grades.
    if (! (aa.includes("/") || bb.includes("/"))) {
        // only letters, plus and minus
        // maybe some fancy index of logic here?
    }
    //ew
    
}

export default {
    addOrIncrement,
};