import React, { Fragment } from 'react';
import './UserIdEntry.css';

function UserIdEntry(props) {
  const { handleChange, values } = props;
  return (
    <Fragment>
      <label>Enter your Mountain Project UserID!</label>
      <input
        className="userIdEntry"
        name="userId"
        value={values.userId}
        onChange={handleChange}
      />
    </Fragment>
  )
}
export default UserIdEntry;