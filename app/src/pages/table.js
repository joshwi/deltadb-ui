/*eslint-disable*/
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom";
import { Container, Row, Col, Label, Dropdown, DropdownToggle, DropdownItem, DropdownMenu, Input, Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap"
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

    const closeBtn = <button className="close" style={{ border: 0, backgroundColor: "transparent" }} onClick={() => SetVisible({ ...visible, headers: false })}><i class="bi bi-x" style={{ fontSize: "2rem", color: "white" }} /></button>;

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
        <>
            <Container fluid={true}>
                <div style={{ padding: "6px 12px", fontFamily: "monospace", zIndex: 1, position: "relative", top: 0, right: 0, margin: "12px", borderRadius: "4px" }}>
                    <span style={{ margin: "10px" }} />
                    <div className="centerDiv">
                        <FilterBar {...props} />
                        <span style={{ margin: "10px" }} />
                        <Dropdown isOpen={visible.options} direction="left" toggle={() => { }}>
                            <DropdownToggle caret id="secondaryColor" style={{ border: "none" }} onClick={() => SetVisible({ ...visible, options: !visible.options })}><i class="bi bi-list" style={{ color: "white" }} /></DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem header>Columns</DropdownItem>
                                <DropdownItem key={1}>
                                <button type="button" className="btn" id="secondaryColor" style={{ border: "none" }} onClick={() => SetVisible({...visible, headers: !visible.headers})}><i className="bi bi-layout-three-columns" style={{ color: "white" }} /></button>
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
                {page && page.data && page.data.length > 0 && <Table rows={pageSize} headers={page.headers} data={page.data ? page.data : []} {...props} />}
            </Container>
            <Modal size="xl" isOpen={visible.headers}>
                <ModalHeader close={closeBtn} id="primaryColor" style={{ border: "none" }}><span id="primaryColor">Headers</span></ModalHeader>
                <ModalBody id="primaryColor">
                    <Row>
                        {page && page.headers && page.headers.map((entry) => {
                            return (
                                <Col xs="3">
                                    <Label style={{ marginLeft: "5px" }} onClick={() => props.actions.setPage(`table_${category}_${node}`, { headers: update(page.headers, entry.name) })} check>
                                        <Input type="checkbox" defaultChecked={entry.active} />{' '}
                                        {entry.header}
                                    </Label>
                                </Col>
                            )
                        })}
                    </Row>
                </ModalBody>
                <ModalFooter id="primaryColor" style={{ border: "none" }}></ModalFooter>
            </Modal>
        </>
    )
}

export default TablePage