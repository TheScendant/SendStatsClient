import React, { useState } from 'react';
import Graph from './Graph';
import Pyramid from './Pyramid';
import MainPageHeader from './MainPageHeader';
import SimpleMovingMedian from './SimpleMovingMedian';
import './MainPage.css';
import { gradeSorter, isValidRating } from './utils';
import { BrowserRouter as Router, Link, Redirect, Route, Switch } from 'react-router-dom';
import { Button, Drawer, Icon } from '@material-ui/core';
import {Menu as MenuIcon} from '@material-ui/icons/';

function MainPage({ email, sends, userData, setSends }) {

  const getHardests = (sends) => {
    const hardestObject = {
      onsight: { rating: "5.0" },
      flash: { rating: "5.0" },
      redpoint: { rating: "5.0" }
    }
    for (const send of sends) {
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

  const GRAPH_ENUM = {
    TIME_GRAPH: "TIME_GRAPH",
    PYRAMID: "PYRAMID",
    MEDIAN: "MEDIAN",
  };

  const graphType = GRAPH_ENUM.PYRAMID;

  const hardestObject = getHardests(sends);
  const year = (new Date()).getFullYear();

  const goHome = () => { //dosomething
    setSends([]);
  }
  const { name } = userData;

  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div id="MainPage">
      <div id="graph-selection">
        <Button onClick={(e) => setDrawerOpen(!drawerOpen)}>
          <MenuIcon />
        </Button>
        <span id="HOME" onClick={goHome}><a>SendStats</a></span>
      </div>
      <Router>
        <Drawer anchor={'left'} open={drawerOpen} onClose={(e) => setDrawerOpen(false)}>
          <div id="link-list">
            <span>Navigation</span>
            <span id="SUMMARY"><Link to="/summary">Sends Summary</Link></span>
            <span id="TIME_GRAPH"><Link to="/timeByGrades">Sends Over Time</Link></span>
            <span id="PYRAMID"><Link to="/gradesByTime">Grade Pyramid</Link></span>
          </div>
          <span>{name}</span>
        </Drawer>
        <div id="visual-wrapper" >
          <Switch>
            <Route path="/summary" exact={true}>
              <MainPageHeader hardestObject={hardestObject} name={name} />
            </Route>
            <Route path="/timeByGrades" exact={true}>
              <Graph email={email} sends={sends} />
            </Route>
            <Route path="/gradesByTime" exact={true}>
              <Pyramid email={email} sends={sends} year={year} />
            </Route>
            <Redirect exact from="/" to="gradesByTime" />
          </Switch>
        </div>
      </Router>
    </div>
  );
}
export default MainPage;