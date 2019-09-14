import React, { useState } from 'react';
import './App.css';
import EntryForm from './EntryForm';
import Graph from './Graph';
function App() {

  const [email, setEmail] = useState("");
  const [sends, setSends] = useState([]);
  let graph, emailEntry;
  if (email && sends && sends.length) {
    graph = <Graph email={email} sends={sends}/>
  } else {
    emailEntry = <EntryForm setEmail={setEmail} setSends={setSends}/>
  }
  return (
    <div id="App">
      {graph}
      {emailEntry}
    </div>
  );
}

export default App;
