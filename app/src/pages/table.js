/*eslint-disable*/
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom";
import { CSVLink } from 'react-csv';
import { Container, Label, Dropdown, DropdownToggle, DropdownItem, DropdownMenu, Input } from "reactstrap"
import Table from "../components/view/table"
import FilterBar from "../components/controller/tablefilter"

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
    const [pageSize, setPageSize] = useState(25)

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

    return (
        <Container fluid={true}>
            <div style={{ padding: "6px 12px", fontFamily: "monospace", zIndex: 1, position: "relative", top: 0, right: 0, margin: "12px", borderRadius: "4px" }}>
                <span style={{ margin: "10px" }} />
                <div className="centerDiv">
                    <FilterBar {...props} />
                    {/* <span style={{ margin: "10px" }} />
                    <CSVLink filename={'deltadb.csv'} data={page && page.csv ? page.csv : []} style={{ backgroundColor: "transparent" }}>
                        <button type="button" className="btn" id="secondaryColor" style={{ border: "none" }}><i className="bi bi-filetype-csv" style={{ color: "white" }} /></button>
                    </CSVLink> */}
                    <span style={{ margin: "10px" }} />
                    <Dropdown isOpen={visible.headers} toggle={() => SetVisible({ ...visible, headers: !visible.headers })}>
                        <DropdownToggle caret id="secondaryColor" style={{ border: "none" }}><i class="bi bi-layout-three-columns" /></DropdownToggle>
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
                    <Dropdown isOpen={visible.options} direction="left" toggle={() => { }}>
                        <DropdownToggle caret id="secondaryColor" style={{ border: "none" }} onClick={() => SetVisible({ ...visible, options: !visible.options })}><i class="bi bi-list" style={{ color: "white" }} /></DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem header>Rows</DropdownItem>
                            <DropdownItem key={1}>
                                <div className="btn-group">
                                    <button className="btn btn-default" onClick={() => setPageSize(10)} disabled={pageSize == 10}>10</button>
                                    <button className="btn btn-default" onClick={() => setPageSize(25)} disabled={pageSize == 25}>25</button>
                                    <button className="btn btn-default" onClick={() => setPageSize(100)} disabled={pageSize == 100}>100</button>
                                </div>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
            <span style={{ margin: "30px" }} />
            {page && page.data && page.data.length > 0 && <Table rows={pageSize} headers={page.headers} data={page.data ? page.data : []} {...props} />}
        </Container>
    )
}

export default TablePage