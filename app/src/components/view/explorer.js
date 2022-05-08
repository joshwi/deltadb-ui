/*eslint-disable*/
import React, { useEffect } from "react";
import * as d3 from "d3";
import plugins from "../../utility/D3/plugins"
import {useHistory} from "react-router-dom"

const config = {
    source: { label: "nfl_teams", view: "explorer", category: "nfl", node: "teams", type: "image", key: "logo", transform: "-25px" },
    target: { label: "nfl_games", view: "explorer", category: "nfl", node: "games", type: "circle", primary: "primary_color", secondary: "secondary_color", keys: ["year", "week"] }
}

function EXPLORER(props) {

    let nav = useHistory()

    const height = window.innerHeight;
    const width = window.innerWidth;

    useEffect(() => {
        if (props.records.source && props.records.target && props.records.link) {
            let nodes = [...props.records.source, ...props.records.target]
            let links = props.records.link
            nodes = nodes.map((entry, index) => { return { ...entry, id: index } })
            links = links.map((entry, index) => { return { ...entry, id: index } })
            GRAPH(nodes, links, props.records.source, props.records.target)
        }
    }, [props.records])

    // let base_svg = window.btoa('<svg xmlns="http://www.w3.org/2000/svg" width="248" height="235.355" viewBox="0 0 250 237.36"><g transform="matrix(1.3333 0 0 -1.3333 72.337 166.71)"><g transform="matrix(2.4002 0 0 2.4002 -53.276 -52.137)"><path d="m72.686 57.769c-10.438 6.5887-34.346 11.629-52.18 15.774l-20.505-22.04 17.601 0.377c-8.7641-14.16-6.9778-47.455 15.184-51.88-1.1407 2.1875-3.1219 6.2051-0.5539 11.179 1.8285 3.5379 11.996 22.988 11.996 22.988h2.4348c3.2957 0 4.3809-1.2395 2.9192-2.9863 8.7859 0.1121 14.18 3.4343 16.601 6.9843-1.8426 3.3719-7.7058 7.3418-10.083 8.9504h12.293c3.5254 0 4.3203-1.4765 3.4902-3.0843 5.7527 1.1304 8.6942 8.757 0.8027 13.738" fill="#a5acaf"/><path d="m71.282 57.097c-14.217 7.9742-49.42 13.289-49.42 13.289l-15.08-16.153h15.635c-11.544-15.253-8.9863-46.044 7.9898-52.444-1.2039 2.8633-1.814 6.1856 0.3559 10.414 2.4488 4.7676 6.3476 12.783 11.931 23.482h4.5571c3.782 0 4.991-1.5984 4.4773-2.8328 3.1106 0 8.7969 0.3055 12.923 5.3125-3.4375 4.8016-14.803 10.401-14.803 10.401h19.497c2.8652 0 4.2969-1.0187 3.9016-2.7445 4.98 2.4316 3.6851 8.1062-1.9653 11.276" fill="#fff"/><path transform="matrix(.75 0 0 -.75 0 73.54)" d="m27.822 7.207 1.832 2.3301-11.707 12.602 41.168 3.1484c-0.07547 0.14893-0.1534 0.30094-0.23047 0.45508h-27.648l2.1406 2.0195c-1.7484 2.46-3.2354 5.1181-4.4844 7.9004l23.119-4.7246c-0.1256 0.18493-0.25065 0.37113-0.37305 0.55859l-27.543 9.1797 2.4199 1.3711c-1.1364 3.7803-1.8742 7.6966-2.2285 11.613l23.402-14.203c-0.06933 0.21467-0.13575 0.4284-0.19922 0.64453l-25.809 20.363 2.3789 0.5957c0.13387 4.4167 0.75448 8.722 1.8301 12.717l21.008-24.766c0.03547 0.198 0.07452 0.3954 0.11719 0.5918l-20.807 30.533 1.957 0.13281c2.4115 5.4271 5.8386 9.8789 10.203 12.645-1.6848-3.7458-1.1475-8.2428 0.80664-12.248 1.6943-3.4661 23.754-47.393 23.754-47.393l-3.6855-1.9727h34.277c3.5104 0 5.4551 1.4723 5.416 3.4531 2.1693-1.8308 2.6544-7.3778-4.6816-11.402-15.941-8.7448-66.434-16.145-66.434-16.145zm59.457 15.457c1.752 0.58494 5.6948 2.7826 7.1875 4.5039h-2.832c-1.1172-1.8364-4.3555-4.5039-4.3555-4.5039zm8.7871 3.8477c3.0735 1.5683 3.4514 4.7051 3.041 5.875-0.27867-0.8552-1.6005-2.3418-4.7344-2.3418h-7.9004c0.07653-0.15307 0.1527-0.30224 0.22656-0.45117 1.5-0.12027 6.8066-0.57165 9.8066-1.1367zm-31.791 7.4863 0.47852 1.4199c-1.1312 2.2115-5.1843 10.243-6.5879 13.053h10.516c0.1432 1.862 1.9933 3.442 3.9141 3.8613-1.138-1.5199-0.68696-3.028 0.16211-3.8613h4.9668c1.3801 0 0.95378 1.6549-1.291 3.3789 3.5131-0.80213 6.1374-2.4008 7.8535-4.6836-3.2561-4.9719-20.012-13.168-20.012-13.168z"/><path transform="matrix(.75 0 0 -.75 0 73.54)" d="m32.014 13.662-3.3438 3.6211 54.637 7.5586c0.0984-0.19787 0.19764-0.39225 0.29297-0.58398-11.175-3.2547-33.184-7.7514-51.586-10.596zm18.367 14.758-14.836 0.33789c-0.7428 1.0177-1.432 2.0762-2.0742 3.1699l16.473-2.9434c0.14427-0.18907 0.29003-0.37845 0.4375-0.56445zm-5.2422 8.6934-16.205 5.8223c-0.36093 1.336-0.6653 2.6925-0.91797 4.0586l16.838-9.1953c0.0912-0.22813 0.18782-0.45741 0.28516-0.68555zm17.99 7.2832-1.209 2.3438h12.861c0.0964-0.19013 0.18845-0.37757 0.28125-0.5625zm-20.225 3.5117-15.666 13.316c0.10573 1.4765 0.27192 2.9356 0.49219 4.3652l15.201-16.957c-0.01133-0.24227-0.02214-0.48234-0.02734-0.72461zm2.7695 10.547-13.672 20.617c0.7172 1.3593 1.51 2.6302 2.373 3.7969l11.619-23.822c-0.10933-0.19627-0.21618-0.39393-0.32031-0.5918z" fill="#a71930"/></g></g></svg>')

    const buildNode = (config, nodes, functions) => {
        if (config.type && config.type == "image") {
            return d3.select('svg g')
                .selectAll("images")
                .data(nodes.filter(x => x.labels && x.labels.includes(config.label)))
                .join("svg:image")
                .attr("xlink:href", function (node) { if (node.properties && node.properties[config.key]) { return node.properties[config.key] } else { return "" } })
                // .attr("href", 'data:image/svg+xml;base64,' + base_svg)
                .attr("width", 50)
                .attr("height", 50)
                .style("transform", "translate(-25px, -25px)")
                .on('mouseover', functions.mouseOver)
                .on('click', function (d, i) {
                    if(i.properties && i.properties.label){
                        nav.push(`/table/nfl/teams/games/${i.properties.label}`)
                        // props.actions.setPage("explorer_nfl_teams_games_kan", { query:  })
                    }
                })
                .call(plugins.drag(functions.simulation));
        } else {
            return d3.select('svg g')
                .selectAll("circle")
                .data(nodes.filter(x => x.labels && x.labels.includes(config.label)))
                .join(config.type)
                .attr("r", 20)
                .attr("stroke-width", 2)
                .attr("stroke", function (node) {
                    if (node.properties[config.secondary]) { return node.properties[config.secondary] } else { return "#000000" }
                })
                .attr("fill", function (node) {
                    if (node.properties[config.primary]) { return node.properties[config.primary] } else { return "#333333" }
                })
                .on('mouseover', functions.mouseOver)
                .call(plugins.drag(functions.simulation));
        }
    }

    const buildLabel = (config, nodes, functions) => {
        return d3.select('svg g')
            .attr("class", "texts")
            .selectAll("text")
            .data([
            ...nodes.filter(x => config.target.type !== "image" && x.labels && x.labels.includes(config.target.label)),
            ...nodes.filter(x => config.source.type !== "image" && x.labels && x.labels.includes(config.source.label))
            ])
            .enter().append("text")
            .text(function (node) {
                if(config.source.keys && config.source.keys.length > 0 && node.labels.includes(config.source.label)){
                    return config.source.keys.map((entry) => { return node.properties[entry] ? node.properties[entry] : "" }).join(' ')
                }
                else if(config.target.keys && config.target.keys.length > 0 && node.labels.includes(config.target.label)){
                    return config.target.keys.map((entry) => { return node.properties[entry] ? node.properties[entry] : "" }).join(' ')                    
                }else {
                    return `${node.properties.label}`
                }
            })
            .attr("font-size", 12)
            .attr("stroke", "white")
            .attr("dx", 0)
            .attr("dy", 0)
            .call(plugins.drag(functions.simulation));
    }

    const GRAPH = (nodes, links) => {

        // Runs each iteration of force algorithm, updating positions of nodes
        function ticked() {
            target.attr('x', function (d) { return d.x }).attr('y', function (d) { return d.y }).attr("cx", d => d.x).attr("cy", d => d.y);
            source.attr('x', function (d) { return d.x }).attr('y', function (d) { return d.y }).attr("cx", d => d.x).attr("cy", d => d.y);
            link.attr("x1", d => d.source.x).attr("y1", d => d.source.y).attr("x2", d => d.target.x).attr("y2", d => d.target.y);
            labels.attr('x', function (d) { return d.x }).attr('y', function (d) { return d.y });
        };

        function mouseOver(d, i) {
            d3.select(this.parentNode)
                .append("text")
                .attr("dx", "6") // margin
                .attr("dy", ".35em") // vertical-align
                .attr("class", "mylabel")//adding a label class
            //   .text(function() {
            //     return i.properties.label;
            //   });
            let label = i.labels.length > 0 ? i.labels[0] : ""
            props.actions.setPage("explorer_nfl_teams_games", { key: label, summary: { ...i.properties } })
        };

        d3.select(".d3-graph > *").remove()
        let graph = d3.select(".d3-graph")
        let svg = graph.append("svg")
        svg.append("g")

        function handleZoom(e) {
            d3.select('svg g').attr('transform', e.transform);
        }
        const zoom = d3.zoom().on('zoom', handleZoom);
        d3.select('svg').call(zoom);

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.properties.label))
            .force("charge", d3.forceManyBody().strength(-500))
            .force("x", d3.forceX())
            .force("y", d3.forceY())
            .on("tick", ticked);

        svg.attr("viewBox", [-width / 2, -height / 2, width, height])

        const link = d3.select('svg g')
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke", "#aaaaaa")
            .attr("stroke-width", 3)
            .call(plugins.drag(simulation));

        const source = buildNode(config.source, nodes, { mouseOver: mouseOver, simulation: simulation })

        const target = buildNode(config.target, nodes, { mouseOver: mouseOver, simulation: simulation })

        const labels = buildLabel(config, nodes, { simulation: simulation })

    }

    return (<div className="d3-graph" id="mapbox" style={{ width: "100%" }} />)
}

export default EXPLORER;