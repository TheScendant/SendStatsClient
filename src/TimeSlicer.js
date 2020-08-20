import Year from './Year';
import Month from './Month';
import { isValidRating, monthSorter } from './utils';

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
  const ratings = [];
  for (const send of sends) {
    if (isValidRating(send)) { // ignore boulders for now
      const date = new Date(send.date);
      const year = date.getFullYear();
      const month = date.getMonth();
      const timeKey = `${month}${year}`;
      const {rating} = send;
      let monthObject;
      if (!ratings.includes(rating)) {
        ratings.push(rating);
      }
      if (dateToGradeQuanities.has(timeKey)) {
        monthObject = dateToGradeQuanities.get(timeKey);
        monthObject.increment(rating);
      } else {
        monthObject = new Month(date, rating);
      }
      dateToGradeQuanities.set(timeKey, monthObject);
    }
  }
  const dateGradeQuantityArray = [];
  for (const timeKey of dateToGradeQuanities.keys()) {
    const monthObject = dateToGradeQuanities.get(timeKey);
    const month = {
      TimeSegment: monthObject.getDateObj(),
      Year: parseInt(monthObject.getYear()),
      Month: parseInt(monthObject.getMonth()),
    }; // add 1 to month
    for (let k = 0; k < ratings.length; k++) {
      const grade = ratings[k];
      let gradeCount = monthObject.getGradeCount(grade);
      month[grade] = gradeCount ? gradeCount : 0;
    }
    dateGradeQuantityArray.push(month);
  }
  dateGradeQuantityArray.sort((a, b) => monthSorter(a, b));
  return [ratings, dateGradeQuantityArray];
}

const sliceDataYearly = (sends) => {
  const dateToGradeQuanities = new Map();
  const ratings = [];
  for (const send of sends) {
    if (isValidRating(send)) { // ignore boulders for now
      const date = new Date(send.date)
      const year = date.getFullYear();
      const {rating} = send;
      if (!ratings.includes(rating)) {
        ratings.push(rating);
      }
      let yearObject;
      if (dateToGradeQuanities.has(year)) {
        yearObject = dateToGradeQuanities.get(year);
        yearObject.increment(rating);
      } else {
        yearObject = new Year(date, rating);
      }
      dateToGradeQuanities.set(year, yearObject);
    }
  }
  const dateGradeQuantityArray = [];
  for (const yearKey of dateToGradeQuanities.keys()) {
    const yearObject = dateToGradeQuanities.get(yearKey);
    const year = { TimeSegment: yearObject.getDateObj() };
    for (let k = 0; k < ratings.length; k++) {
      const grade = ratings[k];
      let gradeCount = yearObject.getGradeCount(grade);
      year[grade] = gradeCount ? gradeCount : 0;
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
  return [ratings, dateGradeQuantityArray];
}

export {
  sliceData,
  TimeSliceEnum,
}