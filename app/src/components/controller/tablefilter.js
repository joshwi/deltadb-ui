/*eslint-disable*/
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom";
import Fuse from "fuse.js";
import { Input } from "reactstrap"
import _ from "underscore"
import { get } from "../../utility/REST"

function ExplorerFilters(props) {

    const { category, node } = useParams()

    const db = useSelector(state => state.db)
    const params = useSelector(state => state.params);
    const page = useSelector(state => state.pages[`explorer`]);

    useEffect(() => {
        if (category && node) {
            props.actions.setParams({ category: category, node: node })
        }
    }, [category, node])

    const [search, SetSearch] = useState(false)
    const [validation, SetValidation] = useState([])
    const [properties, SetProperties] = useState([])
    const [results, SetResults] = useState([])
    const [query, SetQuery] = useState('n.year="20.*" AND n.week="[^\\d]+" AND (n.home_team=".*Chiefs" OR n.away_team=".*Chiefs")')

    useEffect(() => {
        if (db.keys[`${category}_${node}`] && db.keys[`${category}_${node}`].keys) {
            let source_regex = `(\(|)n\.(${db.keys[`${category}_${node}`].keys.join("|")})=\"([^\"]{0,30})\"(\)|)`
            let list = db.keys[`${category}_${node}`].keys.map(entry => { return `n.${entry}` })
            SetProperties(list)
            let query_regex = new RegExp(`((\\sAND\\s|\\sOR\\s)${source_regex}|${source_regex})+`, "gm");
            SetValidation([query_regex])
            SetSearch(!search)
        }
    }, [db.keys])

    useEffect(() => {
        if (query.length > 0 && validation.length > 0) {
            let check = validation.map(entry => { return query.search(entry) }).includes(-1)
            if (!check) {
                let cypher = query.replaceAll('\=\"', '=~"(?i)')

                let url = new URL(`${window.location.origin}/api/v2/admin/db/node/${category}_${node}`)
                let parameters = { filter: cypher }
                Object.keys(parameters).forEach(key => url.searchParams.append(key, parameters[key]))

                if (!page || page && cypher !== page.query) {
                    get(url).then(result => {
                        if (result.length > 0) {
                            props.actions.setPage(`table_${category}_${node}`, { query: cypher, data: result })
                        }
                    })
                }
            }
        }
    }, [search])

    function check(query, properties) {

        var eoq = query.match(/(n)\.([\w]+|)$/)
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
        SetQuery(query.replace(/(n)\.([\w]+|)$/, `${tag}="`))
        document.getElementById("search-bar").focus();
    }

    return (
        <>
            <Input className="primaryColor" id="search-bar" placeholder={"search"} value={query} style={{ border: "none", width: "70%", display: "inline-flex" }} onChange={(e) => SetQuery(e.target.value)} onKeyUp={() => check(query, properties)} />
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