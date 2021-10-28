/*eslint-disable*/
import React, { useEffect, useState } from "react";
import { Col, Label, InputGroup, InputGroupAddon, InputGroupText, Dropdown, DropdownToggle, DropdownItem, DropdownMenu, Input, Button, FormGroup } from "reactstrap"
import "../../static/css/main.css"

function FILTER(props) {

    const [visible, SetVisible] = useState({"filters": false, "headers": false})

    const [node, SetNode] = useState("")
    const [filters, SetFilters] = useState([])
    const [headers, SetHeaders] = useState([])
    const [search, SetSearch] = useState(false)


    function submit(key) {
        if (key === "Enter") {
            try { props.actions.updatePageState(props.status.params.view, props.schema, { search: search }) }
            catch (err) { console.log(err) }
            SetSearch(true)
        }
    }

    function edit(dict, name, value) {
        let output = dict.map(entry => {
            if (entry.name == name) {
                return { ...entry, value: value }
            } else {
                return entry
            }
        })
        return output
    }

    function update(dict, name) {
        let output = dict.map(entry => {
            if (entry.name == name) {
                return { ...entry, active: !entry.active }
            } else {
                return entry
            }
        })
        return output
    }

    useEffect(() => { if (props.node) { SetNode(props.node) } }, [props.node])

    useEffect(() => {
        if (props.keys[node] && props.schema) {
            if (props.keys[node].allHeaders.length === props.keys[node].allKeys.length) {
                let temp = props.keys[node].allHeaders.map((entry, index) => { return { header: entry, name: props.keys[node].allKeys[index], active: false, value: "" } })
                try {
                    props.status.pages[props.status.params.view][props.schema].filters.map((entry) => {
                        temp = temp.map(index => { return entry.name === index.name ? entry : index })
                    })
                } catch (err) { console.log(err) }
                SetFilters(temp)
            }
        }
    }, [props.keys, props.schema, node])

    useEffect(() => {
        if (props.keys[node] !== undefined) {
            if (props.keys[node].allHeaders.length === props.keys[node].allKeys.length) {
                let temp = props.keys[node].allHeaders.map((entry, index) => {
                    if (props.keys[node].primaryHeaders.indexOf(entry) > -1) {
                        return { header: entry, name: props.keys[node].allKeys[index], active: true }
                    } else {
                        return { header: entry, name: props.keys[node].allKeys[index], active: false }
                    }
                })
                SetHeaders(temp)
            }
        }
    }, [props.keys, node])

    useEffect(() => {
        if (headers && headers.length > 0 && props.schema) {
            try {
                props.actions.updatePageState(props.status.params.view, props.schema, { headers: headers })
            } catch (err) { console.log(err) }
        }
    }, [headers])

    useEffect(() => {
        if (search && filters && filters.length > 0) {
            try { props.actions.updatePageState(props.status.params.view, props.schema, { filters: filters }) }
            catch (err) { console.log(err) }
            SetSearch(false)
        }
    }, [search])

    return (
        <>
        {/* <div className="centeredDiv"> */}
            {filters && filters.filter(x => x.active === true).map((entry, index) => {
                if (index < 3) {
                    return <Col className="centerDiv" key={index} style={{marginBottom: "10px"}}>
                        {/* <InputGroup> */}
                        {/* <InputGroupAddon addonType="prepend">
                                        <InputGroupText style={{fontSize: "11px"}}><strong>{entry.header}</strong></InputGroupText>
                                    </InputGroupAddon> */}
                        <FormGroup>
                            <Label style={{ color: "white" }}>{entry.header}</Label>
                            <Input style={{backgroundColor: "#283448", color: "white"}} placeholder={entry.value} value={entry.value !== undefined ? entry.value : null} onChange={(e) => SetFilters(edit(filters, entry.name, e.target.value))} onKeyUp={(e) => submit(e.key)} />
                        </FormGroup>
                        {/* </InputGroup> */}
                    </Col>
                }
                else { return <></> }
            })
            }
            {filters && (
                <Col className="centerDiv">
                    <button type="button" class="btn" style={{border: "none", backgroundColor: "#ce0e0e"}} onClick={() => SetSearch(!search)}><i className="bi bi-search" style={{ color: "white" }} /></button>
                    <span style={{ margin: "10px" }}></span>
                    <Dropdown isOpen={visible.filters} toggle={() => SetVisible({...visible, filters: !visible.filters})}>
                        <DropdownToggle caret style={{border: "none", backgroundColor: "#ce0e0e", color: "white"}}>Filters</DropdownToggle>
                        <DropdownMenu>
                            {filters.sort().map((entry, index) => {
                                return <DropdownItem key={index}>
                                    <Label style={{ marginLeft: "5px" }} onClick={() => SetFilters(update(filters, entry.name))} check>
                                        <Input type="checkbox" defaultChecked={entry.active} onClick={() => SetFilters(update(filters, entry.name))} />{' '}
                                        {entry.header}
                                    </Label>
                                </DropdownItem>
                            })}
                        </DropdownMenu>
                    </Dropdown>
                    <span style={{ margin: "10px" }}></span>
                    <Dropdown isOpen={visible.headers} toggle={() => SetVisible({...visible, headers: !visible.headers})}>
                        <DropdownToggle caret style={{border: "none", backgroundColor: "#ce0e0e", color: "white"}}>Headers</DropdownToggle>
                        <DropdownMenu>
                            {headers.sort().map((entry, index) => {
                                return <DropdownItem key={index}>
                                    <Label style={{ marginLeft: "5px" }} onClick={() => SetHeaders(update(headers, entry.name))} check>
                                        <Input type="checkbox" defaultChecked={entry.active} onClick={() => SetHeaders(update(headers, entry.name))} />{' '}
                                        {entry.header}
                                    </Label>
                                </DropdownItem>
                            })}
                        </DropdownMenu>
                    </Dropdown>
                </Col>
            )}
            {/* </div> */}
        </>
    )
}

export default FILTER