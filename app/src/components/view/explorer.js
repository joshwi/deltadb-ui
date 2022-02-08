/*eslint-disable*/
import React, { useEffect } from "react";
import * as d3 from "d3";
import plugins from "../../utility/D3/plugins"

const config = {
    source: { label: "nfl_teams", view: "explorer", category: "nfl", node: "teams", type: "image", key: "logo", transform: "-25px" },
    target: { label: "nfl_games", view: "explorer", category: "nfl", node: "games", type: "circle", primary: "primary_color", secondary: "secondary_color", keys: ["year", "week"] }
}

function EXPLORER(props) {

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

    const buildNode = (config, nodes, functions) => {
        if (config.type && config.type == "image") {
            return d3.select('svg g')
                .selectAll("images")
                .data(nodes.filter(x => x.labels && x.labels.includes(config.label)))
                .join("svg:image")
                .attr("xlink:href", function (node) { if (node.properties && node.properties[config.key]) { return node.properties[config.key] } else { return "" } })
                .attr("width", 50)
                .attr("height", 50)
                .style("transform", "translate(-25px, -25px)")
                .on('mouseover', functions.mouseOver)
                //.on('mouseout', function (d, i) {})
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
            props.actions.setPage("explorer", { key: label, summary: { ...i.properties } })
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