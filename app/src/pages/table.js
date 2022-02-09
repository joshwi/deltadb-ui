/*eslint-disable*/
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom";
import { CSVLink } from 'react-csv';
import Table from "../components/view/table"
import { get } from "../utility/REST";
// import SearchBar from "../components/controller/search"
import FilterBar from "../components/controller/tablefilter"

import { Col, Label, Dropdown, DropdownToggle, DropdownItem, DropdownMenu, Input, FormGroup } from "reactstrap"
// import Parameters from "../components/controller/parameters"

function TablePage(props) {

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

    const { category, node } = useParams()

    const db = useSelector(state => state.db)
    const params = useSelector(state => state.params);
    const page = useSelector(state => state.pages[`table_${category}_${node}`]);
    const [visible, SetVisible] = useState({ "filters": false, "headers": false, "options": false })

    useEffect(() => {
        if (category && node) {
            props.actions.setParams({ category: category, node: node })
        }
    }, [category, node])

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
                props.actions.setPage(`table_${category}_${node}`, { headers: temp })
            }
        }
    }, [db.keys, params])

    // useEffect(() => {
    //     if (params.category && params.node && page && page.headers && page.headers.length > 0 && page.headers.length == page.filters.length) {

    //         let url = new URL(`${window.location.origin}/api/v2/admin/db/node/${params.category}_${params.node}`)

    //         let cypher = ``
    //         page.filters.filter(x => x.active === true).map((entry, index) => { index == 0 ? cypher += `n.${entry.name}=~\"(?i).*${entry.value}.*\"` : cypher += `AND n.${entry.name}=~\"(?i).*${entry.value}.*\"` })

    //         let parameters = { filter: cypher }
    //         Object.keys(parameters).forEach(key => url.searchParams.append(key, parameters[key]))

    //         if (cypher !== page.query && page.filters.length > 0) {
    //             get(url).then(result => {
    //                 if (result.length > 0) {
    //                     props.actions.setPage(`table_${params.category}_${params.node}`, { headers: page.headers, filters: page.filters, search: page.search, query: cypher, data: result })
    //                 }
    //             })
    //         }
    //     }
    // }, [params, page, category, node])

    return (
        <div className="justify-content-md-center row">
            <div style={{ padding: "6px 12px", fontFamily: "monospace", zIndex: 1, position: "relative", top: 0, right: 0, margin: "12px", borderRadius: "4px" }}>
                <span style={{ margin: "10px" }} />
                <div className="centerDiv">
                    <FilterBar {...props} />
                    {/* <span style={{ margin: "10px" }} />
                    <Dropdown isOpen={visible.options} direction="left" toggle={() => { }}>
                        <DropdownToggle caret id="secondaryColor" style={{ border: "none" }} onClick={() => SetVisible({ ...visible, options: !visible.options })}><i class="bi bi-list" style={{ color: "white" }} /></DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem header>View</DropdownItem>
                            <DropdownItem key={1}>
                                <Label style={{ marginLeft: "5px" }} check>
                                    <Input type="checkbox" defaultChecked={visible.draggable} onClick={() => SetVisible({ ...visible, draggable: !visible.draggable })} />{' '}
                                    {"Headers"}
                                </Label>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown> */}
                    <span style={{ margin: "10px" }} />
                    <CSVLink filename={'deltadb.csv'} data={page && page.csv ? page.csv : []} style={{ backgroundColor: "transparent" }}>
                        <button type="button" className="btn" id="secondaryColor" style={{ border: "none" }}><i className="bi bi-filetype-csv" style={{ color: "white" }} /></button>
                    </CSVLink>
                    <span style={{ margin: "10px" }} />
                    <Dropdown isOpen={visible.headers} toggle={() => SetVisible({ ...visible, headers: !visible.headers })}>
                        <DropdownToggle caret id="secondaryColor" style={{ border: "none" }}><i class="bi bi-layout-three-columns"/></DropdownToggle>
                        <DropdownMenu children={true}>
                            {page && page.headers && page.headers.map((entry, index) => {
                                return <DropdownItem key={index}>
                                    <Label style={{ marginLeft: "5px" }} onClick={() => props.actions.setPage(`table_${category}_${node}`, { headers: update(page.headers, entry.name) })} check>
                                        <Input type="checkbox" defaultChecked={entry.active} onClick={() => props.actions.setPage(`table_${category}_${node}`, { headers: update(page.headers, entry.name) })} />{' '}
                                        {entry.header}
                                    </Label>
                                </DropdownItem>
                            })}
                        </DropdownMenu>
                    </Dropdown>
                    <span style={{ margin: "10px" }} />
                </div>
            </div>
            {/* <SearchBar {...props} /> */}
            <span style={{ margin: "30px" }} />
            {page && page.data && page.data.length > 0 && <Table headers={page.headers} data={page.data ? page.data : []} {...props} />}
        </div>
    )
}

export default TablePage