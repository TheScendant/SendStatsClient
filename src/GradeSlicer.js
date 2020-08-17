import { gradeSorter, isValidRating } from './utils';
import Grade from './Grade';
// import Year from './Year';

const TimeSliceEnum = {
  YEAR: 'YEAR',
  MONTH: 'MONTH',
}

const sliceData = (sends, TimeSlice, aggregrate) => {
  if (TimeSlice === TimeSliceEnum.YEAR) {
    return sliceDataYearly(sends, aggregrate);
  }
}
const sliceDataYearly = (sends, aggregrate) => {
  const gradeToDateQuanities = new Map();
  const years = [];
  for (const send of sends) {
    if (isValidRating(send)) { // ignore boulders for now
      const year = new Date(send.date).getFullYear();

      const grade = new Grade(year, send, aggregrate).getGrade();
      if (!years.includes(year)) {
        years.push(year);
      }
      let gradeObject;
      if (gradeToDateQuanities.has(grade)) {
        gradeObject = gradeToDateQuanities.get(grade);
        gradeObject.increment(year);
      } else {
        gradeObject = new Grade(year, send, aggregrate);
      }
      gradeToDateQuanities.set(grade, gradeObject);
    }
  }

  const gradeDateQuantityArray = [];
  for (const gradeKey of gradeToDateQuanities.keys()) {
    const gradeObject = gradeToDateQuanities.get(gradeKey);
    const grade = { grade: gradeObject.getGrade() };
    for (let k = 0; k < years.length; k++) {
      const year = years[k];
      grade[year] = gradeObject.getYearCount(year);
    }
    gradeDateQuantityArray.push(grade);
  }
  gradeDateQuantityArray.sort((a,b) => gradeSorter(a.grade,b.grade));
  return [gradeDateQuantityArray, years];
}
export {
  sliceData
}