# 🛤️ Phase 06: Route Engine

## Goal

Build the core itinerary optimization engine that creates route-aware, day-by-day plans minimizing backtracking while respecting anchors and user preferences.

---

## PRD Reference

> **The engine optimizes *movement*, not just recommendations.**

> **Inputs:** Hotel location, Anchor places, Trip duration, User context, Fixed-time events
> **Outputs:** Day-by-day itinerary, Morning/Afternoon/Evening flow, Minimal backtracking

> **Daily Flow Example:**
> Hotel → Anchor A → Nearby B → Nearby C → Anchor D → Optional E → Hotel

---

## Deliverables

### 1. Route Optimization Algorithm

- [ ] Cluster places by proximity
- [ ] Assign places to days
- [ ] Order places within days
- [ ] Minimize total travel distance
- [ ] Respect time-locked anchors

### 2. Day Structure Generation

- [ ] Morning / Afternoon / Evening slots
- [ ] Activity duration estimation
- [ ] Travel time calculation
- [ ] Buffer time for flexibility

### 3. Itinerary Data Model

- [ ] Day-by-day structure
- [ ] Place ordering with reasons
- [ ] Travel segments
- [ ] Timing estimates

### 4. Optional Suggestions

- [ ] Identify "on the way" places
- [ ] Calculate detour costs
- [ ] Rank by relevance + proximity

---

## Technical Requirements

### Data Model

```tsx
// types/itinerary.ts

interface Itinerary {
  id: string;
  createdAt: Date;
  tripDetails: TripDetails;
  userContext: UserContext;
  days: ItineraryDay[];
  totalDistance: number;          // meters
  totalDuration: number;          // minutes
  optimizationScore: number;      // 0-100, higher = more efficient
}

interface ItineraryDay {
  dayNumber: number;
  date: Date;
  slots: TimeSlot[];
  places: ItineraryPlace[];
  routes: RouteSegment[];
  totalDistance: number;
  totalDuration: number;
}

type TimeSlotType = 'morning' | 'afternoon' | 'evening' | 'night';

interface TimeSlot {
  type: TimeSlotType;
  startTime: string;              // "09:00"
  endTime: string;                // "12:00"
  places: ItineraryPlace[];
}

interface ItineraryPlace {
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

interface RouteSegment {
  from: ItineraryPlace;
  to: ItineraryPlace;
  distance: number;
  duration: number;
  geometry: GeoJSON.LineString;
  mode: 'walking' | 'driving';
}
```

### Folder Structure

```
src/
├── services/
│   └── route-engine/
│       ├── index.ts              # Main engine export
│       ├── optimizer.ts          # Core optimization logic
│       ├── clustering.ts         # Spatial clustering
│       ├── day-planner.ts        # Day structure
│       ├── time-estimator.ts     # Duration estimation
│       ├── detour-scorer.ts      # Optional place ranking
│       └── constraints.ts        # Time-lock handling
├── lib/
│   └── geo/
│       ├── distance.ts           # Haversine, etc.
│       ├── clustering.ts         # K-means, DBSCAN
│       └── tsp.ts                # Traveling salesman
└── types/
    └── itinerary.ts
```

---

## Optimization Algorithm

### High-Level Flow

```
1. Input: anchors[], optionalPlaces[], hotel, tripDays, userContext

2. Pre-process:
   - Cluster all places by proximity
   - Identify time-locked anchors per day
   
3. Day Assignment:
   - Assign time-locked anchors to their days
   - Distribute remaining anchors across days (balanced)
   - Assign optional places to days based on cluster proximity
   
4. Intra-Day Ordering:
   - For each day, solve TSP starting/ending at hotel
   - Respect time constraints (morning activities first, etc.)
   - Insert optional places if they're "on the way"
   
5. Post-process:
   - Calculate all travel times/distances
   - Generate time slots
   - Score optimization quality
   - Generate explanations
```

### Core Algorithm

```typescript
// services/route-engine/optimizer.ts

interface OptimizationInput {
  anchors: Anchor[];
  optionalPlaces: Place[];
  hotel: { lat: number; lng: number };
  tripDays: number;
  userContext: UserContext;
  fixedEvents: FixedEvent[];
}

interface OptimizationResult {
  itinerary: Itinerary;
  warnings: string[];
  alternativeCount: number;
}

async function optimizeItinerary(input: OptimizationInput): Promise<OptimizationResult> {
  // Step 1: Cluster places by proximity
  const clusters = clusterPlaces([...input.anchors, ...input.optionalPlaces], input.tripDays);
  
  // Step 2: Assign anchors to days
  const dayAssignments = assignAnchorsTodays(input.anchors, input.tripDays, input.fixedEvents);
  
  // Step 3: Fill days with optional places from same cluster
  const filledDays = fillDaysWithOptional(dayAssignments, input.optionalPlaces, clusters, input.userContext);
  
  // Step 4: Optimize order within each day
  const orderedDays = await Promise.all(
    filledDays.map(day => optimizeDayOrder(day, input.hotel))
  );
  
  // Step 5: Calculate routes and times
  const routedDays = await Promise.all(
    orderedDays.map(day => calculateRoutes(day, input.hotel))
  );
  
  // Step 6: Generate time slots
  const slottedDays = routedDays.map(day => assignTimeSlots(day, input.userContext));
  
  // Step 7: Score and finalize
  const itinerary = finalizeItinerary(slottedDays, input);
  
  return {
    itinerary,
    warnings: collectWarnings(itinerary),
    alternativeCount: 0, // Future: alternative routes
  };
}
```

### Clustering Algorithm

```typescript
// services/route-engine/clustering.ts

interface Cluster {
  id: number;
  centroid: { lat: number; lng: number };
  places: Place[];
  radius: number;  // max distance from centroid
}

function clusterPlaces(places: Place[], targetClusters: number): Cluster[] {
  // Use K-means clustering
  // K = number of trip days (roughly one cluster per day)
  
  if (places.length <= targetClusters) {
    // Each place is its own cluster
    return places.map((p, i) => ({
      id: i,
      centroid: p.location,
      places: [p],
      radius: 0,
    }));
  }
  
  // K-means implementation
  let centroids = initializeCentroids(places, targetClusters);
  let assignments: number[] = [];
  
  for (let iteration = 0; iteration < 100; iteration++) {
    // Assign each place to nearest centroid
    assignments = places.map(p => findNearestCentroid(p.location, centroids));
    
    // Update centroids
    const newCentroids = updateCentroids(places, assignments, targetClusters);
    
    // Check convergence
    if (centroidsEqual(centroids, newCentroids)) break;
    centroids = newCentroids;
  }
  
  // Build cluster objects
  return buildClusters(places, assignments, centroids);
}
```

### Day Ordering (TSP)

```typescript
// services/route-engine/optimizer.ts

async function optimizeDayOrder(
  day: { places: Place[]; anchors: Anchor[] },
  hotel: { lat: number; lng: number }
): Promise<Place[]> {
  const allPlaces = [...day.places];
  
  if (allPlaces.length <= 2) {
    return allPlaces; // No optimization needed
  }
  
  // For small sets: brute force
  // For larger sets: nearest neighbor heuristic + 2-opt
  
  if (allPlaces.length <= 8) {
    return bruteForceTSP(allPlaces, hotel);
  }
  
  // Nearest neighbor heuristic
  let route = nearestNeighborRoute(allPlaces, hotel);
  
  // 2-opt improvement
  route = twoOptImprove(route, hotel);
  
  return route;
}

function nearestNeighborRoute(places: Place[], start: { lat: number; lng: number }): Place[] {
  const route: Place[] = [];
  const remaining = new Set(places);
  let current = start;
  
  while (remaining.size > 0) {
    const nearest = findNearest(current, Array.from(remaining));
    route.push(nearest);
    remaining.delete(nearest);
    current = nearest.location;
  }
  
  return route;
}
```

### Time Slot Assignment

```typescript
// services/route-engine/day-planner.ts

interface SlotConfig {
  morning: { start: string; end: string; maxPlaces: number };
  afternoon: { start: string; end: string; maxPlaces: number };
  evening: { start: string; end: string; maxPlaces: number };
  night: { start: string; end: string; maxPlaces: number };
}

function getSlotConfig(userContext: UserContext): SlotConfig {
  const baseConfig = {
    morning: { start: '09:00', end: '12:00', maxPlaces: 2 },
    afternoon: { start: '12:00', end: '17:00', maxPlaces: 3 },
    evening: { start: '17:00', end: '21:00', maxPlaces: 2 },
    night: { start: '21:00', end: '24:00', maxPlaces: 2 },
  };
  
  // Adjust based on energy level
  if (userContext.energy === 'low') {
    baseConfig.morning.maxPlaces = 1;
    baseConfig.afternoon.maxPlaces = 2;
  }
  
  if (userContext.energy === 'high') {
    baseConfig.morning.start = '08:00';
    baseConfig.afternoon.maxPlaces = 4;
  }
  
  // Adjust based on vibe
  if (userContext.vibe === 'party') {
    baseConfig.night.end = '02:00';
    baseConfig.morning.start = '11:00';
  }
  
  return baseConfig;
}

function assignTimeSlots(day: ItineraryDay, userContext: UserContext): ItineraryDay {
  const config = getSlotConfig(userContext);
  const slots: TimeSlot[] = [];
  
  // Distribute places across slots based on activity type
  // - Breakfast/cafés → morning
  // - Attractions → afternoon
  // - Dinner/bars → evening
  // - Clubs → night
  
  // ... implementation
  
  return { ...day, slots };
}
```

### Detour Scoring

```typescript
// services/route-engine/detour-scorer.ts

interface DetourScore {
  place: Place;
  status: 'on-route' | 'detour' | 'optional';
  extraTime: number;          // minutes added to route
  extraDistance: number;      // meters added
  relevanceScore: number;     // 0-1, based on vibe match
  overallScore: number;       // Combined score
}

function scoreDetour(
  place: Place,
  routeSegment: { from: Place; to: Place },
  userContext: UserContext
): DetourScore {
  // Calculate how much extra distance/time this place adds
  const directDistance = calculateDistance(routeSegment.from.location, routeSegment.to.location);
  const viaPlaceDistance = 
    calculateDistance(routeSegment.from.location, place.location) +
    calculateDistance(place.location, routeSegment.to.location);
  
  const extraDistance = viaPlaceDistance - directDistance;
  const extraTime = estimateTime(extraDistance);
  
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
  const relevanceScore = calculateVibeMatch(place, userContext);
  
  // Combined score (lower is better)
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
```

---

## Distance & Time Utilities

```typescript
// lib/geo/distance.ts

// Haversine formula for distance
function calculateDistance(
  point1: { lat: number; lng: number },
  point2: { lat: number; lng: number }
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = toRad(point2.lat - point1.lat);
  const dLng = toRad(point2.lng - point1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.lat)) * Math.cos(toRad(point2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c; // meters
}

// Estimate travel time based on mode
function estimateTravelTime(
  distance: number, 
  mode: 'walking' | 'driving' | 'transit'
): number {
  const speeds = {
    walking: 5,      // km/h
    driving: 25,     // km/h (city traffic)
    transit: 20,     // km/h (including wait)
  };
  
  const speedMps = speeds[mode] * 1000 / 60; // meters per minute
  return Math.ceil(distance / speedMps);
}

// Estimate activity duration by type
function estimateActivityDuration(type: ActivityType): number {
  const durations: Record<ActivityType, number> = {
    restaurant: 60,
    cafe: 45,
    bar: 60,
    club: 120,
    attraction: 90,
    viewpoint: 30,
    beach: 180,
    market: 60,
    temple: 45,
    museum: 90,
    shopping: 90,
    nature: 120,
    other: 60,
  };
  
  return durations[type] || 60;
}
```

---

## State Management

```tsx
// stores/itinerary-store.ts

interface ItineraryStore {
  itinerary: Itinerary | null;
  isGenerating: boolean;
  error: string | null;
  
  // Actions
  generateItinerary: (input: OptimizationInput) => Promise<void>;
  regenerateDay: (dayNumber: number) => Promise<void>;
  
  // Manual adjustments
  movePlaceToDay: (placeId: string, targetDay: number) => void;
  reorderPlaceInDay: (dayNumber: number, fromIndex: number, toIndex: number) => void;
  addPlaceToDay: (place: Place, dayNumber: number, position?: number) => void;
  removePlaceFromDay: (placeId: string) => void;
  
  // Optional places
  toggleOptionalPlace: (placeId: string, include: boolean) => void;
  
  // Computed
  getDayByNumber: (dayNumber: number) => ItineraryDay | undefined;
  getTotalDistance: () => number;
  getOptimizationScore: () => number;
}
```

---

## Acceptance Criteria

- [ ] Itinerary generates with anchors properly placed
- [ ] Time-locked anchors are on correct days
- [ ] Places are ordered to minimize backtracking
- [ ] Days are balanced (not overloaded)
- [ ] Travel times are calculated
- [ ] Route lines can be displayed on map
- [ ] Optional places are scored and labeled
- [ ] Low/high energy preferences affect schedule
- [ ] Can manually reorder places
- [ ] Can move places between days
- [ ] Regenerating one day works

---

## Performance Considerations

- [ ] Cache Mapbox Directions calls
- [ ] Debounce regeneration
- [ ] Use web worker for TSP if >15 places
- [ ] Progressive optimization (show fast result, refine)

---

## Edge Cases

- [ ] Only 1 anchor (single-day trip feeling)
- [ ] All anchors on same day (time conflicts)
- [ ] No optional places
- [ ] Very spread out places (different cities)
- [ ] 1-day trip
- [ ] 14-day trip
- [ ] Night-only venues

---

## Next Phase

Once complete, proceed to → `07-ITINERARY-VIEWS.md`

