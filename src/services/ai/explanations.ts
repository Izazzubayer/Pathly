import type { Place } from '@/types/places';
import type { UserContext } from '@/types';
import type { ItineraryPlace } from '@/types/itinerary';

export interface ExplanationInput {
  place: Place;
  userContext: UserContext;
  routeContext: {
    previousPlace?: Place;
    nextPlace?: Place;
    distanceFromHotel: number;
    timeOfDay: string;
    orderInDay: number;
  };
}

/**
 * Generate human-readable explanation for why a place was included
 * Template-based for MVP, can be enhanced with AI later
 */
export function generateExplanation(input: ExplanationInput): string {
  const { place, userContext, routeContext } = input;
  const reasons: string[] = [];

  // Proximity reason
  if (routeContext.previousPlace) {
    const distanceKm = (routeContext.distanceFromHotel / 1000).toFixed(1);
    if (parseFloat(distanceKm) < 2) {
      reasons.push(`Only ${distanceKm} km from your previous stop`);
    } else if (parseFloat(distanceKm) < 5) {
      reasons.push(`Just ${distanceKm} km away`);
    }
  }

  // Vibe match
  const vibeMatch = calculateVibeMatch(place, userContext.vibe);
  if (vibeMatch > 0.5) {
    reasons.push(`Perfect for your ${userContext.vibe} travel style`);
  }

  // Time of day match
  const timeMatch = matchTimeOfDay(place, routeContext.timeOfDay);
  if (timeMatch) {
    reasons.push(`Great for ${routeContext.timeOfDay} activities`);
  }

  // Activity type match
  if (routeContext.orderInDay === 1) {
    reasons.push(`A great way to start your day`);
  }

  // Confidence-based
  if (place.confidence === 'high') {
    reasons.push(`Highly recommended location`);
  }

  // Default if no specific reasons
  if (reasons.length === 0) {
    return `Added to your itinerary`;
  }

  return reasons.join(' • ');
}

function calculateVibeMatch(place: Place, vibe: UserContext['vibe']): number {
  const vibeKeywords: Record<UserContext['vibe'], string[]> = {
    romantic: ['intimate', 'sunset', 'scenic', 'quiet', 'dinner', 'romantic'],
    party: ['nightlife', 'club', 'bar', 'music', 'dance', 'party'],
    cultural: ['temple', 'museum', 'history', 'art', 'local', 'cultural'],
    chill: ['beach', 'spa', 'cafe', 'relax', 'slow', 'chill'],
    balanced: [],
  };

  if (vibe === 'balanced') return 0.7;

  const keywords = vibeKeywords[vibe];
  const placeText = `${place.name} ${place.activityType}`.toLowerCase();

  const matches = keywords.filter((k) => placeText.includes(k));
  return Math.min(1, matches.length * 0.3);
}

function matchTimeOfDay(place: Place, timeOfDay: string): boolean {
  const timeKeywords: Record<string, string[]> = {
    morning: ['cafe', 'temple', 'viewpoint', 'nature', 'attraction'],
    afternoon: ['museum', 'shopping', 'market', 'beach', 'attraction'],
    evening: ['restaurant', 'bar', 'viewpoint'],
    night: ['club', 'bar'],
  };

  const keywords = timeKeywords[timeOfDay.toLowerCase()] || [];
  return keywords.includes(place.activityType);
}

/**
 * Generate explanation for itinerary place
 */
export function generateItineraryPlaceExplanation(
  itineraryPlace: ItineraryPlace,
  userContext: UserContext,
  previousPlace?: ItineraryPlace
): string {
  return generateExplanation({
    place: itineraryPlace.place,
    userContext,
    routeContext: {
      previousPlace: previousPlace?.place,
      distanceFromHotel: itineraryPlace.distanceFromPrevious,
      timeOfDay: getTimeOfDay(itineraryPlace.arrivalTime),
      orderInDay: itineraryPlace.orderInDay,
    },
  });
}

function getTimeOfDay(time: string): string {
  const hour = parseInt(time.split(':')[0]);
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

