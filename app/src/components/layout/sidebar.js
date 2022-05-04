
import React, { useEffect, useState } from "react";
import SimpleBar from 'simplebar-react';
// import { useLocation } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';
import { Nav, Dropdown, Navbar } from '@themesberg/react-bootstrap';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, InputGroup, InputGroupText } from "reactstrap"
import { Link, useHistory } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
// import Settings from "../controller/settings"

// const tabs = (params) => [
//   {header: "Tables", key: "table", icon: "bi bi-table", link: `/table/${params.category}/${params.node}`},
//   {header: "Explorer", key: "explorer", icon: "bi bi-cursor"},
//   {header: "Charts", key: "chart", icon: "bi bi-bar-chart"},
//   {header: "Maps", key: "map", icon: "bi bi-map"}
// ]

export default (props) => {

  const navigate = useHistory();

  const closeBtn = <button className="close" style={{ border: 0, backgroundColor: "transparent" }} onClick={() => SetSettings(false)}><i class="bi bi-x" style={{ fontSize: "2rem", color: "white" }} /></button>;

  const [settings, SetSettings] = useState(false)
  const [show, setShow] = useState(false);
  const [params, SetParams] = useState({})
  const showClass = show ? "show" : "";

  const onCollapse = () => setShow(!show);

  const { user, loginWithRedirect, logout } = useAuth0();

  useEffect(() => { if (props.params) { SetParams(props.params) } }, [props.params])

  return (
    <>
      <Navbar expand={false} collapseOnSelect variant="dark" className="navbar-theme-primary px-4 d-md-none" style={{zIndex: 10}}>
        <Navbar.Brand className="me-lg-5" >
          <i className="bi bi-server" id="secondaryColorText" />
        </Navbar.Brand>
        <Navbar.Toggle as={Button} aria-controls="main-navbar" onClick={onCollapse}>
          <span className="navbar-toggler-icon" />
        </Navbar.Toggle>
      </Navbar>
      <CSSTransition timeout={300} in={show} classNames="sidebar-transition">
        <SimpleBar className={`collapse ${showClass} sidebar d-md-block text-white`} id="primaryColor">
          <div className="sidebar-inner px-4 pt-3">
            <div className="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
              <div className="d-flex align-items-center">
                <div className="user-avatar lg-avatar me-4">
                  <i className="bi bi-person-circle" id="secondaryColorText" style={{ fontSize: '2rem' }} />
                </div>
                <div className="d-block">
                  <h6>Hi, {user && user.given_name && user.family_name ? `${user.given_name} ${user.family_name}` : "Guest"}</h6>
                  {!user && <button type="button" className="btn btn-xs" id="secondaryColor" style={{ border: "none" }} onClick={() => loginWithRedirect()}>Login</button>}
                  {"\t"}
                  {!user && <button type="button" className="btn btn-xs" id="secondaryColor" style={{ border: "none" }} onClick={() => loginWithRedirect()}>Sign Up</button>}
                  {user && <button type="button" className="btn btn-xs" id="secondaryColor" style={{ border: "none" }} onClick={() => logout({ returnTo: window.location.origin })}>Logout</button>}
                  {"\t"}
                  {user && <button type="button" className="btn btn-xs" id="secondaryColor" style={{ border: "none" }} onClick={() => SetSettings(!settings)}><i className="bi bi-gear" /><span>&nbsp;&nbsp;Settings</span></button>}
                </div>
              </div>
              <Nav.Link className="collapse-close d-md-none" onClick={onCollapse}>
                <i className="bi bi-x"></i>
              </Nav.Link>
            </div>
            <Nav className="flex-column pt-3 pt-md-0">
              <button type="button" className="btn btn-lg">
                <Link to={"/"} id="secondaryColorText" style={{ border: "transparent", backgroundColor: "transparent", fontSize: "1.5rem", textDecoration: "none" }}><i className="bi bi-server" /><span>&nbsp;&nbsp;deltaDB</span></Link>
              </button>
              <Dropdown.Divider className="my-3 border-indigo" />
              {/* <button type="button" className="btn btn-lg" style={{ border: "transparent", backgroundColor: "transparent", color: "white" }}>
                <Link style={{ textDecoration: 'none' }} to={`/table/${props.params.category ? props.params.category : "nfl"}/${props.params.node ? props.params.node : "games"}`}><i className="bi bi-table" /><span>&nbsp;&nbsp;Tables</span></Link>
              </button> */}
              <button type="button" className="btn btn-lg" style={{ border: "transparent", backgroundColor: "transparent", color: "white" }}>
                <Link style={{ textDecoration: 'none' }} to={`/table/${props.params.category ? props.params.category : "nfl"}/${props.params.source ? props.params.source : "teams"}/${props.params.target ? props.params.target : "games"}/${props.params.label ? props.params.label : "kan"}`}><i className="bi bi-table" /><span>&nbsp;&nbsp;Tables</span></Link>
              </button>
              <div style={{ padding: "5px" }} />
              <button type="button" className="btn btn-lg" style={{ border: "transparent", backgroundColor: "transparent", color: "white" }}>
                <Link style={{ textDecoration: 'none' }} to={`/explorer/${props.params.category ? props.params.category : "nfl"}/${props.params.source ? props.params.source : "teams"}/${props.params.target ? props.params.target : "games"}`}><i className="bi bi-cursor" /><span>&nbsp;&nbsp;Explorer</span></Link>
              </button>
              {/* <div style={{ padding: "5px" }} />
              <button type="button" className="btn btn-lg" style={{ border: "transparent", backgroundColor: "transparent", color: "white" }}>
                <Link style={{ textDecoration: 'none' }} to={"/map"}><i className="bi bi-map" /><span>&nbsp;&nbsp;Maps</span></Link>
              </button> */}
              <div style={{ padding: "5px" }} />
            </Nav>
            {!show && (
              <Nav className="flex-column pt-3 pt-md-0" style={{ bottom: "0px" }}>
                <Dropdown.Divider className="my-3 border-indigo" />
                <div className="d-flex justify-content-center">
                  <i className="bi bi-person-circle" id="secondaryColorText" style={{ fontSize: '2rem' }} />
                </div>
                <div className="d-flex justify-content-center">
                  <Link to={"/"} id="secondaryColorText" style={{ border: "transparent", backgroundColor: "transparent", fontSize: "1.5rem", textDecoration: "none" }}><h6>Hi, {user && user.given_name && user.family_name ? `${user.given_name} ${user.family_name}` : "Guest"}</h6></Link>
                </div>
                <div style={{ padding: "5px" }} />
                {!user && <button type="button" className="btn" id="secondaryColor" style={{ border: "none" }} onClick={() => loginWithRedirect()}>Login / Sign Up</button>}
                {user && <button type="button" className="btn" id="secondaryColor" style={{ border: "none" }} onClick={() => logout({ returnTo: window.location.origin })}>Logout</button>}
                <div style={{ padding: "5px" }} />
                {/* {user && <button type="button" className="btn" id="secondaryColor" style={{ border: "none" }} onClick={() => SetSettings(!settings)}><i className="bi bi-gear" /><span>&nbsp;&nbsp;Settings</span></button>} */}
              </Nav>
            )}
          </div>
        </SimpleBar>
      </CSSTransition>
      <div>
        <Modal isOpen={settings}>
          <ModalHeader close={closeBtn} id="primaryColor"><span style={{ color: "white" }}>Settings</span></ModalHeader>
          <ModalBody id="primaryColor">
            {Object.keys(params).map((entry, index) => {
              return (
                <InputGroup key={index} style={{ padding: "10px" }}>
                  <InputGroupText id="primaryColor">{entry}</InputGroupText>
                  <Input id="primaryColor" placeholder={params[entry]} onChange={(e) => SetParams({ ...params, [entry]: e.target.value })} />
                </InputGroup>
              )
            })}
          </ModalBody>
          <ModalFooter id="primaryColor">
            <button type="button" className="btn" style={{ border: "none" }} onClick={() => { props.actions.setParams(params); navigate.push(`/${params.view}/${params.category}/${params.node}`) }}>
                <i className="bi bi-check2" />
                <span>&nbsp;&nbsp;Save</span>
            </button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
};
