import React, { useState } from 'react';
import './App.css';
import EntryForm from './EntryForm';
import MainPage from './MainPage';
function App() {

  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [sends, setSends] = useState([]);
  let mainPage, emailEntry;
  if ((email || userId) && sends && sends.length) {
    mainPage = <MainPage email={email} sends={sends}/>
  } else {
    emailEntry = <EntryForm setEmail={setEmail} setSends={setSends} setUserId={setUserId}/>
  }
  return (
    <div id="App">
      {mainPage}
      {emailEntry}
    </div>
  );
}

export default App;
