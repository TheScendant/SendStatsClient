import React from 'react';
import './App.css';
import EntryForm from './EntryForm';
import MainPage from './MainPage';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

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
    <Router>
      <div id="App">
        {mainPage}
        {entryForm}
      </div>
    </Router>
  );
}

export default App;
