/*eslint-disable*/
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom";
import Fuse from "fuse.js";
import { Input } from "reactstrap"
import _ from "underscore"
import { POST } from "../../utility/REST"

function ExplorerFilters(props) {

    const { category, source, target, label } = useParams()

    const db = useSelector(state => state.db)
    const params = useSelector(state => state.params);
    const page = useSelector(state => state.pages[`explorer`]);

    useEffect(() => {
        if (category && source && target && label) {
            props.actions.setParams({ category: category, source: source, target: target, label: label })
        }
    }, [category, source, target])

    const [search, SetSearch] = useState(false)
    const [validation, SetValidation] = useState([])
    const [properties, SetProperties] = useState([])
    const [results, SetResults] = useState([])
    const [query, SetQuery] = useState(`b.week="[^\\d]+"`)

    useEffect(() => {
        if (db.keys[`${category}_${source}`] && db.keys[`${category}_${target}`] && db.keys[`${category}_${source}`].keys && db.keys[`${category}_${target}`].keys) {
            let source_regex = `(\(|)a\.(${db.keys[`${category}_${source}`].keys.join("|")})=\"([^\"]{0,30})\"(\)|)`
            let target_regex = `(\(|)b\.(${db.keys[`${category}_${target}`].keys.join("|")})=\"([^\"]{0,30})\"(\)|)`
            let list = [
                ...db.keys[`${category}_${source}`].keys.map(entry => { return `a.${entry}` }),
                ...db.keys[`${category}_${target}`].keys.map(entry => { return `b.${entry}` })
            ]
            SetProperties(list)
            let query_regex = new RegExp(`((\\sAND\\s|\\sOR\\s)${source_regex}|(\\sAND\\s|\\sOR\\s)${target_regex}|${source_regex}|${target_regex})+`, "gm");
            SetValidation([query_regex])
            SetSearch(!search)
        }
    }, [db.keys])

    useEffect(() => {
        if (query.length > 0 && validation.length > 0) {
            let check = validation.map(entry => { return query.search(entry) }).includes(-1)
            if (!check) {
                let MATCH_STATEMENT = query.replaceAll("\=", "=~")
                let cypher = `MATCH p=(a:${category}_${source})-[]->(b:${category}_${target}) WHERE a.label="${label}" AND ${MATCH_STATEMENT} RETURN collect(DISTINCT a) as source, collect(DISTINCT b) as target, collect(DISTINCT {source: a.label, target: b.label}) as link`
                if (!page || page && cypher != page.query) {
                    POST("/api/v2/admin/db/query", { "cypher": cypher }).then(response => {
                        if (response.records && response.records.length > 0) {
                            let input = response.records[0]
                            let temp_source = input.source ? input.source.map(entry => {return entry.properties}) : []
                            let temp_target = input.target ? input.target.map(entry => {return entry.properties}) : []
                            props.actions.setPage(`table_${category}_${source}_${target}`, { query: cypher, data: response.records[0], in_data: temp_source, out_data: temp_target })
                            // props.actions.setPage(`table_${category}_${source}_${target}`, { query: cypher, data: response.records[0] })
                        }
                    })
                }
            }
        }
    }, [search])

    function check(query, properties) {

        var eoq = query.match(/(a|b)\.([\w]+|)$/)
        var test = eoq ? eoq.shift() : null

        if (test) {
            let options = { includeScore: true, findAllMatches: true, ignoreLocation: true }
            let fuse = new Fuse(properties, options)
            let result = fuse.search(test)
            SetResults(result)
        } else {
            SetResults([])
        }
    }

    const chooseTag = (tag) => {
        SetQuery(query.replace(/(a|b)\.([\w]+|)$/, `${tag}="`))
        document.getElementById("search-bar").focus();
    }

    return (
        <>
            <Input className="primaryColor" id="search-bar" placeholder={"search"} value={query} style={{ border: "none", display: "inline-flex" }} onChange={(e) => SetQuery(e.target.value)} onKeyUp={() => check(query, properties)} />
            {results && results.length > 0 && (
                <div className="dropdown-menu" id="primaryColor" style={{ display: "inline-flex", margin: "10px", width: "100%", overflowX: "scroll" }}>
                    {results.map((entry, index) => { return <a className="dropdown-item" id="primaryColor" onClick={() => { chooseTag(entry.item) }} key={index}>{entry.item ? entry.item : ""}</a> })}
                </div>
            )}
            <span style={{ margin: "10px" }}></span>
            <button type="button" className="btn" id="secondaryColor" style={{ border: "none" }} onClick={() => SetSearch(!search)}><i className="bi bi-search" style={{ color: "white" }} /></button>
        </>
    )
}

export default ExplorerFilters