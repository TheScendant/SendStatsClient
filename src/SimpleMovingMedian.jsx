import * as d3 from 'd3';
import React, { Component } from 'react';
import { getGradeKeys, getMacroRating, gradeSorter } from './utils';

class SimpleMovingMedian extends Component {

  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.createGraph(this.props.sends);
  }

  componentDidUpdate() {
    this.createGraph(this.props.sends);
  }

  calcSMM(sends, hardestRedpoint) {
    const grades = sends.map(s => s && s.rating); // dosomething bandaid ?
    grades.sort((a, b) => gradeSorter(a,b));
    const median = grades[4];
    const last = grades[grades.length - 1];
    const val = gradeSorter(last, hardestRedpoint);
    if (val === 1) {
      hardestRedpoint = last;
    }
    return {date: sends[sends.length-1].date, hardestRedpoint, median}
  }

  makeDataPoints(sends) {
    const dataPoints = [];
    let x = 9; // pointer
    if (sends.length > x) {
      let hardestRedpoint = sends[0].rating;
      const window = sends.slice(0, x);
      for (let i = x; i< sends.length; i++) {
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
    sends = sends.filter(s => !s.rating.toUpperCase().includes("V"))
    sends.sort((a,b) => new Date(a.date) - new Date(b.date)); // dosomething sort by date
    const dataPoints = this.makeDataPoints(sends);
    var margin = {top: 50, right: 50, bottom: 50, left: 50}
  , width = window.innerWidth - margin.left - margin.right // Use the window's width
  , height = window.innerHeight - margin.top - margin.bottom; // Use the window's height

  // The number of datapoints
var n = dataPoints.length;

// 5. X scale will use the index of our data
const start = new Date(dataPoints[0].date).getTime();
const end = new Date(dataPoints[dataPoints.length-1].date).getTime();
var xScale = d3.scaleLinear()
    .domain([0, dataPoints.length -1])
    .range([0, width]); // output



const keys = getGradeKeys();
console.warn(getMacroRating("5.10b"));
// 6. Y scale will use the randomly generate number
var yScale = d3.scaleLinear()
    .domain([getMacroRating(keys[0]), getMacroRating(keys[keys.length-1])]) // input
    .range([0, height]); // output

// 7. d3's line generator
var line = d3.line()
    .x(function(d, i) {
       const x = xScale(new Date(d.date).getTime());
       return xScale(i);
      }) // set the x values for the line generator
    .y(function(d) {
      const grade = getMacroRating(d.median);
      console.warn(yScale(grade));
      return yScale(grade);
     }) // set the y values for the line generator
    .curve(d3.curveMonotoneX) // apply smoothing to the line


// 1. Add the SVG to the page and employ #2
var svg = d3.select("#cookies").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
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
svg.append("path")
    .datum(dataPoints) // 10. Binds data to the line
    .attr("class", "line") // Assign a class for styling
    .attr("d", line); // 11. Calls the line generator

// 12. Appends a circle for each datapoint
/* svg.selectAll(".dot")
    .data(dataPoints)
  .enter().append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function(d, i) { return xScale(i) })
    .attr("cy", function(d) { return yScale(d.y) })
    .attr("r", 5) */
    /* .on("mouseover", function(a, b, c) {
  			console.log(a)
        this.attr('class', 'focus')
		})
 */
  }
  render() {
    return (
      <div id="cookies">
      </div>
    )
  };
}

export default SimpleMovingMedian;