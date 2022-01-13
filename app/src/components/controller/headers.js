/*eslint-disable*/
import React, { useEffect, useState } from "react";
import { Label, Dropdown, DropdownToggle, DropdownItem, DropdownMenu, Input, Col } from "reactstrap"
import "../../static/css/main.css"

function HEADER(props) {
    
    const [node, SetNode] = useState("")
    const [visible, SetVisible] = useState(false)
    const [headers, SetHeaders] = useState([])

    function updateHeader(name) {
        let input = headers.map(entry => {
            if (entry.name === name) {
                return { ...entry, active: !entry.active }
            } else {
                return entry
            }
        })
        SetHeaders(input)
    }

    useEffect(() => {if(props.node) {SetNode(props.node)}}, [props.node])

    useEffect(() => {
        if (props.keys[node] !== undefined) {
            if (props.keys[node].headers.length === props.keys[node].keys.length) {
                let temp = props.keys[node].headers.map((entry, index) => {
                    if (props.keys[node].primary.indexOf(entry) > -1) {
                        return { header: entry, name: props.keys[node].keys[index], active: true }
                    } else {
                        return { header: entry, name: props.keys[node].keys[index], active: false }
                    }
                })
                SetHeaders(temp)
            }
        }
    }, [props.keys, node])

    useEffect(() => {
        if(headers && headers.length > 0 && props.schema){
            try{
                props.actions.updatePageState(props.status.params.view, props.schema, {headers: headers})
            }catch(err){console.log(err)}
        }
    }, [headers])

    return (
        <Col className="centerDiv">
        <Dropdown isOpen={visible} toggle={() => SetVisible(!visible)}>
        <DropdownToggle color="success" caret>Headers</DropdownToggle>
        <DropdownMenu>
            {headers.sort().map((entry) => {
                return <DropdownItem>
                    <Label style={{ marginLeft: "5px" }} onClick={() => updateHeader(entry.name)} check>
                        <Input type="checkbox" defaultChecked={entry.active} onClick={() => updateHeader(entry.name)} />{' '}
                        {entry.header}
                    </Label>
                </DropdownItem>
            })}
        </DropdownMenu>
    </Dropdown>
    </Col>
    )
}

export default HEADER