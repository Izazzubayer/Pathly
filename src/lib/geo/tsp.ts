import type { Place } from '@/types/places';
import { calculateDistance } from './distance';
import type { Point } from './distance';

/**
 * Nearest neighbor heuristic for TSP
 * Simple but effective for small-medium sets
 */
export function nearestNeighborRoute(
  places: Place[],
  start: Point
): Place[] {
  if (places.length === 0) return [];
  if (places.length === 1) return places;
  
  const route: Place[] = [];
  const remaining = new Set(places);
  let current = start;
  
  while (remaining.size > 0) {
    const nearest = findNearest(current, Array.from(remaining));
    route.push(nearest);
    remaining.delete(nearest);
    current = nearest.location;
  }
  
  return route;
}

function findNearest(point: Point, places: Place[]): Place {
  let minDist = Infinity;
  let nearest = places[0];
  
  for (const place of places) {
    const dist = calculateDistance(point, place.location);
    if (dist < minDist) {
      minDist = dist;
      nearest = place;
    }
  }
  
  return nearest;
}

/**
 * 2-opt improvement for TSP route
 * Tries to improve route by swapping edges
 */
export function twoOptImprove(
  route: Place[],
  start: Point
): Place[] {
  if (route.length <= 2) return route;
  
  let improved = true;
  let bestRoute = [...route];
  let bestDistance = calculateRouteDistance([start, ...route.map(p => p.location), start]);
  
  while (improved) {
    improved = false;
    
    for (let i = 1; i < route.length - 1; i++) {
      for (let j = i + 1; j < route.length; j++) {
        // Try swapping segment
        const newRoute = [
          ...route.slice(0, i),
          ...route.slice(i, j + 1).reverse(),
          ...route.slice(j + 1),
        ];
        
        const newDistance = calculateRouteDistance([
          start,
          ...newRoute.map(p => p.location),
          start,
        ]);
        
        if (newDistance < bestDistance) {
          bestRoute = newRoute;
          bestDistance = newDistance;
          improved = true;
        }
      }
    }
    
    if (improved) {
      route = bestRoute;
    }
  }
  
  return bestRoute;
}

function calculateRouteDistance(points: Point[]): number {
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    total += calculateDistance(points[i], points[i + 1]);
  }
  return total;
}

