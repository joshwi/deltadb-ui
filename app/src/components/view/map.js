/*eslint-disable*/
//JS Packages
import React, { useState, useEffect, useRef } from "react";
import mapboxgl from '!mapbox-gl';
//React components

require('dotenv').config()

const MAPBOX_API_KEY = process.env.REACT_APP_MAPBOX_API_KEY

function MAP(props) {

    mapboxgl.accessToken = MAPBOX_API_KEY
    
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, SetLng] = useState(-90);
    const [lat, SetLat] = useState(40);
    const [zoom, SetZoom] = useState(3);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v10',
            center: [lng, lat],
            zoom: zoom
        });
    });

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('move', () => {
            SetLng(map.current.getCenter().lng.toFixed(4));
            SetLat(map.current.getCenter().lat.toFixed(4));
            SetZoom(map.current.getZoom().toFixed(2));
        });
    });



    return (
        <div>
            <div style={{backgroundColor: "#283448", color: "#fff", padding: "6px 12px", fontFamily: "monospace", zIndex: 1, position: "relative", top: 0, right: 0, margin: "12px", borderRadius: "4px"}}>
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>
            <div ref={mapContainer} className="map-container" style={{height: window.innerHeight, width: window.innerWidth}} />
        </div>
    );

}

export default MAP;