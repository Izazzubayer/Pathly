# 🧭 Route-Aware AI Travel Planner
### Turning Social Inspiration into Efficient, Human-Centered Itineraries

---

## 1. Overview

**Route-Aware AI Travel Planner** is a web-based application that helps travelers transform **messy social inspiration** (Instagram reels, saved posts, shared links) into **clear, efficient, route-optimized travel itineraries**.

Unlike traditional travel apps that focus only on recommendations, this system focuses on:
- **Human context**
- **Geographical efficiency**
- **Real-world decision-making workflows**

The product is designed to feel **simple for users** while handling **high complexity internally**.

---

## 2. Core Problem

### The Real Workflow (Today)

When planning a trip, users:
1. Receive Instagram Reels from partners/friends
2. Save posts without structure
3. Manually copy place names into Notes
4. Search locations one-by-one on Google Maps
5. Try to mentally optimize routes
6. Waste time, backtrack, and feel overwhelmed

This process is:
- Time-consuming
- Cognitively expensive
- Error-prone
- Not supported by any single tool

---

## 3. Key Insight

> **People decide *what* they want to do socially, but plan *how* to do it alone.**

This product bridges that gap by:
- Respecting places users already care about
- Reducing invisible planning labor
- Optimizing movement, not just choices

---

## 4. Product Principles

1. **AI suggests, humans decide**
2. **No backtracking unless intentional**
3. **Clarity over completeness**
4. **Explain every AI decision**
5. **Never override user intent**

---

## 5. Target Users

### Primary
- First-time travelers
- Couples
- Small groups (friends/family)
- Short trips (3–7 days)

### Example Persona
- Couple traveling from Bangladesh to Thailand
- Staying at Four Wings Hotel, Bangkok
- Fixed plan: ICONSIAM on New Year’s Eve
- Wants a club on the way back, not a detour

---

## 6. Core Features

---

### 6.1 Context Builder (Human-First Onboarding)

Before planning, the system understands *who the user is*.

**Inputs:**
- Who are you traveling with?
  - Solo / Couple / Friends / Family
- Travel vibe:
  - Romantic / Party / Cultural / Chill / Balanced
- Energy level:
  - Low / Medium / High
- Budget sensitivity
- Mobility tolerance

**UX Notes:**
- Conversational flow
- Saved context (not repeated)
- No long forms

---

### 6.2 Social Intent Capture (Instagram → Plan)

Users can paste:
- Instagram Reel links
- Instagram post links
- Multiple links at once
- Manual text references

**User does NOT need to:**
- Extract place names
- Organize lists
- Validate locations manually

---

### 6.3 Social Intent Processing Pipeline

**Step 1: Metadata Extraction**
- Caption text
- Hashtags
- Tagged locations
- Optional comments

**Step 2: Place & Activity Inference**
- Place names
- City references
- Activity type (club, café, viewpoint, beach)

**Step 3: Confidence Scoring**
- High: explicit location tags
- Medium: caption-based inference
- Low: contextual inference

Users can review and confirm inferred places.

---

### 6.4 Anchor Places (Critical Concept)

**Anchor places** are locations the user explicitly wants to visit.

Rules:
- Anchors are never removed by AI
- Anchors drive route planning
- Anchors can be time-locked (e.g., NYE event)

Examples:
- ICONSIAM
- A viral café from Instagram
- A must-visit club

---

### 6.5 Route-Aware Itinerary Engine

The engine optimizes **movement**, not just recommendations.

**Inputs:**
- Hotel location
- Anchor places
- Trip duration
- User context
- Fixed-time events

**Outputs:**
- Day-by-day itinerary
- Morning / Afternoon / Evening flow
- Minimal backtracking
- Clear spatial logic

**Daily Flow Example:**
Hotel → Anchor A → Nearby B → Nearby C → Anchor D → Optional E → Hotel


---

### 6.6 Nearby vs Optional Suggestions

Each place is labeled:
- 🟢 On the way
- 🟡 Small detour
- 🔵 Optional bonus

This prevents:
- FOMO pressure
- Over-packed days
- User fatigue

---

### 6.7 Explainable Recommendations

Every suggestion includes:
- Why it was selected
- How it fits the user’s vibe
- Distance impact
- Time cost

**Example:**
> “Suggested because it’s 6 minutes from ICONSIAM and matches late-night couple vibes.”

---

## 7. UX Screens

1. Social Link Drop Zone
2. Anchor Review & Confirmation
3. Context Builder (chat-style)
4. Map-First Itinerary View
5. Day Timeline View
6. Optional Detours Drawer
7. Partial Regeneration Controls

---

## 8. Technical Architecture

---

### 8.1 Frontend

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Mapbox GL JS
- Zustand (state management)

---

### 8.2 Backend / API

- Next.js API routes
- Stateless AI calls
- Explicit context passing
- Caching for performance

---

## 9. AI & ML Stack

---

### 9.1 Language Reasoning
Used for:
- Intent understanding
- Explanation generation
- Context alignment

**Models:**
- `google/flan-t5-large`
- `facebook/bart-large-mnli`

---

### 9.2 Semantic Similarity & Clustering
Used for:
- Grouping nearby activities
- Matching vibe to places

**Models:**
- `sentence-transformers/all-MiniLM-L6-v2`
- `BAAI/bge-base-en-v1.5`

---

### 9.3 Vision (Optional / Advanced)
Used for:
- Screenshot-based place inference
- Landmark recognition

**Models:**
- `openai/clip-vit-base-patch32`
- `facebook/dino-v2`

---

### 9.4 Routing & Geography
- Mapbox Directions API
- Graph-based shortest path logic
- AI ranks, algorithm orders

---

## 10. Edge Cases & Constraints

- Ambiguous place names
- Duplicate reels
- Viral content without tags
- Night-only venues
- Conflicting anchors
- Traffic-heavy routes

---

## 11. Accessibility & Ethics

- Clear, simple language
- No FOMO-inducing copy
- Transparent AI logic
- No hidden sponsorship bias
- User retains full control

---

## 12. Metrics of Success

- Reduced daily travel distance
- Reduced backtracking
- Fewer full regenerations
- Faster planning time
- Lower perceived effort

---

## 13. What This Project Demonstrates

- Human-centered AI design
- System thinking
- UX + engineering integration
- Real-world constraint handling
- Enterprise-grade product maturity

This is **not a travel app**.  
This is an **AI-powered decision-support system**.

---

## 14. Portfolio Positioning Statement

> “I designed and built a route-aware AI system that converts unstructured social inspiration into efficient, explainable itineraries—reducing cognitive load and travel friction.”

---

## 15. Future Enhancements

- Real-time replanning
- Offline mode
- Multi-city trips# 🧠 CONTEXT.md
## Route-Aware AI Travel Planner (Social-Inspired Itinerary System)

---

## 1. Purpose of This Document

This document exists to provide **deep contextual grounding** for Cursor (AI-assisted development) so that:

- Generated code aligns with **product intent**
- Architectural decisions respect **UX principles**
- AI suggestions avoid generic patterns
- Relevant external tools are used **intentionally**, not randomly

This is **not** a README for users.  
This is a **context-loading document for developers and AI tools**.

---

## 2. Problem Space (Real-World, Observed)

Users planning trips today experience a **fragmented workflow**:

- Inspiration happens on **social platforms** (Instagram Reels, shared posts)
- Planning happens in **notes apps**
- Routing happens in **Google Maps**
- Decision-making happens mentally

This creates:
- High cognitive load
- Inefficient travel routes
- Loss of context (“Why did I save this?”)
- Emotional fatigue

This project exists to **collapse these steps into one calm, intentional system**.

---

## 3. Core Product Insight

> Humans already know *what* they want to do — they struggle with *how to do it efficiently*.

This system:
- Treats user-selected places as **authoritative**
- Uses AI to optimize *movement*, not *desire*
- Preserves human agency at every step

---

## 4. Non-Goals (Very Important)

Cursor and contributors should NOT:
- Build a booking engine
- Rank places by sponsorship
- Create infinite recommendation feeds
- Optimize purely for “most popular”
- Replace user intent with AI guesses

This is **decision support**, not automation.

---

## 5. UX Philosophy (Hard Constraints)

All generated UI and logic must follow:

1. **Simple surface, complex engine**
2. **AI must explain itself**
3. **No forced decisions**
4. **No FOMO language**
5. **Route logic > recommendation count**

If a feature adds complexity without reducing user effort, it is out of scope.

---

## 6. Key Concepts (Shared Vocabulary)

### 6.1 Social Intent
Unstructured inspiration coming from:
- Instagram Reels
- Instagram Posts
- Shared links
- Casual text references

Social intent is **messy by nature** and must be treated as such.

---

### 6.2 Anchor Places
Places the user explicitly wants to visit.

Rules:
- Anchors are never removed by AI
- Anchors drive itinerary structure
- Anchors can be time-locked

---

### 6.3 Optional Enhancements
Nearby experiences suggested by AI that:
- Are clearly labeled as optional
- Never replace anchors
- Can be toggled off without penalty

---

## 7. Existing Products & Tools (For Inspiration, Not Duplication)

### 7.1 Travel Planning Tools

#### Google Maps
- Strength: routing, real-time traffic
- Weakness: no multi-day human-centric planning

#### Wanderlog
- Strength: itinerary organization
- Weakness: weak spatial optimization

#### TripIt
- Strength: schedule aggregation
- Weakness: no inspiration-to-plan flow

---

### 7.2 Social Inspiration Tools

#### Instagram
- Strength: discovery, emotional resonance
- Weakness: no structure, no planning affordances

#### TikTok Travel
- Strength: viral discovery
- Weakness: zero intent capture

---

### 7.3 AI & UX Inspiration

#### Microsoft Copilot
- Progressive disclosure
- Explainable suggestions
- Human-in-the-loop design

#### Apple Maps (Modern UX)
- Calm visuals
- Reduced decision fatigue
- Clear spatial hierarchy

---

## 8. Relevant External APIs & Services

### 8.1 Mapping & Geography
- Mapbox (routes, directions, visualization)
- OpenStreetMap (fallback geodata)

### 8.2 Places & Discovery
- Google Places API
- Foursquare Places API

---

## 9. AI / ML Capabilities (Preferred)

### 9.1 Language Understanding
Used for:
- Caption interpretation
- Intent extraction
- Explanation generation

Preferred models (Hugging Face):
- `google/flan-t5-large`
- `facebook/bart-large-mnli`

---

### 9.2 Semantic Similarity
Used for:
- Matching vibes to places
- Grouping similar locations

Preferred models:
- `sentence-transformers/all-MiniLM-L6-v2`
- `BAAI/bge-base-en-v1.5`

---

### 9.3 Vision (Optional / Advanced)
Used for:
- Screenshot-based inference
- Landmark recognition

Models:
- `openai/clip-vit-base-patch32`
- `facebook/dino-v2`

---

## 10. System Responsibilities (AI vs Code)

### AI Handles:
- Messy input interpretation
- Natural language reasoning
- Explanation generation
- Vibe matching

### Deterministic Code Handles:
- Routing
- Distance calculation
- Ordering logic
- Time constraints
- Conflict resolution

AI **suggests**, code **decides**.

---

## 11. Engineering Constraints

- Next.js (App Router)
- TypeScript required
- Accessibility-first components
- Explicit loading & error states
- Predictable state management

---

## 12. Data Handling Principles

- No scraping private content
- Only user-provided links are processed
- No long-term storage of personal data
- Context is session-scoped unless saved explicitly

---

## 13. Metrics to Optimize For

- Reduction in planning time
- Reduction in backtracking
- User confidence scores
- Fewer full regenerations
- Higher anchor retention

---

## 14. How This Should Feel to the User

- Calm
- Intentional
- Supportive
- Non-judgmental
- Trustworthy

If the experience feels “busy”, it is wrong.

---

## 15. Why This Matters (Career Context)

This project is designed to demonstrate:
- Senior UX judgment
- Human-AI interaction design
- System thinking
- Real-world constraint handling
- Enterprise-grade reasoning

It is intentionally aligned with:
- Microsoft Copilot teams
- SAP enterprise UX
- EA tooling & player experience# 🧠 CONTEXT.md
## Route-Aware AI Travel Planner (Social-Inspired Itinerary System)

---

## 1. Purpose of This Document

This document exists to provide **deep contextual grounding** for Cursor (AI-assisted development) so that:

- Generated code aligns with **product intent**
- Architectural decisions respect **UX principles**
- AI suggestions avoid generic patterns
- Relevant external tools are used **intentionally**, not randomly

This is **not** a README for users.  
This is a **context-loading document for developers and AI tools**.

---

## 2. Problem Space (Real-World, Observed)

Users planning trips today experience a **fragmented workflow**:

- Inspiration happens on **social platforms** (Instagram Reels, shared posts)
- Planning happens in **notes apps**
- Routing happens in **Google Maps**
- Decision-making happens mentally

This creates:
- High cognitive load
- Inefficient travel routes
- Loss of context (“Why did I save this?”)
- Emotional fatigue

This project exists to **collapse these steps into one calm, intentional system**.

---

## 3. Core Product Insight

> Humans already know *what* they want to do — they struggle with *how to do it efficiently*.

This system:
- Treats user-selected places as **authoritative**
- Uses AI to optimize *movement*, not *desire*
- Preserves human agency at every step

---

## 4. Non-Goals (Very Important)

Cursor and contributors should NOT:
- Build a booking engine
- Rank places by sponsorship
- Create infinite recommendation feeds
- Optimize purely for “most popular”
- Replace user intent with AI guesses

This is **decision support**, not automation.

---

## 5. UX Philosophy (Hard Constraints)

All generated UI and logic must follow:

1. **Simple surface, complex engine**
2. **AI must explain itself**
3. **No forced decisions**
4. **No FOMO language**
5. **Route logic > recommendation count**

If a feature adds complexity without reducing user effort, it is out of scope.

---

## 6. Key Concepts (Shared Vocabulary)

### 6.1 Social Intent
Unstructured inspiration coming from:
- Instagram Reels
- Instagram Posts
- Shared links
- Casual text references

Social intent is **messy by nature** and must be treated as such.

---

### 6.2 Anchor Places
Places the user explicitly wants to visit.

Rules:
- Anchors are never removed by AI
- Anchors drive itinerary structure
- Anchors can be time-locked

---

### 6.3 Optional Enhancements
Nearby experiences suggested by AI that:
- Are clearly labeled as optional
- Never replace anchors
- Can be toggled off without penalty

---

## 7. Existing Products & Tools (For Inspiration, Not Duplication)

### 7.1 Travel Planning Tools

#### Google Maps
- Strength: routing, real-time traffic
- Weakness: no multi-day human-centric planning

#### Wanderlog
- Strength: itinerary organization
- Weakness: weak spatial optimization

#### TripIt
- Strength: schedule aggregation
- Weakness: no inspiration-to-plan flow

---

### 7.2 Social Inspiration Tools

#### Instagram
- Strength: discovery, emotional resonance
- Weakness: no structure, no planning affordances

#### TikTok Travel
- Strength: viral discovery
- Weakness: zero intent capture

---

### 7.3 AI & UX Inspiration

#### Microsoft Copilot
- Progressive disclosure
- Explainable suggestions
- Human-in-the-loop design

#### Apple Maps (Modern UX)
- Calm visuals
- Reduced decision fatigue
- Clear spatial hierarchy

---

## 8. Relevant External APIs & Services

### 8.1 Mapping & Geography
- Mapbox (routes, directions, visualization)
- OpenStreetMap (fallback geodata)

### 8.2 Places & Discovery
- Google Places API
- Foursquare Places API

---

## 9. AI / ML Capabilities (Preferred)

### 9.1 Language Understanding
Used for:
- Caption interpretation
- Intent extraction
- Explanation generation

Preferred models (Hugging Face):
- `google/flan-t5-large`
- `facebook/bart-large-mnli`

---

### 9.2 Semantic Similarity
Used for:
- Matching vibes to places
- Grouping similar locations

Preferred models:
- `sentence-transformers/all-MiniLM-L6-v2`
- `BAAI/bge-base-en-v1.5`

---

### 9.3 Vision (Optional / Advanced)
Used for:
- Screenshot-based inference
- Landmark recognition

Models:
- `openai/clip-vit-base-patch32`
- `facebook/dino-v2`

---

## 10. System Responsibilities (AI vs Code)

### AI Handles:
- Messy input interpretation
- Natural language reasoning
- Explanation generation
- Vibe matching

### Deterministic Code Handles:
- Routing
- Distance calculation
- Ordering logic
- Time constraints
- Conflict resolution

AI **suggests**, code **decides**.

---

## 11. Engineering Constraints

- Next.js (App Router)
- TypeScript required
- Accessibility-first components
- Explicit loading & error states
- Predictable state management

---

## 12. Data Handling Principles

- No scraping private content
- Only user-provided links are processed
- No long-term storage of personal data
- Context is session-scoped unless saved explicitly

---

## 13. Metrics to Optimize For

- Reduction in planning time
- Reduction in backtracking
- User confidence scores
- Fewer full regenerations
- Higher anchor retention

---

## 14. How This Should Feel to the User

- Calm
- Intentional
- Supportive
- Non-judgmental
- Trustworthy

If the experience feels “busy”, it is wrong.

---

## 15. Why This Matters (Career Context)

This project is designed to demonstrate:
- Senior UX judgment
- Human-AI interaction design
- System thinking
- Real-world constraint handling
- Enterprise-grade reasoning

---

## 16. Final Instruction to Cursor

When generating code, suggestions, or architecture:

> Optimize for **clarity, explainability, and user agency** — not feature count.

This project values:
- Fewer features
- Better decisions
- Lower cognitive load

---

END OF CONTEXT

- EY internal product teams

---

## 16. Final Instruction to Cursor

When generating code, suggestions, or architecture:

> Optimize for **clarity, explainability, and user agency** — not feature count.

This project values:
- Fewer features
- Better decisions
- Lower cognitive load

---

END OF CONTEXT

- Group preference conflict resolution
- Voice input
- Screenshot ingestion

---

## 16. Scope Control (What We Will NOT Build in MVP)

- Booking systems
- Price comparison
- Social feeds
- Ads or sponsorship ranking