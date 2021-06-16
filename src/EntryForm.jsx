import React, { useState } from 'react';
import { useForm, useSettersAsEventHandler, useConstraints } from "react-uniformed";
import Spinner from './Spinner';
import EmailEntry from './EmailEntry';
import UserIdEntry from './UserIdEntry';
import './EntryForm.css'
import { herokuUrl, postJSON } from './utils';
import { useDispatch } from 'react-redux';
import { setUserEmail, setStoreUserInfo, setUserID } from './userSlice';
import { setStoreSends, setStoreStars } from './sendsSlice';
function EntryForm() {
  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  // Use HTML5 style validation
  const validators = useConstraints({
    email: { required: false, type: "email" },
    userId: { required: false },
  });
  const dispatch = useDispatch();


  /**
   * onSubmit is only called when there aren't errors
   * @param {Object} data
   */
  const onSubmit = async (data) => {
    setNetworkError(false); // dosomething remove this from screen on change?
    if (data) {
      setLoading(true);

      const { email, userId } = data;
      const sendRes = await postJSON(data, `${herokuUrl}/sendData`);
      const userDataRes = await postJSON(data, `${herokuUrl}/userData`);

      if (sendRes && userDataRes) {
        const { sends, stars } = JSON.parse(sendRes.message);
        dispatch(setStoreUserInfo(userDataRes.message))
        dispatch( email ? setUserEmail(email) : setUserID(userId));
        dispatch(setStoreSends(sends));
        dispatch(setStoreStars(stars.toFixed(2)));
      } else {
        setNetworkError(true);
      }
      setLoading(false);
    };
  }

  // useForm holds the state of the form (ie touches, values, errors)
  //const { errors, hasErrors, setValue, submit, values, validateByName } = useForm({
  const { hasErrors, setValue, submit, values, validateByName } = useForm({
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

  const [isEmailEntry, setIsEmailEntry] = useState(true);

  const emailSelected = isEmailEntry ? 'selected' : '';
  const userIdSelected = !isEmailEntry ? 'selected' : '';

  // show spinner or input
  if (loading) {
    spinner = <Spinner />
  } else {
    form = (<form onSubmit={submit}>
      {errorMessage}
      {
        emailSelected
          ? <EmailEntry handleChange={handleChange} values={values} />
          : <UserIdEntry handleChange={handleChange} values={values} />
      }
      {submitButton}
    </form>);
  }
  return (
    <div id="EntryForm">
      <div id="FormWrapper">
        <div className="form-tabs">
          <div className={`form-tab ${emailSelected}`} onClick={() => setIsEmailEntry(true)}>Email</div>
          <div className={`form-tab ${userIdSelected}`} onClick={() => setIsEmailEntry(false)}>User ID</div>
        </div>
        <div className="entry-wrapper">
          {form}
          {spinner}
          {networkErrorMessage}
        </div>
      </div>
    </div>
  );
}

export default EntryForm;