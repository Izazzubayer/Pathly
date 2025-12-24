'use client';

import { useEffect } from 'react';
import { useMap } from 'react-map-gl/maplibre';
import type { RouteSegment } from '@/types/itinerary';
import type { GeoJSONSource } from 'maplibre-gl';

interface RouteLayerProps {
  routes: RouteSegment[];
  hotel?: { lat: number; lng: number };
}

export function RouteLayer({ routes, hotel }: RouteLayerProps) {
  const { current: mapRef } = useMap();

  useEffect(() => {
    if (!mapRef || routes.length === 0) return;
    const map = mapRef.getMap();
    if (!map) return;

    // Create route line from hotel to first place, then between places
    const coordinates: [number, number][] = [];

    // Start from hotel if available
    if (hotel) {
      coordinates.push([hotel.lng, hotel.lat]);
    }

    // Add route segments
    routes.forEach((route) => {
      if (route.geometry) {
        // Use geometry if available
        coordinates.push(...route.geometry.coordinates as [number, number][]);
      } else {
        // Fallback: straight line between places
        coordinates.push([
          route.from.place.location.lng,
          route.from.place.location.lat,
        ]);
        coordinates.push([
          route.to.place.location.lng,
          route.to.place.location.lat,
        ]);
      }
    });

    // Create GeoJSON line
    const routeGeoJson = {
      type: 'Feature' as const,
      geometry: {
        type: 'LineString' as const,
        coordinates,
      },
      properties: {},
    };

    // Add source
    const sourceId = 'route-source';
    const layerId = 'route-layer';

    if (map.getSource(sourceId)) {
      const source = map.getSource(sourceId) as GeoJSONSource;
      if (source.setData) {
        source.setData(routeGeoJson as any);
      }
    } else {
      map.addSource(sourceId, {
        type: 'geojson',
        data: routeGeoJson as any,
      });

      map.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': 'hsl(var(--primary))',
          'line-width': 3,
          'line-opacity': 0.6,
        },
      });
    }

    return () => {
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
    };
  }, [mapRef, routes, hotel]);

  return null;
}

