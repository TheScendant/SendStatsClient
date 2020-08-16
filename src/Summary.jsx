import React from 'react';
//import { useSelector } from 'react-redux';
import './Summary.css'

function Summary({ hardestObject, name }) {
  const { onsight, flash, redpoint } = hardestObject;
  // const email = useSelector(state => state.userData.email);
  return (
    <div id="Summary">
      {/* Email is {email} */}
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
      </div>
    </div>
  )
}

export default Summary;