import * as d3 from "d3";
import React, { Component } from "react";
import "./test-scroll.css";

class TestScroll extends Component {

  componentDidMount() {
    this.createGraph();
  }

  componentDidUpdate() {
    this.createGraph();
  }

  createGraph() {
    var DATA_COUNT = 50;
    var MAX_LABEL_LENGTH = 30;
    var data = [];

    for (var i = 0; i < DATA_COUNT; i++) {
      var datum = {};
      datum.label = stringGen(MAX_LABEL_LENGTH);
      datum.value = Math.floor(Math.random() * 600);
      data.push(datum);
    }

    function stringGen(maxLength) {
      var text = "";
      var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < getRandomArbitrary(1, maxLength); i++) {
        text += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      return text;
    }

    function getRandomArbitrary(min, max) {
      return Math.round(Math.random() * (max - min) + min);
    }

    var margin = { top: 20, right: 10, bottom: 20, left: 40 };
    var marginOverview = { top: 30, right: 10, bottom: 20, left: 40 };
    var selectorHeight = 40;
    var width = 600 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom - selectorHeight;
    var heightOverview = 80 - marginOverview.top - marginOverview.bottom;

    var maxLength = d3.max(
      data.map(function (d) {
        return d.label.length;
      })
    );
    var barWidth = maxLength * 7;
    var numBars = Math.round(width / barWidth);
    var isScrollDisplayed = barWidth * data.length > width;

    console.log(isScrollDisplayed);

    var xscale = d3
      .scaleBand()
      .domain(
        data.slice(0, numBars).map(function (d) {
          return d.label;
        })
      )
      .range([0, width]);

    var yscale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function (d) {
          return d.value;
        })
      ])
      .range([height, 0]);

    var xAxis = d3.axisBottom(xscale);
    var yAxis = d3.axisLeft(yscale);

    var svg = d3
      .select("#burn")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom + selectorHeight);

    var diagram = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    diagram
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0, " + height + ")")
      .call(xAxis);

    diagram
      .append("g")
      .attr("class", "y axis")
      .call(yAxis);

    var bars = diagram.append("g");

    bars
      .selectAll("rect")
      .data(data.slice(0, numBars), function (d) {
        return d.label;
      })
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function (d) {
        return xscale(d.label);
      })
      .attr("y", function (d) {
        return yscale(d.value);
      })
      .attr("width", xscale.bandwidth())
      .attr("height", function (d) {
        return height - yscale(d.value);
      });

    if (isScrollDisplayed) {
      var xOverview = d3
        .scaleBand()
        .domain(
          data.map(function (d) {
            return d.label;
          })
        )
        .range([0, width]);
      var yOverview = d3.scaleLinear().range([heightOverview, 0]);
      yOverview.domain(yscale.domain());

      var subBars = diagram.selectAll(".subBar").data(data);

      subBars
        .enter()
        .append("rect")
        .classed("subBar", true)
        .attr("height", function (d) {
          return heightOverview - yOverview(d.value);
        })
        .attr("width", function (d) {
          return xOverview.bandwidth();
        })
        .attr("x", function (d) {
          return xOverview(d.label);
        })
        .attr("y", function (d) {
          return height + heightOverview + yOverview(d.value);
        });

      var displayed = d3
        .scaleQuantize()
        .domain([0, width])
        .range(d3.range(data.length));

      diagram
        .append("rect")
        .attr("transform", "translate(0, " + (height + margin.bottom) + ")")
        .attr("class", "mover")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", selectorHeight)
        .attr("width", Math.round(parseFloat(numBars * width) / data.length))
        .attr("pointer-events", "all")
        .attr("cursor", "ew-resize")
        .call(d3.drag().on("drag", display));
    }
    function display() {
      var x = parseInt(d3.select(this).attr("x")),
        nx = x + d3.event.dx,
        w = parseInt(d3.select(this).attr("width")),
        f,
        nf,
        new_data,
        rects;

      if (nx < 0 || nx + w > width) return;

      d3.select(this).attr("x", nx);

      f = displayed(x);
      nf = displayed(nx);

      if (f === nf) return;

      new_data = data.slice(nf, nf + numBars);

      xscale.domain(
        new_data.map(function (d) {
          return d.label;
        })
      );
      diagram.select(".x.axis").call(xAxis);

      rects = bars.selectAll("rect").data(new_data, function (d) {
        return d.label;
      });

      rects.attr("x", function (d) {
        return xscale(d.label);
      });

      // 	  rects.attr("transform", function(d) { return "translate(" + xscale(d.label) + ",0)"; })

      rects
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
          return xscale(d.label);
        })
        .attr("y", function (d) {
          return yscale(d.value);
        })
        .attr("width", xscale.bandwidth())
        .attr("height", function (d) {
          return height - yscale(d.value);
        });

      rects.exit().remove();
    }

  }
  render() {

    return <div id="burn"></div>;
  }
}
export default TestScroll;
