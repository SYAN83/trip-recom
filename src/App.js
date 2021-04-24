import React from 'react';
import './App.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap, LayersControl, LayerGroup, Tooltip, CircleMarker,  } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import NavPanel from './NavPanel';
import { COLORS, HEATS } from './constants';
import collisions from './data/collisions-small.json';
import crimeIndex from './data/crimes_index-small.json';
require('react-leaflet-markercluster/dist/styles.min.css');

const DefaultIcon = L.icon({
    iconUrl: icon,
    iconSize: [25, 41],
    iconAnchor: [12, 42],
    popupAnchor: [0, -45],
    shadowUrl: iconShadow,
    shadowAnchor: [13, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const center = [47.608013, -122.335167];
const zoom = 13;

const crimeFiltered = crimeIndex.filter( data => data.Index > 99).map( data  => ({
  Color: HEATS[Math.min(HEATS.length, Math.floor(data.Index / 100))-1], 
  LatLng: data.LatLng, Index: Math.round(data.Index)
}));

function SetViewOnChange({ nodes }) {
  const map = useMap();
  switch (nodes.length) {
    case 1:
      map.setView(nodes[0].latlng, zoom, { animate: true });
      break;
    case 2:
      map.fitBounds([nodes[0].latlng, nodes[1].latlng], { animate: true });
      break;
    default:
      map.setView(center, zoom, { animate: true });
  }
  return null;
}

function App() {
  const [segments, setSegments] = React.useState([]);
  const [nodes, setNodes] = React.useState([]);

  return (
    <div className="App" id="container">
      <div id="map">
        <MapContainer center={center} zoom={zoom}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors" />
          <LayersControl position="topleft">
            <LayersControl.Overlay checked name="Navigation">
            <LayerGroup>
              {segments.map((segment, index) =>
                <Polyline weight={6} opacity={0.75} positions={segment} color={COLORS[index]} />
              )}
              {nodes.map(node =>
                <Marker position={node.latlng} >
                  <Popup>{node.loc.join(' & ')}</Popup>
                </Marker>
              )}
            </LayerGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Collisions">
              <MarkerClusterGroup>
                {collisions.map( data => {
                  return (
                  <CircleMarker center={data.LatLng}>
                    <Tooltip direction="right" offset={[0, 0]} opacity={1}>
                      <p align="left">Date: {data.INCDATE}</p>
                      <p>{data.SDOT_COLDESC}</p>
                    </Tooltip>
                  </CircleMarker>
                  )
                })}
              </MarkerClusterGroup>;
            </LayersControl.Overlay>
            <LayersControl.Overlay checked name="Crime Index">
              <LayerGroup>
                {crimeFiltered.map( data => {
                  return (
                    <CircleMarker center={data.LatLng} radius={10} 
                      pathOptions={{ color: data.Color, fillOpacity: 0.8, stroke: false}}>
                      <Tooltip direction="right" offset={[0, 0]} opacity={1}>{data.Index}</Tooltip>
                    </CircleMarker>
                    );
                })}
              </LayerGroup>
            </LayersControl.Overlay>
          </LayersControl>
          <SetViewOnChange nodes={nodes} />
        </MapContainer>
      </div>
      <NavPanel setNodes={setNodes} setSegments={setSegments}/>
    </div>
  );
};

export default App;
