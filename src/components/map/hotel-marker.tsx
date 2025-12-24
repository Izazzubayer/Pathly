'use client';

import { Marker } from 'react-map-gl/mapbox';
import { Home } from 'lucide-react';

interface HotelMarkerProps {
  location: { lat: number; lng: number };
  name: string;
}

export function HotelMarker({ location, name }: HotelMarkerProps) {
  return (
    <Marker
      longitude={location.lng}
      latitude={location.lat}
      anchor="bottom"
    >
      <div className="relative cursor-pointer">
        <div className="flex items-center justify-center rounded-full border-2 border-green-600 bg-green-50 shadow-lg w-10 h-10">
          <Home className="h-5 w-5 text-green-700" />
        </div>
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <div className="bg-white px-2 py-1 rounded shadow text-xs font-medium border">
            {name}
          </div>
        </div>
      </div>
    </Marker>
  );
}

