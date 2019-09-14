import React, { useState } from 'react';
import { useForm, useSettersAsEventHandler, useConstraints } from "react-uniformed";import Spinner from './Spinner';
import EmailEntry from './EmailEntry';
import UserIdEntry from './UserIdEntry';
import './EntryForm.css'
// dosomething make a generic Entry page and add a user id entry component.
// one spinner to rule them all
function EntryForm(props) {

  const { setEmail, setSends } = props;
  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  // Use HTML5 style validation
  const validators = useConstraints({
    email: { required: true, type: "email" },
    userId: { required: false },
  });

  const postUserId = async(userId) => {
    try {
      const response = await fetch('/userId', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userId)
      });
      const body = await response.json();
      if (response.status !== 200) {
        throw Error("ERROR");
      }
      return body;
    } catch (e) {
      console.error(e);
      return;
    }
  }

  const postEmail = async (email) => {
    try {
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
    } catch (e) {
      console.error(e);
      return;
    }
  };

  /**
   * onSubmit is only called when there aren't errors
   * @param {Object} data
   */
  const onSubmit = async (data) => {
    setNetworkError(false); // dosomething remove this from screen on change?
    if (data) {
      const { email, userId } = data;
      let sends;
      setLoading(true);
      if (email) {
        setEmail(email);
        sends = await postEmail(data);
      } else if (userId) {
        // setUserId(userId)
        // sends = await postUserId(data) // dosomething postUserId if UserId?
      }
      console.warn(sends);
      (sends) ? setSends(JSON.parse(sends.message)) : setNetworkError(true);
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

  let errorMessage, spinner, form, networkErrorMessage, submitButton;
  if (networkError) {
    networkErrorMessage = <span className="error">Error retreiving send data</span>
  }
  if (hasErrors) {
    // disable submit button maybe?
    submitButton = <input type="submit" id="SubmitButton" className="desabled" disabled />
  } else {
    submitButton = <input type="submit" id="SubmitButton" className="enabled" />
  }
  // show spinner or input
  if (loading) {
    spinner = <Spinner />
  } else {
    form = (<form onSubmit={submit}>
      {errorMessage}
      <label>Enter your Mountain Project email to get started!</label>
      <EmailEntry handleChange={handleChange} values={values}/>
      <UserIdEntry />
      {submitButton}
    </form>);
  }
  return (
    <div id="EntryForm">
      <div id="FormWrapper">
        {networkErrorMessage}
        {form}
        {spinner}
      </div>
    </div>
  );
}

export default EntryForm;