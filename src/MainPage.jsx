import React, { Component } from 'react';
import Graph from './Graph';
import Pyramid from './Pyramid';
import SimpleMovingMedian from './SimpleMovingMedian';
import './MainPage.css';
import classNames from 'classnames';
import {gradeSorter, isValidRating} from './utils';


class MainPage extends Component {
  constructor(props) {
    super(props);
    const { email, sends, userData } = props;
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

    this.hardestObject = this.getHardests();
  }

  getHardests() {
    const hardestObject = {
      onsight: {rating: "5.0"},
      flash: {rating: "5.0"},
      redpoint: {rating: "5.0"}
    }
    for (const send of this.state.sends) {
      if (isValidRating(send)) {
        const leadStyle = send.leadStyle.toLowerCase();
        if (leadStyle === "onsight") {
          if (gradeSorter(send.rating, hardestObject.onsight.rating) === 1) {
            hardestObject.onsight = send;
          }
        } else if (leadStyle === "flash") {
          if (gradeSorter(send.rating, hardestObject.flash.rating) === 1) {
            hardestObject.flash = send;
          }
        } else if (leadStyle === "redpoint") {
          if (gradeSorter(send.rating, hardestObject.redpoint.rating) === 1) {
            hardestObject.redpoint = send;
          }
        }
      }
    }
    return hardestObject;
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
    const {onsight, flash, redpoint} = this.hardestObject;

    return (
      <div id="MainPage">
        <div id="main-page-header">
          <span id="name">Send Stats for {name}</span>
          <div id="hardests">
            <div>
              <span id="hardest-onsight">Hardest Onsight:</span>
              <a href={`https://www.mountainproject.com/route/${onsight.routeId}`}>
                {onsight.name} -- {onsight.rating}
              </a>
            </div>
            <div>
              <span id="hardest-flash">Hardest Flash: </span>
              <a href={`https://www.mountainproject.com/route/${flash.routeId}`}>
                {flash.name} -- {flash.rating}
              </a>
            </div>
            <div>
              <span id="hardest-redpoint">Hardest Redpoint: </span>
              <a href={`https://www.mountainproject.com/route/${redpoint.routeId}`}>
                {redpoint.name} -- {redpoint.rating}
              </a>
            </div>
          </div>
        </div>
        <div id="graph-selection">
          <span id={this.GRAPH_ENUM.TIME_GRAPH} className={time_graph_class} onClick={(e) => { this.setGraphType(e.target.id) }}>Grades by Time</span>
          <span id={this.GRAPH_ENUM.PYRAMID} className={pyramid_class} onClick={(e) => { this.setGraphType(e.target.id) }}>Time by Grades</span>
          <span id={this.GRAPH_ENUM.MEDIAN} className={median_class} onClick={(e) => { this.setGraphType(e.target.id) }}>Median vs Max</span>
        </div>
        <div id="visual-wrapper">
          {visual}
        </div>
      </div>
    );
  }
}
export default MainPage;