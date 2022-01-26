import React from "react"
import { Container, Row, Col } from 'reactstrap';

function Home() {

    return (
        <div style={{ marginTop: "2rem" }}>
            <Container fluid className="table" id="primaryColor">
                <Row>
                    <Col className="centerDiv"><i className="bi bi-table" id="secondaryColorText" style={{fontSize: "5rem"}} /></Col>
                    <Col className="centerDiv">
                        <p>
                        - Browse different datasets and filter your search based on fields<br/>
                        - Customize which headers are displayed in the table<br/>
                        - Export data from tables into .csv format
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col className="centerDiv"><i className="bi bi-cursor" id="secondaryColorText" style={{fontSize: "5rem"}} /></Col>
                    <Col className="centerDiv">
                        <p>
                        - Graph relationships between nodes in a dataset<br/>
                        - Enables users to correlate different datasets<br/>
                        - Export graph into .png format
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col className="centerDiv"><i className="bi bi-bar-chart" id="secondaryColorText" style={{fontSize: "5rem"}} /></Col>
                    <Col className="centerDiv">
                        <p>
                        - Compare two fields in a dataset on an XY chart<br/>
                        - Export map into .png format
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col className="centerDiv"><i className="bi bi-map" id="secondaryColorText" style={{fontSize: "5rem"}} /></Col>
                    <Col className="centerDiv">
                        <p>
                        - Plot geographic data onto a world map<br/>
                        - Export map into .png format
                        </p>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Home