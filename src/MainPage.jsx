import React, { Component } from 'react';
import Graph from './Graph';
import Pyramid from './Pyramid';
import MainPageHeader from './MainPageHeader';
import SimpleMovingMedian from './SimpleMovingMedian';
import './MainPage.css';
import { gradeSorter, isValidRating } from './utils';
import { BrowserRouter as Router, Link, Redirect, Route, Switch } from 'react-router-dom';

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
    this.year = (new Date()).getFullYear();
  }

  getHardests() {
    const hardestObject = {
      onsight: { rating: "5.0" },
      flash: { rating: "5.0" },
      redpoint: { rating: "5.0" }
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
    this.setState(function () {
      return {
        email: this.state.email,
        sends: this.state.sends,
        userData: this.state.userData,
        graphType: graphType,
      }
    });
  }

  render() {
    const { name } = this.state.userData;

    return (
      <div id="MainPage">
        <MainPageHeader hardestObject={this.hardestObject} name={name} />
        <Router>
          <div id="graph-selection">
            <Link to="/timeByGrades">
              <span id="TIME_GRAPH">Grades by Time</span>
            </Link>
            <Link to="/gradesByTime">
              <span id="PYRAMID">Time by Grades</span>
            </Link>
            {/*<span id={this.GRAPH_ENUM.MEDIAN} className={median_class} onClick={(e) => { this.setGraphType(e.target.id) }}>Median vs Max</span>*/}
          </div>
          <Switch>
            <Route path="/timeByGrades" exact={true}>
              <Graph email={this.state.email} sends={this.state.sends} />
            </Route>
            <Route path="/gradesByTime" exact={true}>
              <Pyramid email={this.state.email} sends={this.state.sends} year={this.year} />
            </Route>
            <Redirect exact from="/" to="timeByGrades" />
          </Switch>
        </Router>
        {/*

        <div id="visual-wrapper">
          {visual}
    </div>*/}
      </div>
    );
  }
}
export default MainPage;