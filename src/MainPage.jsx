import React, { useState } from 'react';
import Graph from './Graph';
import Pyramid from './Pyramid';
import './MainPage.css';



function MainPage(props) {
  const { email, sends } = props;
  const [useGraph, setUseGraph] = useState(false);
  let visual;
  if (useGraph) {
    visual = <Graph email={email} sends={sends} />
  } else {
    visual = <Pyramid email={email} sends={sends} />
  }

  return (
    <div id="MainPage">
      <div id="graph-selection">
          <span id="set-graph" onClick={(e) => {setUseGraph(e.target.id === "set-graph")}}>Graph</span>
          <span id="set-pyramid" onClick={(e) => {setUseGraph(e.target.id === "set-graph")}}>Pyramid</span>
      </div>
      {visual}
    </div>
  );
}
export default MainPage;