import React, { useEffect, useState } from "react"
import { Container, Row, Col } from "reactstrap"
// import SearchBar from "../components/controller/search"
import D3 from "../components/view/explorer"
import {POST} from "../utility/REST"

function Explorer(props) {

    const [records, SetRecords] = useState({})
    
    var data = {"cypher": "MATCH p=(a:nfl_teams)-[r:played_in]->(b:nfl_games) WHERE b.week=~'[^\\d]+' AND b.year='2020' RETURN collect(DISTINCT a) as source, collect(DISTINCT b) as target, collect(DISTINCT {source: a.label, target: b.label}) as link"}

    useEffect(() => {
       POST("/api/v2/admin/db/cypher/quick", data).then(response => {
           if(response.records.length > 0){
               SetRecords(response.records[0])
            }})
    }, [])

    // useEffect(() => {
    //     console.log(records)
    // }, [records])

    return (
        <Container fluid={true} style={{ marginTop: "75px" }}>
            <Row>
                {/* <SearchBar node={node} schema={schema} {...props} /> */}
            </Row>
            <Row style={{ margin: "10px" }}>
                <Col className="centerDiv">
                    <Col><D3 records={records}/></Col>
                </Col>
            </Row>
        </Container>
    )
}

export default Explorer