import React, { useState } from 'react';
import { useForm, useSettersAsEventHandler, useConstraints } from "react-uniformed";
import './EmailEntry.css';
import Spinner from './Spinner';

function EmailEntry(props) {

  const { setEmail, setSends } = props;
  const [ loading, setLoading ] = useState(false);
  // Use HTML5 style validation
  const validators = useConstraints({
    email: { required: true, type: "email" },
  });

  const callBackendAPI = async (email) => {
    const response = await fetch('/email', {
      method: "POST",
      headers: {
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
      setEmail(email);
      setLoading(true);
      const sends = await callBackendAPI(data)
      setSends(JSON.parse(sends.message));
      setLoading(false);
    };
  }

  // useForm holds the state of the form (ie touches, values, errors)
  const { errors, hasErrors, setValue, submit, values, validateByName } = useForm({
    validators,
    defaultValues: { email: "" },
    onSubmit: onSubmit,
  });

  // compose your event handlers using useSettersAsEventHandler
  const handleChange = useSettersAsEventHandler(setValue, validateByName);

  /*
  let reportError;
  if (errors) {
    reportError = <span>The error is {errors.email}</span>
  } */


  let errorMessage, spinner, form;
  if (hasErrors) {
    // dosomething a switch on errors?
    errorMessage = <span class="error-message">Bad email</span>;
  }
  // show spinner or input
  if (loading) {
    spinner = <Spinner />
  } else {
    form = (<form onSubmit={submit}>
      {errorMessage}
      <label>Enter your Mountain Project email to get started!</label>
      <input
        className="emailEntry"
        name="email"
        value={values.email}
        onChange={handleChange}
      />
      <input type="submit" id="SubmitButton" />
    </form>);
  }
  return (
    <div id="EmailEntry">
      <div id="FormWrapper">
        {form}
        {spinner}
      </div>
    </div>
  );
}

export default EmailEntry;