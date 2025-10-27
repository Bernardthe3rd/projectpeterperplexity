'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Business } from '@/lib/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet-images/marker-icon-2x.png',
    iconUrl: '/leaflet-images/marker-icon.png',
    shadowUrl: '/leaflet-images/marker-shadow.png',
});

interface LeafletMapProps {
    businesses: Business[];
}

export default function LeafletMap({ businesses }: LeafletMapProps) {
    return (
        <div className="h-96 w-full rounded-lg overflow-hidden">
            <MapContainer
                center={[51.0, 6.5]} // Netherlands-Germany border
                zoom={8}
                className="h-full w-full"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {businesses.map((business) => (
                    <Marker
                        key={business.id}
                        position={[business.latitude, business.longitude]}
                    >
                        <Popup>
                            <div className="p-2">
                                <h3 className="font-bold text-lg">{business.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{business.category}</p>
                                <p className="text-sm mb-2">📍 {business.address}, {business.city}</p>
                                {business.phone && (
                                    <p className="text-sm mb-2">📞 {business.phone}</p>
                                )}

                                {/* Google Maps Link */}
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${business.latitude},${business.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded mt-2"
                                >
                                    🗺️ Open in Google Maps
                                </a>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}