export default class Year {
  constructor(date, grade) {
    this.dateObj = date;
    this.year = date.getFullYear();
    this.increment(grade);
  }
  increment(grade) {
    this[grade] = this[grade] ? this[grade] + 1 : 1;
  }
  getYear() {
    return this.year;
  }
  getGradeCount(grade) {
    return this[grade];
  }
  getDateObj() {
    return new Date(`1/1/${this.year}`)
  }
}
