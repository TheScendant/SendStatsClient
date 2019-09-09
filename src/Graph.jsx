import * as d3 from 'd3';
import React, { Component } from 'react';
import sends from './sends';
import utils from './utils';

const { addOrIncrement, gradeSorter } = utils;

class Graph extends Component {

  componentDidMount() {
    this.createGraph();
  }

  componentDidUpdate() {
    this.createGraph();
  }

  noLabelBarGraph(dateGradeQuantityArray) {
        
    var margin = { top: 20, right: 20, bottom: 70, left: 40 },
      width = 600 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

    // Parse the date / time
    var parseDate = d3.timeParse("%Y-%m");

    var x = d3.scaleLinear().range([0, width]).domain([new Date("2016-4-5"), new Date("2019-10-10")]);
    var y = d3.scaleLinear().range([height, 0]).domain([0, 10]);

    var xAxis = d3.axisBottom(x).tickValues(dateGradeQuantityArray.map(d => parseDate(d.date)))

    var yAxis = d3.axisLeft(x).tickValues(dateGradeQuantityArray.map(d => d.quantity))

    var svg = d3.select("#cookies").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

    const data = dateGradeQuantityArray;
    data.forEach(function (d) {
      d.date = new Date(d.date);
    });


    svg.selectAll("bar")
      .data(data)
      .enter().append("rect")
      .style("fill", "red")
      .attr("x", function (d) { return x(d.date); })
      .attr("width", 10)
      .attr("y", function (d) { return y(d.quantity); })
      .attr("height", function (d) { return height - y(d.quantity); });

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)");

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Value ($)");

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
    dateGradeQuantityArray.sort((a,b) => {
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
    this.noLabelBarGraph(dateGradeQuantityArray);
    // const grades = ['5.7-','5.7', '5.7+', '5.8', '5.9+', '5.10b', '5.10c', '5.11a', '5.11b', '5.12a'];
/* 
    const csv = [
      { Year: 2017, State: 'AL', "Under 5 Years": 552, "5 to 13 Years": 259, "14 to 17 Years": 310 },
      { Year: 2017, State: 'AK', "Under 5 Years": 856, "5 to 13 Years": 421, "14 to 17 Years": 520 },
      { Year: 2017, State: 'AZ', "Under 5 Years": 828, "5 to 13 Years": 362, "14 to 17 Years": 515 },
      { Year: 2017, State: 'AR', "Under 5 Years": 343, "5 to 13 Years": 157, "14 to 17 Years": 202 },
      { Year: 2017, State: 'CA', "Under 5 Years": 449, "5 to 13 Years": 215, "14 to 17 Years": 270 },
      { Year: 2017, State: 'CO', "Under 5 Years": 587, "5 to 13 Years": 261, "14 to 17 Years": 358 },
      { Year: 2017, State: 'CT', "Under 5 Years": 403, "5 to 13 Years": 196, "14 to 17 Years": 211 },
      { Year: 2017, State: 'DE', "Under 5 Years": 794, "5 to 13 Years": 474, "14 to 17 Years": 593 },
      { Year: 2018, State: 'AL', "Under 5 Years": 310, "5 to 13 Years": 552, "14 to 17 Years": 259 },
      { Year: 2018, State: 'AK', "Under 5 Years": 520, "5 to 13 Years": 556, "14 to 17 Years": 421 },
      { Year: 2018, State: 'AZ', "Under 5 Years": 515, "5 to 13 Years": 828, "14 to 17 Years": 362 },
      { Year: 2018, State: 'AR', "Under 5 Years": 202, "5 to 13 Years": 343, "14 to 17 Years": 157 },
      { Year: 2018, State: 'CA', "Under 5 Years": 270, "5 to 13 Years": 449, "14 to 17 Years": 215 },
      { Year: 2018, State: 'CO', "Under 5 Years": 358, "5 to 13 Years": 587, "14 to 17 Years": 261 },
      { Year: 2018, State: 'CT', "Under 5 Years": 211, "5 to 13 Years": 403, "14 to 17 Years": 196 },
      { Year: 2018, State: 'DE', "Under 5 Years": 593, "5 to 13 Years": 994, "14 to 17 Years": 474 },
    ];

   

    const ratings = [...new Set(sends.map(s => s.rating))].sort(); // need a custom grade sorter?
    const dates = [...new Set(sends.map(s => s.date))]; // same as states

    console.warn(ratings.join(","));
    
    var keys = ["Year", "State", "Under 5 Years", "5 to 13 Years", "14 to 17 Years"]
    var year = [...new Set(csv.map(d => d.Year))]
    var states = [...new Set(csv.map(d => d.State))]


    // populate drop down
    var options = d3.select("#year").selectAll("option")
      .data(year)
      .enter().append("option")
      .text(d => d)

    var svg = d3.select("#chart"),
      margin = { top: 35, left: 35, bottom: 0, right: 0 },
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom;

    const sendSVG = d3.select("#sendChart");

    var x = d3.scaleBand()
      .range([margin.left, width - margin.right])
      .padding(0.1)

    const sendX = d3.scaleTime()
      .domain([new Date(2019, 6, 5), new Date(2019, 9, 9)])
      .range(0,700)


    var y = d3.scaleLinear()
      .rangeRound([height - margin.bottom, margin.top])

    const sendY = d3.scaleLinear()
      .rangeRound([height - margin.bottom, margin.top])

    var xAxis = svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .attr("class", "x-axis")

    const sendXAxis = sendSVG.append('g')
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .attr("class", "send-x-axis")

    var yAxis = svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .attr("class", "y-axis")

    var sendYAxis = sendSVG.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .attr("class", "send-y-axis")

    var z = d3.scaleOrdinal()
      .range(["steelblue", "darkorange", "lightblue"])
      .domain(keys);

   const sendZ = d3.scaleOrdinal()
     .range(["red", "orange", "yellow", "green", "lightblue", "blue", "purple", "orange"])
     .domain(ratings);


    update(d3.select("#year").property("value"), 0)

    function update(input, speed) {

      var data = csv.filter(f => f.Year == input);
      const sendData = dateGradeQuantityArray;

      data.forEach(function (d) {
        d.total = d3.sum(keys, k => +d[k])
        return d
      })

      sendData.forEach((d) => {
        d.date = new Date(d.date);
      })


      y.domain([0, d3.max(data, d => d3.sum(keys, k => +d[k]))]).nice();

      // dosomething
      sendY.domain([0, 100]);

      svg.selectAll(".y-axis").transition().duration(speed)
        .call(d3.axisLeft(y).ticks(null, "s"))

      sendSVG.selectAll(".send-y-axis").transition().duration(speed)
        .call(d3.axisLeft(sendY).ticks(null, "s"))


      data.sort(d3.select("#sort").property("checked")
        ? (a, b) => b.total - a.total
        : (a, b) => states.indexOf(a.State) - states.indexOf(b.State))

      x.domain(data.map(d => d.State));


      svg.selectAll(".x-axis").transition().duration(speed)
        .call(d3.axisBottom(x).tickSizeOuter(0))

      sendSVG.selectAll(".send-x-axis").transition().duration(speed)
        .call(d3.axisBottom(sendX).tickFormat("%y-%b-%d").tickValues(sendData.map(d => d.date)))

      var group = svg.selectAll("g.layer")
        .data(d3.stack().keys(keys)(data), d => d.key)

      const sendGroup = sendSVG.selectAll("g.sendlayer")
        .data(d3.stack().keys()(sendData), d=>d.key)

      group.exit().remove()
      sendGroup.exit().remove();

      group.enter().append("g")
        .classed("layer", true)
        .attr("fill", d => z(d.key));
      
      sendGroup.enter().append("g")
        .classed("sendlayer", true)
        //.attr("fill", d=> sendZ(d.rating));

      var bars = svg.selectAll("g.layer").selectAll("rect")
        .data(d => d, e => e.data.State);
      
      const sendBars = sendSVG.selectAll("g.sendlayer").selectAll("rect")
        .data(d=> d, e => e.data.date)

      bars.exit().remove()
      sendBars.exit().remove()

      bars.enter().append("rect")
        .attr("width", x.bandwidth())
        .merge(bars)
        .transition().duration(speed)
        .attr("x", d => x(d.data.State))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))


      sendBars.enter().append("rect")
        .attr("width", x.bandwidth())
        .merge(sendBars)
        .transition().duration(speed)
        .attr("x", d => {
          console.warn(d.data.date);
          return sendX(d.data.date)})
        .attr("y", 50)
        .attr("height", d => {
          console.warn(d);
          return 50})

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
      
 */
  }

  render() {
    return (
      <div>
         {/* <div id="theirs">
          <svg id="chart" width="650" height="400"></svg>
          Select year:
          <select id="year"></select>
          <input type="checkbox" id="sort" />
          Toggle sort
        </div> 
        <div id="mine">
          <svg id="sendChart" width="650" height="400"></svg>
          Select year:
          <select id="sendYear"></select>
          <input type="checkbox" id="sendSort" />
          Toggle sort
        </div> */}
        {<div id="cookies"></div>}
      </div>
    )
  };
}

export default Graph;