import type { Place } from '@/types/places';
import { calculateDistance } from './distance';
import type { Point } from './distance';

export interface Cluster {
  id: number;
  centroid: Point;
  places: Place[];
  radius: number;  // max distance from centroid in meters
}

/**
 * Simple K-means clustering for places
 * Groups places by proximity
 */
export function clusterPlaces(places: Place[], targetClusters: number): Cluster[] {
  if (places.length === 0) {
    return [];
  }
  
  if (places.length <= targetClusters) {
    // Each place is its own cluster
    return places.map((p, i) => ({
      id: i,
      centroid: p.location,
      places: [p],
      radius: 0,
    }));
  }
  
  // Initialize centroids randomly
  let centroids = initializeCentroids(places, targetClusters);
  let assignments: number[] = [];
  
  // K-means iteration
  for (let iteration = 0; iteration < 100; iteration++) {
    // Assign each place to nearest centroid
    assignments = places.map((p) => findNearestCentroid(p.location, centroids));
    
    // Update centroids
    const newCentroids = updateCentroids(places, assignments, targetClusters);
    
    // Check convergence
    if (centroidsEqual(centroids, newCentroids)) break;
    centroids = newCentroids;
  }
  
  // Build cluster objects
  return buildClusters(places, assignments, centroids);
}

function initializeCentroids(places: Place[], k: number): Point[] {
  // Simple initialization: pick k random places as centroids
  const indices = new Set<number>();
  while (indices.size < k) {
    indices.add(Math.floor(Math.random() * places.length));
  }
  return Array.from(indices).map((i) => places[i].location);
}

function findNearestCentroid(point: Point, centroids: Point[]): number {
  let minDist = Infinity;
  let nearest = 0;
  
  for (let i = 0; i < centroids.length; i++) {
    const dist = calculateDistance(point, centroids[i]);
    if (dist < minDist) {
      minDist = dist;
      nearest = i;
    }
  }
  
  return nearest;
}

function updateCentroids(places: Place[], assignments: number[], k: number): Point[] {
  const clusters: Place[][] = Array(k).fill(null).map(() => []);
  
  places.forEach((place, i) => {
    clusters[assignments[i]].push(place);
  });
  
  return clusters.map((cluster) => {
    if (cluster.length === 0) {
      // If cluster is empty, keep old centroid or use a random place
      return places[Math.floor(Math.random() * places.length)].location;
    }
    
    // Calculate mean of cluster
    const lat = cluster.reduce((sum, p) => sum + p.location.lat, 0) / cluster.length;
    const lng = cluster.reduce((sum, p) => sum + p.location.lng, 0) / cluster.length;
    
    return { lat, lng };
  });
}

function centroidsEqual(c1: Point[], c2: Point[]): boolean {
  if (c1.length !== c2.length) return false;
  
  for (let i = 0; i < c1.length; i++) {
    const dist = calculateDistance(c1[i], c2[i]);
    if (dist > 100) { // 100m threshold
      return false;
    }
  }
  
  return true;
}

function buildClusters(places: Place[], assignments: number[], centroids: Point[]): Cluster[] {
  const clusters: Place[][] = Array(centroids.length).fill(null).map(() => []);
  
  places.forEach((place, i) => {
    clusters[assignments[i]].push(place);
  });
  
  return clusters.map((cluster, id) => {
    if (cluster.length === 0) {
      return {
        id,
        centroid: centroids[id],
        places: [],
        radius: 0,
      };
    }
    
    // Calculate max radius
    const radius = Math.max(
      ...cluster.map((p) => calculateDistance(p.location, centroids[id]))
    );
    
    return {
      id,
      centroid: centroids[id],
      places: cluster,
      radius,
    };
  }).filter((c) => c.places.length > 0);
}

