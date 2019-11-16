import { getGradeKeys } from './utils';

export default class Year {
  constructor(year, grade) {
    this.year = year;
    this.increment(grade);
  }
  increment(grade) {
    this[grade] = this[grade] ? this.grade + 1 : 1;
  }
  getYear() {
    return this.year;
  }
  getGradeCount(grade) {
    return this[grade];
  }
}
