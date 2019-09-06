import React, { useState } from 'react';
import './App.css';
import EmailEntry from './EmailEntry';
import Graph from './Graph';
function App() {

  const [email, setEmail] = useState("");
  return (
    <div id="App">
      {email}
      {/*<EmailEntry setEmail={setEmail} /> */}
      <Graph />
    </div>
  );
}

export default App;
