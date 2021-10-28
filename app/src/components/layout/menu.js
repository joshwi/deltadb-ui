import React from "react";
import { Collapse, Navbar, Nav, NavItem, NavLink, Row, NavbarText } from 'reactstrap';
import { Link } from "react-router-dom";
import "../../static/css/main.css"

function HEADER(props) {

  return (
    <>
      {props.status.sidebar && (
        <div className={`headers${props.status.sidebar.active ? " active" : ""}`}>
          <Navbar color="dark" dark expand="md">
            <Collapse navbar>
              <Nav>
                <NavItem>
                  <NavLink><Link to="/" style={{ color: "white" }}><i className="bi bi-server" style={{ color: "white" }} /><span style={{ marginLeft: "5px" }}>deltaDB</span></Link></NavLink>
                </NavItem>
                <NavItem>
                  <NavLink><Link to={`/${props.status.params && props.status.params.view ? props.status.params.view : "table"}/games`} onClick={() => props.actions.setParams({ schema: "games" })} style={{ color: "white" }}>Games</Link></NavLink>
                </NavItem>
                <NavItem>
                  <NavLink><Link to={`/${props.status.params && props.status.params.view ? props.status.params.view : "table"}/picks`} onClick={() => props.actions.setParams({ schema: "picks" })} style={{ color: "white" }}>Draft</Link></NavLink>
                </NavItem>
              </Nav>
            </Collapse>
            <NavbarText style={{ float: "right" }}>
              <Row md="10"></Row>
            </NavbarText>
          </Navbar>
        </div>
      )}
    </>

  );
}

export default HEADER;