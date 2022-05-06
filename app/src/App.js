/*eslint-disable*/
import React, { useEffect } from 'react';
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import PropTypes from "prop-types"

import Sidebar from "./components/layout/sidebar"

import Home from "./pages/home"
import Table from "./pages/table"
import Correlation from "./pages/correlation"
// import Record from "./pages/record"
import Explorer from "./pages/explorer"
import Map from "./pages/map"
import NotFound from "./pages/notFound"

import * as actions from "./store/actions"

import "./static/scss/volt.scss";


function App(props) {

  const { isAuthenticated } = useAuth0();

  useEffect(() => { props.actions.loadKeys() }, [])

  return (
    <Router>
          <Sidebar {...props} />
          {isAuthenticated && (
            <main className="content" style={{padding: "1rem"}}>
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path={"/table/:category/:node"} exact render={() => <Table {...props} />} />
                <Route path={"/table/:category/:source/:target/:label"} exact render={() => <Correlation {...props} />} />
                {/* <Route path={"/record/:category/:node/:label"} exact render={() => <Record {...props} />} /> */}
                <Route path={"/explorer/:category/:source/:target"} exact render={() => <Explorer {...props} />} />
                <Route path={"/map"} exact render={() => <Map {...props} />} />
                <Route component={NotFound} />
              </Switch>
            </main>
          )}
    </Router>
  );
}

App.propTypes = {
  view: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  pages: PropTypes.object.isRequired,
  db: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    view: state.view,
    params: state.params,
    pages: state.pages,
    db: state.db
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)