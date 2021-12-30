import { gradeSorter, isValidRating } from './utils';
import Grade from './Grade';
// import Year from './Year';

const TimeSliceEnum = {
  YEAR: 'YEAR',
  MONTH: 'MONTH',
}

const sliceData = (sends, TimeSlice, aggregrate, isBoulder) => {
  if (TimeSlice === TimeSliceEnum.YEAR) {
    return sliceDataYearly(sends, aggregrate, isBoulder);
  }
}
const sliceDataYearly = (sends, aggregrate, isBoulder) => {
  const gradeToDateQuanities = new Map();
  const years = [];
  for (const send of sends) {
    if (isValidRating(send, isBoulder)) { // ignore boulders for now
      const year = new Date(send.date).getFullYear();

      const grade = new Grade(year, send, aggregrate).getGrade();
      if (!years.includes(year)) {
        years.push(year);
      }
      let gradeObject;
      if (gradeToDateQuanities.has(grade)) {
        gradeObject = gradeToDateQuanities.get(grade);
        gradeObject.grade.increment(year);
        gradeObject.sendList.push(send);

      } else {
        let g = new Grade(year, send, aggregrate);
        gradeObject = { grade: g, sendList: [send] }
      }
      gradeToDateQuanities.set(grade, gradeObject);
    }
  }

  /*
    Build an array of objects relating grade to number of grades 
    sent per year. eg:
    {2018: 1, 2019: 10, 2020: 5, grade: "5.11b", total: 16, sendList: [{}]}
  */
  const gradeDateQuantityArray = [];
  for (const gradeKey of gradeToDateQuanities.keys()) {
    const gradeObject = gradeToDateQuanities.get(gradeKey);
    const grade = { grade: gradeObject.grade.getGrade(), sendList: gradeObject.sendList };
    for (let k = 0; k < years.length; k++) {
      const year = years[k];
      grade[year] = gradeObject.grade.getYearCount(year);
    }
    gradeDateQuantityArray.push(grade);
  }
  gradeDateQuantityArray.sort((a, b) => gradeSorter(a.grade, b.grade));
  return [gradeDateQuantityArray, years];
}
export {
  sliceData
}