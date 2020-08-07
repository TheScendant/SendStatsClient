import React, { useState } from 'react';
import Graph from './Graph';
import Pyramid from './Pyramid';
import MainPageHeader from './MainPageHeader';
// import SimpleMovingMedian from './SimpleMovingMedian';
import './MainPage.css';
import { gradeSorter, isValidRating } from './utils';
import { BrowserRouter as Router, Link, Redirect, Route, Switch } from 'react-router-dom';
import { Button, Drawer } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons/';

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

/*   const GRAPH_ENUM = {
    TIME_GRAPH: "TIME_GRAPH",
    PYRAMID: "PYRAMID",
    MEDIAN: "MEDIAN",
    SUMMARY: "SUMMARY",
  }; */


  const hardestObject = getHardests(sends);
  const year = (new Date()).getFullYear();

  const goHome = () => { //dosomething
    setSends([]);
  }
  const { name } = userData;

  const [drawerOpen, setDrawerOpen] = useState(false);


  const handleRouteChange = (e) => {
    // setDrawerOpen(false)
  }

  return (
    <div id="MainPage">
      <div id="graph-selection">
        <Button onClick={(e) => setDrawerOpen(!drawerOpen)}>
          <MenuIcon className="menu-icon"/>
        </Button>
        <span id="HOME" onClick={goHome}><a href="/">SendStats</a></span>
      </div>
      <Router>
        <Drawer anchor={'left'} open={drawerOpen} onClose={(e) => setDrawerOpen(false)}>
          <div id="link-list">
            <div id="LL_TITLE">Navigation</div>
            <span id="SUMMARY" onClick={handleRouteChange}>
              <Link to="/summary">Sends Summary</Link>
            </span>
            <span id="TIME_GRAPH" onClick={handleRouteChange}>
              <Link to="/timeByGrades">Sends Over Time</Link>
            </span>
            <span id="PYRAMID" onClick={handleRouteChange}>
              <Link to="/gradePyramid">Grade Pyramid</Link>
            </span>
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
            <Route path="/gradePyramid" exact={true}>
              <Pyramid email={email} sends={sends} year={year} />
            </Route>
            <Redirect exact from="/" to="gradePyramid" />
          </Switch>
        </div>
      </Router>
    </div>
  );
}
export default MainPage;