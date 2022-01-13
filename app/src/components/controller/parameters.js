/*eslint-disable*/
import React, { useEffect, useState } from "react";
import { Row, Col, Label, InputGroup, InputGroupAddon, InputGroupText, Dropdown, DropdownToggle, DropdownItem, DropdownMenu, Input, Button, FormGroup } from "reactstrap"
import "../../static/css/main.css"

function Parameters(props) {


    return (
            <Row>
                <div style={{ padding: "20px"}} />
                <Col key={1} style={{ marginBottom: "10px" }}>
                    <InputGroup>
                        <InputGroupText style={{ backgroundColor: "#283448", color: "white" }}>Category</InputGroupText>
                        <Input style={{ backgroundColor: "#283448", color: "white" }} placeholder="nfl" onChange={(e) => console.log(e)} onKeyUp={(e) => console.log(e.key)} />
                    </InputGroup>
                </Col>
                <Col key={2} style={{ marginBottom: "10px" }}>
                    <InputGroup>
                        <InputGroupText style={{ backgroundColor: "#283448", color: "white" }}>Node</InputGroupText>
                        <Input style={{ backgroundColor: "#283448", color: "white" }} placeholder="games" onChange={(e) => console.log(e)} onKeyUp={(e) => console.log(e.key)} />
                    </InputGroup>
                </Col>
            </Row>
    )
}

export default Parameters