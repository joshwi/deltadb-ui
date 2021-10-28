/*eslint-disable*/
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner } from "reactstrap"
import { useParams } from "react-router-dom";
import Table from "../components/view/table"
import { get } from "../utility/REST";
import SearchBar from "../components/controller/search"
import "../static/css/main.css"

function Component(props) {

    const { schema } = useParams()

    const [node, SetNode] = useState("")
    const [query, SetQuery] = useState("")

    const [filters, SetFilters] = useState([])
    const [headers, SetHeaders] = useState([])
    const [data, SetData] = useState([])

    const [search, SetSearch] = useState(false)

    useEffect(() => {
        if (props.status && props.status.params && props.status.pages) {
            try {
                SetHeaders(props.status.pages[props.status.params.view][schema].headers ? props.status.pages[props.status.params.view][schema].headers : [])
                SetFilters(props.status.pages[props.status.params.view][schema].filters ? props.status.pages[props.status.params.view][schema].filters : [])
                SetSearch(props.status.pages[props.status.params.view][schema].search ? props.status.pages[props.status.params.view][schema].search : !search)
                SetData(props.status.pages[props.status.params.view][schema].data ? props.status.pages[props.status.params.view][schema].data : [])
            } catch (err) { console.log(err) }
            SetNode(schema)
        }
    }, [props.status.params, props.status.pages, schema])

    useEffect(() => {
        if (node.length > 0) {
            let url = new URL(`${window.location.origin}/api/v2/admin/db/node/${node}`)

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

            if (filters.length > 0 && cypher !== props.status.pages[props.status.params.view][schema].query) {
                // get(`/api/v2/admin/db/node/${node}` + testing.toString()).then(result => SetData(result))
                get(url).then(result => SetData(result))
            }
        }
    }, [node, search])

    useEffect(() => {
        if (data.length > 0) {
            props.actions.updatePageState(props.status.params.view, schema, { headers: headers, filters: filters, search: search, query: query, data: data })
        }
    }, [data])

    return (
        <div style={{marginTop: "2rem"}}>
            <Row>
                <SearchBar node={node} schema={schema} {...props} />
            </Row>
            <span style={{margin: "2rem"}}/>
            <Row>
                <Col className="centerDiv">
                    {data.length > 0 && <Table headers={headers} data={data} {...props} />}
                </Col>
            </Row>
        </div>
    )
}

export default Component