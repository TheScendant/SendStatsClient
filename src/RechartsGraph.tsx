import * as d3 from 'd3';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { sliceData } from './GradeSlicer';
import { TimeSliceEnum } from './TimeSlicer';
import { redScaleArray } from './utils';
export const RechartsGraph = () => {
  const timeSlice = TimeSliceEnum.YEAR;

  const sends = useSelector((state: any) => state.sendsData.sends) || [];

  const [agg, setAgg] = useState(true);
  const [canShowModal, setCanShowModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});
  //@ts-ignore
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

  return (
    <BarChart width={1000} height={500} data={data} >
      <CartesianGrid />
      <XAxis dataKey="grade" />
      <YAxis label={{ value: "Number of sends", angle: -90, position: 'insideLeft' }} />
      {years.map((year: any, i: any) => (
        // @ts-ignore
        <Bar dataKey={year} stackId="a" fill={redScaleArray[i + 3]} />
      ))}
    </BarChart>
  )
}