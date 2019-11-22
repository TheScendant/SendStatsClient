import * as d3 from "d3";
import React, { Component } from "react";
import "./test-scroll.css";
import { TimeSliceEnum, sliceData } from './TimeSlicer.js';
import { gradeSorter } from './utils';

class TestScroll extends Component {


  constructor(props) {
    super(props);
    this.state = {
      TimeSlice: TimeSliceEnum.MONTH,
      zoomTransform: null,
    };
 /*    this.zoom = d3.zoom()
      .scaleExtent([-5, 5])
      .on("zoom", this.zoomed.bind(this)) */
  }

  componentDidMount() {
    this.createGraph(this.props.sends);
  }

  componentDidUpdate() {
    this.createGraph(this.props.sends);
  }

  createGraph(sends) {
    const [ratings, dateGradeQuantityArray] = sliceData(sends, this.state.TimeSlice);
    const data = dateGradeQuantityArray;

    var keys = ratings.sort((a,b) => gradeSorter(a,b));
    for (const d of data) {
      let total = 0;
      for (let k = 0; k < keys.length; k++) {
        const key = keys[k];
        total += d[key];
      }
      d.total = total;
    }


    var margin = { top: 20, right: 10, bottom: 20, left: 40 };
    var marginOverview = { top: 30, right: 10, bottom: 20, left: 40 };
    var selectorHeight = 40;
    var width = 600 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom - selectorHeight;
    var heightOverview = 80 - marginOverview.top - marginOverview.bottom;


    let numBars = data.length;
    let barWidth = Math.round(width / numBars);

    const MIN_BAR_WIDTH = 150;

    if (barWidth < MIN_BAR_WIDTH) {
      barWidth = MIN_BAR_WIDTH;
      numBars = Math.floor(width / barWidth);
    }

    var isScrollDisplayed = barWidth * data.length > width;

    console.log(isScrollDisplayed);

    var xscale = d3
      .scaleBand()
      .domain(
        data.slice(0, numBars).map(function (d) {
          return d.TimeSegment;
        })
      )
      .range([0, width]);

    var yscale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function (d) {
          return d.total;
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
        return d.TimeSegment;
      })
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function (d) {
        return xscale(d.TimeSegment);
      })
      .attr("y", function (d) {
        return yscale(d.total);
      })
      .attr("width", xscale.bandwidth())
      .attr("height", function (d) {
        return height - yscale(d.total);
      });

    if (isScrollDisplayed) {
      var xOverview = d3
        .scaleBand()
        .domain(
          data.map(function (d) {
            return d.TimeSegment;
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
          return heightOverview - yOverview(d.total);
        })
        .attr("width", function (d) {
          return xOverview.bandwidth();
        })
        .attr("x", function (d) {
          return xOverview(d.TimeSegment);
        })
        .attr("y", function (d) {
          return height + heightOverview + yOverview(d.total);
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
          return d.TimeSegment;
        })
      );
      diagram.select(".x.axis").call(xAxis);

      rects = bars.selectAll("rect").data(new_data, function (d) {
        return d.TimeSegment;
      });

      rects.attr("x", function (d) {
        return xscale(d.TimeSegment);
      });

      // 	  rects.attr("transform", function(d) { return "translate(" + xscale(d.label) + ",0)"; })

      rects
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
          return xscale(d.TimeSegment);
        })
        .attr("y", function (d) {
          return yscale(d.total);
        })
        .attr("width", xscale.bandwidth())
        .attr("height", function (d) {
          return height - yscale(d.total);
        });

      rects.exit().remove();
    }

  }
  render() {

    return <div id="burn"></div>;
  }
}
export default TestScroll;
