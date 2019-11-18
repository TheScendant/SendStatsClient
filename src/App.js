import React, { useState } from 'react';
import './App.css';
import EntryForm from './EntryForm';
import MainPage from './MainPage';
function App() {

  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [sends, setSends] = useState([]);
  const [userData, setUserData] = useState("");
  let mainPage, entryForm;
  if ((email || userId) && sends && sends.length && userData) {
    mainPage = <MainPage email={email} sends={sends} userData={userData}/>
  } else {
    entryForm = <EntryForm setEmail={setEmail} setSends={setSends} setUserId={setUserId} setUserData={setUserData}/>
  }

  return (
    <div id="App">
      {mainPage}
      {entryForm}
    </div>
  );
}

export default App;
