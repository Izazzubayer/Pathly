/**
 * Mapbox Directions API integration
 * For calculating actual routes between places
 */

export interface DirectionsRequest {
  coordinates: [number, number][];  // [lng, lat] pairs
  profile: 'driving' | 'walking' | 'cycling';
  alternatives?: boolean;
}

export interface DirectionsResponse {
  routes: {
    geometry: GeoJSON.LineString;
    distance: number;
    duration: number;
    legs: {
      distance: number;
      duration: number;
      steps: unknown[];
    }[];
  }[];
}

/**
 * Get directions from Mapbox Directions API
 */
export async function getDirections(request: DirectionsRequest): Promise<DirectionsResponse | null> {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  
  if (!mapboxToken) {
    console.warn('Mapbox token not found');
    return null;
  }
  
  const coords = request.coordinates.map((c) => c.join(',')).join(';');
  const url = `https://api.mapbox.com/directions/v5/mapbox/${request.profile}/${coords}`;
  
  const params = new URLSearchParams({
    access_token: mapboxToken,
    geometries: 'geojson',
    overview: 'full',
  });
  
  try {
    const response = await fetch(`${url}?${params}`);
    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to get directions:', error);
    return null;
  }
}

