# 🔄 User Flow Guide

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────┐
│                    START: Landing Page (/)                   │
│              "Route-Aware AI Travel Planner"                 │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│          STEP 1: Context Builder (/context)                  │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Chat-Style Questions:                              │    │
│  │  1. "Who are you traveling with?"                 │    │
│  │     → Solo / Couple / Friends / Family            │    │
│  │                                                     │    │
│  │  2. "What's your travel vibe?"                    │    │
│  │     → Romantic / Party / Cultural / Chill /       │    │
│  │       Balanced                                     │    │
│  │                                                     │    │
│  │  3. "What's your energy level?"                   │    │
│  │     → Low / Medium / High                          │    │
│  │                                                     │    │
│  │  4. "Budget sensitivity?"                         │    │
│  │     → Budget / Moderate / Luxury                  │    │
│  │                                                     │    │
│  │  5. "Mobility tolerance?"                        │    │
│  │     → Low / Medium / High                         │    │
│  └────────────────────────────────────────────────────┘    │
│                        │                                     │
│                        ▼                                     │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Summary Card: Review Your Answers                 │    │
│  │  [Edit] [Continue]                                │    │
│  └────────────────────────────────────────────────────┘    │
│                        │                                     │
│                        ▼                                     │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Trip Details Form:                                │    │
│  │  • Destination (e.g., "Bangkok, Thailand")        │    │
│  │  • Start Date                                      │    │
│  │  • End Date                                        │    │
│  │  • Hotel Name                                      │    │
│  │  • Hotel Location (coordinates)                    │    │
│  │                                                     │    │
│  │  [Continue to Capture]                             │    │
│  └────────────────────────────────────────────────────┘    │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│       STEP 2: Social Intent Capture (/capture)              │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Drop Zone:                                        │    │
│  │  • Paste Instagram links                           │    │
│  │    (e.g., https://www.instagram.com/p/...)        │    │
│  │  • Paste generic URLs                              │    │
│  │  • Enter multi-line text with place names         │    │
│  │                                                     │    │
│  │  Example:                                          │    │
│  │  "ICONSIAM shopping mall                           │    │
│  │   Wat Arun temple                                  │    │
│  │   https://www.instagram.com/p/ABC123"             │    │
│  └────────────────────────────────────────────────────┘    │
│                        │                                     │
│                        ▼                                     │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Captured Items List:                              │    │
│  │  • Item 1: Instagram link [Processing...] [×]      │    │
│  │  • Item 2: Text input [Completed] [×]              │    │
│  │  • Item 3: URL [Pending] [×]                       │    │
│  │                                                     │    │
│  │  [Clear All]  [Continue to Review]                 │    │
│  └────────────────────────────────────────────────────┘    │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│     STEP 3: Review & Anchor Selection (/review)             │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Processing:                                       │    │
│  │  • Extracting places from intents...              │    │
│  │  • Geocoding locations...                         │    │
│  │  • Calculating confidence scores...                │    │
│  └────────────────────────────────────────────────────┘    │
│                        │                                     │
│                        ▼                                     │
│  ┌───────────────┬───────────────────────────────────┐    │
│  │  Places List  │  Interactive Map                  │    │
│  │               │                                    │    │
│  │  Place Card:  │  🗺️ Mapbox Map                    │    │
│  │  ┌──────────┐ │  • Place markers                  │    │
│  │  │🏛️ Temple │ │  • Hotel marker                   │    │
│  │  │High ✓    │ │  • Click for details              │    │
│  │  │[⭐ Anchor]│ │                                    │    │
│  │  │[🕐 Time] │ │                                    │    │
│  │  └──────────┘ │                                    │    │
│  │               │                                    │    │
│  │  Place Card:  │                                    │    │
│  │  ┌──────────┐ │                                    │    │
│  │  │☕ Café    │ │                                    │    │
│  │  │Medium ✓  │ │                                    │    │
│  │  │[⭐ Anchor]│ │                                    │    │
│  │  └──────────┘ │                                    │    │
│  │               │                                    │    │
│  │  [Continue to Itinerary]                           │    │
│  └───────────────┴───────────────────────────────────┘    │
│                                                              │
│  Actions:                                                    │
│  • Click ⭐ to mark as anchor (must-visit)                  │
│  • Click 🕐 to set time-lock (specific date/time)          │
│  • Click × to remove place                                 │
│  • Click map marker to see details                         │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│         STEP 4: Itinerary View (/itinerary)                 │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Day Selector: [Day 1] [Day 2] [Day 3]            │    │
│  │  Summary: 3 days • 12 km • Score: 85/100          │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────────────────┬──────────────────────────────┐   │
│  │   MAP VIEW (60%)     │  TIMELINE VIEW (40%)        │   │
│  │                      │                              │   │
│  │  🗺️ Mapbox Map       │  🌅 Morning (09:00-12:00)   │   │
│  │  • Route lines       │  ┌────────────────────────┐ │   │
│  │  • Place markers     │  │ 🏛️ Temple of Dawn     │ │   │
│  │  • Hotel marker      │  │ 09:30 - 10:30 (1hr)   │ │   │
│  │  • Click to sync     │  │ "Perfect for morning" │ │   │
│  │                      │  │ [⭐ Anchor] [Remove]  │ │   │
│  │                      │  └────────────────────────┘ │   │
│  │                      │  ↓ 15 min walk (1.2 km)     │   │
│  │                      │  ┌────────────────────────┐ │   │
│  │                      │  │ ☕ Blue Whale Café      │ │   │
│  │                      │  │ 10:45 - 11:30 (45min)  │ │   │
│  │                      │  │ "On the way"            │ │   │
│  │                      │  │ [Remove]                │ │   │
│  │                      │  └────────────────────────┘ │   │
│  │                      │                              │   │
│  │                      │  ☀️ Afternoon (12:00-17:00) │   │
│  │                      │  ┌────────────────────────┐ │   │
│  │                      │  │ 🛍️ ICONSIAM Mall       │ │   │
│  │                      │  │ 13:00 - 15:00 (2hr)    │ │   │
│  │                      │  │ "Must-visit anchor"    │ │   │
│  │                      │  │ [⭐ Anchor] [Remove]    │ │   │
│  │                      │  └────────────────────────┘ │   │
│  │                      │                              │   │
│  │                      │  🌆 Evening (17:00-21:00)   │   │
│  │                      │  ...                         │   │
│  └──────────────────────┴──────────────────────────────┘   │
│                                                              │
│  Actions:                                                    │
│  [🔄 Optimize Order] [↻ Regenerate Day] [📤 Export]         │
│  [View Optional Places] (on travel segments)                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step User Flow

### **STEP 1: Context Builder** (`/context`)

**What happens:**
1. User lands on context builder page
2. System asks questions one by one (chat-style)
3. User selects answers using option chips
4. Progress bar shows completion
5. Summary card displays all answers
6. User can edit or continue
7. Trip details form appears
8. User enters:
   - Destination
   - Start/end dates
   - Hotel name and location
9. System saves context and trip details
10. User clicks "Continue" → Goes to `/capture`

**Time:** ~2-3 minutes

---

### **STEP 2: Social Intent Capture** (`/capture`)

**What happens:**
1. User sees drop zone for links/text
2. User pastes Instagram links or types place names
3. System captures each item
4. Items appear in "Captured" list with status:
   - Pending (not processed yet)
   - Processing (being analyzed)
   - Completed (ready)
5. User can remove individual items or clear all
6. User clicks "Continue to Review" → Goes to `/review`

**Time:** ~1-2 minutes

---

### **STEP 3: Review & Anchor Selection** (`/review`)

**What happens:**
1. System processes all captured intents
2. Places are extracted and displayed
3. Each place shows:
   - Name
   - Activity type (restaurant, temple, etc.)
   - Confidence level (High/Medium/Low)
   - Location on map
4. User reviews places
5. User marks important places as **anchors** (⭐)
6. User can set **time-locks** for anchors (specific date/time)
7. User can remove unwanted places
8. Map shows all places with markers
9. User clicks map markers to see details
10. User clicks "Continue to Itinerary" → Goes to `/itinerary`

**Time:** ~3-5 minutes

---

### **STEP 4: Itinerary View** (`/itinerary`)

**What happens:**
1. System automatically generates optimized itinerary
2. User sees:
   - Day selector tabs
   - Summary stats (days, distance, score)
   - Split view: Map + Timeline
3. **Map View:**
   - Shows all places for selected day
   - Route lines connecting places
   - Click markers for details
4. **Timeline View:**
   - Vertical timeline with time slots
   - Place cards with timing
   - Travel segments between places
   - AI explanations for each place
5. User can:
   - Switch between days
   - Click places to sync map/timeline
   - View optional places (detours)
   - Regenerate a day
   - Optimize order
   - Export itinerary
6. User exports or shares itinerary

**Time:** ~5-10 minutes (exploration)

---

## Key Interactions

### **Marking Anchors**
1. Go to `/review`
2. Find a place you must visit
3. Click the ⭐ button
4. Optionally set time-lock (specific date/time)
5. Anchor is saved and highlighted

### **Viewing Routes**
1. Go to `/itinerary`
2. Select a day
3. See route lines on map connecting places
4. Click timeline place → Map highlights it
5. Click map marker → See details

### **Exporting Itinerary**
1. Go to `/itinerary`
2. Click "Export" button
3. Choose format:
   - Text file (.txt) - Human readable
   - JSON file (.json) - For integration
4. File downloads automatically

### **Keyboard Shortcuts**
- `Ctrl/Cmd + R`: Regenerate current day
- `Ctrl/Cmd + O`: Optimize order
- `Ctrl/Cmd + E`: Export as text

---

## Data Flow

```
User Input
    │
    ├─→ Context (preferences, trip details)
    │   └─→ Stored in Zustand store
    │
    ├─→ Social Intents (links, text)
    │   └─→ Processed → Places extracted
    │
    └─→ Anchor Selections
        └─→ Marked places with time-locks
            │
            ▼
    Route Engine
        ├─→ Clusters places by proximity
        ├─→ Assigns to days
        ├─→ Optimizes order (TSP)
        ├─→ Calculates routes
        └─→ Generates timeline
            │
            ▼
    Itinerary Display
        ├─→ Map visualization
        ├─→ Timeline view
        └─→ Export options
```

---

## Typical User Journey

**Scenario: Planning a 3-day trip to Bangkok**

1. **Context** (2 min)
   - Answers: Couple, Romantic vibe, Medium energy
   - Enters: Bangkok, Dec 30 - Jan 2, Four Wings Hotel

2. **Capture** (1 min)
   - Pastes: 3 Instagram links
   - Types: "ICONSIAM, Wat Arun, Blue Whale Café"

3. **Review** (3 min)
   - Reviews 8 extracted places
   - Marks 3 as anchors:
     - ICONSIAM (Dec 31, 8 PM - time-locked)
     - Wat Arun (must-visit)
     - Blue Whale Café (must-visit)

4. **Itinerary** (5 min)
   - Views optimized 3-day plan
   - Sees routes on map
   - Reviews timeline
   - Exports as text file

**Total Time:** ~11 minutes from start to export

---

## State Persistence

All user data is saved in browser storage:
- ✅ Context preferences
- ✅ Trip details
- ✅ Captured intents
- ✅ Places and anchors
- ✅ Generated itinerary

**Refresh the page?** Your progress is saved!

---

## Error Handling

If something goes wrong:
- Error boundaries catch crashes
- Helpful error messages
- Retry buttons
- Empty states guide users

---

**Ready to start?** Go to `/context` and begin! 🚀

