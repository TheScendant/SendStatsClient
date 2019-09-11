import * as d3 from 'd3';
import React, { Component } from 'react';
// import sends from './sends';
import utils from './utils';
import Year from './Year';

const { getGradeKeys, getMacroRating } = utils;

class Graph extends Component {

  componentDidMount() {
    console.warn("SENDS IS")
    console.warn(this.props.sends)
    this.createGraph(this.props.sends);
  }

  componentDidUpdate() {
    this.createGraph(this.props.sends);
  }

  sliceData(sends) {
    const dateToGradeQuanities = new Map();

    for (const send of sends) {
      if (!send.rating.toLowerCase().includes("v")) { // ignore boulders for now
        const year = new Date(send.date).getFullYear();
        const macroRating = `5.${getMacroRating(send.rating)}`; // hack to strip abcd+-/
        let yearObject;
        if (dateToGradeQuanities.has(year)) {
          yearObject = dateToGradeQuanities.get(year);
          yearObject.increment(macroRating);
        } else {
          yearObject = new Year(year, macroRating);
        }
        dateToGradeQuanities.set(year, yearObject);
      }
    }
    const dateGradeQuantityArray = [];
    for (const yearKey of dateToGradeQuanities.keys()) {
      const yearObject = dateToGradeQuanities.get(yearKey);
      const gradeKeys = getGradeKeys();
      const year = { "Year": yearObject.getYear() };
      for (let k = 0; k < gradeKeys.length; k++) {
        const grade = gradeKeys[k];
        year[grade] = yearObject.getGradeCount(grade);
      }
      dateGradeQuantityArray.push(year);
    }
    dateGradeQuantityArray.sort((a, b) => {
      if (a.Year > b.Year) {
        return 1
      } else if (a.Year < b.Year) {
        return -1
      }
      return 0
    })
    return dateGradeQuantityArray;
  }

  createGraph(sends) {
    const dateGradeQuantityArray = this.sliceData(sends);
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


    // set the colors
     var z = d3.scaleOrdinal(d3.schemeSet3);

    data.sort((a, b) => b.Year - a.Year);
    x.domain(data.map((d) => d.Year));
    y.domain([0, d3.max(data, (d) => d.total)]).nice();
    z.domain(keys);

    g.append("g")
      .selectAll("g")
      .data(d3.stack().keys(keys)(data))
      .enter().append("g")
      .attr("fill", (d) => z(d.key))
      .selectAll("rect")
      .data((d) => d)
      .enter().append("rect")
      .attr("x", (d) => x(d.data.Year))
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
      .attr("transform", (d, i) =>`translate(0,${i* 20})`);

    legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

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

  render() {
    return (
      <div>
        <style>
        </style>
        <div id="main">
          <svg width="960" height="500"></svg>
        </div>
      </div>
    )
  };
}

export default Graph;