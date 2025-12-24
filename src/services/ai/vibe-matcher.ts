import type { Place } from '@/types/places';
import type { TravelVibe } from '@/types';

const vibeKeywords: Record<TravelVibe, string[]> = {
  romantic: ['intimate', 'sunset', 'scenic', 'quiet', 'dinner', 'romantic', 'couple'],
  party: ['nightlife', 'club', 'bar', 'music', 'dance', 'party', 'vibrant'],
  cultural: ['temple', 'museum', 'history', 'art', 'local', 'cultural', 'heritage'],
  chill: ['beach', 'spa', 'cafe', 'relax', 'slow', 'chill', 'peaceful'],
  balanced: [], // Matches all
};

/**
 * Calculate how well a place matches the user's travel vibe
 * Returns a score from 0-1, where 1 is a perfect match
 */
export function calculateVibeScore(place: Place, vibe: TravelVibe): number {
  if (vibe === 'balanced') return 0.7;

  const keywords = vibeKeywords[vibe];
  const placeText = `${place.name} ${place.activityType} ${place.address || ''}`.toLowerCase();

  const matches = keywords.filter((k) => placeText.includes(k));
  const baseScore = Math.min(1, matches.length * 0.3);

  // Boost score based on activity type alignment
  const activityBoost = getActivityTypeBoost(place.activityType, vibe);
  
  return Math.min(1, baseScore + activityBoost);
}

function getActivityTypeBoost(activityType: Place['activityType'], vibe: TravelVibe): number {
  const boosts: Record<TravelVibe, Partial<Record<Place['activityType'], number>>> = {
    romantic: {
      restaurant: 0.3,
      viewpoint: 0.2,
      beach: 0.2,
    },
    party: {
      club: 0.4,
      bar: 0.3,
    },
    cultural: {
      temple: 0.3,
      museum: 0.3,
      attraction: 0.2,
    },
    chill: {
      cafe: 0.3,
      beach: 0.3,
      nature: 0.2,
    },
    balanced: {},
  };

  return boosts[vibe][activityType] || 0;
}

/**
 * Get vibe match description
 */
export function getVibeMatchDescription(place: Place, vibe: TravelVibe): string {
  const score = calculateVibeScore(place, vibe);
  
  if (score >= 0.7) {
    return 'Perfect match for your vibe';
  } else if (score >= 0.4) {
    return 'Matches your travel style';
  } else {
    return 'Might interest you';
  }
}

