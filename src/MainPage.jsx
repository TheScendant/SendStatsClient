import React, { useState } from 'react';
import Graph from './Graph';
import Pyramid from './Pyramid';
import SimpleMovingMedian from './SimpleMovingMedian';
import TestScroll from './test-scroll';
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

  // visual = <SimpleMovingMedian email={email} sends={sends} />
  //visual = <TestScroll email={email} sends={sends} />

  const isSelected = (val) => {
    return val ? "selected" : "";
  }
  return (
    <div id="MainPage">
      <div id="graph-selection">
        <span id="set-graph" className={isSelected(useGraph)} onClick={(e) => { setUseGraph(e.target.id === "set-graph") }}>Grades by Time</span>
        <span id="set-pyramid" className={isSelected(!useGraph)} onClick={(e) => { setUseGraph(e.target.id === "set-graph") }}>Time by Grades</span>
      </div>
      {visual}
    </div>
  );
}
export default MainPage;