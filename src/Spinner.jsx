import React from 'react';
import './Spinner.css'
function Spinner(props) {
  return (
    <div  style={{height: '200px'}} >
      <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
    </div>
  );
};
export default Spinner;