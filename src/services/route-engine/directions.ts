/**
 * OpenRouteService API integration (FREE, no token required)
 * For calculating actual routes between places
 * Alternative: OSRM (also free)
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
 * Get directions from OpenRouteService (FREE, no API key needed)
 * Falls back to OSRM if OpenRouteService fails
 */
export async function getDirections(request: DirectionsRequest): Promise<DirectionsResponse | null> {
  const coords = request.coordinates.map((c) => `${c[0]},${c[1]}`).join('|');
  
  // Map profile names
  const profileMap: Record<string, string> = {
    driving: 'driving-car',
    walking: 'foot-walking',
    cycling: 'cycling-regular',
  };
  
  const orsProfile = profileMap[request.profile] || 'driving-car';
  
  // Try OpenRouteService first (free, no token needed for basic usage)
  try {
    const orsUrl = `https://api.openrouteservice.org/v2/directions/${orsProfile}`;
    const response = await fetch(orsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coordinates: request.coordinates,
        format: 'geojson',
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        routes: [{
          geometry: data.features[0].geometry,
          distance: data.features[0].properties.segments[0].distance,
          duration: data.features[0].properties.segments[0].duration,
          legs: data.features[0].properties.segments.map((seg: any) => ({
            distance: seg.distance,
            duration: seg.duration,
            steps: [],
          })),
        }],
      };
    }
  } catch (error) {
    console.warn('OpenRouteService failed, trying OSRM:', error);
  }
  
  // Fallback to OSRM (also free, no token needed)
  try {
    const osrmProfile = request.profile === 'cycling' ? 'bike' : request.profile;
    const osrmUrl = `https://router.project-osrm.org/route/v1/${osrmProfile}/${coords}?overview=full&geometries=geojson`;
    
    const response = await fetch(osrmUrl);
    if (response.ok) {
      const data = await response.json();
      return {
        routes: [{
          geometry: data.routes[0].geometry,
          distance: data.routes[0].distance,
          duration: data.routes[0].duration,
          legs: data.routes[0].legs || [],
        }],
      };
    }
  } catch (error) {
    console.error('Failed to get directions from both services:', error);
  }
  
  return null;
}

