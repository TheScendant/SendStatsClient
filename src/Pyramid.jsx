import * as d3 from 'd3';
import React, { Component } from 'react';
// import sends from './sends';
import './Pyramid.css'
import { sliceData } from './GradeSlicer.js';
import { TimeSliceEnum } from './TimeSlicer.js';

class Pyramid extends Component {

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
    const [gradeDateQuantityArray, years] = sliceData(sends, this.state.TimeSlice);
    // {TimeSegment: value, gradeA: quantity, gradeB: quantity }
    d3.select("svg").selectAll("*").remove();
    // dosomething implement screen resize
    const svg = d3.select("svg");
    const SVG_RECT = svg.node().getBoundingClientRect();

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = SVG_RECT.width- margin.left - margin.right;
    const height = SVG_RECT.height- margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const data = gradeDateQuantityArray;

    for (const d of data) {
      let total = 0;
      for (let k = 0; k < years.length; k++) {
        const year = years[k];
        total += d[year] ? d[year] : 0;
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

    const startYear = years.sort()[0];
    var myColor = d3.scaleLinear().domain([startYear,2019])
      .range(["white", "red"]); // dosomething .domain(keys)? interpolate?


    x.domain(data.map((d) => d.grade));
    y.domain([0, d3.max(data, (d) => d.total)]).nice();

    g.append("g")
      .selectAll("g")
      .data(d3.stack().keys(years)(data))
      .enter().append("g")
      .attr("fill", (d) => myColor(d.key))
      .selectAll("rect")
      .data((d) => d)
      .enter().append("rect")
      .attr("x", (d) => x(d.data.grade))
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())

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
      .data(years.slice().reverse())
      .enter().append("g")
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", d => myColor(d));

    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text((d) => d);

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
      <div id="Pyramid">
        <svg id="pyramid-graph"></svg>
        <label className="radioLabel">
          Year
          <input type="radio" name="year" className="radio" checked={this.state.TimeSlice === TimeSliceEnum.YEAR} onChange={(event) => this.radioClickHandler(event)}/>
        </label>
        <label className="radioLabel">
          Month
          <input type="radio" name="month" className="radio" checked={this.state.TimeSlice === TimeSliceEnum.MONTH} onChange={(event) => this.radioClickHandler(event)}/>
        </label>
      </div>
    )
  };
}
export default Pyramid;