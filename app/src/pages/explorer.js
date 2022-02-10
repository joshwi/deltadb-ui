/*eslint-disable*/
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom";
import { Container, Label, Dropdown, DropdownToggle, DropdownItem, DropdownMenu, Input } from "reactstrap"
import Draggable from "react-draggable"
import _ from "underscore"

import Filters from "../components/controller/filters"
import D3 from "../components/view/explorer"

function Explorer(props) {

    const { category, source, target } = useParams()

    const db = useSelector(state => state.db)
    const params = useSelector(state => state.params);
    const page = useSelector(state => state.pages[`explorer`]);

    useEffect(() => {
        if (category && source && target) {
            props.actions.setParams({ category: category, source: source, target: target })
        }
    }, [category, source, target])

    const [summary, SetSummary] = useState({})
    const [visible, SetVisible] = useState({ "source": false, "target": false, "options": false, "draggable": true })


    useEffect(() => {
        if (page && page.key && page.summary && db.keys[page.key] && db.keys[page.key].primary) {
            let primary = db.keys[page.key].primary.map(entry => { return entry.replaceAll(" ", "_") })
            let result = _.pick(page.summary, primary)
            SetSummary(result)
        }
    }, [page])

    return (
        <Container fluid={true}>
            {visible.draggable && Object.keys(summary) && Object.keys(summary).length > 0 && (
                <Draggable
                    axis="both"
                    handle=".handle"
                    defaultPosition={{ x: 0, y: 0 }}
                    position={null}
                    grid={[5, 5]}
                    scale={1}
                >
                    <Container className="table handle draggable" id="primaryColor" style={{ position: "absolute", bottom: 0, right: 40, width: "300px", zIndex: 5, overflowX: "scroll", border: "none" }}>
                        <tr><th>Key</th><th>Value</th><th style={{ position: "absolute", right: 0 }}><i className="bi bi-x" onClick={() => SetVisible({ ...visible, draggable: false })} /></th></tr>
                        {Object.keys(summary).map((entry, index) => { return <tr key={index}><td>{entry.replaceAll("_", " ")}</td><td>{summary[entry]}</td></tr> })}
                        <span style={{ margin: "10px" }} />
                    </Container>
                </Draggable>
            )}
            <div style={{ padding: "6px 12px", fontFamily: "monospace", zIndex: 1, position: "relative", top: 0, right: 0, margin: "12px", borderRadius: "4px" }}>
                <span style={{ margin: "10px" }}></span>
                <div className="centerDiv">
                    <Filters {...props} />
                    <span style={{ margin: "10px" }}></span>
                    <Dropdown isOpen={visible.options} direction="left" toggle={() => { }}>
                        <DropdownToggle caret id="secondaryColor" style={{ border: "none" }} onClick={() => SetVisible({ ...visible, options: !visible.options })}><i class="bi bi-list" style={{ color: "white" }} /></DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem header>View</DropdownItem>
                            <DropdownItem key={1}>
                                <Label style={{ marginLeft: "5px" }} check>
                                    <Input type="checkbox" defaultChecked={visible.draggable} onClick={() => SetVisible({ ...visible, draggable: !visible.draggable })} />{' '}
                                    {"Table"}
                                </Label>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
            <D3 records={page && page.data ? page.data : {}} {...props} />
        </Container >
    )
}

export default Explorer