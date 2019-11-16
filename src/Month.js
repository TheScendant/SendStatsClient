import { getGradeKeys } from './utils';

export default class Month {
  constructor(date, grade) {
    const dateObj = new Date(date);
    this.year = dateObj.getFullYear();
    this.month = dateObj.getMonth() + 1; // handle Date Object oddity
    this.increment(grade);
  }
  increment(grade) {
    this[grade] = this[grade] ? this[grade] + 1 : 1;
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
