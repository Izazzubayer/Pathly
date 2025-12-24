import type { Anchor, Place } from '@/types/places';
import type { UserContext, TripDetails } from '@/types';
import type { Itinerary, ItineraryDay, ItineraryPlace, RouteSegment } from '@/types/itinerary';
import { clusterPlaces } from '@/lib/geo/clustering';
import { nearestNeighborRoute, twoOptImprove } from '@/lib/geo/tsp';
import { calculateDistance, estimateTravelTime, estimateActivityDuration } from '@/lib/geo/distance';
import { assignTimeSlots } from './day-planner';
import { generateItineraryPlaceExplanation } from '@/services/ai/explanations';

export interface OptimizationInput {
  anchors: Anchor[];
  optionalPlaces: Place[];
  hotel: { lat: number; lng: number };
  tripDetails: TripDetails;
  userContext: UserContext;
}

export interface OptimizationResult {
  itinerary: Itinerary;
  warnings: string[];
}

function generateId(): string {
  return `itinerary-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Assign anchors to days, respecting time-locks
 */
function assignAnchorsToDays(
  anchors: Anchor[],
  tripDays: number,
  startDate: Date
): Map<number, Anchor[]> {
  const assignments = new Map<number, Anchor[]>();
  
  // Initialize days
  for (let i = 0; i < tripDays; i++) {
    assignments.set(i + 1, []);
  }
  
  // First, assign time-locked anchors
  anchors.forEach((anchor) => {
    if (anchor.timeLock) {
      const anchorDate = new Date(anchor.timeLock.date);
      const dayNumber = Math.ceil(
        (anchorDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
      
      if (dayNumber >= 1 && dayNumber <= tripDays) {
        assignments.get(dayNumber)!.push(anchor);
      }
    }
  });
  
  // Then, distribute remaining anchors evenly
  const unassignedAnchors = anchors.filter((a) => !a.timeLock);
  unassignedAnchors.forEach((anchor, index) => {
    const dayNumber = (index % tripDays) + 1;
    assignments.get(dayNumber)!.push(anchor);
  });
  
  return assignments;
}

/**
 * Fill days with optional places from same cluster
 */
function fillDaysWithOptional(
  dayAssignments: Map<number, Anchor[]>,
  optionalPlaces: Place[],
  clusters: ReturnType<typeof clusterPlaces>,
  userContext: UserContext
): Map<number, Place[]> {
  const filledDays = new Map<number, Place[]>();
  
  dayAssignments.forEach((anchors, dayNumber) => {
    const dayPlaces: Place[] = [...anchors];
    
    // Find clusters that contain anchors for this day
    const anchorIds = new Set(anchors.map((a) => a.id));
    const relevantClusters = clusters.filter((cluster) =>
      anchors.some((anchor) => cluster.places.some((p) => p.id === anchor.id))
    );
    
    // Add optional places from relevant clusters
    const optionalPlaceIds = new Set(optionalPlaces.map((p) => p.id));
    relevantClusters.forEach((cluster) => {
      cluster.places.forEach((place) => {
        if (!anchorIds.has(place.id) && optionalPlaceIds.has(place.id)) {
          dayPlaces.push(place);
        }
      });
    });
    
    filledDays.set(dayNumber, dayPlaces);
  });
  
  return filledDays;
}

/**
 * Optimize order within a day using TSP
 */
function optimizeDayOrder(
  places: Place[],
  hotel: { lat: number; lng: number }
): Place[] {
  if (places.length <= 2) {
    return places;
  }
  
  // Use nearest neighbor + 2-opt
  let route = nearestNeighborRoute(places, hotel);
  route = twoOptImprove(route, hotel);
  
  return route;
}

/**
 * Calculate routes and times for a day
 */
function calculateRoutesForDay(
  places: Place[],
  hotel: { lat: number; lng: number },
  dayNumber: number
): { places: ItineraryPlace[]; routes: RouteSegment[] } {
  const itineraryPlaces: ItineraryPlace[] = [];
  const routes: RouteSegment[] = [];
  
  let currentTime = '09:00'; // Start time
  let previousLocation = hotel;
  
  places.forEach((place, index) => {
    const distance = calculateDistance(previousLocation, place.location);
    const travelTime = estimateTravelTime(distance, 'walking');
    const activityDuration = estimateActivityDuration(place.activityType);
    
    // Calculate arrival time
    const arrivalTime = addMinutes(currentTime, travelTime);
    const departureTime = addMinutes(arrivalTime, activityDuration);
    
    const itineraryPlace: ItineraryPlace = {
      place,
      isAnchor: false, // Will be set correctly
      orderInDay: index + 1,
      arrivalTime,
      departureTime,
      duration: activityDuration,
      distanceFromPrevious: distance,
      durationFromPrevious: travelTime,
      travelMode: 'walking',
      status: 'on-route',
      reason: index === 0 
        ? 'First stop of the day'
        : `Added because it's ${Math.round(travelTime)} min from previous stop`,
    };
    
    itineraryPlaces.push(itineraryPlace);
    
    // Create route segment
    if (index > 0) {
      routes.push({
        from: itineraryPlaces[index - 1],
        to: itineraryPlace,
        distance,
        duration: travelTime,
        mode: 'walking',
      });
    }
    
    previousLocation = place.location;
    currentTime = departureTime;
  });
  
  return { places: itineraryPlaces, routes };
}

function addMinutes(time: string, minutes: number): string {
  const [hours, mins] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60);
  const newMins = totalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
}

/**
 * Main optimization function
 */
export async function optimizeItinerary(input: OptimizationInput): Promise<OptimizationResult> {
  const { anchors, optionalPlaces, hotel, tripDetails, userContext } = input;
  const tripDays = tripDetails.duration;
  const startDate = new Date(tripDetails.startDate);
  
  // Step 1: Cluster places
  const allPlaces = [...anchors, ...optionalPlaces];
  const clusters = clusterPlaces(allPlaces, tripDays);
  
  // Step 2: Assign anchors to days
  const dayAssignments = assignAnchorsToDays(anchors, tripDays, startDate);
  
  // Step 3: Fill days with optional places
  const filledDays = fillDaysWithOptional(dayAssignments, optionalPlaces, clusters, userContext);
  
  // Step 4: Optimize order within each day
  const optimizedDays: Place[][] = [];
  filledDays.forEach((places, dayNumber) => {
    const ordered = optimizeDayOrder(places, hotel);
    optimizedDays[dayNumber] = ordered;
  });
  
  // Step 5: Calculate routes and create itinerary days
  const itineraryDays: ItineraryDay[] = [];
  let totalDistance = 0;
  let totalDuration = 0;
  
  optimizedDays.forEach((places, dayNumber) => {
    const { places: itineraryPlaces, routes } = calculateRoutesForDay(
      places,
      hotel,
      dayNumber
    );
    
    // Mark anchors and generate explanations
    itineraryPlaces.forEach((ip, index) => {
      ip.isAnchor = anchors.some((a) => a.id === ip.place.id);
      
      // Generate explanation if not already set
      if (!ip.reason) {
        const previousPlace = index > 0 ? itineraryPlaces[index - 1] : undefined;
        ip.reason = generateItineraryPlaceExplanation(ip, userContext, previousPlace);
      }
    });
    
    const dayDistance = routes.reduce((sum, r) => sum + r.distance, 0);
    const dayDuration = itineraryPlaces.reduce((sum, p) => sum + p.duration + p.durationFromPrevious, 0);
    
    totalDistance += dayDistance;
    totalDuration += dayDuration;
    
    const day: ItineraryDay = {
      dayNumber,
      date: new Date(startDate.getTime() + (dayNumber - 1) * 24 * 60 * 60 * 1000),
      slots: [],
      places: itineraryPlaces,
      routes,
      totalDistance: dayDistance,
      totalDuration: dayDuration,
    };
    
    // Assign time slots
    const slottedDay = assignTimeSlots(day, userContext);
    itineraryDays.push(slottedDay);
  });
  
  // Step 6: Calculate optimization score
  const optimizationScore = calculateOptimizationScore(itineraryDays, totalDistance);
  
  const itinerary: Itinerary = {
    id: generateId(),
    createdAt: new Date(),
    tripDetails,
    userContext,
    days: itineraryDays,
    totalDistance,
    totalDuration,
    optimizationScore,
  };
  
  return {
    itinerary,
    warnings: [],
  };
}

function calculateOptimizationScore(days: ItineraryDay[], totalDistance: number): number {
  // Simple scoring: lower distance = higher score
  // In production, would consider more factors
  const avgDistancePerDay = totalDistance / days.length;
  const maxScore = 100;
  const baseScore = Math.max(0, maxScore - (avgDistancePerDay / 1000)); // Penalize by km
  
  return Math.min(100, Math.round(baseScore));
}

