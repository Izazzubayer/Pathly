import type { SocialIntent } from '@/types/social-intent';
import type { Place, ConfidenceLevel } from '@/types/places';
import { calculateConfidence, getConfidenceReason } from '@/lib/confidence';

export interface ProcessingResult {
  places: Place[];
  warnings: string[];
  failureReason?: string;
}

// Simple text-based place inference (MVP approach)
// In production, this would use AI/NLP
function inferPlacesFromText(text: string): Array<{ name: string; confidence: ConfidenceLevel }> {
  const places: Array<{ name: string; confidence: ConfidenceLevel }> = [];
  
  // Simple pattern matching for common place indicators
  // This is a placeholder - real implementation would use NLP/AI
  
  // Look for capitalized words that might be place names
  const words = text.split(/\s+/);
  const capitalizedWords: string[] = [];
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i].replace(/[^\w]/g, '');
    if (word.length > 2 && word[0] === word[0].toUpperCase()) {
      // Check if it's part of a multi-word place name
      if (i > 0 && words[i - 1].replace(/[^\w]/g, '')[0] === words[i - 1].replace(/[^\w]/g, '')[0].toUpperCase()) {
        // Continue previous place name
        continue;
      }
      capitalizedWords.push(word);
    }
  }
  
  // For MVP, treat any capitalized word as a potential place
  // In production, this would be much more sophisticated
  capitalizedWords.forEach((word) => {
    if (word.length > 3) {
      places.push({
        name: word,
        confidence: 'low',
      });
    }
  });
  
  return places;
}

export async function processTextIntent(intent: SocialIntent): Promise<ProcessingResult> {
  const inferred = inferPlacesFromText(intent.rawInput);
  
  // For MVP, we'll create placeholder places
  // In Phase 05+, these will be resolved via Google Places API
  const places: Place[] = inferred.map((inference, index) => ({
    id: `${intent.id}-place-${index}`,
    name: inference.name,
    location: {
      lat: 0, // Will be resolved later
      lng: 0,
    },
    activityType: 'other',
    sourceIntentId: intent.id,
    confidence: inference.confidence,
    inferenceReason: getConfidenceReason(intent.source, false, false),
    userVerified: false,
  }));
  
  return {
    places,
    warnings: places.length === 0 ? ['No places could be inferred from this text'] : [],
  };
}

export async function processInstagramIntent(intent: SocialIntent): Promise<ProcessingResult> {
  // For MVP, treat Instagram URLs similar to text
  // In production, would extract metadata from Instagram API
  return processTextIntent(intent);
}

export async function processGenericUrl(intent: SocialIntent): Promise<ProcessingResult> {
  // For generic URLs, try to extract place names from the URL itself
  const url = intent.url || intent.rawInput;
  const domain = new URL(url).hostname;
  
  // Simple extraction - in production would be more sophisticated
  const places: Place[] = [{
    id: `${intent.id}-place-0`,
    name: domain.replace('www.', '').split('.')[0],
    location: {
      lat: 0,
      lng: 0,
    },
    activityType: 'other',
    sourceIntentId: intent.id,
    confidence: 'low',
    inferenceReason: 'From URL',
    userVerified: false,
  }];
  
  return {
    places,
    warnings: [],
  };
}

export async function processIntent(intent: SocialIntent): Promise<ProcessingResult> {
  if (intent.source === 'instagram-reel' || intent.source === 'instagram-post') {
    return processInstagramIntent(intent);
  }
  
  if (intent.source === 'text') {
    return processTextIntent(intent);
  }
  
  return processGenericUrl(intent);
}

