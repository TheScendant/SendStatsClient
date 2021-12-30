
import * as d3 from 'd3';
// if you change these micros it'll affect the aggRating and getAllGrades funcs!!
const microWeights = new Map([["-", 1], ["a", 2], ["a/b", 3], ["b", 4], ["b/c", 5], ["c", 6], ["c/d", 7], ["d", 8], ["+", 9]]);
const microGrades = new Map([[1, "-"], [2, "a"], [3, "a/b"], [4, "b"], [5, "b/c"], [6, "c"], [7, "c/d"], [8, "d"], [9, "+"]]);
const singles = ["5.4", "5.5", "5.6", "5.7", "5.8", "5.9"];

const BARE_GRADE_WEIGHT = 5;

const addOrIncrement = (mapName, key) => {
  const oldValue = mapName.get(key);
  mapName.set(key, oldValue ? oldValue + 1 : 1);
}

const gradesToInts = (grade) => {
  const macro = getMacroRating(grade);
  let micro = getMicroRating(grade);
  micro = micro ? micro : BARE_GRADE_WEIGHT;
  return parseInt(macro.toString() + micro.toString());
}

const getGradeKeys = () => ["5.4", "5.5", "5.6", "5.7", "5.8", "5.9", "5.10", "5.11", "5.12", "5.13", "5.14"];
const getMicroRating = (grade) => microWeights.get(grade.match(/5\.\d+(.*)/)[1]); // matches anything after 5.numbers
const getMacroRating = (grade) => parseInt(grade.match(/5\.(\d+)/)[1]); // matches the number after '5'
const gradeSorter = (a, b) => {

  if (a.toLowerCase().includes('v') && b.toLowerCase().includes('v')) {
    return boulderSorter(a, b)
  }
  const macroA = getMacroRating(a);
  const macroB = getMacroRating(b);
  if (macroA > macroB) {
    return 1;
  }
  if (macroA < macroB) {
    return -1;
  }
  let microA = getMicroRating(a) || 5.5;
  let microB = getMicroRating(b) || 5.5;
  if (microA > microB) {
    return 1;
  }
  if (microA < microB) {
    return -1;
  }
  return 0;
}
const boulderSorter = (a, b) => {
  const cleanA = parseInt(a.replace('+', '').replace('-', ''))
  const cleanB = parseInt(b.replace('+', '').replace('-', ''))

  return cleanA - cleanB

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

export const herokuUrl = "https://send-stats-server.herokuapp.com";

const postJSON = async (data, url) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": herokuUrl,
        "Referer": herokuUrl
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

const isValidRating = (send, isBoulder) => {
  const rope = (!send.rating.toLowerCase().includes("v")) && !send.rating.toLowerCase().includes("w") && send.rating.toLowerCase().includes("5")
  // what about w's ???
  if ((isBoulder && send.rating.includes('/')) || send.rating.toLowerCase().includes('w')) {
    return false
  }
  return isBoulder ? !rope : rope
}

const gradesByTimeColoring = (grade, hardest) => {
  // const softest = ratings[0];
  const maxSpectral = gradesToInts(hardest);
  let numb = gradesToInts(grade);
  /*
   5.0 - 5.9 becomes 0 - 9
   5.10 => 10
   5.11 => 20
   5.12 => 30
   5.13 => 40
   5.14 => 50
  */
  if (numb < 100) {
    numb = numb / 10.0;
  } else {
    numb = numb - 90;
  }

  numb = numb / (maxSpectral - 90);
  return d3.interpolateSpectral(numb);
}

const getAllBoulderGrades = () => ['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12', 'V13', 'V14', 'V15', 'V16']

const getAllGrades = (agg) => {
  let allGrades = Array.from(singles);
  if (!agg) {
    singles.forEach((single) => {
      allGrades.push(single.concat("-"));
      allGrades.push(single.concat("+"));
    });
  }

  const doubles = ['5.10', '5.11', '5.12', '5.13', '5.14', '5.15'];
  if (!agg) {
    allGrades = allGrades.concat(doubles);
  }
  doubles.forEach((double) => {
    for (const key of microWeights.keys()) {
      if (!agg) {
        allGrades.push(double.concat(key));
      } else {
        if (microWeights.get(key) % 2 !== 1) {
          allGrades.push(double.concat(key));
        }
      }
    }
  });
  return allGrades.sort(gradeSorter);
}

const cleanLegend = (key) => {
  const m = getMicroRating(key);
  return m === 2 || m === 6 || key === '5.9' || key === "5.7"
}

const simpleStringSort = (a, b, order) => {
  if (a < b) {
    return order === 'down' ? 1 : -1;
  } else if (a > b) {
    return order === 'down' ? -1 : 1;
  }
  return 0;
}

/**
 * Be warned all ye who enter here.
 * @param {String} rating 
 */
const aggRating = (rating) => {
  let micro = getMicroRating(rating);
  const macro = getMacroRating(rating);

  // the +, - and / grades all have an odd weight so change to it's closer even one
  if (micro % 2 === 1) { // risky
    if (micro === 1) {
      micro = 2;
    } else {
      micro = micro - 1;
    }
  }

  // 5.10 => 5.10b
  // 5.7+ => 5.7
  // 5.7- => 5.7
  let mv = "";
  if (!singles.includes(`5.${macro}`)) {
    let m = microGrades.get(micro);
    mv = m ? m : 'b';
  }
  return `5.${macro}${mv}`;
}

export {
  addOrIncrement,
  aggRating,
  boulderSorter,
  cleanLegend,
  getAllBoulderGrades,
  getAllGrades,
  getGradeKeys,
  getMacroRating,
  getMicroRating,
  gradesByTimeColoring,
  gradesToInts,
  gradeSorter,
  isValidRating,
  monthSorter,
  postJSON,
  simpleStringSort,
};