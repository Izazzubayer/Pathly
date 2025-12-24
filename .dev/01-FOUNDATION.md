# 🏗️ Phase 01: Foundation & Setup

## Goal

Set up the Next.js project with shadcn/ui (zinc theme), configure the development environment, and establish the app structure.

---

## Deliverables

### 1. Project Initialization

- [ ] Create Next.js 15 project with App Router
- [ ] TypeScript configuration
- [ ] Tailwind CSS v4 setup
- [ ] Initialize shadcn/ui with zinc theme
- [ ] Install Framer Motion
- [ ] Install Zustand
- [ ] ESLint + Prettier setup

### 2. shadcn Components

- [ ] Install core UI components (see list below)
- [ ] Add custom status colors to globals.css
- [ ] Verify dark mode works

### 3. App Structure

- [ ] Create folder structure
- [ ] Set up root layout
- [ ] Create planner route group
- [ ] Initialize Zustand store

---

## Commands

### Project Setup

```bash
# Create Next.js project
npx create-next-app@latest trip-planner --typescript --tailwind --eslint --app --src-dir

# Navigate to project
cd trip-planner

# Initialize shadcn with zinc theme
npx shadcn@latest init
# Select: zinc, CSS variables, src/components path
```

### Install shadcn Components

```bash
# Core components (one command)
npx shadcn@latest add button card badge input label dialog drawer sheet tooltip skeleton spinner separator scroll-area tabs radio-group switch calendar progress sonner alert-dialog avatar popover command resizable collapsible
```

### Additional Dependencies

```bash
# State management
npm install zustand

# Animation
npm install framer-motion

# Map (for Phase 05)
npm install mapbox-gl react-map-gl

# Utilities
npm install clsx tailwind-merge

# Icons (already included with shadcn)
npm install lucide-react
```

---

## Folder Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing / entry
│   ├── globals.css             # Styles + custom tokens
│   └── (planner)/              # Planner flow route group
│       ├── layout.tsx          # Planner layout
│       ├── context/
│       │   └── page.tsx        # Step 1: Context builder
│       ├── capture/
│       │   └── page.tsx        # Step 2: Social capture
│       ├── review/
│       │   └── page.tsx        # Step 3: Anchor review
│       └── itinerary/
│           └── page.tsx        # Step 4: Final itinerary
├── components/
│   ├── ui/                     # shadcn components (auto-generated)
│   └── custom/                 # Our compositions
│       └── status-badge.tsx    # Status indicator wrapper
├── lib/
│   ├── utils.ts                # cn() helper
│   └── constants.ts            # App constants
├── stores/
│   └── trip-store.ts           # Zustand store
├── types/
│   └── index.ts                # TypeScript types
└── hooks/
    └── use-trip.ts             # Custom hooks
```

---

## Custom CSS Tokens

Add to `globals.css` after shadcn's defaults:

```css
@layer base {
  :root {
    /* Status colors for route indicators */
    --status-on-route: 142 76% 36%;     /* Green */
    --status-detour: 45 93% 47%;        /* Amber */
    --status-optional: 217 91% 60%;     /* Blue */
    --status-anchor: 262 83% 58%;       /* Violet */
  }

  .dark {
    --status-on-route: 142 70% 45%;
    --status-detour: 45 93% 55%;
    --status-optional: 217 91% 70%;
    --status-anchor: 262 83% 68%;
  }
}
```

---

## Zustand Store (Initial)

```tsx
// stores/trip-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TripStore {
  // Current step
  currentStep: 'context' | 'capture' | 'review' | 'itinerary';
  setCurrentStep: (step: TripStore['currentStep']) => void;
  
  // User context (Phase 02)
  userContext: UserContext | null;
  setUserContext: (context: UserContext) => void;
  
  // Trip details (Phase 02)
  tripDetails: TripDetails | null;
  setTripDetails: (details: TripDetails) => void;
  
  // Reset
  reset: () => void;
}

export const useTripStore = create<TripStore>()(
  persist(
    (set) => ({
      currentStep: 'context',
      setCurrentStep: (step) => set({ currentStep: step }),
      
      userContext: null,
      setUserContext: (context) => set({ userContext: context }),
      
      tripDetails: null,
      setTripDetails: (details) => set({ tripDetails: details }),
      
      reset: () => set({
        currentStep: 'context',
        userContext: null,
        tripDetails: null,
      }),
    }),
    { name: 'trip-planner-store' }
  )
);
```

---

## TypeScript Types (Initial)

```tsx
// types/index.ts

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
```

---

## Custom Status Badge

```tsx
// components/custom/status-badge.tsx
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PlaceStatus } from '@/types';

const statusConfig: Record<PlaceStatus, { label: string; className: string }> = {
  'on-route': {
    label: 'On the way',
    className: 'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20',
  },
  'detour': {
    label: 'Small detour',
    className: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20',
  },
  'optional': {
    label: 'Optional',
    className: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20',
  },
  'anchor': {
    label: 'Must visit',
    className: 'bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/20',
  },
};

interface StatusBadgeProps {
  status: PlaceStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
```

---

## Root Layout

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'Trip Planner - Route-Aware AI Itineraries',
  description: 'Transform social inspiration into efficient, route-optimized travel itineraries.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

---

## Planner Layout

```tsx
// app/(planner)/layout.tsx
export default function PlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Optional: Progress indicator */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
```

---

## Acceptance Criteria

- [ ] `npm run dev` starts without errors
- [ ] shadcn components render correctly
- [ ] Zinc theme is applied
- [ ] Dark mode toggle works (if added)
- [ ] Zustand store persists across refresh
- [ ] TypeScript compiles without errors
- [ ] Folder structure is correct
- [ ] Custom status badge works

---

## Verification Steps

1. Run `npm run dev`
2. Visit `http://localhost:3000`
3. Check browser console for errors
4. Test a shadcn component (Button, Card)
5. Check localStorage for store persistence
6. Toggle dark mode (if enabled)

---

## Next Phase

Once complete, proceed to → `02-CONTEXT-BUILDER.md`
