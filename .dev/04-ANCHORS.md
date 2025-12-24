# ⚓ Phase 04: Intent Processing & Anchor System

## Goal

Process captured social intents to extract place information, score confidence, and allow users to review and confirm "anchor" places that must be included in their itinerary.

---

## PRD Reference

### Social Intent Processing Pipeline

> **Step 1: Metadata Extraction** - Caption, hashtags, tagged locations
> **Step 2: Place & Activity Inference** - Place names, city refs, activity type
> **Step 3: Confidence Scoring** - High/Medium/Low based on source

### Anchor Places (Critical Concept)

> Rules:
> - Anchors are **never removed by AI**
> - Anchors **drive route planning**
> - Anchors can be **time-locked**

---

## Deliverables

### 1. Intent Processing

- [ ] Metadata extraction service
- [ ] Place name inference (AI-assisted)
- [ ] Activity type classification
- [ ] Confidence scoring logic
- [ ] Error handling for failed extractions

### 2. Place Resolution

- [ ] Google Places / Foursquare lookup
- [ ] Geocoding (lat/lng)
- [ ] Place deduplication
- [ ] Manual place search fallback

### 3. Anchor Review UI

- [ ] List of inferred places
- [ ] Confidence indicators
- [ ] Promote to anchor action
- [ ] Edit/correct place details
- [ ] Time-lock toggle for anchors
- [ ] Add manual places

### 4. Anchor Management

- [ ] Anchor CRUD operations
- [ ] Time/date constraints
- [ ] Order preference (optional)
- [ ] Anchor validation

---

## Technical Requirements

### Data Model

```tsx
// types/places.ts

type ConfidenceLevel = 'high' | 'medium' | 'low';

type ActivityType = 
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

interface Place {
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

interface Anchor extends Place {
  isAnchor: true;
  timeLock?: {
    date: Date;
    time?: string;              // "14:00" or "evening"
    flexible: boolean;          // Can be moved within the day?
  };
  priority: number;             // For ordering
}

interface OpeningHours {
  periods: {
    day: number;
    open: string;
    close: string;
  }[];
  isOpenNow?: boolean;
}
```

### Folder Structure

```
src/
├── app/
│   └── (planner)/
│       └── review/
│           └── page.tsx              # Anchor review page
│   └── api/
│       └── process/
│           ├── route.ts              # Process intent endpoint
│           └── places/
│               └── route.ts          # Place lookup endpoint
├── components/
│   └── anchor-review/
│       ├── review-container.tsx      # Main review layout
│       ├── place-card.tsx            # Individual place
│       ├── confidence-badge.tsx      # High/Med/Low indicator
│       ├── anchor-toggle.tsx         # Mark as anchor
│       ├── time-lock-picker.tsx      # Date/time constraint
│       ├── place-editor.tsx          # Edit place details
│       ├── manual-add.tsx            # Add place manually
│       └── anchor-summary.tsx        # Summary of anchors
├── services/
│   ├── intent-processor.ts           # Main processing logic
│   ├── place-resolver.ts             # Google/Foursquare lookup
│   └── inference-engine.ts           # AI inference (placeholder)
└── stores/
    └── places-store.ts               # Places & anchors state
```

---

## Processing Pipeline

### Step 1: Metadata Extraction

```typescript
// services/intent-processor.ts

interface ProcessingResult {
  places: Place[];
  warnings: string[];
  failureReason?: string;
}

async function processIntent(intent: SocialIntent): Promise<ProcessingResult> {
  // For Instagram URLs, attempt to get public metadata
  // Note: Instagram requires auth for most data
  // MVP approach: Extract from URL patterns + user input
  
  if (intent.source === 'instagram-reel' || intent.source === 'instagram-post') {
    return processInstagramIntent(intent);
  }
  
  if (intent.source === 'text') {
    return processTextIntent(intent);
  }
  
  return processGenericUrl(intent);
}

async function processTextIntent(intent: SocialIntent): Promise<ProcessingResult> {
  // Use AI to extract place references from text
  const extracted = await inferPlacesFromText(intent.rawInput);
  
  const places: Place[] = [];
  
  for (const inference of extracted) {
    // Try to resolve to real place
    const resolved = await resolvePlaceByName(inference.name, tripDestination);
    
    if (resolved) {
      places.push({
        ...resolved,
        sourceIntentId: intent.id,
        confidence: inference.confidence,
        inferenceReason: 'From text reference',
      });
    }
  }
  
  return { places, warnings: [] };
}
```

### Step 2: Place Resolution

```typescript
// services/place-resolver.ts

interface PlaceSearchResult {
  places: Place[];
  query: string;
}

async function resolvePlaceByName(
  name: string, 
  nearLocation: { lat: number; lng: number }
): Promise<Place | null> {
  // Option 1: Google Places API
  // Option 2: Foursquare Places API
  // Option 3: Mapbox Geocoding
  
  const results = await searchPlaces({
    query: name,
    location: nearLocation,
    radius: 50000, // 50km
  });
  
  if (results.length === 0) return null;
  
  // Return best match
  return results[0];
}

async function searchPlaces(params: {
  query: string;
  location: { lat: number; lng: number };
  radius: number;
  type?: ActivityType;
}): Promise<Place[]> {
  // Implementation using Google Places or Foursquare
}
```

### Step 3: Confidence Scoring

```typescript
// lib/confidence.ts

function calculateConfidence(source: IntentSource, hasLocationTag: boolean, hasExactMatch: boolean): ConfidenceLevel {
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
```

---

## Component Specifications

### PlaceCard

```tsx
interface PlaceCardProps {
  place: Place;
  isAnchor: boolean;
  onToggleAnchor: () => void;
  onEdit: () => void;
  onRemove: () => void;
}

// Visual elements:
// - Place name (prominent)
// - Activity type icon
// - Confidence badge
// - Anchor toggle (star icon)
// - Time-lock indicator if set
// - Edit/remove actions
```

### ConfidenceBadge

```tsx
interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
  reason?: string;
}

// Styling:
// High: Green, solid
// Medium: Yellow, outline
// Low: Gray, dashed outline

// Tooltip shows inference reason
```

### TimeLockPicker

```tsx
interface TimeLockPickerProps {
  value?: Anchor['timeLock'];
  tripDates: { start: Date; end: Date };
  onChange: (timeLock: Anchor['timeLock']) => void;
}

// Features:
// - Date picker (constrained to trip dates)
// - Time picker (optional)
// - "Flexible" toggle
// - Clear button
```

### ManualAddPlace

```tsx
interface ManualAddPlaceProps {
  destination: string;
  onAdd: (place: Place) => void;
}

// Features:
// - Search input with autocomplete
// - Recent searches
// - "Add as anchor" checkbox
```

---

## State Management

```tsx
// stores/places-store.ts

interface PlacesStore {
  // All discovered places
  places: Place[];
  
  // Anchors (subset of places)
  anchors: Anchor[];
  
  // Processing state
  processingIntents: Set<string>;
  
  // Actions
  addPlace: (place: Place) => void;
  updatePlace: (id: string, updates: Partial<Place>) => void;
  removePlace: (id: string) => void;
  
  promoteToAnchor: (placeId: string) => void;
  demoteFromAnchor: (placeId: string) => void;
  updateAnchorTimeLock: (id: string, timeLock: Anchor['timeLock']) => void;
  reorderAnchors: (ids: string[]) => void;
  
  // Computed
  getPlacesByConfidence: (level: ConfidenceLevel) => Place[];
  getAnchorsByDate: (date: Date) => Anchor[];
}
```

---

## UI Layout

```
┌─────────────────────────────────────────────────────────┐
│  Review Your Places                                      │
│  We found 8 places from your saved content               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ⭐ Your Anchors (3)                                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │ 🏛️ ICONSIAM           ⭐ │ 📅 Dec 31, Evening  │   │
│  │ High confidence • Shopping mall                   │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │ 🍸 Rabbit Hole Club    ⭐ │ 📅 Any evening      │   │
│  │ Medium confidence • Bar/Club                      │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  📍 Other Discovered Places (5)                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ ☕ Blue Whale Café     ☆  │ ─                    │   │
│  │ Medium confidence • Café                          │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │ 🌅 Mahanakhon Skywalk  ☆  │ ─                    │   │
│  │ Low confidence • Viewpoint                        │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ + Add a place manually                            │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  [ Continue to Map & Route ]                             │
└─────────────────────────────────────────────────────────┘
```

---

## Acceptance Criteria

- [ ] Text-based intents are processed
- [ ] Places are resolved to real locations
- [ ] Confidence levels display correctly
- [ ] Can mark place as anchor
- [ ] Can set time-lock on anchor
- [ ] Can edit place name/type
- [ ] Can remove places
- [ ] Can add places manually
- [ ] Anchors section shows separately
- [ ] Continue button enabled with at least 1 anchor
- [ ] Processing state shows during resolution

---

## Edge Cases

- [ ] No places found from intent
- [ ] Multiple places with same name
- [ ] Place not in destination city
- [ ] Place API returns no results
- [ ] All anchors on same day (warning)
- [ ] Anchor time conflicts

---

## AI Integration Notes (For Phase 08)

The `inference-engine.ts` will be enhanced with:
- NLP for extracting place names from messy text
- Activity type classification
- Vibe matching (romantic café vs party club)

For MVP, use simple pattern matching and direct Place API search.

---

## Next Phase

Once complete, proceed to → `05-MAPS.md`

