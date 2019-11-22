import React, { Component } from 'react';
import Graph from './Graph';
import Pyramid from './Pyramid';
import SimpleMovingMedian from './SimpleMovingMedian';
import './MainPage.css';
import classNames from 'classnames';



class MainPage extends Component {
  constructor(props) {
    super(props);
    const { email, sends, userData } = props;
    console.warn(userData)
    this.GRAPH_ENUM = {
      TIME_GRAPH: "TIME_GRAPH",
      PYRAMID: "PYRAMID",
      MEDIAN: "MEDIAN",
    };

    this.state = {
      email,
      sends,
      userData,
      graphType: this.GRAPH_ENUM.TIME_GRAPH,
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
        userData: this.state.userData,
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
    } else if (graphType === this.GRAPH_ENUM.MEDIAN){
      visual = <SimpleMovingMedian email={this.state.email} sends={this.state.sends} />
    }

    const time_graph_class = classNames({
      'selected': this.state.graphType === this.GRAPH_ENUM.TIME_GRAPH,
    });
    const pyramid_class = classNames({
      'selected': this.state.graphType === this.GRAPH_ENUM.PYRAMID,
    });
    const median_class = classNames({
      'selected': this.state.graphType === this.GRAPH_ENUM.MEDIAN,
    });

    const {name} = this.state.userData;

    return (

      <div id="MainPage">
        <div id="graph-selection">
          <span id={this.GRAPH_ENUM.TIME_GRAPH} className={time_graph_class} onClick={(e) => { this.setGraphType(e.target.id) }}>Grades by Time</span>
          <span id={this.GRAPH_ENUM.PYRAMID} className={pyramid_class} onClick={(e) => { this.setGraphType(e.target.id) }}>Time by Grades</span>
          <span id={this.GRAPH_ENUM.MEDIAN} className={median_class} onClick={(e) => { this.setGraphType(e.target.id) }}>Median vs Max</span>
        </div>
        <span id="name">{name}</span>
        {visual}
      </div>
    );
  }
}
export default MainPage;