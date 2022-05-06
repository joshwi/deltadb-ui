/*eslint-disable*/
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "reactstrap"
import Table from "../components/view/card"
import { get } from "../utility/REST"

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

    const { category, node, label } = useParams()

    const db = useSelector(state => state.db)
    const params = useSelector(state => state.params);
    const page = useSelector(state => state.pages[`record_${category}_${node}_${label}`]);
    const [visible, SetVisible] = useState({ "filters": false, "headers": false, "options": false })
    const [pageSize, setPageSize] = useState(25)
    const [search, SetSearch] = useState(false)

    const closeBtn = <button className="close" style={{ border: 0, backgroundColor: "transparent" }} onClick={() => SetVisible({ ...visible, headers: false })}><i class="bi bi-x" style={{ fontSize: "2rem", color: "white" }} /></button>;

    useEffect(() => {
        if (category && node && label) {
            props.actions.setParams({ category: category, node: node, label: label })
        }
    }, [category, node, label])

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
                props.actions.setPage(`record_${category}_${node}_${label}`, { headers: temp })
                SetSearch(!search)
            }
        }
    }, [db.keys, params])

    useEffect(() => {
            let url = new URL(`${window.location.origin}/api/v2/node/${category}_${node}/${label}`)
            if (!page) {
                get(url).then(result => {
                    if (result.length > 0) {
                        props.actions.setPage(`record_${category}_${node}_${label}`, { data: result })
                    }
                })
            }
    }, [search])

    return (
        <>
            <Container fluid={true}>
                <Row>
                <Col sm={1}/>
                    <Col>
                    {page && page.data && page.data.length > 0 && page.data[0].logo &&  <div className="d-flex justify-content-center" style={{  borderRadius: "10px", backgroundColor: `${page.data[0].primary_color}`}}><img src={page.data[0].logo} style={{display: "block"}} width="200" height="190"/></div>}
                    </Col>
                    <Col sm={1}/>
                </Row>
                <span style={{padding: "10px"}}/>
                <Row>
                <Col sm={1}/>
                <Col>
                {page && page.data && page.data.length > 0 && <Table rows={pageSize} headers={page.headers} options={{ header: false, filter: false, footer: false }} data={page.data ? page.data : []} {...props} />}
                </Col>
                <Col sm={1}/>
                </Row>
            </Container>
        </>
    )
}

export default TablePage