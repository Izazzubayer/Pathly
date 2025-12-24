# 🗺️ Phase 05: Map Integration

## Goal

Integrate Mapbox GL JS to visualize places, hotel location, and provide the spatial foundation for route optimization.

---

## PRD Reference

> **Map-First Itinerary View** - One of the 7 core UX screens

> **Routing & Geography:**
> - Mapbox Directions API
> - Graph-based shortest path logic

---

## Deliverables

### 1. Mapbox Setup

- [ ] Mapbox GL JS integration
- [ ] Access token configuration
- [ ] Custom map style (calm, minimal)
- [ ] Responsive map container

### 2. Place Visualization

- [ ] Anchor markers (distinct style)
- [ ] Optional place markers
- [ ] Hotel/base marker
- [ ] Marker clustering (if many places)
- [ ] Click/hover interactions

### 3. Route Display

- [ ] Route lines between places
- [ ] Color-coded by day
- [ ] Direction indicators
- [ ] Distance/time labels

### 4. User Interactions

- [ ] Pan and zoom
- [ ] Click marker to see details
- [ ] Fit bounds to all places
- [ ] Current location (optional)

---

## Technical Requirements

### Dependencies

```json
{
  "dependencies": {
    "mapbox-gl": "^3.x",
    "react-map-gl": "^7.x"
  }
}
```

### Environment Variables

```env
NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx
```

### Folder Structure

```
src/
├── components/
│   └── map/
│       ├── map-container.tsx       # Main map wrapper
│       ├── place-marker.tsx        # Custom marker component
│       ├── anchor-marker.tsx       # Anchor-specific marker
│       ├── hotel-marker.tsx        # Hotel/base marker
│       ├── route-layer.tsx         # Route lines
│       ├── map-controls.tsx        # Zoom, recenter buttons
│       └── place-popup.tsx         # Click popup
├── lib/
│   └── map/
│       ├── styles.ts               # Map style config
│       ├── bounds.ts               # Bounds calculation
│       └── markers.ts              # Marker helpers
└── hooks/
    └── use-map.ts                  # Map utilities hook
```

---

## Map Style

### Custom Style (Calm, Minimal)

```typescript
// lib/map/styles.ts

// Option 1: Use Mapbox Studio custom style
export const MAP_STYLE = 'mapbox://styles/username/style-id';

// Option 2: Modify standard style
export const MAP_STYLE = 'mapbox://styles/mapbox/light-v11';

// Style overrides for calm feel
export const styleOverrides = {
  // Muted colors
  // Reduced label density
  // Subtle water/land contrast
};
```

### Color Tokens for Map

```css
:root {
  /* Markers */
  --marker-anchor: #2563EB;       /* Blue - anchors */
  --marker-optional: #9CA3AF;     /* Gray - optional */
  --marker-hotel: #059669;        /* Green - hotel */
  
  /* Routes */
  --route-day-1: #3B82F6;
  --route-day-2: #8B5CF6;
  --route-day-3: #EC4899;
  --route-day-4: #F59E0B;
  --route-day-5: #10B981;
  
  /* UI */
  --map-popup-bg: #FFFFFF;
  --map-control-bg: #FFFFFF;
}
```

---

## Component Specifications

### MapContainer

```tsx
interface MapContainerProps {
  places: Place[];
  anchors: Anchor[];
  hotel?: { lat: number; lng: number; name: string };
  routes?: Route[];
  
  // Interactions
  onPlaceClick?: (place: Place) => void;
  onMapClick?: (lngLat: { lng: number; lat: number }) => void;
  
  // Display options
  showRoutes?: boolean;
  fitToPlaces?: boolean;
  interactive?: boolean;
}

// Features:
// - Auto-fit bounds on initial load
// - Smooth transitions on data change
// - Handles empty state gracefully
```

### PlaceMarker

```tsx
interface PlaceMarkerProps {
  place: Place;
  isAnchor: boolean;
  isSelected?: boolean;
  dayNumber?: number;          // For color coding
  orderInDay?: number;         // For numbering
  onClick?: () => void;
}

// Visual design:
// - Circle or custom icon based on activity type
// - Anchor: filled, larger, with star
// - Optional: outline, smaller
// - Numbered when part of itinerary
```

### HotelMarker

```tsx
interface HotelMarkerProps {
  location: { lat: number; lng: number };
  name: string;
}

// Visual design:
// - Distinct icon (home/hotel)
// - Always visible
// - Labeled
```

### RouteLayer

```tsx
interface RouteLayerProps {
  routes: Route[];
  activeDay?: number;
}

interface Route {
  day: number;
  segments: RouteSegment[];
}

interface RouteSegment {
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
  geometry: GeoJSON.LineString;   // From Mapbox Directions
  distance: number;                // meters
  duration: number;                // seconds
  mode: 'driving' | 'walking';
}

// Visual design:
// - Colored by day
// - Dashed for walking, solid for driving
// - Arrows showing direction
// - Hover to show distance/time
```

### PlacePopup

```tsx
interface PlacePopupProps {
  place: Place;
  onClose: () => void;
  onToggleAnchor?: () => void;
  onViewDetails?: () => void;
}

// Content:
// - Place name
// - Activity type
// - Distance from hotel
// - "Add to itinerary" button
// - Rating (if available)
```

---

## Mapbox Directions Integration

```typescript
// lib/map/directions.ts

interface DirectionsRequest {
  coordinates: [number, number][];  // [lng, lat] pairs
  profile: 'driving' | 'walking' | 'cycling';
  alternatives?: boolean;
}

interface DirectionsResponse {
  routes: {
    geometry: GeoJSON.LineString;
    distance: number;
    duration: number;
    legs: {
      distance: number;
      duration: number;
      steps: Step[];
    }[];
  }[];
}

async function getDirections(request: DirectionsRequest): Promise<DirectionsResponse> {
  const coords = request.coordinates.map(c => c.join(',')).join(';');
  
  const url = `https://api.mapbox.com/directions/v5/mapbox/${request.profile}/${coords}`;
  
  const params = new URLSearchParams({
    access_token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN!,
    geometries: 'geojson',
    overview: 'full',
  });
  
  const response = await fetch(`${url}?${params}`);
  return response.json();
}
```

---

## Bounds Calculation

```typescript
// lib/map/bounds.ts

import { LngLatBounds } from 'mapbox-gl';

function calculateBounds(points: { lat: number; lng: number }[]): LngLatBounds {
  if (points.length === 0) {
    // Default to world view or destination
    return new LngLatBounds([-180, -90], [180, 90]);
  }
  
  const bounds = new LngLatBounds();
  
  for (const point of points) {
    bounds.extend([point.lng, point.lat]);
  }
  
  return bounds;
}

function fitBoundsWithPadding(
  map: mapboxgl.Map, 
  bounds: LngLatBounds,
  options?: { padding?: number; maxZoom?: number }
) {
  map.fitBounds(bounds, {
    padding: options?.padding ?? 50,
    maxZoom: options?.maxZoom ?? 15,
    duration: 1000,
  });
}
```

---

## Map Controls

```tsx
interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRecenter: () => void;
  onToggleRoutes?: () => void;
  showingRoutes?: boolean;
}

// Layout:
// - Position: bottom-right
// - Vertical stack of buttons
// - Subtle background
// - Clear icons
```

---

## Responsive Design

```tsx
// Map container responsive behavior

// Desktop: Full map beside content
// Tablet: Map takes more vertical space
// Mobile: Map in collapsible section or bottom sheet

const mapHeights = {
  mobile: '300px',
  tablet: '400px',
  desktop: '100%',
};
```

---

## State Management

```tsx
// hooks/use-map.ts

interface UseMapReturn {
  mapRef: React.RefObject<mapboxgl.Map>;
  
  // Actions
  flyTo: (location: { lat: number; lng: number }, zoom?: number) => void;
  fitToPlaces: (places: Place[]) => void;
  highlightPlace: (placeId: string) => void;
  showRoute: (day: number) => void;
  
  // State
  currentZoom: number;
  currentCenter: { lat: number; lng: number };
  selectedPlace: Place | null;
}
```

---

## Acceptance Criteria

- [ ] Map renders with places
- [ ] Anchor markers are visually distinct
- [ ] Hotel marker shows
- [ ] Click marker opens popup
- [ ] Map fits to show all places
- [ ] Can zoom and pan
- [ ] Route lines display (when available)
- [ ] Works on mobile
- [ ] Smooth animations on state change
- [ ] Handles empty state (no places yet)

---

## Performance Considerations

- [ ] Lazy load map on scroll into view
- [ ] Use marker clustering for 20+ places
- [ ] Debounce zoom/pan events
- [ ] Optimize route geometry
- [ ] Consider SSR implications (map is client-only)

---

## Edge Cases

- [ ] No places yet (show destination center)
- [ ] All places in same location
- [ ] Places span multiple cities
- [ ] Mapbox token invalid
- [ ] Network error loading map
- [ ] Mobile with limited viewport

---

## Next Phase

Once complete, proceed to → `06-ROUTE-ENGINE.md`

