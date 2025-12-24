# 🧠 CONTEXT.md
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
