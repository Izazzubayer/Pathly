import type { Place } from '@/types/places';

export interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export function calculateBounds(points: Array<{ lat: number; lng: number }>): Bounds | null {
  if (points.length === 0) {
    return null;
  }

  let north = points[0].lat;
  let south = points[0].lat;
  let east = points[0].lng;
  let west = points[0].lng;

  for (const point of points) {
    north = Math.max(north, point.lat);
    south = Math.min(south, point.lat);
    east = Math.max(east, point.lng);
    west = Math.min(west, point.lng);
  }

  return { north, south, east, west };
}

export function fitBoundsToPlaces(places: Place[]): Bounds | null {
  const points = places.map((place) => place.location);
  return calculateBounds(points);
}

