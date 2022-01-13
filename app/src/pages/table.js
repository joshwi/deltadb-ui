/*eslint-disable*/
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner } from "reactstrap"
import { useParams } from "react-router-dom";
import Table from "../components/view/table"
import { get } from "../utility/REST";
import SearchBar from "../components/controller/search"
import Parameters from "../components/controller/parameters"
import "../static/css/main.css"

function Component(props) {

    const { category, node } = useParams()

    const [nodename, SetNodeName] = useState("nfl_games")
    const [query, SetQuery] = useState("")

    const [filters, SetFilters] = useState([])
    const [headers, SetHeaders] = useState([])
    const [data, SetData] = useState([])

    const [search, SetSearch] = useState(false)

    useEffect(() => { SetNodeName(`${category}_${node}`) }, [category, node])

    useEffect(() => {
        if (props.status && props.status.params && props.status.pages) {
            try {
                SetHeaders(props.status.pages[`table_${nodename}`].headers ? props.status.pages[`table_${nodename}`].headers : [])
                SetFilters(props.status.pages[`table_${nodename}`].filters ? props.status.pages[`table_${nodename}`].filters : [])
                SetSearch(props.status.pages[`table_${nodename}`].search ? props.status.pages[`table_${nodename}`].search : !search)
                SetData(props.status.pages[`table_${nodename}`].data ? props.status.pages[`table_${nodename}`].data : [])
            } catch (err) { console.log(err) }
            // SetNodeName(nodename)
        }
    }, [props.status.params, props.status.pages, nodename])

    useEffect(() => {
        if (nodename.length > 0) {
            let url = new URL(`${window.location.origin}/api/v2/admin/db/node/${nodename}`)

            let cypher = ``
            filters.filter(x => x.active === true).map((entry, index) => {
                if (index === 0) {
                    cypher += `n.${entry.name}=~\"(?i)${entry.value}.*\"`
                } else {
                    cypher += `AND n.${entry.name}=~\"(?i)${entry.value}.*\"`
                }
            })
            SetQuery(cypher)

            let params = { filter: cypher }
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

            // let testing = new URLSearchParams(params)
            // console.log(`/api/v2/admin/db/node/${node}` + testing.toString())

            if (filters.length > 0 && cypher !== props.status.pages[`table_${nodename}`].query) {
                // get(`/api/v2/admin/db/node/${node}` + testing.toString()).then(result => SetData(result))
                get(url).then(result => SetData(result))
            }
        }
    }, [nodename, search])

    useEffect(() => {
        if (data.length > 0) {
            props.actions.updatePage(`table_${nodename}`, { headers: headers, filters: filters, search: search, query: query, data: data })
        }
    }, [data])

    return (
        <div style={{ marginTop: "1rem" }}>
            <Parameters />
            <span style={{ margin: "2rem" }} />
            <Row>
                <SearchBar node={nodename} schema={nodename} {...props} />
            </Row>
            <span style={{ margin: "2rem" }} />
            <Row>
                <Col className="centerDiv">
                    {data.length > 0 && <Table headers={headers} data={data} {...props} />}
                </Col>
            </Row>
        </div>
    )
}

export default Component