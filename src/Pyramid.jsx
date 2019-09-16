import * as d3 from 'd3';
import React, { Component } from 'react';
import './Pyramid.css'
import { gradeSorter, addOrIncrement, isValidRating, getMacroRating } from './utils';

class Pyramid extends Component {
  componentDidMount() {
    this.createGraph(this.props.sends);
  }

  componentDidUpdate() {
    this.createGraph(this.props.sends);
  }

  createGraph(sends) {
    const gradeMap = new Map();
    for (const send of sends) {
      if (isValidRating(send)) { // ignore boulders for now
        addOrIncrement(gradeMap, send.rating); //getMacroRating(send.rating));
      }
    }
    const gradeObjects = [];
    for (const key of gradeMap.keys()) {
      gradeObjects.push({ grade: key, quantity: gradeMap.get(key) });
    }

    gradeObjects.sort((a, b) => -1 * gradeSorter(a.grade, b.grade)); // lol

    var myColor = d3.scaleLinear().domain([1,5]).range(["white", "orange"]);

    d3.select("#main")
      .selectAll("div")
      .data(gradeObjects, (d) => d.grade)
      .enter()
      .append("div")
      .attr("class", "wedge")
      .attr("style", (d) => `width: ${d.quantity*75}px; height: 60px;background-color:${myColor(getMacroRating(d.grade))}`)
      .append("span")
      .attr("class", "wedge-text")
      .text(d => `${d.grade}: ${d.quantity}`)


  }
  render() {
    return (
      <div id="Pyramid">
        <div id="main-pyramid">
          {/* <svg width="1152" height="600"></svg> */}
        </div>
      </div>
    )
  };
}

export default Pyramid;