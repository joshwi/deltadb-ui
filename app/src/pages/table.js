/*eslint-disable*/
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner } from "reactstrap"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom";
import Table from "../components/view/table"
import { get } from "../utility/REST";
import SearchBar from "../components/controller/search"
// import Parameters from "../components/controller/parameters"
import "../static/css/main.css"

function TablePage(props) {

    const { category, node } = useParams()

    const params = useSelector(state => state.params);
    const page = useSelector(state => state.pages[`table_${params.category}_${params.node}`]);

    useEffect(() => {
        if(category && node){
            props.actions.setParams({category: category, node: node})
        }
    }, [category, node])

    useEffect(() => {
        if (params.category && params.node && page && page.headers && page.headers.length > 0 && page.headers.length == page.filters.length && !page.data) {
            let url = new URL(`${window.location.origin}/api/v2/admin/db/node/${params.category}_${params.node}`)

            let cypher = ``
            page.filters.filter(x => x.active === true).map((entry, index) => { index == 0 ? cypher += `n.${entry.name}=~\"(?i).*${entry.value}.*\"` : cypher += `AND n.${entry.name}=~\"(?i).*${entry.value}.*\"` })

            let parameters = { filter: cypher }
            Object.keys(parameters).forEach(key => url.searchParams.append(key, parameters[key]))

            if (cypher !== page.query) {
                get(url).then(result => {
                    if (result.length > 0) {
                        props.actions.setPage(`table_${params.category}_${params.node}`, { headers: page.headers, filters: page.filters, search: page.search, query: cypher, data: result })
                    }
                }
            )}
        }
    }, [params, page, category, node])

    return (
        <div style={{ marginTop: "1rem" }}>
            <Row>
                <SearchBar {...props} />
            </Row>
            <span style={{ margin: "2rem" }} />
            <Row>
                <Col className="centerDiv">
                    {page && page.data && page.data.length > 0 && <Table headers={page.headers} data={page.data ? page.data : []} {...props} />}
                </Col>
            </Row>
        </div>
    )
}

export default TablePage