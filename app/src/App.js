/*eslint-disable*/
import React, { useEffect } from 'react';
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import PropTypes from "prop-types"

import Sidebar from "./components/layout/sidebar"

import Home from "./pages/home"
import Table from "./pages/table"
import Chart from "./pages/chart"
import Explorer from "./pages/explorer"
import Map from "./pages/map"
import NotFound from "./pages/notFound"

import * as actions from "./store/actions"
import initState from "./static/json/initialState.json"

import "./static/scss/volt.scss";
import LoginButton from './components/controller/login';
import Profile from './components/controller/profile';
import LogoutButton from './components/controller/logout';


function App(props) {

  // console.log(props)

  useEffect(() => {
    props.actions.loadKeys()
    props.actions.loadColorThemes()
    props.actions.initStatus(initState)
  }, [])

  return (
    <Router>
          <Sidebar {...props} />
          {props.status.sidebar && (
            <main className="content">
              <LoginButton/>
              <LogoutButton/>
              <Profile/>
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path={"/table/:schema"} exact render={() => <Table {...props} />} />
                <Route path={"/chart/:schema"} exact render={() => <Chart {...props} />} />
                <Route path={"/explorer/:schema"} exact render={() => <Explorer {...props} />} />
                <Route path={"/map/:schema"} exact render={() => <Map {...props} />} />
                <Route component={NotFound} />
              </Switch>
            </main>
          )}
    </Router>
  );
}

App.propTypes = {
  keys: PropTypes.object.isRequired,
  status: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    keys: state.keys,
    teams: state.teams,
    status: state.status
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)