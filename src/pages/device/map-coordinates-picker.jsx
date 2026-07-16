import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
//import 'leaflet/dist/leaflet.css';
//import './MapCoordinatesPicker.css';

const MapCoordinatesPicker = ({
  initialLatitude,
  initialLongitude,
  onCoordinatesSelect,
  zoom = 15,
  disabled = false,
}) => {
  const [position, setPosition] = useState(
    initialLatitude && initialLongitude
      ? [initialLatitude, initialLongitude]
      : [24.7136, 46.6753] // Default to Riyadh
  );

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        if (!disabled) {
          const { lat, lng } = e.latlng;
          setPosition([lat, lng]);
          onCoordinatesSelect({ lat, lng });
        }
      },
    });

    return position ? <Marker position={position} /> : null;
  };

  return (
    <div className="map-coordinates-picker">
      <MapContainer
        center={position}
        zoom={zoom}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
    </div>
  );
};

export default MapCoordinatesPicker;
