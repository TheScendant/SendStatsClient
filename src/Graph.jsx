import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';
// import sends from './sends';
import './Graph.css'
import { sliceData, TimeSliceEnum } from './TimeSlicer.js';
import { cleanLegend, gradesByTimeColoring, gradeSorter } from './utils';
import { useSelector } from 'react-redux';

function Graph() {
  const svgRef = useRef(null);

  const sends = useSelector(state => state.sendsData.sends) || [];

  const [timeSlice, setTimeSlice] = useState(TimeSliceEnum.MONTH);
  const [redpoints, setRedpoints] = useState(true);
  const [flashes, setFlashes] = useState(true);
  const [onsights, setOnsights] = useState(true);

  const currSends = Array.from(sends).filter((send) => {
    const ls = send.leadStyle.toLowerCase();
    return (redpoints && (ls === 'redpoint' || ls === 'pinkpoint'))
      || (flashes && ls === 'flash')
      || (onsights && ls === 'onsight')
  });

  const calcTimeBounds = (sends) => {
    const dates = sends.map(({ date }) => new Date(date));

    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    const correctedMinDate = new Date(`1/1/${minDate.getFullYear()}`);
    const correctedMaxDate = new Date(`12/31/${maxDate.getFullYear()}`);
    return [correctedMinDate, correctedMaxDate];
  }

  const calcMonthDifferences = (start, stop) => {
    if (timeSlice === TimeSliceEnum.YEAR) {
      return (stop.getYear() - start.getYear()) + 1; // giggles
    } else {
      const yearsAsMonths = ((stop.getYear() - start.getYear()) + 1) * 12;
      const months = (stop.getMonth() - start.getMonth())
      return months + yearsAsMonths;
    }
  }

  useEffect(() => {
    if (currSends && svgRef.current) {
      const yeet = d3.zoom().on("zoom", (e) => {
          const xTransform = Math.max(Math.min(d3.event.transform.x, 0), (bitter - width) * -1);
          xAxis.attr("transform", `translate(${xTransform},${height})`)
          staxG.attr("transform", `translate(${xTransform},0)`)
      })

      const [ratings, dateGradeQuantityArray] = sliceData(currSends, timeSlice);
      const data = dateGradeQuantityArray;

      var keys = ratings.sort((a, b) => gradeSorter(a, b));
      for (const d of data) {
        let total = 0;
        for (let k = 0; k < keys.length; k++) {
          const key = keys[k];
          total += d[key];
        }
        d.total = total;
      }
      const HARDEST_GRADE = keys[keys.length - 1];

      d3.select(svgRef.current).selectAll("*").remove();

      // dosomething implement screen resize
      const LEGEND_WIDTH = 50;
      const svg = d3.select(svgRef.current).call(yeet).on("wheel.zoom", null)

      const SVG_RECT = svg.node().getBoundingClientRect();
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const width = SVG_RECT.width - margin.left - margin.right - LEGEND_WIDTH; // main graph width

      const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const height = SVG_RECT.height - margin.top - margin.bottom;

      const timeBounds = calcTimeBounds(currSends);

      const timeLength = calcMonthDifferences(timeBounds[0], timeBounds[1]);
      // timeLength = # of year or # of months

      // ye be warned
      // if theres more default size bars then the svg width then that's our width
      // otherwise we want to fill the screen so width is svg width
      // if we do fill screen then need to resize bars to something pretty
      let barWidth = (timeSlice === TimeSliceEnum.YEAR) ? 200 : 25;
      let bestWidth;
      if (timeLength * barWidth > width) {
        bestWidth = timeLength * barWidth;
      } else {
        bestWidth = width;
        barWidth = width / timeLength;
      }

      const x = d3.scaleTime().domain(timeBounds).rangeRound([0, bestWidth])

      // set y scale
      var y = d3.scaleLinear()
        .rangeRound([height, 0]);

      data.sort((a, b) => b.TimeSegment - a.TimeSegment);


      y.domain([0, d3.max(data, (d) => d.total)]).nice();
      const staxG = g.append("g")
      staxG
        .selectAll("g")
        .data(d3.stack().keys(keys)(data))
        .enter()
        .append("g")
        .attr("fill", (d) => gradesByTimeColoring(d.key, HARDEST_GRADE))
        .attr("class", "g-rect")
        .selectAll("rect")
        .data((d) => d)
        .enter()
        .append("rect")
        .attr("x", (d) => x(d.data.TimeSegment.getTime()))
        .attr("y", (d) => y(d[1]))
        .attr("height", (d) => y(d[0]) - y(d[1]))
        .attr("width", barWidth)

      const xAxis = g.append("g");
      const xAxisContent = d3.axisBottom(x);
      xAxis
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxisContent);

      const yAxis = g.append("g");
      yAxis
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

      const bitter = xAxis.node().getBBox().width;

      const legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(keys.slice().reverse().filter(k => cleanLegend(k)))
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
    }
  })

  const radioClickHandler = (event) => {
    setTimeSlice(event.target.name === "year" ? TimeSliceEnum.YEAR : TimeSliceEnum.MONTH);
  }

  return (
    <div id="Graph">
      <svg id="time-graph" ref={svgRef} />
      <div id="time-filter">
        <label className="radioLabel">
          Year
          <input type="radio" name="year" className="radio" checked={timeSlice === TimeSliceEnum.YEAR} onChange={radioClickHandler} />
        </label>
        <label className="radioLabel">
          Month
          <input type="radio" name="month" className="radio" checked={timeSlice === TimeSliceEnum.MONTH} onChange={radioClickHandler} />
        </label>
      </div>
      <div id="sends-filter">
        <label className="sendType">
          Redpoints
        </label>
        <input type="checkbox" checked={redpoints} onChange={(e) => setRedpoints(e.target.checked)} />
        <label className="sendType">
          Flashes
        </label>
        <input type="checkbox" checked={flashes} onChange={(e) => setFlashes(e.target.checked)} />
        <label className="sendType">
          Onsights
        </label>
        <input type="checkbox" checked={onsights} onChange={(e) => setOnsights(e.target.checked)} />
      </div>
    </div>
  )
}

export default Graph;