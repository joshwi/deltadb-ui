import React from "react"
import { Container, Row, Col } from "reactstrap"
// import SearchBar from "../components/controller/search"
import D3 from "../components/view/explorer"

function Explorer(props) {

    // let node = ""
    // let schema = ""

    return (
        <Container fluid={true} style={{ marginTop: "75px" }}>
            <Row>
                {/* <SearchBar node={node} schema={schema} {...props} /> */}
            </Row>
            <Row style={{ margin: "10px" }}>
                <Col className="centerDiv">
                    <Col><D3 /></Col>
                </Col>
            </Row>
        </Container>
    )
}

export default Explorer