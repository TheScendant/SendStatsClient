import React from 'react';
import './SendList.css';
import { useState } from 'react';
import { gradeSorter, isValidRating } from './utils';

function SendList({ sends }) {

  const [sendsCopy, setSendsCopy] = useState(Array.from(sends).filter(s => isValidRating(s)).sort((a, b) => new Date(b.date) - new Date(a.date)));
  const [sortCrit, setSortCrit] = useState('date'); // forces rerender too! :)
  const [sortedAsc, setSortedAsc] = useState(true);
  const sortSends = (sortType) => {
    if (sortType === 'name') {

      setSendsCopy(sendsCopy.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        }
        return 0;
      }))
      setSortCrit('name');
    } else if (sortType === 'date') {
      setSendsCopy(sendsCopy.sort((a, b) => new Date(b.date) - new Date(a.date)));
      setSortCrit('date');
    } else if (sortType === 'rating') {
      setSendsCopy(sendsCopy.sort((a, b) => gradeSorter(b.rating, a.rating)));
      setSortCrit('rating');
    }
  }
  return (
    <div className="send-list-table">
      <div className="send-list-row">
        <div className="send-list-cell table-header" onClick={() => sortSends("name")}>
          <div>Name</div>
          {sortCrit === 'name' && (<div>^</div>)}
        </div>
        <div className="send-list-cell table-header" onClick={() => sortSends("date")}>
          <div>Date</div>
          {sortCrit === 'date' && (<div>^</div>)}
        </div>
        <div className="send-list-cell table-header" onClick={() => sortSends("rating")}>
          <div>Rating</div>
          {sortCrit === 'rating' && (<div>^</div>)}
        </div>
      </div>
      {sendsCopy.map((send) => (
        <div className="send-list-row" key={send.name}>
          <div className="send-list-cell">{send.name}</div>
          <div className="send-list-cell">{send.date}</div>
          <div className="send-list-cell">{send.rating}</div>
        </div>
      ))}
    </div>
  )

}
export default SendList;