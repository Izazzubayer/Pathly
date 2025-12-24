# 📅 Phase 07: Itinerary Views & Interactions

## Goal

Build the final user-facing screens: Day Timeline View, Optional Detours Drawer, and Partial Regeneration Controls. These screens let users view, understand, and adjust their itinerary.

---

## PRD Reference

### UX Screens
> 4. Map-First Itinerary View
> 5. Day Timeline View
> 6. Optional Detours Drawer
> 7. Partial Regeneration Controls

### Nearby vs Optional Suggestions
> Each place is labeled:
> - 🟢 On the way
> - 🟡 Small detour
> - 🔵 Optional bonus

---

## Deliverables

### 1. Day Timeline View

- [ ] Day selector / navigator
- [ ] Vertical timeline layout
- [ ] Place cards with timing
- [ ] Travel segments between places
- [ ] Time slot groupings (Morning/Afternoon/Evening)

### 2. Place Cards (Enhanced)

- [ ] Full place details
- [ ] Status badge (on-route/detour/optional)
- [ ] Explanation text
- [ ] Edit/remove actions
- [ ] Drag to reorder

### 3. Optional Detours Drawer

- [ ] Slide-up/slide-in panel
- [ ] List of optional places
- [ ] Sorted by proximity/relevance
- [ ] Quick add to itinerary
- [ ] Detour cost preview

### 4. Partial Regeneration

- [ ] "Regenerate this day" button
- [ ] "Optimize order" button
- [ ] Undo/redo support
- [ ] Confirmation before regenerate

### 5. Split View (Map + Timeline)

- [ ] Responsive layout
- [ ] Synced selection (click timeline → map highlights)
- [ ] Day filter on map

---

## Technical Requirements

### Folder Structure

```
src/
├── app/
│   └── (planner)/
│       └── itinerary/
│           ├── page.tsx              # Main itinerary page
│           └── [day]/
│               └── page.tsx          # Single day view (optional)
├── components/
│   └── itinerary/
│       ├── itinerary-layout.tsx      # Split view layout
│       ├── day-selector.tsx          # Day tabs/navigation
│       ├── timeline-view.tsx         # Vertical timeline
│       ├── timeline-place.tsx        # Place in timeline
│       ├── travel-segment.tsx        # Travel between places
│       ├── time-slot-header.tsx      # Morning/Afternoon headers
│       ├── detours-drawer.tsx        # Optional places panel
│       ├── detour-card.tsx           # Individual detour
│       ├── regenerate-controls.tsx   # Regeneration buttons
│       └── itinerary-summary.tsx     # Overview stats
└── hooks/
    ├── use-itinerary-sync.ts         # Map-timeline sync
    └── use-drag-reorder.ts           # Drag and drop
```

---

## Component Specifications

### ItineraryLayout

```tsx
interface ItineraryLayoutProps {
  itinerary: Itinerary;
  children: React.ReactNode;
}

// Layout structure:
// Desktop: 60% Map | 40% Timeline (side by side)
// Tablet: Map top, Timeline bottom (stacked)
// Mobile: Tab between Map and Timeline

// Features:
// - Resizable divider (desktop)
// - Smooth transitions between views
// - Persisted view preference
```

### DaySelector

```tsx
interface DaySelectorProps {
  days: ItineraryDay[];
  activeDay: number;
  onDayChange: (dayNumber: number) => void;
}

// Design options:
// 1. Horizontal tabs (scrollable on mobile)
// 2. Dropdown selector
// 3. Calendar-style mini picker

// Content per day tab:
// - Day number & date
// - Place count
// - Distance summary (optional)
```

### TimelineView

```tsx
interface TimelineViewProps {
  day: ItineraryDay;
  onPlaceClick: (place: ItineraryPlace) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onRemove: (placeId: string) => void;
}

// Structure:
// [Time Slot Header: Morning]
//   │
//   ├── [Place Card: Hotel Departure]
//   │      ↓ 15 min walk
//   ├── [Place Card: Café]
//   │      ↓ 10 min walk
//   ├── [Place Card: Temple]
//   │
// [Time Slot Header: Afternoon]
//   │
//   ├── [Place Card: Lunch]
//   ...
```

### TimelinePlace

```tsx
interface TimelinePlaceProps {
  place: ItineraryPlace;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  dragHandleProps?: DragHandleProps;
}

// Visual elements:
// ┌─────────────────────────────────────┐
// │ [Drag] 🏛️ Temple of Dawn    ⭐ 🟢   │
// │        09:30 - 10:30 (1hr)          │
// │        "Perfect for morning light"   │
// │        [Edit] [Remove]               │
// └─────────────────────────────────────┘
```

### TravelSegment

```tsx
interface TravelSegmentProps {
  from: ItineraryPlace;
  to: ItineraryPlace;
  segment: RouteSegment;
  showOptional?: boolean;  // Show add-detour button
}

// Visual:
//    │
//    │  🚶 15 min (1.2 km)
//    │  [+ Add stop on the way]
//    ↓
```

### DetoursDrawer

```tsx
interface DetoursDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  detours: DetourScore[];
  onAddDetour: (place: Place, afterPlaceId: string) => void;
  currentDay: number;
}

// Features:
// - Slide up from bottom (mobile)
// - Slide in from right (desktop)
// - Sorted by relevance
// - Filter by category
// - Shows detour cost
```

### DetourCard

```tsx
interface DetourCardProps {
  detour: DetourScore;
  onAdd: () => void;
}

// Visual:
// ┌─────────────────────────────────────┐
// │ ☕ Blue Whale Café              🟡   │
// │ +8 min detour • Matches your vibe   │
// │                          [+ Add]     │
// └─────────────────────────────────────┘
```

### RegenerateControls

```tsx
interface RegenerateControlsProps {
  dayNumber: number;
  onRegenerateDay: () => void;
  onOptimizeOrder: () => void;
  onUndo: () => void;
  canUndo: boolean;
}

// Buttons:
// [🔄 Optimize Order] - Rerun TSP
// [↻ Regenerate Day] - Full regeneration
// [↩ Undo] - Revert last change
```

---

## Drag and Drop

```tsx
// hooks/use-drag-reorder.ts

import { useDrag, useDrop } from 'react-dnd'; // or use @dnd-kit

interface UseDragReorderOptions {
  items: ItineraryPlace[];
  onReorder: (fromIndex: number, toIndex: number) => void;
}

function useDragReorder(options: UseDragReorderOptions) {
  // Implementation for drag-to-reorder
  // Constraints:
  // - Cannot drag anchors with time-locks
  // - Visual feedback during drag
  // - Haptic feedback on mobile
}
```

---

## Status Badges

```tsx
// components/ui/status-badge.tsx

const statusConfig = {
  'on-route': {
    label: 'On the way',
    icon: '🟢',
    color: 'var(--status-on-route)',
    description: 'No extra travel time',
  },
  'detour': {
    label: 'Small detour',
    icon: '🟡',
    color: 'var(--status-detour)',
    description: 'Adds a few minutes',
  },
  'optional': {
    label: 'Optional',
    icon: '🔵',
    color: 'var(--status-optional)',
    description: 'Worth the trip',
  },
  'anchor': {
    label: 'Must visit',
    icon: '⭐',
    color: 'var(--accent-primary)',
    description: 'Your priority place',
  },
};
```

---

## Animations

```tsx
// Timeline animations
const timelineVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const placeVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

// Drawer animations
const drawerVariants = {
  closed: { y: '100%' },
  open: { 
    y: 0,
    transition: { type: 'spring', damping: 25 }
  },
};

// Drag feedback
const dragVariants = {
  dragging: {
    scale: 1.02,
    boxShadow: 'var(--shadow-lg)',
    zIndex: 100,
  },
};
```

---

## Map-Timeline Sync

```tsx
// hooks/use-itinerary-sync.ts

interface UseItinerarySyncReturn {
  selectedPlace: ItineraryPlace | null;
  selectPlace: (place: ItineraryPlace) => void;
  clearSelection: () => void;
  
  // Map will highlight selected place
  // Timeline will scroll to selected place
}

function useItinerarySync(itinerary: Itinerary) {
  const [selectedPlace, setSelectedPlace] = useState<ItineraryPlace | null>(null);
  
  const selectPlace = useCallback((place: ItineraryPlace) => {
    setSelectedPlace(place);
    
    // Notify map to highlight
    // Scroll timeline to place
  }, []);
  
  return { selectedPlace, selectPlace, clearSelection };
}
```

---

## Responsive Layout

```tsx
// Mobile: Full-screen views with tab navigation
// Tablet: Stacked layout (map on top)
// Desktop: Side-by-side split view

const layoutBreakpoints = {
  mobile: '(max-width: 639px)',
  tablet: '(min-width: 640px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
};

// Mobile view switcher
interface MobileViewProps {
  view: 'map' | 'timeline';
  onViewChange: (view: 'map' | 'timeline') => void;
}
```

---

## Itinerary Summary

```tsx
interface ItinerarySummaryProps {
  itinerary: Itinerary;
}

// Display:
// ┌─────────────────────────────────────┐
// │ Your 5-Day Bangkok Trip             │
// ├─────────────────────────────────────┤
// │ 📍 12 places • ⭐ 5 anchors          │
// │ 🚗 45 km total • ⏱️ 8hr travel       │
// │ ✨ 87/100 efficiency score          │
// └─────────────────────────────────────┘
```

---

## Acceptance Criteria

### Timeline View
- [ ] All days display correctly
- [ ] Day switching works smoothly
- [ ] Places show in correct order
- [ ] Travel segments show times
- [ ] Time slots are grouped
- [ ] Status badges display

### Interactions
- [ ] Click place → highlights on map
- [ ] Drag to reorder works
- [ ] Remove place works
- [ ] Time-locked anchors cannot be moved
- [ ] Undo works after changes

### Detours Drawer
- [ ] Opens/closes smoothly
- [ ] Shows relevant optional places
- [ ] Adding detour updates itinerary
- [ ] Shows detour cost

### Regeneration
- [ ] Optimize order works
- [ ] Regenerate day works
- [ ] Confirmation dialog shows
- [ ] Loading state during regeneration

### Responsive
- [ ] Mobile view switching works
- [ ] Tablet stacked layout works
- [ ] Desktop split view works

---

## Edge Cases

- [ ] Empty day (no places yet)
- [ ] Single place day
- [ ] Very long day (10+ places)
- [ ] Scroll performance with animations
- [ ] Drag during scroll
- [ ] Touch vs mouse interactions

---

## Next Phase

Once complete, proceed to → `08-AI-POLISH.md`

