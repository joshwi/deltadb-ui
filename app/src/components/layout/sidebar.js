
import React, { useState } from "react";
import SimpleBar from 'simplebar-react';
// import { useLocation } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';
import { Nav, Dropdown, Navbar } from '@themesberg/react-bootstrap';
import { Button } from "reactstrap"
import { Link } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

export default (props = {}) => {

  const [show, setShow] = useState(false);
  const showClass = show ? "show" : "";

  const onCollapse = () => setShow(!show);

  const { user, loginWithRedirect, logout } = useAuth0();

  return (
    <>
      { props.status.sidebar && (
        <>
          <Navbar expand={false} collapseOnSelect variant="dark" className="navbar-theme-primary px-4 d-md-none">
            <Navbar.Brand className="me-lg-5" >
              <i className="bi bi-server" style={{ color: "#ce0e0e" }} />
            </Navbar.Brand>
            <Navbar.Toggle as={Button} aria-controls="main-navbar" onClick={onCollapse}>
              <span className="navbar-toggler-icon" />
            </Navbar.Toggle>
          </Navbar>
          <CSSTransition timeout={300} in={show} classNames="sidebar-transition">
            <SimpleBar className={`collapse ${showClass} sidebar d-md-block text-white`} style={{ backgroundColor: "#283448" }}>
              <div className="sidebar-inner px-4 pt-3">
                <div className="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
                  <div className="d-flex align-items-center">
                    <div className="user-avatar lg-avatar me-4">
                      <i className="bi bi-person-circle" style={{ color: "#ce0e0e", fontSize: '2rem' }} />
                    </div>
                    <div className="d-block">
                      <h6>Hi, {user && user.given_name && user.family_name ? `${user.given_name} ${user.family_name}` : "Guest"}</h6>
                      {!user && <button type="button" className="btn btn-xs" style={{ border: "none", backgroundColor: "#ce0e0e", color: "white" }} onClick={() => loginWithRedirect()}>Login</button>}
                      {"\t"}
                      {!user && <button type="button" className="btn btn-xs" style={{ border: "none", backgroundColor: "#ce0e0e", color: "white" }} onClick={() => loginWithRedirect()}>Sign Up</button>}
                      {user && <button type="button" className="btn btn-xs" style={{ border: "none", backgroundColor: "#ce0e0e", color: "white" }} onClick={() => logout({ returnTo: window.location.origin })}>Logout</button>}
                      {"\t"}
                      {user && <button type="button" className="btn btn-xs" style={{ border: "none", backgroundColor: "#ce0e0e", color: "white" }}><i className="bi bi-gear" /><span>&nbsp;&nbsp;Settings</span></button>}
                    </div>
                  </div>
                  <Nav.Link className="collapse-close d-md-none" onClick={onCollapse}>
                    <i className="bi bi-x"></i>
                  </Nav.Link>
                </div>
                <Nav className="flex-column pt-3 pt-md-0">
                  <button type="button" className="btn btn-lg">
                    <Link style={{ textDecoration: 'none' }} to={"/"} style={{ border: "transparent", backgroundColor: "transparent", color: "#ce0e0e", fontSize: "1.5rem", textDecoration: "none" }}><i className="bi bi-server" /><span>&nbsp;&nbsp;deltaDB</span></Link>
                  </button>
                  <Dropdown.Divider className="my-3 border-indigo" />
                  <button type="button" className="btn btn-lg" style={{ border: "transparent", backgroundColor: "transparent", color: "white" }}>
                    <Link style={{ textDecoration: 'none' }} to={`/table/${props.status.params && props.status.params.category ? props.status.params.category : "nfl"}/${props.status.params && props.status.params.node ? props.status.params.node : "games"}`} onClick={() => props.actions.setParams({ view: "table" })}><i className="bi bi-table" /><span>&nbsp;&nbsp;Tables</span></Link>
                  </button>
                  <div style={{ padding: "5px" }} />
                  <button type="button" className="btn btn-lg" style={{ border: "transparent", backgroundColor: "transparent", color: "white" }}>
                    <Link style={{ textDecoration: 'none' }} to={`/explorer/${props.status.params && props.status.params.schema ? props.status.params.schema : "season"}`} onClick={() => props.actions.setParams({ view: "explorer" })}><i className="bi bi-cursor" /><span>&nbsp;&nbsp;Explorer</span></Link>
                  </button>
                  <div style={{ padding: "5px" }} />
                  <button type="button" className="btn btn-lg" style={{ border: "transparent", backgroundColor: "transparent", color: "white" }}>
                    <Link style={{ textDecoration: 'none' }} to={"/"} onClick={() => props.actions.setParams({ view: "explorer" })}><i className="bi bi-bar-chart" /><span>&nbsp;&nbsp;Charts</span></Link>
                  </button>
                  <div style={{ padding: "5px" }} />
                  <button type="button" className="btn btn-lg" style={{ border: "transparent", backgroundColor: "transparent", color: "white" }}>
                    <Link style={{ textDecoration: 'none' }} to={"/map"} onClick={() => props.actions.setParams({ view: "explorer" })}><i className="bi bi-map" /><span>&nbsp;&nbsp;Maps</span></Link>
                  </button>
                  <div style={{ padding: "5px" }} />
                </Nav>

                {!show && (
                  <Nav className="flex-column pt-3 pt-md-0" style={{ bottom: "0px" }}>
                    <Dropdown.Divider className="my-3 border-indigo" />
                    <div className="d-flex justify-content-center">
                      <i className="bi bi-person-circle" style={{ color: "#ce0e0e", fontSize: '2rem' }} />
                    </div>
                    <div className="d-flex justify-content-center">
                      <Link style={{ textDecoration: 'none' }} to={"/"} style={{ border: "transparent", backgroundColor: "transparent", color: "#ce0e0e", fontSize: "1.5rem", textDecoration: "none" }}><h6>Hi, {user && user.given_name && user.family_name ? `${user.given_name} ${user.family_name}` : "Guest"}</h6></Link>
                    </div>
                    <div style={{ padding: "5px" }} />
                    {!user && <button type="button" className="btn" style={{ border: "none", backgroundColor: "#ce0e0e", color: "white" }} onClick={() => loginWithRedirect()}>Login / Sign Up</button>}
                    {user && <button type="button" className="btn" style={{ border: "none", backgroundColor: "#ce0e0e", color: "white" }} onClick={() => logout({ returnTo: window.location.origin })}>Logout</button>}
                    <div style={{ padding: "5px" }} />
                    {user && <button type="button" className="btn" style={{ border: "none", backgroundColor: "#ce0e0e", color: "white" }}><i className="bi bi-gear" /><span>&nbsp;&nbsp;Settings</span></button>}
                  </Nav>
                )}
              </div>
            </SimpleBar>
          </CSSTransition>
        </>
      )}
    </>
  );
};
