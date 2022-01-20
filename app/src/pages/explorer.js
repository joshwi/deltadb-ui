import React, { useEffect, useState } from "react"
import { Container, Row, Col } from "reactstrap"
// import SearchBar from "../components/controller/search"
// import _ from "underscore"
import D3 from "../components/view/explorer"
// import Draggable from "react-draggable"
import { POST } from "../utility/REST"

function Explorer(props) {

    const [records, SetRecords] = useState({})
    // const [summary, SetSummary] = useState({})

    useEffect(() => {
        const data = { "cypher": "MATCH p=(a:nfl_teams)-[r:played_in]->(b:nfl_games) WHERE b.week=~'[^\\d]+' AND b.year='2020' RETURN collect(DISTINCT a) as source, collect(DISTINCT b) as target, collect(DISTINCT {source: a.label, target: b.label}) as link" }
        POST("/api/v2/admin/db/cypher/quick", data).then(response => {
            if (response.records.length > 0) {
                SetRecords(response.records[0])
            }
        })
    }, [])

    // useEffect(() => {
    //     if(props.db.keys.nfl_games && props.db.keys.nfl_games.primary && props.pages.explorer && props.pages.explorer.data){
    //     let primary = props.db.keys.nfl_games.primary.map(entry => {return entry.replaceAll(" ", "_")})
    //     let result = _.pick(props.pages.explorer.data, primary)
    //     SetSummary(result)
    //     }
    // }, [ props.db.keys.nfl_games, props.pages])

    // useEffect(() => {
    //     console.log(records)
    // }, [records])

    return (
        <Container fluid={true} style={{ marginTop: "75px" }}>
            <Row>
                {/* <Draggable
                    axis="both"
                    handle=".handle"
                    defaultPosition={{ x: 100, y:0}}
                    position={null}
                    grid={[25, 25]}
                    scale={1}
                >
                <Container className="table handle" style={{position: "absolute", top: 5, left: 350, width: "300px", color: "white", backgroundColor: "#283448" }}>
                    <tr><th>Key</th><th>Value</th></tr>
                    {Object.keys(summary).map(entry => {return <tr><td>{entry.replaceAll("_", " ")}</td><td>{summary[entry]}</td></tr>})}
                </Container>
                </Draggable> */}
            </Row>
            <Row style={{ margin: "10px" }}>
                <Col className="centerDiv">
                    <Col><D3 records={records} {...props} /></Col>
                </Col>
            </Row>
        </Container>
    )
}

export default Explorer