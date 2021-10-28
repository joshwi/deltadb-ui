/*eslint-disable*/
import React, { useEffect, useState } from "react";
import { UncontrolledCollapse,Container, Row, Col, Button, InputGroup, InputGroupAddon, InputGroupText, Input } from "reactstrap";
import _ from "underscore"

function Forms(props) {

    let test = [
        {
            header: "Running",
            key: "run",
            subfields: [
                {
                    header: "Distance",
                    key: "distance",
                    value: "",
                    unit: "Mile"
                },
                {
                    header: "Time",
                    key: "time",
                    value: "",
                    unit: "Minutes"
                }
            ]
        },
        {
            header: "Upper Body",
            key: "upper",
            subfields: [
                {
                    header: "Bench Press",
                    key: "bench",
                    subfields: [
                        {
                            header: "Sets",
                            key: "sets",
                            value: ""
                        },
                        {
                            header: "Reps",
                            key: "reps",
                            value: ""
                        },
                        {
                            header: "Weight",
                            key: "weight",
                            value: ""
                        }
                    ]
                }
            ]
        }
    ]

    useEffect(() => {console.log(test)}, [test])

    function drawForm(input, index) {

        return input.map(entry => {
            if (entry.subfields) {
                return (
                    <>
                        <Row style={{ paddingTop: "5px", paddingBottom: "5px", marginLeft: `${50*index}px` }} id={`${entry.key}_toggle`}>{entry.header}</Row>
                        <UncontrolledCollapse toggler={`#${entry.key}_toggle`}>
                            {drawForm(entry.subfields, index + 1)}
                        </UncontrolledCollapse>

                    </>
                )
            } else {
                return (<Row style={{ paddingTop: "5px", paddingBottom: "5px", paddingLeft: "5px" }}>
                    <Col className="centerDiv">
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText style={{ fontSize: "10px" }}><strong>{entry.header}</strong></InputGroupText>
                            </InputGroupAddon>
                            <Input placeholder={entry.value} value={entry.value !== undefined ? entry.value : null} onChange={(e) => entry.value = e.target.value} />
                        </InputGroup>
                    </Col>
                </Row>)
            }
        })

    }

    return (
        <Container>
            {/* {
                categories.map(index => {
                    return (
                        <>
                            <h3 style={{ paddingTop: "5px", paddingBottom: "5px", color: "white" }}>{index}</h3>
                            {data.filter(x => x.category == index).map(entry => {
                                if (entry.type === "exercise") {
                                    return exerciseFields(entry)
                                } else {
                                    return standardField(entry)
                                }
                            })}
                        </>
                    )
                })
            } */}
            {drawForm(test, 0)}
            {/* <label htmlFor="firstName">First Name</label>
                <Field id="firstName" name="firstName" placeholder="Jane" />

                <label htmlFor="lastName">Last Name</label>
                <Field id="lastName" name="lastName" placeholder="Doe" />

                <label htmlFor="email">Email</label>
                <Field id="email"
                    name="email"
                    placeholder="jane@acme.com"
                    type="email"
                /> */}
            <Row style={{ paddingTop: "15px", paddingBottom: "15px" }}>
                <Col>
                    <Button type="save" color="success">Save</Button>
                    <span style={{ padding: "10px" }}></span>
                    <Button type="submit" color="success">Submit</Button>
                </Col>
            </Row>
        </Container>
    )
}

export default Forms