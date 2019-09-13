import React from 'react';
import './Spinner.css'
function Spinner(props) {
  return (
    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
  );
};
export default Spinner;