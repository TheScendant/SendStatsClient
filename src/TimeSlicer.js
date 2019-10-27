import Year from './Year';
import Month from './Month';
import { getGradeKeys, getMacroRating, isValidRating, monthSorter } from './utils';

const TimeSliceEnum = {
  YEAR: 'YEAR',
  MONTH: 'MONTH',
}

const sliceData = (sends, TimeSlice) => {
  if (TimeSlice === TimeSliceEnum.YEAR) {
    return sliceDataYearly(sends);
  } else if (TimeSlice === TimeSliceEnum.MONTH) {
    return sliceDataMonthly(sends);
  }
}



const sliceDataMonthly = (sends) => {
  const dateToGradeQuanities = new Map();
  for (const send of sends) {
    if (isValidRating(send)) { // ignore boulders for now
      const date = new Date(send.date);
      const year = date.getFullYear();
      const month = date.getMonth();
      const timeKey = `${month}${year}`;
      const macroRating = `5.${getMacroRating(send.rating)}`; // hack to strip abcd+-/
      let monthObject;
      if (dateToGradeQuanities.has(timeKey)) {
        monthObject = dateToGradeQuanities.get(timeKey);
        monthObject.increment(macroRating);
      } else {
        monthObject = new Month(date, macroRating);
      }
      dateToGradeQuanities.set(timeKey, monthObject);
    }
  }
  const dateGradeQuantityArray = [];
  for (const timeKey of dateToGradeQuanities.keys()) {
    const monthObject = dateToGradeQuanities.get(timeKey);
    const gradeKeys = getGradeKeys();
    const month = {
      TimeSegment: `${monthObject.getMonth()}/${monthObject.getYear().toString().slice(2,4)}`,
      Year: parseInt(monthObject.getYear()),
      Month: parseInt(monthObject.getMonth()),
    }; // add 1 to month
    for (let k = 0; k < gradeKeys.length; k++) {
      const grade = gradeKeys[k];
      month[grade] = monthObject.getGradeCount(grade);
    }
    dateGradeQuantityArray.push(month);
  }
  dateGradeQuantityArray.sort((a, b) => monthSorter(a, b));
  return dateGradeQuantityArray;
}

const sliceDataYearly = (sends) => {
  const dateToGradeQuanities = new Map();
  for (const send of sends) {
    if (isValidRating(send)) { // ignore boulders for now
      const year = new Date(send.date).getFullYear();
      const macroRating = `5.${getMacroRating(send.rating)}`; // hack to strip abcd+-/
      let yearObject;
      if (dateToGradeQuanities.has(year)) {
        yearObject = dateToGradeQuanities.get(year);
        yearObject.increment(macroRating);
      } else {
        yearObject = new Year(year, macroRating);
      }
      dateToGradeQuanities.set(year, yearObject);
    }
  }
  const dateGradeQuantityArray = [];
  for (const yearKey of dateToGradeQuanities.keys()) {
    const yearObject = dateToGradeQuanities.get(yearKey);
    const gradeKeys = getGradeKeys();
    const year = { TimeSegment: yearObject.getYear() };
    for (let k = 0; k < gradeKeys.length; k++) {
      const grade = gradeKeys[k];
      year[grade] = yearObject.getGradeCount(grade);
    }
    dateGradeQuantityArray.push(year);
  }
  dateGradeQuantityArray.sort((a, b) => {
    if (a.TimeSegment > b.TimeSegment) {
      return 1
    } else if (a.TimeSegment < b.TimeSegment) {
      return -1
    }
    return 0
  })
  return dateGradeQuantityArray;
}

export {
  sliceData,
  TimeSliceEnum,
}