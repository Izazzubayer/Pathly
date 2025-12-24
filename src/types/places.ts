export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type ActivityType = 
  | 'restaurant' 
  | 'cafe' 
  | 'bar' 
  | 'club' 
  | 'attraction' 
  | 'viewpoint' 
  | 'beach' 
  | 'market' 
  | 'temple' 
  | 'museum' 
  | 'shopping' 
  | 'nature' 
  | 'other';

export interface Place {
  id: string;
  name: string;
  address?: string;
  location: {
    lat: number;
    lng: number;
  };
  activityType: ActivityType;
  
  // Metadata
  sourceIntentId?: string;      // Link back to social intent
  confidence: ConfidenceLevel;
  inferenceReason?: string;     // "From location tag" / "From caption"
  
  // Place API data
  placeId?: string;             // Google/Foursquare ID
  rating?: number;
  priceLevel?: number;
  openingHours?: OpeningHours;
  photos?: string[];
  
  // User modifications
  userVerified: boolean;
  userNotes?: string;
}

export interface Anchor extends Place {
  isAnchor: true;
  timeLock?: {
    date: Date;
    time?: string;              // "14:00" or "evening"
    flexible: boolean;          // Can be moved within the day?
  };
  priority: number;             // For ordering
}

export interface OpeningHours {
  periods: {
    day: number;
    open: string;
    close: string;
  }[];
  isOpenNow?: boolean;
}

