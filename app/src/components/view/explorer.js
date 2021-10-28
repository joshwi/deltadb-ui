import React, { useEffect } from "react";
import * as d3 from "d3";
import plugins from "../../utility/D3/plugins"
import data from "./graph.json"

function APP() {

    const height = 900
    const width = 1500

    let links = data.links.map(d => Object.create(d));
    let nodes = data.nodes.map(d => Object.create(d));

    useEffect(() => { GRAPH({ nodes, links }) }, [nodes, links])

    const GRAPH = ({ nodes, links }) => {

        d3.select(".d3-graph > *").remove()

        let graph = d3.select(".d3-graph")
        let svg = graph.append("svg")

        let simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id))
            .force("charge", d3.forceManyBody())
            .force("x", d3.forceX())
            .force("y", d3.forceY());

        svg.attr("viewBox", [-width / 2, -height / 2, width, height])
        svg.append("p").text("Hello from D3");

        const node = svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("r", 5)
            .attr("fill", "#ce0e0e")
            .call(plugins.drag(simulation));

        const link = svg.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke-width", d => Math.sqrt(d.value));

        node.append("title").text(d => d.id);

        simulation.on("tick", () => {
            link.attr("x1", d => d.source.x).attr("y1", d => d.source.y).attr("x2", d => d.target.x).attr("y2", d => d.target.y);
            node.attr("cx", d => d.x).attr("cy", d => d.y);
        });

    }

    return (<div className="d3-graph" />)
}

export default APP;