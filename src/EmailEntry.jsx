import React, {Fragment} from 'react';
import './EmailEntry.css';

function EmailEntry(props) {

  const { handleChange, values } = props;
  // Use HTML5 style validation
  return (
    <Fragment>
      <label>Enter your Mountain Project Email!</label>
      <input
        className="emailEntry"
        name="email"
        value={values.email}
        onChange={handleChange}
        placeholder="eg: hayden518@gmail.com"
      />
    </Fragment>
  );
}

export default EmailEntry;