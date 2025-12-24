// Geographic distance calculations

export interface Point {
  lat: number;
  lng: number;
}

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in meters
 */
export function calculateDistance(point1: Point, point2: Point): number {
  const R = 6371000; // Earth radius in meters
  const dLat = toRad(point2.lat - point1.lat);
  const dLng = toRad(point2.lng - point1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.lat)) * Math.cos(toRad(point2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c; // meters
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Estimate travel time based on distance and mode
 * Returns time in minutes
 */
export function estimateTravelTime(
  distance: number, 
  mode: 'walking' | 'driving' | 'transit'
): number {
  const speeds = {
    walking: 5,      // km/h
    driving: 25,     // km/h (city traffic)
    transit: 20,     // km/h (including wait)
  };
  
  const speedMps = speeds[mode] * 1000 / 60; // meters per minute
  return Math.ceil(distance / speedMps);
}

/**
 * Estimate activity duration by type
 * Returns duration in minutes
 */
export function estimateActivityDuration(type: ActivityType): number {
  const durations: Record<ActivityType, number> = {
    restaurant: 60,
    cafe: 45,
    bar: 60,
    club: 120,
    attraction: 90,
    viewpoint: 30,
    beach: 180,
    market: 60,
    temple: 45,
    museum: 90,
    shopping: 90,
    nature: 120,
    other: 60,
  };
  
  return durations[type] || 60;
}

import type { ActivityType } from '@/types/places';

