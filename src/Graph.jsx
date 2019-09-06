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
    const grades = ['5.7-','5.7', '5.7+', '5.8', '5.9+', '5.10b', '5.10c', '5.11a', '5.11b', '5.12a'];

    const csv = [
      {Year: 2017, State: 'AL', "Under 5 Years": 552, "5 to 13 Years": 259, "14 to 17 Years": 310},
      {Year: 2017, State: 'AK', "Under 5 Years": 856, "5 to 13 Years": 421, "14 to 17 Years": 520},
      {Year: 2017, State: 'AZ', "Under 5 Years": 828, "5 to 13 Years": 362, "14 to 17 Years": 515},
      {Year: 2017, State: 'AR', "Under 5 Years": 343, "5 to 13 Years": 157, "14 to 17 Years": 202},
      {Year: 2017, State: 'CA', "Under 5 Years": 449, "5 to 13 Years": 215, "14 to 17 Years": 270},
      {Year: 2017, State: 'CO', "Under 5 Years": 587, "5 to 13 Years": 261, "14 to 17 Years": 358},
      {Year: 2017, State: 'CT', "Under 5 Years": 403, "5 to 13 Years": 196, "14 to 17 Years": 211},
      {Year: 2017, State: 'DE', "Under 5 Years": 794, "5 to 13 Years": 474, "14 to 17 Years": 593},
      {Year: 2018, State: 'AL', "Under 5 Years": 310, "5 to 13 Years": 552, "14 to 17 Years": 259},
      {Year: 2018, State: 'AK', "Under 5 Years": 520, "5 to 13 Years": 556, "14 to 17 Years": 421},
      {Year: 2018, State: 'AZ', "Under 5 Years": 515, "5 to 13 Years": 828, "14 to 17 Years": 362},
      {Year: 2018, State: 'AR', "Under 5 Years": 202, "5 to 13 Years": 343, "14 to 17 Years": 157},
      {Year: 2018, State: 'CA', "Under 5 Years": 270, "5 to 13 Years": 449, "14 to 17 Years": 215},
      {Year: 2018, State: 'CO', "Under 5 Years": 358, "5 to 13 Years": 587, "14 to 17 Years": 261},
      {Year: 2018, State: 'CT', "Under 5 Years": 211, "5 to 13 Years": 403, "14 to 17 Years": 196},
      {Year: 2018, State: 'DE', "Under 5 Years": 593, "5 to 13 Years": 994, "14 to 17 Years": 474},
    ];

    var keys = ["Year", "State", "Under 5 Years", "5 to 13 Years", "14 to 17 Years"]

    var year = [...new Set(csv.map(d => d.Year))]
    var states = [...new Set(csv.map(d => d.State))]

    var options = d3.select("#year").selectAll("option")
      .data(year)
      .enter().append("option")
      .text(d => d)

    var svg = d3.select("#chart"),
      margin = { top: 35, left: 35, bottom: 0, right: 0 },
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom;

    var x = d3.scaleBand()
      .range([margin.left, width - margin.right])
      .padding(0.1)

    var y = d3.scaleLinear()
      .rangeRound([height - margin.bottom, margin.top])

    var xAxis = svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .attr("class", "x-axis")

    var yAxis = svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .attr("class", "y-axis")

    var z = d3.scaleOrdinal()
      .range(["steelblue", "darkorange", "lightblue"])
      .domain(keys);

    update(d3.select("#year").property("value"), 0)

    function update(input, speed) {

      var data = csv.filter(f => f.Year == input)

      data.forEach(function (d) {
        d.total = d3.sum(keys, k => +d[k])
        return d
      })

      y.domain([0, d3.max(data, d => d3.sum(keys, k => +d[k]))]).nice();

      svg.selectAll(".y-axis").transition().duration(speed)
        .call(d3.axisLeft(y).ticks(null, "s"))

      data.sort(d3.select("#sort").property("checked")
        ? (a, b) => b.total - a.total
        : (a, b) => states.indexOf(a.State) - states.indexOf(b.State))

      x.domain(data.map(d => d.State));

      svg.selectAll(".x-axis").transition().duration(speed)
        .call(d3.axisBottom(x).tickSizeOuter(0))

      var group = svg.selectAll("g.layer")
        .data(d3.stack().keys(keys)(data), d => d.key)

      group.exit().remove()

      group.enter().append("g")
        .classed("layer", true)
        .attr("fill", d => z(d.key));

      var bars = svg.selectAll("g.layer").selectAll("rect")
        .data(d => d, e => e.data.State);

      bars.exit().remove()

      bars.enter().append("rect")
        .attr("width", x.bandwidth())
        .merge(bars)
        .transition().duration(speed)
        .attr("x", d => x(d.data.State))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))

      var text = svg.selectAll(".text")
        .data(data, d => d.State);

      text.exit().remove()

      text.enter().append("text")
        .attr("class", "text")
        .attr("text-anchor", "middle")
        .merge(text)
        .transition().duration(speed)
        .attr("x", d => x(d.State) + x.bandwidth() / 2)
        .attr("y", d => y(d.total) - 5)
        .text(d => d.total)
    }

    var select = d3.select("#year")
      .on("change", function () {
        update(this.value, 750)
      })

    var checkbox = d3.select("#sort")
      .on("click", function () {
        update(select.property("value"), 750)
      })
  }

  render() {
    return (
      <div>
        <svg id="chart" width="650" height="400"></svg>

        Select year:
        <select id="year"></select>
        <input type="checkbox" id="sort" />
        Toggle sort
      </div>
    )
  };
}
export default Graph;