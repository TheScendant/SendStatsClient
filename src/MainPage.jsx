import React, { useState } from 'react';
import Graph from './Graph';
import Pyramid from './Pyramid';
import Summary from './Summary';
import SendList from './SendList';
// import SimpleMovingMedian from './SimpleMovingMedian';
import './MainPage.css';
import { Link, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { Button, Drawer } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons/';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

function MainPage() {
  const LOCATION_ENUM = {
    TIME_GRAPH: "TIME_GRAPH",
    PYRAMID: "PYRAMID",
    MEDIAN: "MEDIAN",
    SUMMARY: "SUMMARY",
    SEND_LIST: "SEND_LIST",
  };

  // const pathToLocation = {
  //   '/summary': LOCATION_ENUM.SUMMARY,
  //   '/timeByGrades': LOCATION_ENUM.TIME_GRAPH,
  //   '/gradePyramid': LOCATION_ENUM.PYRAMID,
  //   '/sendList': LOCATION_ENUM.SEND_LIST,
  // };

  const locationToTile = {}
  locationToTile[LOCATION_ENUM.SUMMARY] = 'Sends Summary';
  locationToTile[LOCATION_ENUM.TIME_GRAPH] = 'Sends Over Time';
  locationToTile[LOCATION_ENUM.PYRAMID] = 'Grade Pyramid';
  locationToTile[LOCATION_ENUM.SEND_LIST] = 'Sends List';


  const year = (new Date()).getFullYear();
  const name = useSelector(state => state.userData.userInfo.name);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleRouteChange = (e) => {
    setDrawerOpen(false)
  }

  const location = useLocation();
  const {pathname} = location;

  const showScrollTip = (pathname === '/gradePyramid') || (pathname === '/timeByGrades');

  return (
    <div id="MainPage">
      <div id="graph-selection">
        <Button onClick={(e) => setDrawerOpen(!drawerOpen)}>
          <MenuIcon className="menu-icon" />
        </Button>
        <span id="HOME"><a href="/">SendStats</a></span>
      </div>
      <Drawer anchor={'left'} open={drawerOpen} onClose={(e) => setDrawerOpen(false)}>
        <div id="link-list">
          <div id="LL_TITLE">Navigation</div>
          <Link className={`drawer-link ${classNames({selected: pathname === '/summary'})}`} to="/summary">
            <span id="SUMMARY" onClick={handleRouteChange}>
              Sends Summary
              </span>
          </Link>
          <Link className={`drawer-link ${classNames({selected: pathname === '/timeByGrades'})}`} to="/timeByGrades">
            <span id="TIME_GRAPH" onClick={handleRouteChange}>
              Sends Over Time
            </span>
          </Link>
          <Link className={`drawer-link ${classNames({selected: pathname === '/gradePyramid'})}`} to="/gradePyramid">
            <span id="PYRAMID" onClick={handleRouteChange}>
              Grade Pyramid
            </span>
          </Link>
          <Link className={`drawer-link ${classNames({selected: pathname === '/sendList'})}`} to="/sendList">
            <span id="SEND_LIST" onClick={handleRouteChange}>
              Send list
              </span>
          </Link>
        </div>
        <span>{name}</span>
      </Drawer>
      <div id="visual-wrapper" >
        <Switch>
          <Route path="/summary" exact={true}>
            <Summary />
          </Route>
          <Route path="/timeByGrades" exact={true}>
            <Graph />
          </Route>
          <Route path="/gradePyramid" exact={true}>
            <Pyramid year={year} />
          </Route>
          <Route path="/sendList" exact={true}>
            <SendList year={year} />
          </Route>
          <Redirect exact from="/" to="gradePyramid" />
        </Switch>
        {showScrollTip && <div className="scroll-graph-tip">Click and drag graph to scroll</div>}
      </div>
    </div>
  );
}
export default MainPage;