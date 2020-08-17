import React from 'react';
import './Spinner.css'
function Spinner(props) {
  return (
    <div className="likeItsHot" style={{height: '200px'}} >
      <div>Retrieving Mountain Project data...</div>
      <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
    </div>
  );
};
export default Spinner;