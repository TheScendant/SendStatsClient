import * as d3 from 'd3';
import React, { Component } from 'react';
import sends from './sends';
import utils from './utils';

import testData from './fakeClimbData'
// import testData from './testdata'
const { addOrIncrement, gradeSorter } = utils;

class Graph extends Component {

  componentDidMount() {
    this.createGraph();
  }

  componentDidUpdate() {
    this.createGraph();
  }

  sliceData() {
    const dateToGradeQuanities = new Map();

    for (const send of sends) {
      if (!send.rating.toLowerCase().includes("v")) { // ignore boulders for now
        if (dateToGradeQuanities.has(send.date)) {
          // assume that if the date is there, a grade map is too
          const gradeMap = dateToGradeQuanities.get(send.date);
          addOrIncrement(gradeMap, send.rating);
          dateToGradeQuanities.set(send.date, gradeMap);
        } else {
          const gradeMap = new Map();
          gradeMap.set(send.rating, 1)
          dateToGradeQuanities.set(send.date, gradeMap);
        }
      }
    }

    const dateGradeQuantityArray = [];
    for (const dateKey of dateToGradeQuanities.keys()) {
      const gradeMap = dateToGradeQuanities.get(dateKey);
      for (const gradeKey of gradeMap.keys()) {
        dateGradeQuantityArray.push({ date: dateKey, rating: gradeKey, quantity: gradeMap.get(gradeKey) })
      }
    }
    dateGradeQuantityArray.sort((a, b) => {
      if (a.date > b.date) {
        return 1
      } else if (a.date < b.date) {
        return -1
      }
      return 0
    })
    return dateGradeQuantityArray;
  }

  createGraph() {
    const dateGradeQuantityArray = this.sliceData();
    // console.warn(dateGradeQuantityArray);
    var svg = d3.select("svg"),
      margin = { top: 20, right: 20, bottom: 30, left: 40 },
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // set x scale
    var x = d3.scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.05)
      .align(0.1);

    // set y scale
    var y = d3.scaleLinear()
      .rangeRound([height, 0]);

    // set the colors
    var z = d3.scaleOrdinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);



    // load the csv and create the chart
    const data = testData;

    // var keys = ["Under 5 Years", "5 to 13 Years", "14 to 17 Years", "18 to 24 Years", "25 to 44 Years", "45 to 64 Years", "65 Years and Over"]; //data.columns.slice(1);
    var keys = ["5.8", "5.9", "5.10", "5.11", "5.12"]; //data.columns.slice(1);
    for (const d of data) {
      d.total = d["5.8"] + d["5.9"] + d["5.10"] + d["5.11"] + d["5.12"];
    }

    console.warn(data);

    data.sort(function (a, b) { return b.total - a.total; }); // dosomethingi think i want this by date?
    x.domain(data.map((d) => d.Date));
    y.domain([0, d3.max(data, function (d) { return d.total; })]).nice();
    z.domain(keys);

    g.append("g")
      .selectAll("g")
      .data(d3.stack().keys(keys)(data))
      .enter().append("g")
      .attr("fill", function (d) { return z(d.key); })
      .selectAll("rect")
      .data(function (d) { return d; })
      .enter().append("rect")
      .attr("x", function (d) { return x(d.data.Date); })
      .attr("y", function (d) { return y(d[1]); })
      .attr("height", function (d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth())
      .on("mouseover", function () { tooltip.style("display", null); })
      .on("mouseout", function () { tooltip.style("display", "none"); })
      .on("mousemove", function (d) {
        console.log(d);
        var xPosition = d3.mouse(this)[0] - 5;
        var yPosition = d3.mouse(this)[1] - 5;
        tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        tooltip.select("text").text(d[1] - d[0]);
      });

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
      .attr("text-anchor", "start");

    var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter().append("g")
      .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function (d) { return d; });


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