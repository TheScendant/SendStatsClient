import * as d3 from 'd3';
import React, { Component } from 'react';
// import sends from './sends';
import './Graph.css'
import { sliceData, TimeSliceEnum } from './TimeSlicer.js';
import { gradesByTimeColoring, gradeSorter } from './utils';

class Graph extends Component {
  // grades by time
  constructor(props) {
    super(props);
    this.state = {
      TimeSlice: TimeSliceEnum.MONTH,
      zoomTransform: null,
    };
    this.zoom = d3.zoom()
      .scaleExtent([-5, 5])
      .on("zoom", this.zoomed.bind(this))
  }
  componentDidMount() {
    this.createGraph(this.props.sends);
  }

  componentDidUpdate() {
    this.createGraph(this.props.sends);
  }

  zoomed() {
    if (d3.event && d3.event.transform) {
      this.setState({
        zoomTransform: d3.event.transform
      });
      console.warn(d3.event.transform)
    }
  }

  calcTimeBounds(sends) {
    const dates = sends.map(({ date }) => new Date(date));

    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    const correctedMinDate = new Date(`1/1/${minDate.getFullYear()}`);
    const correctedMaxDate = new Date(`12/31/${maxDate.getFullYear()}`);
    return [correctedMinDate, correctedMaxDate];
  }

  createGraph(sends) {
    const [ratings, dateGradeQuantityArray] = sliceData(sends, this.state.TimeSlice);

    const data = dateGradeQuantityArray;
    var keys = ratings.sort((a, b) => gradeSorter(a, b));
    for (const d of data) {
      let total = 0;
      for (let k = 0; k < keys.length; k++) {
        const key = keys[k];
        total += d[key];
      }
      d.total = total;
    }
    const HARDEST_GRADE = keys[keys.length - 1];

    d3.select("svg").selectAll("*").remove();


    // dosomething implement screen resize
    const LEGEND_WIDTH = 150;
    const svg = d3.select("svg");
    const SVG_RECT = svg.node().getBoundingClientRect();
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = SVG_RECT.width - margin.left - margin.right - LEGEND_WIDTH; // main graph width

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    let height = SVG_RECT.height - margin.top - margin.bottom;

    const timeBounds = this.calcTimeBounds(sends);
    const x = d3.scaleTime().domain(timeBounds).rangeRound([0, width])

    // set y scale
    var y = d3.scaleLinear()
      .rangeRound([height, 0]);

    data.sort((a, b) => b.TimeSegment - a.TimeSegment);

    let barWidth;
    if (this.state.TimeSlice === TimeSliceEnum.MONTH) {
      barWidth = x(new Date("02-01-2020")) - x(new Date("01-01-2020"))
    } else {
      barWidth = x(new Date("01-01-2020")) - x(new Date("01-01-2019"))
    }

    y.domain([0, d3.max(data, (d) => d.total)]).nice();
    const staxG = g.append("g")
    staxG
      .selectAll("g")
      .data(d3.stack().keys(keys)(data))
      .enter()
      .append("g")
      .attr("fill", (d) => gradesByTimeColoring(d.key, HARDEST_GRADE))
      .attr("class", "g-rect")
      .selectAll("rect")
      .data((d) => d)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.data.TimeSegment.getTime()))
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]))
      .attr("width", barWidth)

    g.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    g.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
      .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("font-size", "16px")
      .attr("text-anchor", "start");

    var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter().append("g")
      .attr("transform", (d, i) => `translate(${LEGEND_WIDTH},${i * 20})`);

    legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", d => gradesByTimeColoring(d, HARDEST_GRADE));

    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text((d) => d);

    // Prep the tooltip bits, initial display is hidden
    var tooltip = svg.append("g")
      .attr("class", "tooltip")
      .style("display", "none");

    tooltip.append("rect")
      .attr("width", 60)
      .attr("height", 20)
      .attr("fill", "white")
      .style("opacity", 0.5);

    tooltip.append("text")
      .attr("x", 30)
      .attr("dy", "1.2em")
      .style("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold");

  }

  radioClickHandler(event) {
    this.setState(event.target.name === "year" ? {TimeSlice: TimeSliceEnum.YEAR} : {TimeSlice: TimeSliceEnum.MONTH});
  }

  render() {
    return (
      <div id="Graph">
        <svg id="time-graph"></svg>
        <label className="radioLabel">
          Year
          <input type="radio" name="year" className="radio" checked={this.state.TimeSlice === TimeSliceEnum.YEAR} onChange={(event) => this.radioClickHandler(event)} />
        </label>
        <label className="radioLabel">
          Month
          <input type="radio" name="month" className="radio" checked={this.state.TimeSlice === TimeSliceEnum.MONTH} onChange={(event) => this.radioClickHandler(event)} />
        </label>
      </div>
    )
  };
}

export default Graph;