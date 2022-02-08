import React from "react"
import { Container, Row, Col, Input } from 'reactstrap';

function Home() {

    function copyToClipboard(id) {
        var copyText = document.getElementById(id);
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(copyText.value);
    }

    return (
        <div style={{ marginTop: "2rem" }}>
            <Container fluid className="table" id="primaryColor">
                <Row>
                    <Col className="centerDiv"><i className="bi bi-table" id="secondaryColorText" style={{ fontSize: "5rem" }} /></Col>
                    <Col>
                        <p>
                            - Browse different datasets and filter your search based on fields<br />
                        - Customize which headers are displayed in the table<br />
                        - Export data from tables into .csv format
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col className="centerDiv"><i className="bi bi-cursor" id="secondaryColorText" style={{ fontSize: "5rem" }} /></Col>
                    <Col>
                        <p>
                        - Graph relationships between nodes in a dataset<br />
                        - Enables users to correlate different datasets<br />
                        - Export graph into .png format
                        </p>
                        <div className="input-group mb-3">
                            <Input className="secondaryColor" id="explorer_1" type="text" class="form-control" value={`b.year="2020" AND b.week="[^\\d]+"`} aria-describedby="basic-addon2" disabled />
                            <span className="input-group-text primaryColor" id="basic-addon2"><button id="primaryColor" style={{ border: "none" }} onClick={() => { copyToClipboard("explorer_1") }}><i className="bi bi-clipboard" id="secondaryColorText" /></button></span>
                        </div>
                        <div className="input-group mb-3">
                            <Input className="secondaryColor" id="explorer_2" type="text" class="form-control" value={`b.week="SuperBowl"`} aria-describedby="basic-addon2" disabled />
                            <span className="input-group-text primaryColor" id="basic-addon2"><button id="primaryColor" style={{ border: "none" }} onClick={() => { copyToClipboard("explorer_2") }}><i className="bi bi-clipboard" id="secondaryColorText" /></button></span>
                        </div>
                        <div className="input-group mb-3">
                            <Input className="secondaryColor" id="explorer_3" type="text" class="form-control" value={`b.year="2013" AND b.home_team=".*Chiefs" AND b.home_rush_yds="1\\d\\d"`} aria-describedby="basic-addon2" disabled />
                            <span className="input-group-text primaryColor" id="basic-addon2"><button id="primaryColor" style={{ border: "none" }} onClick={() => { copyToClipboard("explorer_3") }}><i className="bi bi-clipboard" id="secondaryColorText" /></button></span>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col className="centerDiv"><i className="bi bi-bar-chart" id="secondaryColorText" style={{ fontSize: "5rem" }} /></Col>
                    <Col>
                        <p>
                            - Compare two fields in a dataset on an XY chart<br />
                        - Export map into .png format
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col className="centerDiv"><i className="bi bi-map" id="secondaryColorText" style={{ fontSize: "5rem" }} /></Col>
                    <Col>
                        <p>
                            - Plot geographic data onto a world map<br />
                        - Export map into .png format
                        </p>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Home