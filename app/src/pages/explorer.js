/*eslint-disable*/
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom";
import Fuse from "fuse.js";
import { Container, Col, Label, Dropdown, DropdownToggle, DropdownItem, DropdownMenu, Input } from "reactstrap"
// import Draggable from "react-draggable"
// import _ from "underscore"

// import SearchBar from "../components/controller/search"
import D3 from "../components/view/explorer"

import { POST } from "../utility/REST"

function Explorer(props) {

    const { category, source, target } = useParams()

    const db = useSelector(state => state.db)
    // const params = useSelector(state => state.params);
    // const page = useSelector(state => state.pages[`explorer_${params.category}_${params.source}_${params.target}`]);

    useEffect(() => {
        if (category && source && target) {
            props.actions.setParams({ category: category, source: source, target: target })
        }
    }, [category, source, target])

    // const [summary, SetSummary] = useState({})
    const [search, SetSearch] = useState(false)
    const [validation, SetValidation] = useState([])
    const [properties, SetProperties] = useState([])
    const [results, SetResults] = useState([])
    const [records, SetRecords] = useState({})
    const [query, SetQuery] = useState('b.year="2020" AND b.week="[^\\d]+"')
    const [visible, SetVisible] = useState({ "source": false, "target": false })

    useEffect(() => {
        if (db.keys[`${category}_${source}`] && db.keys[`${category}_${target}`] && db.keys[`${category}_${source}`].keys && db.keys[`${category}_${target}`].keys) {
            let source_regex = `(\(|)a\.(${db.keys[`${category}_${source}`].keys.join("|")})=\"([^\"]{0,30})\"(\)|)`
            let target_regex = `(\(|)b\.(${db.keys[`${category}_${target}`].keys.join("|")})=\"([^\"]{0,30})\"(\)|)`
            let list = [
                ...db.keys[`${category}_${source}`].keys.map(entry => { return `a.${entry}` }),
                ...db.keys[`${category}_${target}`].keys.map(entry => { return `b.${entry}` })
            ]
            SetProperties(list)
            let query_regex = new RegExp(`((\\sAND\\s|\\sOR\\s)${source_regex}|(\\sAND\\s|\\sOR\\s)${target_regex}|${source_regex}|${target_regex})+`, "gm");
            SetValidation([query_regex])
            SetSearch(!search)
        }
    }, [db.keys])

    useEffect(() => {
        if (query.length > 0 && validation.length > 0) {
            let check = validation.map(entry => { return query.search(entry) }).includes(-1)
            if (!check) {
                let cypher_query = query.replaceAll("\=", "=~")
                const data = { "cypher": `MATCH p=(a:${category}_${source})-[]->(b:${category}_${target}) WHERE ${cypher_query} RETURN collect(DISTINCT a) as source, collect(DISTINCT b) as target, collect(DISTINCT {source: a.label, target: b.label}) as link` }
                POST("/api/v2/admin/db/cypher/quick", data).then(response => {
                    if (response.records.length > 0) {
                        SetRecords(response.records[0])
                    }
                })
            }
        }
    }, [search])

    // useEffect(() => {
    //     if (props.db.keys.nfl_games && props.db.keys.nfl_games.primary && props.pages.explorer && props.pages.explorer.data) {
    //         let primary = props.db.keys.nfl_games.primary.map(entry => { return entry.replaceAll(" ", "_") })
    //         let result = _.pick(props.pages.explorer.data, primary)
    //         SetSummary(result)
    //     }
    // }, [props.db.keys.nfl_games, props.pages])

    // useEffect(() => {
    //     console.log(records)
    // }, [records])

    function check(query, properties) {

        var eoq = query.match(/(a|b)\.[\w]+$/)
        var test = eoq ? eoq.shift() : null

        if (test) {
            let options = { includeScore: true, findAllMatches: true, ignoreLocation: true }
            let fuse = new Fuse(properties, options)
            let result = fuse.search(test)
            SetResults(result)
        } else {
            SetResults([])
        }
    }

    const chooseTag = (tag) => { 
        SetQuery(query.replace(/(a|b)\.[\w]+$/, `${tag}="`)) 
        document.getElementById("search-bar").focus();
    }

    return (
        <Container fluid={true}>
            {/* <Row>
                <Draggable
                    axis="both"
                    handle=".handle"
                    defaultPosition={{ x: 100, y:0}}
                    position={null}
                    grid={[25, 25]}
                    scale={1}
                >
                <Container className="table handle" id="primaryColor" style={{position: "absolute", top: 5, left: 350, width: "300px" }}>
                    <tr><th>Key</th><th>Value</th></tr>
                    {Object.keys(summary).map(entry => {return <tr><td>{entry.replaceAll("_", " ")}</td><td>{summary[entry]}</td></tr>})}
                </Container>
                </Draggable>
            </Row> */}
            <div style={{ padding: "6px 12px", fontFamily: "monospace", zIndex: 1, position: "relative", top: 0, right: 0, margin: "12px", borderRadius: "4px" }}>
                <div className="centerDiv">
                    <span className="show-button">
                        <Dropdown isOpen={visible.source} toggle={() => SetVisible({ ...visible, source: !visible.source })}>
                            <DropdownToggle caret id="secondaryColor" style={{ border: "none" }}>Source</DropdownToggle>
                            <DropdownMenu>
                                {Object.values(db.keys).filter(x => x.category === category).sort().map((entry, index) => {
                                    return <DropdownItem key={index}>
                                        <Label style={{ marginLeft: "5px" }} onClick={() => props.actions.setParams({ source: entry.node })} check>
                                            <Input type="checkbox" defaultChecked={entry.node === source} onClick={() => props.actions.setParams({ source: entry.node })} />{' '}
                                            {entry.node}
                                        </Label>
                                    </DropdownItem>
                                })}
                            </DropdownMenu>
                        </Dropdown>
                        <span style={{ margin: "10px" }}></span>
                        <Dropdown isOpen={visible.target} toggle={() => SetVisible({ ...visible, target: !visible.target })}>
                            <DropdownToggle caret id="secondaryColor" style={{ border: "none" }}>Target</DropdownToggle>
                            <DropdownMenu>
                                {Object.values(db.keys).filter(x => x.category === category).sort().map((entry, index) => {
                                    return <DropdownItem key={index}>
                                        <Label style={{ marginLeft: "5px" }} onClick={() => props.actions.setParams({ target: entry.node })} check>
                                            <Input type="checkbox" defaultChecked={entry.node === target} onClick={() => props.actions.setParams({ target: entry.node })} />{' '}
                                            {entry.node}
                                        </Label>
                                    </DropdownItem>
                                })}
                            </DropdownMenu>
                        </Dropdown>
                    </span>
                </div>
                <span style={{ margin: "10px" }}></span>
                <div className="centerDiv">
                    <Input className="primaryColor" id="search-bar" placeholder={"search"} value={query} style={{ border: "none", width: "70%", display: "inline-flex" }} onChange={(e) => SetQuery(e.target.value)} onKeyUp={() => check(query, properties)} />
                    {results && results.length > 0 && (
                        <div className="dropdown-menu" id="primaryColor" style={{ display: "inline-flex", margin: "10px", width: "100%", overflowX: "scroll" }}>
                            {results.map((entry, index) => { return <a className="dropdown-item" id="primaryColor" onClick={() => {chooseTag(entry.item)}} key={index}>{entry.item ? entry.item : ""}</a> })}
                        </div>
                    )}
                    <span style={{ margin: "10px" }}></span>
                    <button type="button" className="btn" id="secondaryColor" style={{ border: "none" }} onClick={() => SetSearch(!search)}><i className="bi bi-search" style={{ color: "white" }} /></button>
                    <span className="hide-button">
                        <span style={{ margin: "10px" }}></span>
                        <Dropdown isOpen={visible.source} toggle={() => SetVisible({ ...visible, source: !visible.source })}>
                            <DropdownToggle caret id="secondaryColor" style={{ border: "none" }}>Source</DropdownToggle>
                            <DropdownMenu>
                                {Object.values(db.keys).filter(x => x.category === category).sort().map((entry, index) => {
                                    return <DropdownItem key={index}>
                                        <Label style={{ marginLeft: "5px" }} onClick={() => props.actions.setParams({ source: entry.node })} check>
                                            <Input type="checkbox" defaultChecked={entry.node === source} onClick={() => props.actions.setParams({ source: entry.node })} />{' '}
                                            {entry.node}
                                        </Label>
                                    </DropdownItem>
                                })}
                            </DropdownMenu>
                        </Dropdown>
                        <span style={{ margin: "10px" }}></span>
                        <Dropdown isOpen={visible.target} toggle={() => SetVisible({ ...visible, target: !visible.target })}>
                            <DropdownToggle caret id="secondaryColor" style={{ border: "none" }}>Target</DropdownToggle>
                            <DropdownMenu>
                                {Object.values(db.keys).filter(x => x.category === category).sort().map((entry, index) => {
                                    return <DropdownItem key={index}>
                                        <Label style={{ marginLeft: "5px" }} onClick={() => props.actions.setParams({ target: entry.node })} check>
                                            <Input type="checkbox" defaultChecked={entry.node === target} onClick={() => props.actions.setParams({ target: entry.node })} />{' '}
                                            {entry.node}
                                        </Label>
                                    </DropdownItem>
                                })}
                            </DropdownMenu>
                        </Dropdown>
                    </span>
                </div>
            </div>
            <D3 records={records} {...props} />
        </Container >
    )
}

export default Explorer