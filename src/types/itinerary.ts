import type { Place, Anchor, ActivityType } from './places';
import type { UserContext, TripDetails } from './index';

export interface Itinerary {
  id: string;
  createdAt: Date;
  tripDetails: TripDetails;
  userContext: UserContext;
  days: ItineraryDay[];
  totalDistance: number;          // meters
  totalDuration: number;          // minutes
  optimizationScore: number;      // 0-100, higher = more efficient
}

export interface ItineraryDay {
  dayNumber: number;
  date: Date;
  slots: TimeSlot[];
  places: ItineraryPlace[];
  routes: RouteSegment[];
  totalDistance: number;
  totalDuration: number;
}

export type TimeSlotType = 'morning' | 'afternoon' | 'evening' | 'night';

export interface TimeSlot {
  type: TimeSlotType;
  startTime: string;              // "09:00"
  endTime: string;                // "12:00"
  places: ItineraryPlace[];
}

export interface ItineraryPlace {
  place: Place;
  isAnchor: boolean;
  orderInDay: number;
  
  // Timing
  arrivalTime: string;
  departureTime: string;
  duration: number;               // minutes
  
  // Routing
  distanceFromPrevious: number;   // meters
  durationFromPrevious: number;   // minutes
  travelMode: 'walking' | 'driving' | 'transit';
  
  // Status
  status: 'on-route' | 'detour' | 'optional';
  detourCost?: number;            // extra minutes if detour
  
  // Explanation
  reason?: string;                // "Added because it's 5 min from..."
}

export interface RouteSegment {
  from: ItineraryPlace;
  to: ItineraryPlace;
  distance: number;
  duration: number;
  geometry?: GeoJSON.LineString;
  mode: 'walking' | 'driving';
}

