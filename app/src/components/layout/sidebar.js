
import React, { useState } from "react";
import SimpleBar from 'simplebar-react';
// import { useLocation } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';
import { Nav, Dropdown, Navbar } from '@themesberg/react-bootstrap';
import { Button } from "reactstrap"
import { Link } from 'react-router-dom';

export default (props = {}) => {
  // const location = useLocation();
  // const { pathname } = location;
  const [show, setShow] = useState(false);
  const showClass = show ? "show" : "";

  const onCollapse = () => setShow(!show);

  // const CollapsableNavItem = (props) => {
  //   const { eventKey, title, icon, children = null } = props;
  //   const defaultKey = pathname.indexOf(eventKey) !== -1 ? eventKey : "";

  //   return (
  //     <Accordion as={Nav.Item} defaultActiveKey={defaultKey}>
  //       <Accordion.Item eventKey={eventKey}>
  //         <Accordion.Button as={Nav.Link} className="d-flex justify-content-between align-items-center">
  //           <span>
  //             <span className="sidebar-icon"> </span>
  //             <span className="sidebar-text">{title}</span>
  //           </span>
  //         </Accordion.Button>
  //         <Accordion.Body className="multi-level">
  //           <Nav className="flex-column">
  //             {children}
  //           </Nav>
  //         </Accordion.Body>
  //       </Accordion.Item>
  //     </Accordion>
  //   );
  // };

  // const NavItem = (props) => {
  //   const { title, link, external, target, icon, image, badgeText, badgeBg = "secondary", badgeColor = "primary" } = props;
  //   const classNames = badgeText ? "d-flex justify-content-start align-items-center justify-content-between" : "";
  //   const navItemClassName = link === pathname ? "active" : "";
  //   const linkProps = external ? { href: link } : { as: Link, to: link };

  //   return (
  //     <Nav.Item className={navItemClassName} onClick={() => setShow(false)}>
  //       <Nav.Link {...linkProps} target={target} className={classNames}>
  //         <span>
  //           {icon ? <span className="sidebar-icon"> </span> : null}
  //           {image ? <Image width={20} height={20} className="sidebar-icon svg-icon" /> : null}

  //           <span className="sidebar-text">{title}</span>
  //         </span>
  //         {badgeText ? (
  //           <Badge pill bg={badgeBg} text={badgeColor} className="badge-md notification-count ms-2">{badgeText}</Badge>
  //         ) : null}
  //       </Nav.Link>
  //     </Nav.Item>
  //   );
  // };

  return (
    <>
      { props.status.sidebar && (
        <>
          <Navbar expand={false} collapseOnSelect variant="dark" className="navbar-theme-primary px-4 d-md-none">
            <Navbar.Brand className="me-lg-5" as={Link} >
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
                      <h6>Hi, User</h6>
                      {/* <Button as={Link} variant="secondary" size="xs" className="text-dark">Sign Out</Button> */}
                    </div>
                  </div>
                  <Nav.Link className="collapse-close d-md-none" onClick={onCollapse}>
                    <i class="bi bi-x"></i>
                  </Nav.Link>
                </div>
                <Nav className="flex-column pt-3 pt-md-0">
                  <button type="button" class="btn btn-lg" style={{ border: "transparent", backgroundColor: "transparent", color: "#ce0e0e", fontSize: "1.5rem" }}><i className="bi bi-server" /><span>&nbsp;&nbsp;deltaDB</span></button>
                  <Dropdown.Divider className="my-3 border-indigo" />

                    <button type="button" class="btn btn-lg" style={{ border: "transparent", backgroundColor: "transparent", color: "white" }}>
                    <Link style={{ textDecoration: 'none' }} to={`/table/${props.status.params && props.status.params.schema ? props.status.params.schema : "season"}`} onClick={() => props.actions.setParams({ view: "table" })}><i className="bi bi-table" /><span>&nbsp;&nbsp;Tables</span></Link>
                    </button>
                  <button type="button" class="btn btn-lg" style={{ border: "transparent", backgroundColor: "transparent", color: "white" }}><i className="bi bi-cursor" />
                  <Link style={{ textDecoration: 'none' }} to={`/explorer/${props.status.params && props.status.params.schema ? props.status.params.schema : "season"}`} onClick={() => props.actions.setParams({ view: "explorer" })}><span>&nbsp;&nbsp;Explorer</span></Link>
                  </button>
                  <Dropdown.Divider className="my-3 border-indigo" />
                  <button type="button" class="btn btn-lg" style={{ border: "transparent", backgroundColor: "transparent", color: "white" }}><i class="bi bi-gear" /><span>&nbsp;&nbsp;Settings</span></button>
                </Nav>
              </div>
            </SimpleBar>
          </CSSTransition>
        </>
      )}
    </>
  );
};
