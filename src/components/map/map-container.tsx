'use client';

import { useEffect, useRef, useState } from 'react';
import { Map, Marker, Popup, ViewStateChangeEvent } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAP_CONFIG } from '@/lib/map/styles';
import { fitBoundsToPlaces } from '@/lib/map/bounds';
import { PlaceMarker } from './place-marker';
import { HotelMarker } from './hotel-marker';
import { PlacePopup } from './place-popup';
import { RouteLayer } from './route-layer';
import type { Place, Anchor } from '@/types/places';
import type { RouteSegment } from '@/types/itinerary';
import { useTripStore } from '@/stores/trip-store';

interface MapContainerProps {
  places: Place[];
  anchors: Anchor[];
  onPlaceClick?: (place: Place) => void;
  showRoutes?: boolean;
  routes?: RouteSegment[];
  fitToPlaces?: boolean;
  interactive?: boolean;
}

export function MapContainer({
  places,
  anchors,
  onPlaceClick,
  showRoutes = false,
  routes = [],
  fitToPlaces = true,
  interactive = true,
}: MapContainerProps) {
  const { tripDetails } = useTripStore();
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 0,
    zoom: 2,
  });
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const mapRef = useRef<any>(null);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (!mapboxToken) {
      console.warn('Mapbox token not found. Set NEXT_PUBLIC_MAPBOX_TOKEN in .env.local');
      return;
    }

    if (fitToPlaces && places.length > 0 && mapRef.current) {
      const bounds = fitBoundsToPlaces(places);
      if (bounds) {
        const map = mapRef.current.getMap();
        if (map) {
          map.fitBounds(
            [
              [bounds.west, bounds.south],
              [bounds.east, bounds.north],
            ],
            {
              padding: 50,
              duration: 1000,
            }
          );
        }
      }
    }
  }, [places, fitToPlaces, mapboxToken]);

  // Set initial view to destination if available
  useEffect(() => {
    if (tripDetails?.destinationCoords && places.length === 0) {
      setViewState({
        longitude: tripDetails.destinationCoords.lng,
        latitude: tripDetails.destinationCoords.lat,
        zoom: 12,
      });
    }
  }, [tripDetails, places.length]);

  if (!mapboxToken) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
        <p className="text-muted-foreground text-sm">
          Mapbox token not configured. Add NEXT_PUBLIC_MAPBOX_TOKEN to .env.local
        </p>
      </div>
    );
  }

  const hotelLocation = tripDetails?.hotelLocation;

  return (
    <div className="w-full h-full relative rounded-lg overflow-hidden">
      <Map
        {...MAP_CONFIG}
        longitude={viewState.longitude}
        latitude={viewState.latitude}
        zoom={viewState.zoom}
        onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
        mapboxAccessToken={mapboxToken}
        ref={mapRef}
        style={{ width: '100%', height: '100%' }}
        interactive={interactive}
      >
        {/* Hotel marker */}
        {hotelLocation && tripDetails?.hotelName && (
          <HotelMarker
            location={hotelLocation}
            name={tripDetails.hotelName}
          />
        )}

        {/* Place markers */}
        {places.map((place) => {
          const isAnchor = anchors.some((a) => a.id === place.id);
          return (
            <PlaceMarker
              key={place.id}
              place={place}
              isAnchor={isAnchor}
              onClick={() => {
                setSelectedPlace(place);
                onPlaceClick?.(place);
              }}
            />
          );
        })}

        {/* Route layer */}
        {showRoutes && routes.length > 0 && (
          <RouteLayer
            routes={routes}
            hotel={hotelLocation}
          />
        )}

        {/* Popup for selected place */}
        {selectedPlace && (
          <Popup
            longitude={selectedPlace.location.lng}
            latitude={selectedPlace.location.lat}
            anchor="bottom"
            onClose={() => setSelectedPlace(null)}
            closeButton={true}
            closeOnClick={false}
          >
            <PlacePopup
              place={selectedPlace}
              onClose={() => setSelectedPlace(null)}
            />
          </Popup>
        )}
      </Map>
    </div>
  );
}

