import { aggRating } from './utils';

export default class Grade {
  constructor(year, send, aggregate) {
    const { rating } = send;
    this.grade = aggregate ? aggRating(rating) : rating;
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
