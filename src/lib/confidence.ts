import type { IntentSource, SocialIntent } from '@/types/social-intent';
import type { ConfidenceLevel } from '@/types/places';

export function calculateConfidence(
  source: IntentSource,
  hasLocationTag: boolean,
  hasExactMatch: boolean
): ConfidenceLevel {
  // High confidence:
  // - Explicit location tag in Instagram post
  // - Exact place API match
  if (hasLocationTag || hasExactMatch) {
    return 'high';
  }
  
  // Medium confidence:
  // - Inferred from caption with strong match
  // - Text reference with API match
  if (source === 'text' || source === 'instagram-post') {
    return 'medium';
  }
  
  // Low confidence:
  // - Contextual inference only
  // - Partial matches
  return 'low';
}

export function getConfidenceReason(
  source: IntentSource,
  hasLocationTag: boolean,
  hasExactMatch: boolean
): string {
  if (hasLocationTag) {
    return 'From location tag';
  }
  if (hasExactMatch) {
    return 'Exact match found';
  }
  if (source === 'text') {
    return 'From text reference';
  }
  if (source === 'instagram-post' || source === 'instagram-reel') {
    return 'From Instagram content';
  }
  return 'Inferred from context';
}

