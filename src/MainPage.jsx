import React, { Component } from 'react';
import Graph from './Graph';
import Pyramid from './Pyramid';
import SimpleMovingMedian from './SimpleMovingMedian';
import TestScroll from './test-scroll';
import './MainPage.css';
import classNames from 'classnames';



class MainPage extends Component {
  constructor(props) {
    super(props);
    const { email, sends } = props;

    this.GRAPH_ENUM = {
      TIME_GRAPH: "TIME_GRAPH",
      PYRAMID: "PYRAMID",
      MEDIAN: "MEDIAN",
    };

    this.state = {
      email: email,
      sends: sends,
      graphType: this.GRAPH_ENUM.PYRAMID,
    };

  }
  isSelected(val, val2) {
    console.warn(val, val2);
    return val ? "selected" : "";
  }

  setGraphType(graphType) {
    this.setState(function() {
      return {
        email: this.state.email,
        sends: this.state.sends,
        graphType: graphType,
      }
  });
  }

  render() {
    let visual;
    const {graphType} = this.state;
    if (graphType === this.GRAPH_ENUM.TIME_GRAPH) {
      visual = <Graph email={this.state.email} sends={this.state.sends} />
    } else if (graphType === this.GRAPH_ENUM.PYRAMID) {
      visual = <Pyramid email={this.state.email} sends={this.state.sends} />
    } else {
      visual = <SimpleMovingMedian email={this.state.email} sends={this.state.sends} />
    }
    //visual = <TestScroll email={email} sends={sends} />

    const time_graph_class = classNames({
      'selected': this.state.graphType === this.GRAPH_ENUM.TIME_GRAPH,
    });
    const pyramid_class = classNames({
      'selected': this.state.graphType === this.GRAPH_ENUM.PYRAMID,
    });
    const median_class = classNames({
      'selected': this.state.graphType === this.GRAPH_ENUM.MEDIAN,
    });
    console.warn(time_graph_class, pyramid_class, median_class)

    return (

      <div id="MainPage">
        <div id="graph-selection">
          <span id={this.GRAPH_ENUM.TIME_GRAPH} className={time_graph_class} onClick={(e) => { this.setGraphType(e.target.id) }}>Grades by Time</span>
          <span id={this.GRAPH_ENUM.PYRAMID} className={pyramid_class} onClick={(e) => { this.setGraphType(e.target.id) }}>Time by Grades</span>
          <span id={this.GRAPH_ENUM.MEDIAN} className={median_class} onClick={(e) => { this.setGraphType(e.target.id) }}>Median vs Max</span>
        </div>
        {visual}
      </div>
    );
  }
}
export default MainPage;