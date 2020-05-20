export default class Month {
  constructor(date, grade) {
    this.dateObj = new Date(date);
    this.year = this.dateObj.getFullYear();
    this.month = this.dateObj.getMonth() + 1; // handle Date Object oddity
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

  getDateObj() {
    return this.dateObj;
  }
}
