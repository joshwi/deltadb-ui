/*eslint-disable*/
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom";
import { Container, Row, Col, Label, Dropdown, DropdownToggle, DropdownItem, DropdownMenu, Input, Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap"
import Table from "../components/view/table"
import Card from "../components/view/card"
import FilterBar from "../components/controller/correlation_filter"

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

    const { category, source, target, label } = useParams()

    const db = useSelector(state => state.db)
    const params = useSelector(state => state.params);
    const page = useSelector(state => state.pages[`table_${category}_${source}_${target}_${label}`]);
    const [visible, SetVisible] = useState({ "filters": false, "headers": false, "options": false })
    const [pageSize, setPageSize] = useState(25)

    const closeBtn = <button className="close" style={{ border: 0, backgroundColor: "transparent" }} onClick={() => SetVisible({ ...visible, headers: false })}><i class="bi bi-x" style={{ fontSize: "2rem", color: "white" }} /></button>;

    useEffect(() => {
        if (category && source && target && label) {
            props.actions.setParams({ category: category, source: source, target: target, label: label })
        }
    }, [category, source, target, label])

    useEffect(() => {
        if (db.keys[`${params.category}_${params.source}`] !== undefined) {
            if (db.keys[`${params.category}_${params.source}`].headers.length === db.keys[`${params.category}_${params.source}`].keys.length) {
                let temp = db.keys[`${params.category}_${params.source}`].headers.map((entry, index) => {
                    if (db.keys[`${params.category}_${params.source}`].primary.indexOf(entry) > -1) {
                        return { header: entry, name: db.keys[`${params.category}_${params.source}`].keys[index], active: true }
                    } else {
                        return { header: entry, name: db.keys[`${params.category}_${params.source}`].keys[index], active: false }
                    }
                })
                props.actions.setPage(`table_${category}_${source}_${target}_${label}`, { source_headers: temp })
            }
        }
        if (db.keys[`${params.category}_${params.target}`] !== undefined) {
            if (db.keys[`${params.category}_${params.target}`].headers.length === db.keys[`${params.category}_${params.target}`].keys.length) {
                let temp = db.keys[`${params.category}_${params.target}`].headers.map((entry, index) => {
                    if (db.keys[`${params.category}_${params.target}`].primary.indexOf(entry) > -1) {
                        return { header: entry, name: db.keys[`${params.category}_${params.target}`].keys[index], active: true }
                    } else {
                        return { header: entry, name: db.keys[`${params.category}_${params.target}`].keys[index], active: false }
                    }
                })
                props.actions.setPage(`table_${category}_${source}_${target}_${label}`, { headers: temp })
            }
        }
    }, [db.keys, params])

    return (
        <>
            <Container fluid={true}>
                <div style={{ fontFamily: "monospace", zIndex: 1, position: "relative", top: 0, right: 0, margin: "5px", borderRadius: "4px" }}>
                    <div className="centerDiv">
                        <FilterBar {...props} />
                        <span style={{ margin: "10px" }} />
                        <Dropdown isOpen={visible.options} direction="left" toggle={() => { }}>
                            <DropdownToggle caret id="secondaryColor" style={{ border: "none" }} onClick={() => SetVisible({ ...visible, options: !visible.options })}><i class="bi bi-list" style={{ color: "white" }} /></DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem header>Columns</DropdownItem>
                                <DropdownItem key={1}>
                                    <button type="button" className="btn" id="secondaryColor" style={{ border: "none" }} onClick={() => SetVisible({ ...visible, headers: !visible.headers })}><i className="bi bi-layout-three-columns" style={{ color: "white" }} /></button>
                                </DropdownItem>
                                <DropdownItem header>Rows</DropdownItem>
                                <DropdownItem key={2}>
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
                <Row className="computer-content">
                    <Col>
                    {page && page.in_data && page.in_data.length > 0 && page.in_data[0].logo &&  <div className="d-flex justify-content-center" style={{  borderRadius: "10px", backgroundColor: `${page.in_data[0].primary_color}`}}><img src={page.in_data[0].logo} style={{display: "block"}} width="200" height="190"/></div>}
                    </Col>
                    <span className="mobile-content" style={{margin: "10px"}}/>
                    <Col>
                    {page && page.in_data && page.in_data.length > 0 && <Card rows={pageSize} headers={page.source_headers} options={{ header: false, filter: false, footer: false }} data={page.in_data ? page.in_data : []} {...props} />}
                    </Col>
                </Row>
                {page && page.out_data && page.out_data.length > 0 && <Table rows={pageSize} headers={page.headers} data={page.out_data ? page.out_data : []} {...props} />}
            </Container>
            <Modal size="xl" isOpen={visible.headers}>
                <ModalHeader close={closeBtn} id="primaryColor" style={{ border: "none" }}><span id="primaryColor">Headers</span></ModalHeader>
                <ModalBody id="primaryColor">
                    <Row>
                        {page && page.headers && page.headers.map((entry) => {
                            return (
                                <Col xs="3" onClick={() => props.actions.setPage(`table_${category}_${source}_${target}_${label}`, { headers: update(page.headers, entry.name) })}>
                                    <Label style={{ marginLeft: "5px" }} check>
                                        <Input type="checkbox" defaultChecked={entry.active} />{' '}
                                        {entry.header}
                                    </Label>
                                </Col>
                            )
                        })}
                    </Row>
                </ModalBody>
                <ModalFooter id="primaryColor" style={{ border: "none" }}>
                    <button type="button" className="btn" id="secondaryColor" style={{ border: "none" }} onClick={() => {
                        props.actions.setPage(`table_${category}_${source}_${target}_${label}`, { headers: page.headers.map((entry) => { return { ...entry, active: false } }) })
                        SetVisible({ ...visible, headers: !visible.headers })
                    }}>{`Clear All `}<i className="bi bi-x" style={{ color: "white" }} /></button>
                    <button type="button" className="btn" id="secondaryColor" style={{ border: "none" }} onClick={() => {
                        props.actions.setPage(`table_${category}_${source}_${target}_${label}`, { headers: page.headers.map((entry) => { return { ...entry, active: true } }) })
                        SetVisible({ ...visible, headers: !visible.headers })
                    }}>{`Select All `}<i className="bi bi-check" style={{ color: "white" }} /></button>
                </ModalFooter>
            </Modal>
        </>
    )
}

export default TablePage