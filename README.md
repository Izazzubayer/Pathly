# 🗺️ Route-Aware AI Travel Planner

Transform social inspiration into efficient, route-optimized travel itineraries.

## Features

- **Context Builder**: Chat-style onboarding to capture travel preferences
- **Social Intent Capture**: Ingest Instagram links and text to discover places
- **Anchor Places**: Mark must-visit places with time-locks
- **Route-Aware Optimization**: Minimize backtracking and travel distance
- **Day-by-Day Timeline**: Visual itinerary with morning/afternoon/evening slots
- **Interactive Map**: See your route on a map with place markers
- **AI Explanations**: Understand why each place was added to your itinerary
- **Vibe Matching**: Places matched to your travel style

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui (zinc theme)
- **State Management**: Zustand with persistence
- **Maps**: MapLibre GL (free, open-source) + react-map-gl
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- **No API keys required!** Uses free, open-source mapping services

### Installation

```bash
# Install dependencies
npm install

# No environment variables needed!
# The app uses free, open-source mapping services (MapLibre + OpenRouteService/OSRM)

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

**No environment variables required!** The app uses free, open-source services:
- **MapLibre GL**: Free map rendering (no API key needed)
- **OpenRouteService/OSRM**: Free routing APIs (no API key needed)

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (planner)/          # Planner route group
│   │   ├── context/        # Context builder
│   │   ├── capture/        # Social intent capture
│   │   ├── review/         # Anchor review & map
│   │   └── itinerary/      # Itinerary view
├── components/
│   ├── context-builder/    # Context builder components
│   ├── social-capture/     # Social capture components
│   ├── anchor-review/      # Anchor review components
│   ├── itinerary/          # Itinerary view components
│   ├── map/                # Map components
│   └── ui/                 # shadcn/ui components
├── services/
│   ├── route-engine/       # Route optimization engine
│   └── ai/                 # AI services (explanations, vibe matching)
├── stores/                 # Zustand stores
├── types/                  # TypeScript types
└── lib/                    # Utilities
```

## Development Phases

1. **Foundation**: Project setup, design system, core types
2. **Context Builder**: Chat-style onboarding
3. **Social Capture**: Instagram link parsing
4. **Intent Processing**: Place extraction and anchor system
5. **Map Integration**: MapLibre visualization
6. **Route Engine**: Itinerary optimization algorithm
7. **Itinerary Views**: Timeline and map split view
8. **AI & Polish**: Explanations, accessibility, performance

## Key Concepts

### Anchor Places
Must-visit places that anchor your itinerary. Can have time-locks (specific date/time).

### Route-Aware Optimization
The engine minimizes total travel distance by:
- Clustering places by proximity
- Assigning places to days
- Optimizing order within days (TSP)
- Respecting time-locked anchors

### Status Types
- **On-route**: No extra travel time (< 5 min)
- **Detour**: Small detour (5-15 min extra)
- **Optional**: Larger detour (> 15 min extra)
- **Anchor**: Must-visit place

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation throughout
- Screen reader support
- Reduced motion support
- Semantic HTML
- Skip links

## Performance

- Code splitting for heavy components
- Dynamic imports for map components
- Optimized images
- Lighthouse score target: ≥ 90

## License

MIT

## Author

Izaz Zubayer

