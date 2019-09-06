import React from 'react';
import { useForm, useSettersAsEventHandler, useConstraints } from "react-uniformed";
import './EmailEntry.css';

function EmailEntry(props) {

  const { setEmail } = props;
  // Use HTML5 style validation
  const validators = useConstraints({
    email: { required: true, type: "email" },
  });

  const callBackendAPI = async (email) => {
    const response = await fetch('/email', {
      method: "POST",
      headers : {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(email)
    });
    const body = await response.json();
    if (response.status !== 200) {
      throw Error("ERROR");
    }
    return body;
  };

  /**
   * onSubmit is only called when there aren't errors
   * @param {Object} data 
   */
  const onSubmit = async (data) => {
    if (data) {
      const { email } = data;
      console.log(await callBackendAPI(data));
      setEmail(email);
    };
  }

  // useForm holds the state of the form (ie touches, values, errors)
  const { /* errors, hasErrors, */ setValue, submit, values, validateByName } = useForm({
    validators,
    defaultValues: { email: "" },
    onSubmit: onSubmit,
  });

  // compose your event handlers using useSettersAsEventHandler
  const handleChange = useSettersAsEventHandler(setValue, validateByName);

  /* let errorState;
  if (hasErrors) {
    errorState = "There's errors";
  }
  let reportError;
  if (errors) {
    reportError = <span>The error is {errors.email}</span>
  } */
  return (
    <div>
      {/* {errorState} */}
      {/* {reportError} */}
      <form onSubmit={submit}>
        <label>Enter your Mountain Project email to get started!</label>
        <input
          className="emailEntry"
          name="email"
          value={values.email}
          onChange={handleChange}
        />
        <input type="submit" />
      </form>
    </div>
  );
}

export default EmailEntry;