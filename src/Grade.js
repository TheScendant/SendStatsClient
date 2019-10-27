export default class Grade {
  constructor(year, send) {
    const {rating} = send;
    this.grade = rating;
    this.increment(year);
  }
  increment(year) {
    this[year] = this[year] ? this[year] + 1 : 1;
  }
  getGrade() {
    return this.grade;
  }
  getYearCount(year) {
    return this[year] ? this[year] : 0;
  }
}
