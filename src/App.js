import React, { useState } from 'react';
import './App.css';
import EntryForm from './EntryForm';
import Graph from './Graph';
import Pyramid from './Pyramid';
function App() {

  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [sends, setSends] = useState([]);
  let graph, emailEntry;
  if ((email || userId) && sends && sends.length) {
    graph = <Graph email={email} sends={sends}/>
    //graph = <Pyramid email={email} sends={sends}/>

  } else {
    emailEntry = <EntryForm setEmail={setEmail} setSends={setSends} setUserId={setUserId}/>
  }
  return (
    <div id="App">
      {graph}
      {emailEntry}
    </div>
  );
}

export default App;
