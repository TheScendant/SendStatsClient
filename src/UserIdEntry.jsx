import React from 'react';
import './UserIdEntry.css';

function UserIdEntry(props) {
  const { handleChange, values } = props;
  return (
    <input
        className="userIdEntry"
        name="userId"
        value={values.userId}
        onChange={handleChange}
      />
  )
}
export default UserIdEntry;