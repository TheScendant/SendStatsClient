import React from 'react';
import './App.css';
import EntryForm from './EntryForm';
import MainPage from './MainPage';
import { useSelector } from 'react-redux';

function App() {
  const userInfo = useSelector(state => state.userData.userInfo);
  const sends = useSelector(state => state.sendsData.sends);
  let mainPage, entryForm;

  if (userInfo && sends) {
    mainPage = <MainPage />
  } else {
    entryForm = <EntryForm />
  }

  return (
    <div id="App">
      {mainPage}
      {entryForm}
    </div>
  );
}

export default App;
