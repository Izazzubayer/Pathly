export type TravelCompanion = 'solo' | 'couple' | 'friends' | 'family';
export type TravelVibe = 'romantic' | 'party' | 'cultural' | 'chill' | 'balanced';
export type EnergyLevel = 'low' | 'medium' | 'high';
export type BudgetLevel = 'budget' | 'moderate' | 'flexible' | 'luxury';
export type MobilityLevel = 'limited' | 'moderate' | 'high';

export interface UserContext {
  companion: TravelCompanion;
  vibe: TravelVibe;
  energy: EnergyLevel;
  budget: BudgetLevel;
  mobility: MobilityLevel;
}

export interface TripDetails {
  destination: string;
  destinationCoords?: { lat: number; lng: number };
  hotelName?: string;
  hotelLocation?: { lat: number; lng: number };
  startDate: Date;
  endDate: Date;
  duration: number;
}

export type PlaceStatus = 'on-route' | 'detour' | 'optional' | 'anchor';

// Re-export social intent types
export type {
  IntentSource,
  ProcessingStatus,
  SocialIntent,
  ExtractedData,
  InferredPlace,
} from './social-intent';

