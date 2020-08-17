import React from 'react';
import { gradeSorter, isValidRating } from './utils';
import { useSelector } from 'react-redux';
import './Summary.css'

function Summary() {

  const sends = useSelector(state => state.sendsData.sends);
  const stars = useSelector(state => state.sendsData.stars);
  const sendCount = sends && sends.length;

  const getHardests = (sends) => {
    const hardestObject = {
      onsight: { rating: "5.0" },
      flash: { rating: "5.0" },
      redpoint: { rating: "5.0" }
    }
    for (const send of sends) {
      if (isValidRating(send)) {
        const leadStyle = send.leadStyle.toLowerCase();
        if (leadStyle === "onsight") {
          if (gradeSorter(send.rating, hardestObject.onsight.rating) === 1) {
            hardestObject.onsight = send;
          }
        } else if (leadStyle === "flash") {
          if (gradeSorter(send.rating, hardestObject.flash.rating) === 1) {
            hardestObject.flash = send;
          }
        } else if (leadStyle === "redpoint") {
          if (gradeSorter(send.rating, hardestObject.redpoint.rating) === 1) {
            hardestObject.redpoint = send;
          }
        }
      }
    }
    return hardestObject;
  }

  const { onsight, flash, redpoint } = getHardests(sends);

  return (
    <div id="Summary">
      <div id="sent-stats-summary">
        <div id="hardests">
          <div className="hard-send">
            <span className="hard-send-type" id="hardest-onsight">Hardest Onsight:</span>
            <a rel="noopener noreferrer"
              target="_blank"
              className="hard-send-type"
              href={`https://www.mountainproject.com/route/${onsight.routeId}`}>
              {onsight.name} -- {onsight.rating}
            </a>
          </div>
          <div className="hard-send">
            <span className="hard-send-type" id="hardest-flash">Hardest Flash:</span>
            <a rel="noopener noreferrer"
              target="_blank"
              className="hard-send-type"
              href={`https://www.mountainproject.com/route/${flash.routeId}`}>
              {flash.name} -- {flash.rating}
            </a>
          </div>
          <div className="hard-send">
            <span className="hard-send-type" id="hardest-redpoint">Hardest Redpoint:</span>
            <a rel="noopener noreferrer"
              target="_blank"
              className="hard-send-type"
              href={`https://www.mountainproject.com/route/${redpoint.routeId}`}>
              {redpoint.name} -- {redpoint.rating}
            </a>
          </div>
        </div>
        <div className="hard-send">
            <div className="hard-send-type">You have collected {stars} stars.</div>
            <div className="hard-send-type">You have sent {sendCount} routes.</div>
          </div>
      </div>
    </div>
  )
}

export default Summary;