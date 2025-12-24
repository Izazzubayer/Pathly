# 🗺️ Development Roadmap

## Route-Aware AI Travel Planner

This document outlines the development phases for the MVP. Each phase builds upon the previous, ensuring a stable foundation before adding complexity.

---

## Development Phases Overview

| Phase | Name | Focus | Est. Complexity |
|-------|------|-------|-----------------|
| 01 | Foundation & Design System | Project setup, design tokens, core UI | ⭐⭐ |
| 02 | Context Builder | User onboarding, preferences | ⭐⭐ |
| 03 | Social Intent Capture | Link drop zone, URL handling | ⭐⭐⭐ |
| 04 | Intent Processing & Anchors | Place extraction, anchor management | ⭐⭐⭐⭐ |
| 05 | Map Integration | Mapbox, visualization, geolocation | ⭐⭐⭐ |
| 06 | Route Engine | Itinerary generation, optimization | ⭐⭐⭐⭐⭐ |
| 07 | Itinerary Views | Timeline, detours, regeneration | ⭐⭐⭐ |
| 08 | AI & Polish | Explanations, accessibility, perf | ⭐⭐⭐⭐ |

---

## Dependency Graph

```
Phase 01 (Foundation)
    │
    ├── Phase 02 (Context Builder)
    │       │
    │       └── Phase 04 (Anchors) ──┐
    │                                │
    └── Phase 03 (Social Capture) ───┤
                                     │
                    Phase 05 (Maps) ─┤
                                     │
                                     ▼
                            Phase 06 (Route Engine)
                                     │
                                     ▼
                            Phase 07 (Itinerary Views)
                                     │
                                     ▼
                            Phase 08 (AI & Polish)
```

---

## Tech Stack Summary

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Mapbox GL JS
- Zustand

### Backend / API
- Next.js API Routes
- Server Actions (where appropriate)

### External Services
- Mapbox Directions API
- Google Places API / Foursquare
- AI models via Hugging Face / API

---

## UX Screens (From PRD)

1. **Social Link Drop Zone** → Phase 03
2. **Anchor Review & Confirmation** → Phase 04
3. **Context Builder (chat-style)** → Phase 02
4. **Map-First Itinerary View** → Phase 05 + 07
5. **Day Timeline View** → Phase 07
6. **Optional Detours Drawer** → Phase 07
7. **Partial Regeneration Controls** → Phase 07

---

## Development Principles

1. **Build incrementally** — each phase should be demo-able
2. **Accessibility first** — semantic HTML, keyboard nav, ARIA
3. **State management** — Zustand for global, React state for local
4. **API design** — explicit context passing, no magic
5. **AI integration** — AI suggests, code decides

---

## Files in This Folder

- `00-ROADMAP.md` — This file (overview)
- `01-FOUNDATION.md` — Project setup & design system
- `02-CONTEXT-BUILDER.md` — User onboarding flow
- `03-SOCIAL-CAPTURE.md` — Link drop & URL parsing
- `04-ANCHORS.md` — Place extraction & anchor system
- `05-MAPS.md` — Mapbox integration
- `06-ROUTE-ENGINE.md` — Itinerary optimization
- `07-ITINERARY-VIEWS.md` — UI screens & interactions
- `08-AI-POLISH.md` — AI integration & refinement

---

## How to Use This Plan

1. Start with Phase 01
2. Complete each phase before moving on
3. Each phase file contains:
   - Goals & deliverables
   - Technical requirements
   - Component/file structure
   - Acceptance criteria
4. Mark phases as complete as you go

---

## Current Status

- [ ] Phase 01: Foundation & Design System
- [ ] Phase 02: Context Builder
- [ ] Phase 03: Social Intent Capture
- [ ] Phase 04: Intent Processing & Anchors
- [ ] Phase 05: Map Integration
- [ ] Phase 06: Route Engine
- [ ] Phase 07: Itinerary Views
- [ ] Phase 08: AI & Polish

---

**Ready to start? Open `01-FOUNDATION.md`**

