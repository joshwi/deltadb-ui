/*eslint-disable*/
import React, { useEffect } from "react";
import * as d3 from "d3";
import plugins from "../../utility/D3/plugins"

function EXPLORER(props) {

    const height = window.innerHeight;
    const width = window.innerWidth;

    useEffect(() => {
        if (props.records.source && props.records.target && props.records.link) {
            let nodes = [...props.records.source, ...props.records.target]
            let links = props.records.link
            nodes = nodes.map((entry, index) => { return { ...entry, id: index } })
            links = links.map((entry, index) => { return { ...entry, id: index } })
            GRAPH(nodes, links)
        }
    }, [props.records])

    const GRAPH = (nodes, links) => {

        // Runs each iteration of force algorithm, updating positions of nodes
        function ticked() {
            node.attr("cx", d => d.x).attr("cy", d => d.y);
            link.attr("x1", d => d.source.x).attr("y1", d => d.source.y).attr("x2", d => d.target.x).attr("y2", d => d.target.y);
            labels.attr('x', function (d) { return d.x }).attr('y', function (d) { return d.y });
        };

        function mouseOver(d, i) {
            // d3.select(this.parentNode)
            //   .append("text")
            //   .attr("dx", "6") // margin
            //   .attr("dy", ".35em") // vertical-align
            //   .attr("class", "mylabel")//adding a label class
            //   .text(function() {
            //     return i.properties.label;
            //   });
            // props.actions.setPage("explorer", {...props.pages.explorer, data: {...i.properties}})
        };

        d3.select(".d3-graph > *").remove()
        let graph = d3.select(".d3-graph")
        let svg = graph.append("svg")
        svg.append("g")

        // var layer1 = svg.append('g');
        // var layer2 = svg.append('g');

        //Zoom function for explorer view
        // const handleZoom = (e) => svg.attr('transform', e.transform);
        function handleZoom(e) {
            d3.select('svg g').attr('transform', e.transform);
          }
        const zoom = d3.zoom().on('zoom', handleZoom);
        // zoom(svg)
        d3.select('svg')
        .call(zoom);

        let simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.properties.label))
        .force("charge", d3.forceManyBody().strength(-600))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .on("tick", ticked);

        svg.attr("viewBox", [-width / 2, -height / 2, width, height])

        const node = d3.select('svg g')
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("r", 20)
            .attr("stroke-width", 2)
            .attr("stroke", function(node){
                if (node.labels.includes("nfl_teams")) { return node.properties.secondary_color } else { return "#000000" }
            })
            .attr("fill", function (node) {
                if (node.labels.includes("nfl_teams")) { return node.properties.primary_color } else { return "#333333" }
            })
            .on('mouseover', mouseOver)
            // .on('mouseout', function (d, i) {})
            .call(plugins.drag(simulation));

        const link = d3.select('svg g')
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke", "#aaaaaa")
            .attr("stroke-width", 1)
            .call(plugins.drag(simulation));

        const labels = d3.select('svg g')
            .attr("class", "texts")
            .selectAll("text")
            .data(nodes)
            .enter().append("text")
            .text(function (node) { if (node.labels.includes("nfl_teams")) { return node.properties.team } else { return node.properties.label.replaceAll("_", " ") } })
            .attr("font-size", 12)
            .attr("stroke", "white")
            .attr("dx", 0)
            .attr("dy", 0)
            .call(plugins.drag(simulation));

        
    }

    return (<div className="d3-graph" style={{ width: "100%"}} />)
}

export default EXPLORER;