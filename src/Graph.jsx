import * as d3 from 'd3';
import React, { Component } from 'react';
// import sends from './sends';
import './Graph.css'
import { TimeSliceEnum, sliceData } from './TimeSlicer.js';
import { gradesByTimeColoring, gradeSorter } from './utils';

class Graph extends Component {

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

  createGraph(sends) {
    const [ratings, dateGradeQuantityArray] = sliceData(sends, this.state.TimeSlice);
    // {TimeSegment: value, gradeA: quantity, gradeB: quantity }
    d3.select("svg").selectAll("*").remove();
    // dosomething implement screen resize
    const SUB_HEIGHT = 100;
    const LEGEND_WIDTH = 50;
    const svg = d3.select("svg");
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = svg.attr("width") - margin.left - margin.right - LEGEND_WIDTH; // main graph width
    const height = svg.attr("height") - margin.top - margin.bottom - SUB_HEIGHT; // main graph height
    const subMargin = { top: svg.attr("height") - margin.top - SUB_HEIGHT + margin.bottom}
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    const subg = svg.append("g")
      .attr("height", SUB_HEIGHT)
      .attr("transform", `translate(${margin.left}, ${subMargin.top})`);
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

    const HARDEST_GRADE = keys[keys.length - 1];

    let numBars = data.length;
    let barWidth = Math.round(width / numBars);

    const MIN_BAR_WIDTH = 60; // dosomething this should be calculated

    if (barWidth < MIN_BAR_WIDTH) {
      barWidth = MIN_BAR_WIDTH;
      numBars = Math.floor(width / barWidth);
    }

    console.warn(numBars, data.length);

    // set x scale
    var x = d3.scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.05)
      .align(0.1);

    // set y scale
    var y = d3.scaleLinear()
      .rangeRound([height, 0]);

    data.sort((a, b) => b.TimeSegment - a.TimeSegment);

    // console.warn(data.slice(0, numBars).map((d) => d.TimeSegment))

    x.domain(data.slice(0, numBars).map((d) => d.TimeSegment));
    y.domain([0, d3.max(data, (d) => d.total)]).nice();
    const staxG = g.append("g")
    staxG
      .selectAll("g")
        .data(d3.stack().keys(keys)(data.slice(0, numBars)))
        .enter()
          .append("g")
          .attr("fill", (d) => gradesByTimeColoring(d.key, HARDEST_GRADE))
          .selectAll("rect")
            .data((d) => d)
            .enter()
              .append("rect")
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


    // set x scale
    var subx = d3.scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.05)
      .align(0.1);

    // set y scale
    var suby = d3.scaleLinear()
      .rangeRound([SUB_HEIGHT - margin.bottom, 0]);

    subx.domain(data.map((d) => d.TimeSegment));
    suby.domain([0, d3.max(data, (d) => d.total)]).nice();

    const SLIDER_RECT_WIDTH = (subx.bandwidth() + 3) * numBars; //dosomething this is hacky
    subg.selectAll("g")
      .data(d3.stack().keys(keys)(data))
      .enter()
        .append("g")
        .attr("fill", (d) => gradesByTimeColoring(d.key, HARDEST_GRADE))
        .selectAll("rect")
          .data((d) => d)
          .enter()
            .append("rect")
            .attr("x", (d) => subx(d.data.TimeSegment))
            .attr("y", (d) => suby(d[1]))
            .attr("height", (d) => suby(d[0]) - suby(d[1]))
            .attr("width", subx.bandwidth());

    var displayed = d3
        .scaleQuantize()
        .domain([0, width])
        .range(d3.range(data.length));


    subg.append("rect")
      .attr("width", SLIDER_RECT_WIDTH)
      .attr("height", SUB_HEIGHT)
      .attr("id", "slider-rect")
      .attr("x", 0)
      .attr("fill", "rgba(255,182,193,.4)")
      .call(d3.drag().on("drag", (d,i,l) => moveTheRect(d,i,l)))

      function moveTheRect(d,i,l) {
        const theRect = d3.select(l[i]);
        const currX = parseFloat(theRect.attr("x"));

        const newX = Math.min(Math.max(d3.event.dx + currX, 0), svg.attr("width")- SLIDER_RECT_WIDTH - margin.right)
        theRect.attr("x", newX)

        const f =  displayed(currX);
        const nf = displayed(newX);

        if (f === nf) {
          return;
        }


        x.domain(data.slice(nf, nf + numBars).map(d => d.TimeSegment));

        // dosomething learn d3
        staxG.selectAll("*").remove();

        g.selectAll(".x-axis").call(d3.axisBottom(x))

        staxG.selectAll("g")
          .data(d3.stack().keys(keys)(data.slice(nf, nf+ numBars)))
          .enter()
            .append("g")
            .attr("fill", (d) => gradesByTimeColoring(d.key, HARDEST_GRADE))
            .selectAll("rect")
              .data((d) => d)
              .enter()
                .append("rect")
                .attr("x", (d) => x(d.data.TimeSegment))
                .attr("y", (d) => y(d[1]))
                .attr("height", (d) => y(d[0]) - y(d[1]))
                .attr("width", x.bandwidth())
              .exit().remove()
        staxG.exit().remove();
      }
    svg.call(this.zoom)
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
        <div id="main-graph">
          <svg width="1152" height="600" ref="graphSVG"></svg>
        </div>
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

export default Graph;