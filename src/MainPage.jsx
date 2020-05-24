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
    const { email, sends, userData, setSends} = props;
    this.setSends = setSends;
    this.GRAPH_ENUM = {
      TIME_GRAPH: "TIME_GRAPH",
      PYRAMID: "PYRAMID",
      MEDIAN: "MEDIAN",
    };

    this.state = {
      email,
      sends,
      userData,
      graphType: this.GRAPH_ENUM.PYRAMID,
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
  goHome() {
    this.setSends([]);
  }
  render() {
    const { name } = this.state.userData;

    return (
      <div id="MainPage">
        <Router>
          <div id="graph-selection">
              <span id="HOME" onClick={this.goHome.bind(this)}><a>SendStats</a></span>
              <span id="TIME_GRAPH"><Link to="/timeByGrades">Sends Over Time</Link></span>
              <span id="PYRAMID"><Link to="/gradesByTime">Grade Pyramid</Link></span>
          </div>
          {/* <MainPageHeader hardestObject={this.hardestObject} name={name} /> */}
          <Switch>
            <div id="visual-wrapper">
              <Route path="/timeByGrades" exact={true}>
                <Graph email={this.state.email} sends={this.state.sends} />
              </Route>
              <Route path="/gradesByTime" exact={true}>
                <Pyramid email={this.state.email} sends={this.state.sends} year={this.year} />
              </Route>
              <Redirect exact from="/" to="timeByGrades" />
            </div>
          </Switch>
        </Router>
      </div>
    );
  }
}
export default MainPage;