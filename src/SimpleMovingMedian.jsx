import * as d3 from 'd3';
import React, { Component } from 'react';
import { getGradeKeys, gradesToInts, gradeSorter } from './utils';
import './SimpleMovingMedian.css';
class SimpleMovingMedian extends Component {

  constructor(props) {
    super(props);
    this.state = {
      windowSize: 9
    }
  }
  componentDidMount() {
    this.createGraph(this.props.sends);
  }

  componentDidUpdate() {
    this.createGraph(this.props.sends);
  }

  calcSMM(sends, hardestRedpoint) {
    const grades = sends.map(s => s && s.rating); // dosomething bandaid ?
    grades.sort((a, b) => gradeSorter(a, b));
    const median = grades[4];
    const last = grades[grades.length - 1];
    const val = gradeSorter(last, hardestRedpoint);
    if (val === 1) {
      hardestRedpoint = last;
    }
    return { date: sends[sends.length - 1].date, hardestRedpoint, median }
  }

  makeDataPoints(sends) {
    const dataPoints = [];
    let x = this.state.windowSize; // pointer
    if (sends.length > x) {
      let hardestRedpoint = sends[0].rating;
      const window = sends.slice(0, x);
      for (let i = x; i < sends.length; i++) {
        const smm = this.calcSMM(window, hardestRedpoint);
        hardestRedpoint = smm.hardestRedpoint;
        dataPoints.push(smm);
        // queueue
        window.push(sends[i]);
        window.shift();
      }
    }
    return dataPoints;
  }

  createGraph(sends) {
    // I'm so sorry
    d3.select("svg").selectAll("*").remove();

    sends = sends.filter(s => !s.rating.toUpperCase().includes("V"))
    sends.sort((a, b) => new Date(a.date) - new Date(b.date)); // dosomething sort by date
    const dataPoints = this.makeDataPoints(sends);

    const svg = d3.select("svg");
    var margin = { top: 20, right: 20, bottom: 30, left: 40 },
      width = svg.attr("width") - margin.left - margin.right,
      height = svg.attr("height") - margin.top - margin.bottom;

    // 5. X scale will use the index of our data
    var xScale = d3.scaleLinear()
      .domain([0, dataPoints.length - 1]).nice()
      .range([0, width]); // output

    const keys = getGradeKeys();

    // 6. Y scale will use the randomly generate number
    var yScale = d3.scaleLinear()
      .domain([gradesToInts(keys[0]), gradesToInts(keys[keys.length - 1])]).nice() // input
      .range([height, 0]); // output

    // 1. Add the SVG to the page and employ #2

    svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // 3. Call the x axis in a group tag
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

    // 4. Call the y axis in a group tag
    svg.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

    // 9. Append the path, bind the data, and call the line generator
    /* svg.append("path")
        .datum(dataPoints) // 10. Binds data to the line
        .attr("class", "line") // Assign a class for styling
        .attr("d", line); // 11. Calls the line generator */

    // 12. Appends a circle for each datapoint
    svg.selectAll(".median-dot")
      .data(dataPoints)
      .enter().append("circle") // Uses the enter().append() method
      .attr("class", "median-dot") // Assign a class for styling
      .attr("cx", function (d, i) {
        // const x = xScale(new Date(d.date).getTime());
        return xScale(i);
      })
      .attr("cy", function (d) {
        const grade = gradesToInts(d.median);
        return yScale(grade);
      })
      .attr("r", 5)
    svg.selectAll("hardest-dot")
      .data(dataPoints)
      .enter().append("circle")
      .attr("class", "hardest-dot") // Assign a class for styling
      .attr("cx", function (d, i) {
        // const x = xScale(new Date(d.date).getTime());
        return xScale(i);
      })
      .attr("cy", function (d) {
        const grade = gradesToInts(d.hardestRedpoint);
        return yScale(grade);
      })
      .attr("r", 3)
      .attr("fill", "red")
  }

  radioClickHandler(event) {
    if (event.target.name === "five") {
      this.setState({ windowSize: 5 });
    } else if (event.target.name === "nine") {
      this.setState({ windowSize: 9 });
    } else {
      this.setState({ windowSize: 14 });
    }
  }
  render() {
    return (
      <div id="MedianGraph">
        <div id="main-median-graph">
          <svg width="1152" height="600" windowSize={this.state.windowSize}></svg>
        </div>
        <span id="labels-title">Median Sample Size</span>
        <div id="labels">
          <label className="radioLabel">
            5
          <input type="radio" name="five" className="radio" checked={this.state.windowSize === 5} onChange={(event) => this.radioClickHandler(event)} />
          </label>
          <label className="radioLabel">
            9
          <input type="radio" name="nine" className="radio" checked={this.state.windowSize === 9} onChange={(event) => this.radioClickHandler(event)} />
          </label>
          <label className="radioLabel">
            15
          <input type="radio" name="fifteen" className="radio" checked={this.state.windowSize === 14} onChange={(event) => this.radioClickHandler(event)} />
          </label>
        </div>
      </div>
    )
  };
}

export default SimpleMovingMedian;