import React from 'react';
import './EmailEntry.css';

function EmailEntry(props) {

  const { handleChange, values } = props;
  // Use HTML5 style validation
  return (
      <input
        className="emailEntry"
        name="email"
        value={values.email}
        onChange={handleChange}
      />
  );
}

export default EmailEntry;