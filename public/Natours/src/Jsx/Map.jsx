import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import pinIcon from '../../img/pin.png';
import Markers from './Markers';

function Map({ locations }) {
  const position = [locations[0].coordinates[1], locations[0].coordinates[0]];

  return (
    <MapContainer
      center={position}
      zoom={8}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      />

      {locations.map((obj, i) => (
        <Markers position={obj} key={i} />
      ))}
    </MapContainer>
  );
}

export default Map;
