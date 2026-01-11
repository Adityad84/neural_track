import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useTheme } from '../contexts/ThemeContext';

// Custom Icons
const createIcon = (color) => {
    return new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
};

const redIcon = createIcon('red');
const yellowIcon = createIcon('gold');
const blueIcon = createIcon('blue');

const RecenterMap = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) map.flyTo(center, 15);
    }, [center, map]);
    return null;
};

const MapComponent = ({ defects, selectedDefect, onSelectDefect }) => {
    const { theme } = useTheme();
    const defaultCenter = [28.6139, 77.2090]; // New Delhi
    const center = selectedDefect
        ? [selectedDefect.latitude, selectedDefect.longitude]
        : (defects.length > 0 ? [defects[0].latitude, defects[0].longitude] : defaultCenter);

    return (
        <div className="map-container">
            <MapContainer
                center={center}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url={theme === 'dark'
                        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    }
                />

                {selectedDefect && <RecenterMap center={[selectedDefect.latitude, selectedDefect.longitude]} />}

                {defects.map((defect) => {
                    let icon = blueIcon;
                    if (defect.severity === 'Critical') icon = redIcon;
                    else if (defect.severity === 'High') icon = yellowIcon;

                    return (
                        <Marker
                            key={defect.id}
                            position={[defect.latitude || 0, defect.longitude || 0]}
                            icon={icon}
                            eventHandlers={{
                                click: () => onSelectDefect(defect),
                            }}
                        >
                            <Popup className="custom-popup">
                                <div style={{
                                    padding: '5px',
                                    fontFamily: 'var(--font-mono)',
                                    textTransform: 'uppercase',
                                    background: 'var(--bg-secondary)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--border-color)',
                                }}>
                                    <div style={{ color: 'var(--accent-blue)', fontWeight: 800, marginBottom: '5px', borderBottom: '1px solid var(--border-color)', paddingBottom: '3px' }}>
                                        ANOMALY_RECORD
                                    </div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 900 }}>{defect.defect_type}</div>
                                    <div style={{ fontSize: '0.65rem', marginTop: '3px' }}>
                                        LEVEL: <span style={{ color: defect.severity === 'Critical' ? 'var(--status-critical)' : 'var(--status-warning)' }}>{defect.severity}</span>
                                    </div>
                                    <div style={{ fontSize: '0.65rem', marginTop: '2px', color: 'var(--text-secondary)' }}>
                                        NODE: {defect.nearest_station?.toUpperCase() || 'UNKNOWN'}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    )
                })}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
