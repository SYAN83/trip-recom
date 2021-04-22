import React from 'react';
import './App.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import NavPanel from './NavPanel';

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

const colors = ["#8AC926", "#1982C4", "#6A4C93", "#FF595E", "#FFCA3A"];

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
          {segments.map((segment, index) =>
            <Polyline weight={6} opacity={0.75} positions={segment} color={colors[index]} />
          )}
          {nodes.map(node =>
            <Marker position={node.latlng} >
              <Popup>{node.loc.join(' & ')}</Popup>
            </Marker>
          )}
          <SetViewOnChange nodes={nodes} />
        </MapContainer>
      </div>
      <NavPanel setNodes={setNodes} setSegments={setSegments}/>
    </div>
  );
};

export default App;
