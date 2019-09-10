import React, { useState } from 'react';
import './App.css';
import EmailEntry from './EmailEntry';
import Graph from './Graph';
function App() {

  const [email, setEmail] = useState("");
  const [sends, setSends] = useState([]);
  let graph, emailEntry;
  if (email && sends && sends.length) {
    console.warn("appjs think that sends is")
    console.warn(sends)
    graph = <Graph email={email} sends={sends}/>
  } else {
    emailEntry = <EmailEntry setEmail={setEmail} setSends={setSends}/>
  }
  return (
    <div id="App">
      {graph}
      {emailEntry}
    </div>
  );
}

export default App;
