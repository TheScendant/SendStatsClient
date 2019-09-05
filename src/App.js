import React, { useState } from 'react';
import './App.css';
import EmailEntry from './EmailEntry';

function App() {

  const [email, setEmail] = useState("");
  return (
    <div id="App">
      {email}
      <EmailEntry setEmail={setEmail} />
    </div>
  );
}

export default App;
