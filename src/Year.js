import utils from './utils';
const {getGradeKeys} = utils;

export default class Year {
  constructor(year, grade) {
    this.year = year;
    const keys = getGradeKeys();
    for (let k = 0; k < keys.length; k+=1) {
      const key = keys[k];
      this[key] = 0;
    }
    this.increment(grade);
  }
  increment(grade) {
    this[grade] = this[grade] + 1;
  }
  getYear() {
    return this.year;
  }
  getGradeCount(grade) {
    return this[grade];
  }
}
