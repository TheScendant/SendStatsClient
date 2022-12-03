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
import { RechartsGraph } from './RechartsGraph';

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

  const userId = useSelector(state => state.userData.userInfo.id)
  console.warn(userId)

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
          <Link className={`drawer-link ${classNames({selected: pathname === '/summary'})}`} to={`/${userId}/summary`}>
            <span id="SUMMARY" onClick={handleRouteChange}>
              Sends Summary
              </span>
          </Link>
          <Link className={`drawer-link ${classNames({selected: pathname === '/timeByGrades'})}`} to={`/${userId}/timeByGrades`}>
            <span id="TIME_GRAPH" onClick={handleRouteChange}>
              Sends Over Time
            </span>
          </Link>
          <Link className={`drawer-link ${classNames({selected: pathname === '/gradePyramid'})}`} to={`/${userId}/gradePyramid`}>
            <span id="PYRAMID" onClick={handleRouteChange}>
              Grade Pyramid
            </span>
          </Link>
          <Link className={`drawer-link ${classNames({selected: pathname === '/sendList'})}`} to={`/${userId}/sendList`}>
            <span id="SEND_LIST" onClick={handleRouteChange}>
              Send list
            </span>
          </Link>
          <Link className={`drawer-link ${classNames({selected: pathname === '/rechartsGraph'})}`} to="/rechartsGraph">
            <span id="RECHARTS_GRAPH" onClick={handleRouteChange}>
              Recharts Graph
            </span>
          </Link>
        </div>
        <span>{name}</span>
      </Drawer>
      <div id="visual-wrapper" >
        <Switch>
          <Route path={`/${userId}/summary`} exact={true}>
            <Summary />
          </Route>
          <Route path={`/${userId}/timeByGrades`} exact={true}>
            <Graph />
          </Route>
          <Route path={`/${userId}/gradePyramid`} exact={true}>
            <Pyramid year={year} />
          </Route>
          <Route path={`/${userId}/sendList`} exact={true}>
            <SendList year={year} />
          </Route>
          <Route path="/rechartsGraph" exact={true}>
            <RechartsGraph />
          </Route>
          <Redirect exact from="/" to="gradePyramid" />
        </Switch>
{/*           <Redirect exact from="/" to={`/${userId}/gradePyramid`} />
 */}       
        {showScrollTip && <div className="scroll-graph-tip">Click and drag graph to scroll</div>}
      </div>
    </div>
  );
}
export default MainPage;