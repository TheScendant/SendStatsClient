import React, { useState } from 'react';
import { useForm, useSettersAsEventHandler, useConstraints } from "react-uniformed"; import Spinner from './Spinner';
import EmailEntry from './EmailEntry';
import UserIdEntry from './UserIdEntry';
import './EntryForm.css'
import { postJSON } from './utils';

function EntryForm(props) {

  const { setEmail, setSends, setUserId } = props;
  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  // Use HTML5 style validation
  const validators = useConstraints({
    email: { required: false, type: "email" },
    userId: { required: false },
  });

  /**
   * onSubmit is only called when there aren't errors
   * @param {Object} data
   */
  const onSubmit = async (data) => {
    setNetworkError(false); // dosomething remove this from screen on change?
    if (data) {
      const { email, userId } = data;
      let sends, url;
      setLoading(true);
      email ? setEmail(email) : setUserId(userId);
      if (email) {
        setEmail(email);
        url = '/email';
      } else if (userId) {
        setUserId(userId);
        url = '/userId';
      }
      sends = await postJSON(data, url);
      (sends) ? setSends(JSON.parse(sends.message)) : setNetworkError(true);
      setLoading(false);
    };
  }

  // useForm holds the state of the form (ie touches, values, errors)
  const { errors, hasErrors, setValue, submit, values, validateByName } = useForm({
    validators,
    defaultValues: { email: "", userId: "" },
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
      <label>Enter one of the following to get started!</label>
      <label>Mountain Project Email:</label>
      <EmailEntry handleChange={handleChange} values={values} />
      <label>Mountain Project User ID:</label>
      <UserIdEntry handleChange={handleChange} values={values} />
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