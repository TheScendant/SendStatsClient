import { getGradeKeys } from './utils';

export default class Month {
  constructor(date, grade) {
    const dateObj = new Date(date);
    this.year = dateObj.getFullYear();
    this.month = dateObj.getMonth() + 1; // handle Date Object oddity
    const keys = getGradeKeys();
    for (let k = 0; k < keys.length; k += 1) {
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
  getMonth() {
    return this.month;
  }
  getGradeCount(grade) {
    return this[grade];
  }
}
