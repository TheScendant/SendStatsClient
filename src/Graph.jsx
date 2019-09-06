import * as d3 from 'd3';
import React, { Component } from 'react';

class Graph extends Component {

  componentDidMount() {
    this.createGraph();
  }

  componentDidUpdate() {
    this.createGraph();
  }

  createGraph() {
    const data = ["I", "II", "III"];

    const nameScale = d3.scaleOrdinal()
      .domain(data)
      .range(["Jan", "Feb", "Mar"]);

    const widthScale = d3.scaleOrdinal()
      .domain(data)
      .range([300, 100, 900]);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    d3.select("#cookies")
      .selectAll("div")
      .data(data)
      .enter()
      .append("div")
      .text(nameScale)
      .style("width", d => widthScale(d) + "px")
      .style("background-color", color);

  }

  render() {
    return (
      <div id="cookies">
      </div>
    )
  };
}
export default Graph;