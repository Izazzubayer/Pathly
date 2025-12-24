import type { Place } from '@/types/places';
import type { TravelVibe } from '@/types';
import { calculateDistance, estimateTravelTime } from '@/lib/geo/distance';
import type { RouteSegment } from '@/types/itinerary';

export interface DetourScore {
  place: Place;
  status: 'on-route' | 'detour' | 'optional';
  extraTime: number;          // minutes added to route
  extraDistance: number;      // meters added
  relevanceScore: number;     // 0-1, based on vibe match
  overallScore: number;       // Combined score
}

const vibeKeywords: Record<TravelVibe, string[]> = {
  romantic: ['intimate', 'sunset', 'scenic', 'quiet', 'dinner'],
  party: ['nightlife', 'club', 'bar', 'music', 'dance'],
  cultural: ['temple', 'museum', 'history', 'art', 'local'],
  chill: ['beach', 'spa', 'cafe', 'relax', 'slow'],
  balanced: [], // Matches all
};

function calculateVibeMatch(place: Place, vibe: TravelVibe): number {
  if (vibe === 'balanced') return 0.7;
  
  const keywords = vibeKeywords[vibe];
  const placeText = `${place.name} ${place.activityType}`.toLowerCase();
  
  const matches = keywords.filter((k) => placeText.includes(k));
  return Math.min(1, matches.length * 0.3);
}

export function scoreDetour(
  place: Place,
  routeSegment: { from: Place; to: Place },
  userContext: { vibe: TravelVibe }
): DetourScore {
  // Calculate how much extra distance/time this place adds
  const directDistance = calculateDistance(
    routeSegment.from.location,
    routeSegment.to.location
  );
  
  const viaPlaceDistance = 
    calculateDistance(routeSegment.from.location, place.location) +
    calculateDistance(place.location, routeSegment.to.location);
  
  const extraDistance = viaPlaceDistance - directDistance;
  const extraTime = estimateTravelTime(extraDistance, 'walking');
  
  // Determine status based on extra time
  let status: 'on-route' | 'detour' | 'optional';
  if (extraTime < 5) {
    status = 'on-route';      // Less than 5 min extra = on the way
  } else if (extraTime < 15) {
    status = 'detour';        // 5-15 min extra = small detour
  } else {
    status = 'optional';      // More than 15 min = optional
  }
  
  // Calculate relevance based on vibe match
  const relevanceScore = calculateVibeMatch(place, userContext.vibe);
  
  // Combined score (lower is better for detours)
  const overallScore = (extraTime * 0.6) - (relevanceScore * 40);
  
  return {
    place,
    status,
    extraTime,
    extraDistance,
    relevanceScore,
    overallScore,
  };
}

