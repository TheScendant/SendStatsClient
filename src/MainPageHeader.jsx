import React from 'react';
function MainPageHeader({ hardestObject, name }) {
  const { onsight, flash, redpoint } = hardestObject;
  return (
    <div id="main-page-header">
      <div id="sent-stats-summary">
        <span id="name">Send Stats for {name}</span>
        <div id="hardests">
          <div className="hard-send">
            <span className="hard-send-type" id="hardest-onsight">Hardest Onsight:</span>
            <a className="hard-send-type" href={`https://www.mountainproject.com/route/${onsight.routeId}`}>
              {onsight.name} -- {onsight.rating}
            </a>
          </div>
          <div className="hard-send">
            <span className="hard-send-type" id="hardest-flash">Hardest Flash:</span>
            <a className="hard-send-type" href={`https://www.mountainproject.com/route/${flash.routeId}`}>
              {flash.name} -- {flash.rating}
            </a>
          </div>
          <div className="hard-send">
            <span className="hard-send-type" id="hardest-redpoint">Hardest Redpoint:</span>
            <a className="hard-send-type" href={`https://www.mountainproject.com/route/${redpoint.routeId}`}>
              {redpoint.name} -- {redpoint.rating}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainPageHeader;