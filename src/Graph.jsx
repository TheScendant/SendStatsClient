import * as d3 from 'd3';
import React, { Component } from 'react';
// import sends from './sends';
import utils from './utils';
import './Graph.css'
import TimeSlicerObject from './TimeSlicer.js';
const { TimeSliceEnum, sliceData } = TimeSlicerObject;
const { getGradeKeys, getMacroRating } = utils;

class Graph extends Component {

  constructor(props) {
    super(props);
    this.state = { TimeSlice: TimeSliceEnum.YEAR };
  }
  componentDidMount() {
    this.createGraph(this.props.sends);
  }

  componentDidUpdate() {
    this.createGraph(this.props.sends);
  }

  createGraph(sends) {
    const dateGradeQuantityArray = sliceData(sends, this.state.TimeSlice);
    d3.select("svg").selectAll("*").remove();
    // dosomething implement screen resize
    var svg = d3.select("svg"),
      margin = { top: 20, right: 20, bottom: 30, left: 40 },
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const data = dateGradeQuantityArray;

    var keys = getGradeKeys();
    for (const d of data) {
      let total = 0;
      for (let k = 0; k < keys.length; k++) {
        const key = keys[k];
        total += d[key];
      }
      d.total = total;
    }

    // set x scale
    var x = d3.scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.05)
      .align(0.1);

    // set y scale
    var y = d3.scaleLinear()
      .rangeRound([height, 0]);

    var myColor = d3.scaleLinear().domain([1,5])
      .range(["white", "orange"]); // dosomething .domain(keys)? interpolate?


    data.sort((a, b) => b.TimeSegment - a.TimeSegment);
    x.domain(data.map((d) => d.TimeSegment));
    y.domain([0, d3.max(data, (d) => d.total)]).nice();

    g.append("g")
      .selectAll("g")
      .data(d3.stack().keys(keys)(data))
      .enter().append("g")
      .attr("fill", (d) => myColor(parseInt(getMacroRating(d.key))-3))
      .selectAll("rect")
      .data((d) => d)
      .enter().append("rect")
      .attr("x", (d) => x(d.data.TimeSegment))
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())
    /* .on("mouseover", () => tooltip.style("display", null))
    .on("mouseout", () => tooltip.style("display", "none"))
    .on("mousemove", (d) => {
      var xPosition = d3.mouse(this)[0] - 5;
      var yPosition = d3.mouse(this)[1] - 5;
      tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
      tooltip.select("text").text(d[1] - d[0]);
    }); */

    g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    g.append("g")
      .attr("class", "axis")
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
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", d => myColor(parseInt(getMacroRating(d))-3));

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
    if (event.target.name === "year") {
      this.setState({TimeSlice: TimeSliceEnum.YEAR});
    } else if (event.target.name === "month") {
      this.setState({TimeSlice: TimeSliceEnum.MONTH});
    }
  }

  render() {
    return (
      <div id="Graph">
        <style>
        </style>
        <div id="main">
          <svg width="1152" height="600"></svg>
        </div>
        <label className="radioLabel">
          Year
          <input type="radio" name="year" checked={this.state.TimeSlice === TimeSliceEnum.YEAR} onChange={(event) => this.radioClickHandler(event)}/>
        </label>
        <label className="radioLabel">
          Month
          <input type="radio" name="month" checked={this.state.TimeSlice === TimeSliceEnum.MONTH} onChange={(event) => this.radioClickHandler(event)}/>
        </label>
      </div>
    )
  };
}

export default Graph;