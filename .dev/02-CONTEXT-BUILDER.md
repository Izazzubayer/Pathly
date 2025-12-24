# 👤 Phase 02: Context Builder

## Goal

Build the human-first onboarding flow that captures *who* the user is before they start planning. This is a conversational, chat-style interface that feels natural and non-intrusive.

---

## PRD Reference

> "Before planning, the system understands *who the user is*."

**Inputs to capture:**
- Who are you traveling with? (Solo / Couple / Friends / Family)
- Travel vibe (Romantic / Party / Cultural / Chill / Balanced)
- Energy level (Low / Medium / High)
- Budget sensitivity
- Mobility tolerance

**UX Notes:**
- Conversational flow
- Saved context (not repeated)
- No long forms

---

## Deliverables

### 1. Context Data Model

- [ ] Define `UserContext` TypeScript interface
- [ ] Create context schema with validation
- [ ] Store in Zustand + localStorage persistence

### 2. Chat-Style UI

- [ ] Message bubble components
- [ ] User response options (chips/buttons)
- [ ] Typing indicator animation
- [ ] Progress indicator (subtle)

### 3. Question Flow

- [ ] Question sequencing logic
- [ ] Conditional questions (based on previous answers)
- [ ] Skip/back functionality
- [ ] Summary confirmation screen

### 4. Trip Details Input

- [ ] Destination input (city/region)
- [ ] Hotel/accommodation location
- [ ] Trip dates / duration
- [ ] Fixed events (e.g., "NYE at ICONSIAM")

---

## Technical Requirements

### Data Model

```tsx
// types/context.ts

type TravelCompanion = 'solo' | 'couple' | 'friends' | 'family';

type TravelVibe = 'romantic' | 'party' | 'cultural' | 'chill' | 'balanced';

type EnergyLevel = 'low' | 'medium' | 'high';

type BudgetLevel = 'budget' | 'moderate' | 'flexible' | 'luxury';

type MobilityLevel = 'limited' | 'moderate' | 'high';

interface UserContext {
  companion: TravelCompanion;
  vibe: TravelVibe;
  energy: EnergyLevel;
  budget: BudgetLevel;
  mobility: MobilityLevel;
}

interface TripDetails {
  destination: string;
  destinationCoords?: { lat: number; lng: number };
  hotelName?: string;
  hotelLocation?: { lat: number; lng: number };
  startDate: Date;
  endDate: Date;
  duration: number; // in days
  fixedEvents: FixedEvent[];
}

interface FixedEvent {
  id: string;
  name: string;
  date: Date;
  time?: string;
  location?: { lat: number; lng: number };
  isAnchor: boolean;
}
```

### Folder Structure

```
src/
├── app/
│   └── (planner)/
│       └── context/
│           └── page.tsx        # Context builder page
├── components/
│   └── context-builder/
│       ├── chat-container.tsx  # Main chat wrapper
│       ├── message-bubble.tsx  # Individual message
│       ├── option-chips.tsx    # Selection chips
│       ├── typing-indicator.tsx
│       ├── progress-bar.tsx
│       └── summary-card.tsx    # Final confirmation
├── lib/
│   └── questions.ts            # Question definitions
└── stores/
    └── trip-store.ts           # Updated with context
```

---

## Question Flow Design

### Questions Sequence

```typescript
const questions = [
  {
    id: 'companion',
    message: "Who are you traveling with?",
    type: 'single-select',
    options: [
      { value: 'solo', label: 'Just me', icon: '🧍' },
      { value: 'couple', label: 'With my partner', icon: '💑' },
      { value: 'friends', label: 'Friends', icon: '👯' },
      { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
    ],
  },
  {
    id: 'vibe',
    message: "What kind of trip vibe are you going for?",
    type: 'single-select',
    options: [
      { value: 'romantic', label: 'Romantic', icon: '💕' },
      { value: 'party', label: 'Party & Nightlife', icon: '🎉' },
      { value: 'cultural', label: 'Cultural & History', icon: '🏛️' },
      { value: 'chill', label: 'Relaxed & Chill', icon: '🌴' },
      { value: 'balanced', label: 'Mix of everything', icon: '⚖️' },
    ],
  },
  {
    id: 'energy',
    message: "How packed do you want your days?",
    type: 'single-select',
    options: [
      { value: 'low', label: 'Easy pace, few activities', icon: '🐢' },
      { value: 'medium', label: 'Balanced, with breaks', icon: '🚶' },
      { value: 'high', label: 'Action-packed!', icon: '🏃' },
    ],
  },
  {
    id: 'budget',
    message: "What's your budget comfort level?",
    type: 'single-select',
    options: [
      { value: 'budget', label: 'Budget-conscious', icon: '💰' },
      { value: 'moderate', label: 'Moderate spending', icon: '💳' },
      { value: 'flexible', label: 'Flexible', icon: '💎' },
      { value: 'luxury', label: 'Treat myself', icon: '👑' },
    ],
  },
  {
    id: 'mobility',
    message: "How much walking/moving are you comfortable with?",
    type: 'single-select',
    options: [
      { value: 'limited', label: 'Prefer minimal walking', icon: '🚗' },
      { value: 'moderate', label: 'Some walking is fine', icon: '🚶' },
      { value: 'high', label: 'Love exploring on foot', icon: '🥾' },
    ],
  },
];
```

---

## Component Specifications

### ChatContainer

```tsx
interface ChatContainerProps {
  onComplete: (context: UserContext) => void;
}

// Manages:
// - Current question index
// - Animation between questions
// - Scroll to latest message
// - Keyboard navigation
```

### MessageBubble

```tsx
interface MessageBubbleProps {
  type: 'system' | 'user';
  children: React.ReactNode;
  animate?: boolean;
}

// System messages: left-aligned, neutral bg
// User messages: right-aligned, accent bg
```

### OptionChips

```tsx
interface OptionChipsProps {
  options: Option[];
  selected?: string;
  onSelect: (value: string) => void;
  multiSelect?: boolean;
}

// Chip design:
// - Clear tap targets (min 44px)
// - Icon + label
// - Selected state with checkmark/highlight
```

---

## Animations (Framer Motion)

```tsx
// Message enter animation
const messageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
};

// Typing indicator
const typingVariants = {
  animate: {
    opacity: [0.4, 1, 0.4],
    transition: { duration: 1.5, repeat: Infinity }
  }
};

// Chip selection
const chipVariants = {
  tap: { scale: 0.98 },
  selected: { 
    backgroundColor: 'var(--accent-primary)',
    color: 'white'
  }
};
```

---

## State Management

```tsx
// stores/trip-store.ts (additions)

interface TripStore {
  // Context Builder state
  userContext: UserContext | null;
  setUserContext: (context: UserContext) => void;
  
  tripDetails: TripDetails | null;
  setTripDetails: (details: TripDetails) => void;
  
  // Persist to localStorage
  hydrated: boolean;
  setHydrated: () => void;
}

// Persist middleware for Zustand
import { persist } from 'zustand/middleware';
```

---

## Acceptance Criteria

- [ ] Chat flow completes without errors
- [ ] All 5 context questions work
- [ ] User selections persist across page refresh
- [ ] Animations are smooth (60fps)
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Screen reader announces messages
- [ ] Summary screen shows all selections
- [ ] Can edit previous answers
- [ ] Trip details (destination, dates) can be entered
- [ ] Validation for required fields

---

## UX Checkpoints

- [ ] Does it feel like a **conversation**, not a form?
- [ ] Is the pace **comfortable** (not too fast)?
- [ ] Are the options **clear and distinct**?
- [ ] Can users **change their mind** easily?
- [ ] Does it respect the "no long forms" principle?

---

## Edge Cases

- [ ] User refreshes mid-flow
- [ ] User navigates back to this page later
- [ ] Mobile keyboard handling
- [ ] Very long destination names
- [ ] Date range spanning months

---

## Next Phase

Once complete, proceed to → `03-SOCIAL-CAPTURE.md`

