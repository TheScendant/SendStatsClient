import React from 'react';
import './SendList.css';
import { useState } from 'react';
import { gradeSorter, isValidRating, simpleStringSort } from './utils';
import {ArrowDownward as ArrowDownwardIcon, ArrowUpward as ArrowUpwardIcon} from '@material-ui/icons/';
import { useSelector } from 'react-redux';

function SendList() {

  const sends = useSelector(state => state.sendsData.sends) || [];

  const [sendsCopy, setSendsCopy] = useState(Array.from(sends).filter(s => isValidRating(s)).sort((a, b) => new Date(b.date) - new Date(a.date)));
  const [sortCrit, setSortCrit] = useState('date'); // forces rerender too! :)
  const [sortedDesc, setSortedDesc] = useState(true);

  // dosomething I'm sure this can be cleaner
  const sortSends = (sortType) => {
    if (sortType === 'name') {
      if (sortCrit === 'name') {
        if (sortedDesc) {
          setSendsCopy(sendsCopy.sort((a, b) => simpleStringSort(a.name, b.name, 'up')));
        } else {
          setSendsCopy(sendsCopy.sort((a, b) => simpleStringSort(a.name, b.name, 'down')));
        }
        setSortedDesc(!sortedDesc);
      } else {
        setSendsCopy(sendsCopy.sort((a, b) => simpleStringSort(a.name, b.name, 'down')));
        setSortedDesc(true);
      }
      setSortCrit('name');
    } else if (sortType === 'date') {
      if (sortCrit === 'date') {
        // we're already sorting by date so flip
        if (sortedDesc) {
          setSendsCopy(sendsCopy.sort((a, b) => new Date(a.date) - new Date(b.date)))
        } else {
          setSendsCopy(sendsCopy.sort((a, b) => new Date(b.date) - new Date(a.date)));
        }
        setSortedDesc(!sortedDesc)
      } else {
        setSendsCopy(sendsCopy.sort((a, b) => new Date(b.date) - new Date(a.date)));
        setSortedDesc(true);
      }
      setSortCrit('date');
    } else if (sortType === 'rating') {
      if (sortCrit === 'rating') {
        // we're already sorting by rating so flip
        if (sortedDesc) {
          setSendsCopy(sendsCopy.sort((a, b) => gradeSorter(a.rating, b.rating)));
        } else {
          setSendsCopy(sendsCopy.sort((a, b) => gradeSorter(b.rating, a.rating)));
        }
        setSortedDesc(!sortedDesc)
      } else {
        setSendsCopy(sendsCopy.sort((a, b) => gradeSorter(b.rating, a.rating)));
        setSortedDesc(true);
      }
      setSortCrit('rating');
    }
  }

  const sortArrow = sortedDesc ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />;

  return (
    <div className="send-list-table">
      <div className="send-list-row">
        <div className="send-list-cell table-header" onClick={() => sortSends("name")}>
          <div>Name</div>
          {sortCrit === 'name' && <div>{sortArrow}</div>}
        </div>
        <div className="send-list-cell table-header" onClick={() => sortSends("date")}>
          <div>Date</div>
          {sortCrit === 'date' && <div>{sortArrow}</div>}
        </div>
        <div className="send-list-cell table-header" onClick={() => sortSends("rating")}>
          <div>Rating</div>
          {sortCrit === 'rating' && <div>{sortArrow}</div>}
        </div>
      </div>
      {sendsCopy.map((send) => (
        <div className="send-list-row" key={send.routeId}>
          <div className="send-list-cell">{send.name}</div>
          <div className="send-list-cell">{send.date}</div>
          <div className="send-list-cell">{send.rating}</div>
        </div>
      ))}
    </div>
  )

}
export default SendList;