import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function Markers({ position }) {
  const positionMarker = [position.coordinates[1], position.coordinates[0]];
  return (
    <Marker position={positionMarker}>
      <Popup>{`Day ${position.day}: ${position.description}`}</Popup>
    </Marker>
  );
}

export default Markers;
