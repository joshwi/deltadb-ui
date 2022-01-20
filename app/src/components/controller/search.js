/*eslint-disable*/
import React, { useEffect, useState } from "react";
import {useSelector} from "react-redux"
import { Col, Label, Dropdown, DropdownToggle, DropdownItem, DropdownMenu, Input, FormGroup } from "reactstrap"
import * as actions from "../../store/actions"
import "../../static/css/main.css"

function TableSearch(props) {

    const [visible, SetVisible] = useState({ "filters": false, "headers": false })

    const db = useSelector(state => state.db);
    const params = useSelector(state => state.params);
    const page = useSelector(state => state.pages[`table_${params.category}_${params.node}`]);

    const [name, SetName] = useState(`table_${params.category}_${params.node}`)
    const [filters, SetFilters] = useState([])
    const [search, SetSearch] = useState(false)

    useEffect(() => {
        if(params.view && params.category && params.node){
            SetName(`${params.view}_${params.category}_${params.node}`)
        }
    }, [params])

    function submit(key) {
        if (key === "Enter") {
            try {
                props.actions.setPage(name, { search: search })
            }
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

    useEffect(() => {
        if (db.filters && db.keys[`${params.category}_${params.node}`]) {
            if (db.keys[`${params.category}_${params.node}`].headers.length === db.keys[`${params.category}_${params.node}`].keys.length) {
                let temp = db.keys[`${params.category}_${params.node}`].headers.map((entry, index) => { return { header: entry, name: db.keys[`${params.category}_${params.node}`].keys[index], active: false, value: "" } })
                try {
                    db.filters.map((entry) => {
                        temp = temp.map(index => { return entry.name === index.name ? entry : index })
                    })
                } catch (err) { console.log(err) }
                props.actions.setPage(name, { filters: temp })
                SetFilters(temp)
            }
        }
    }, [db.filters, db.keys, params])

    useEffect(() => {
        if (db.keys[`${params.category}_${params.node}`] !== undefined) {
            if (db.keys[`${params.category}_${params.node}`].headers.length === db.keys[`${params.category}_${params.node}`].keys.length) {
                let temp = db.keys[`${params.category}_${params.node}`].headers.map((entry, index) => {
                    if (db.keys[`${params.category}_${params.node}`].primary.indexOf(entry) > -1) {
                        return { header: entry, name: db.keys[`${params.category}_${params.node}`].keys[index], active: true }
                    } else {
                        return { header: entry, name: db.keys[`${params.category}_${params.node}`].keys[index], active: false }
                    }
                })
                props.actions.setPage(name, { headers: temp })
            }
        }
    }, [db.keys, params])

    useEffect(() => {
        if (search && page.filters && page.filters.length > 0) {
            try {
                props.actions.setPage(name, { filters: page.filters })
            }
            catch (err) { console.log(err) }
            SetSearch(false)
        }
    }, [search])

    return (
        <>
            {filters && filters.filter(x => x.active === true).map((entry, index) => {
                if (index < 3) {
                    return <Col className="centerDiv" key={index} style={{ marginBottom: "10px" }}>
                        <FormGroup>
                            <Label style={{ color: "white" }}>{entry.header.toUpperCase()}</Label>
                            <Input style={{ backgroundColor: "#283448", color: "white" }} placeholder={entry.value} value={entry.value !== undefined ? entry.value : null} onChange={(e) => SetFilters(edit(filters, entry.name, e.target.value))} onKeyUp={(e) => submit(e.key)} />
                        </FormGroup>
                    </Col>
                }
                else { return <></> }
            })
            }
            {filters && (
                <Col className="centerDiv">
                    <button type="button" className="btn" style={{ border: "none", backgroundColor: "#ce0e0e" }} onClick={() => SetSearch(!search)}><i className="bi bi-search" style={{ color: "white" }} /></button>
                    <span style={{ margin: "10px" }}></span>
                    <Dropdown isOpen={visible.filters} toggle={() => SetVisible({ ...visible, filters: !visible.filters })}>
                        <DropdownToggle caret style={{ border: "none", backgroundColor: "#ce0e0e", color: "white" }}>Filters</DropdownToggle>
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
                    <Dropdown isOpen={visible.headers} toggle={() => SetVisible({ ...visible, headers: !visible.headers })}>
                        <DropdownToggle caret style={{ border: "none", backgroundColor: "#ce0e0e", color: "white" }}>Headers</DropdownToggle>
                        <DropdownMenu>
                            {page && page.headers && page.headers.sort().map((entry, index) => {
                                return <DropdownItem key={index}>
                                    <Label style={{ marginLeft: "5px" }} onClick={() => props.actions.setPage(name,update(page.headers, entry.name))} check>
                                        <Input type="checkbox" defaultChecked={entry.active} onClick={() => props.actions.setPage(name,update(page.headers, entry.name))} />{' '}
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

export default TableSearch