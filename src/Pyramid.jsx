import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';
// import sends from './sends';
import './Pyramid.css'
import { sliceData } from './GradeSlicer.js';
import { TimeSliceEnum } from './TimeSlicer.js';
import { getAllGrades } from './utils';
import { useSelector } from 'react-redux';
import SendList from './SendList';

function Pyramid({ year }) {
  const svgRef = useRef(null);
  // const [timeSlice, setTimeSlice] = useState(TimeSliceEnum.YEAR); dosomething month?
  const timeSlice = TimeSliceEnum.YEAR;

  const sends = useSelector(state => state.sendsData.sends) || [];

  const [agg, setAgg] = useState(true);
  const [canShowModal, setCanShowModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});

  useEffect(() => {
    if (sends && svgRef.current) {
      const yeet = d3.zoom().on("zoom", (e) => {
        const xTransform = Math.max(Math.min(d3.event.transform.x, 0), (bitter - width) * -1);

        xAxis.attr("transform", `translate(${xTransform},${height})`)
        dataG.attr("transform", `translate(${xTransform},0)`)
      });

      const [gradeDateQuantityArray, years] = sliceData(sends, timeSlice, agg);
      const data = gradeDateQuantityArray;

      for (const d of data) {
        let total = 0;
        for (let k = 0; k < years.length; k++) {
          const year = years[k];
          total += d[year] ? d[year] : 0;
        }
        d.total = total;
      }

      d3.select("#pyramid-graph").selectAll("*").remove();
      // dosomething implement screen resize
      const LEGEND_WIDTH = 50;
      const svg = d3.select(svgRef.current);
      svg.call(yeet).on("wheel.zoom", null);

      const SVG_RECT = svg.node().getBoundingClientRect();
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const width = SVG_RECT.width - margin.left - margin.right - LEGEND_WIDTH;
      setCanShowModal(width > 1000);
      const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

      const height = SVG_RECT.height - margin.top - margin.bottom;

      const allGrades = getAllGrades(agg);

      const twentySevenGrades = allGrades.length * 27

      const bestWidth = twentySevenGrades > width ? twentySevenGrades : width;

      // set x scale
      var x = d3.scaleBand()
        .rangeRound([0, bestWidth])
        .paddingInner(0.05)
        .align(0.1);

      // set y scale
      var y = d3.scaleLinear()
        .rangeRound([height, 0]);

      const startYear = years.sort()[0];
      var myColor = d3.scaleLinear().domain([startYear, year])
        .range(["white", "red"]); // dosomething .domain(keys)? interpolate?


      // x.domain(data.map((d) => d.grade));
      x.domain(allGrades);
      y.domain([0, d3.max(data, (d) => d.total)]).nice();

      const dataG = g.append("g");
      dataG
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
        .attr("id", "dataG")
        .attr('class', 'clickMe')
        .on('click', e => {
          if (canShowModal) { // don't rerender if we're not gonna show the modal
            setShowModal(true);
            setModalData(e.data);
          }
        });

      const xAxis = g.append("g");
      xAxis
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .attr("id", "xAxis")
        .call(d3.axisBottom(x));

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
        .attr("id", "yAxis")
        .attr("text-anchor", "start");

      const bitter = xAxis.node().getBBox().width;

      const legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(years.slice().reverse())
        .enter().append("g")
        .attr("transform", (d, i) => `translate(${LEGEND_WIDTH}, ${i * 20})`);

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
  }, [sends, timeSlice, agg, year, canShowModal])


  const aggChangeHandler = (event) => {
    setAgg(event.target.name === 'agg');
  }

  const modal = (showModal && canShowModal && modalData) ? 'showModal' : 'hideModal';

  return (
    <div id="Pyramid">
      <svg id="pyramid-graph" ref={svgRef} />
      <div id="modal" className={modal}>
        <div className="modalHeader">
          <div className="modalHeaderTitle">List of {modalData.grade} Sends</div>
          <div className="closeModal" onClick={() => setShowModal(false)}>X</div>
        </div>
        <SendList sendList={modalData.sendList} />
      </div>
      <div id="time-filter">
        <label className="radioLabel">
          Aggregate
          <input type="radio" name="agg" className="radio" checked={agg} onChange={aggChangeHandler} />
        </label>
        <label className="radioLabel">
          Show Mid Grades
          <input type="radio" name="notagg" className="radio" checked={!agg} onChange={aggChangeHandler} />
        </label>
      </div>
    </div >
  )
}
export default Pyramid;