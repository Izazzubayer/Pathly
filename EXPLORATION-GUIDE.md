# 🗺️ Exploration Guide

## Pages You Can Explore

### 1. **Landing Page** (`/`)
- **URL**: `http://localhost:3000/`
- **What it is**: Welcome page with app title and description
- **What you can do**:
  - View the app introduction
  - Navigate to the planner flow

---

### 2. **Context Builder** (`/context`)
- **URL**: `http://localhost:3000/context`
- **What it is**: Chat-style onboarding to understand your travel preferences
- **What you can do**:
  - Answer questions about your travel style:
    - Who you're traveling with (Solo/Couple/Friends/Family)
    - Travel vibe (Romantic/Party/Cultural/Chill/Balanced)
    - Energy level (Low/Medium/High)
    - Budget sensitivity
    - Mobility tolerance
  - See animated typing indicators
  - Select options using chips
  - View progress bar
  - Review your selections in summary card
  - Enter trip details:
    - Destination
    - Start and end dates
    - Hotel name and location
  - Edit your answers before continuing
  - Navigate to next step when complete

**Features**:
- ✨ Smooth animations
- 📊 Progress tracking
- 💬 Chat-like interface
- ✅ Validation and error handling

---

### 3. **Social Intent Capture** (`/capture`)
- **URL**: `http://localhost:3000/capture`
- **What it is**: Drop zone to paste Instagram links and text
- **What you can do**:
  - Paste Instagram links (e.g., `https://www.instagram.com/p/...`)
  - Paste generic URLs
  - Enter multi-line text with place names
  - Drag and drop links (visual feedback)
  - See captured items list
  - View processing status (pending/processing/completed)
  - Remove individual items
  - Clear all items
  - Navigate to review page when ready

**Features**:
- 📋 Multi-input support
- 🔄 Real-time status updates
- 🗑️ Easy item management
- 📱 Responsive design

---

### 4. **Review & Anchor Selection** (`/review`)
- **URL**: `http://localhost:3000/review`
- **What it is**: Process places, mark anchors, and see them on a map
- **What you can do**:
  - See places extracted from your social intents
  - View confidence levels (High/Medium/Low)
  - See activity types (restaurant, cafe, temple, etc.)
  - **Mark places as anchors** (must-visit) by clicking the star ⭐
  - **Set time-locks** for anchors (specific date/time)
  - View places on an interactive map
  - Click map markers to see place details
  - See anchor summary (count of anchors vs. other places)
  - Remove places you don't want
  - Navigate to itinerary when ready

**Features**:
- 🗺️ Interactive Mapbox map
- ⭐ Anchor system
- 🕐 Time-lock support
- 📍 Place markers with activity icons
- 💬 Place popups
- 🎯 Confidence indicators

---

### 5. **Itinerary View** (`/itinerary`)
- **URL**: `http://localhost:3000/itinerary`
- **What it is**: Your optimized, day-by-day travel plan with map and timeline
- **What you can do**:

#### **Day Navigation**
- Switch between days using day selector tabs
- See date and place count for each day

#### **Map View** (Left side on desktop, tab on mobile)
- See all places for the selected day
- View route lines connecting places
- Click markers to see place details
- See hotel location
- Anchor places marked with stars ⭐
- Auto-fit to show all places

#### **Timeline View** (Right side on desktop, tab on mobile)
- See vertical timeline with:
  - Time slot headers (Morning ☀️ / Afternoon / Evening 🌆 / Night 🌙)
  - Place cards with:
    - Arrival and departure times
    - Activity duration
    - AI-generated explanations
    - Status badges (on-route/detour/optional)
    - Anchor indicators
  - Travel segments showing distance and time
  - "View optional places" buttons

#### **Actions**
- **Regenerate Day**: Completely regenerate a day's itinerary
- **Optimize Order**: Re-optimize the order of places
- **Export**: Download itinerary as:
  - Text file (.txt)
  - JSON file (.json)
- **View Detours**: Click "View optional places" to see nearby places
- **Remove Places**: Remove places from itinerary
- **Click to Sync**: Click a place in timeline → highlights on map

#### **Keyboard Shortcuts**
- `Ctrl/Cmd + R`: Regenerate day
- `Ctrl/Cmd + O`: Optimize order
- `Ctrl/Cmd + E`: Export as text

**Features**:
- 📅 Day-by-day breakdown
- 🗺️ Route visualization
- ⏰ Time slot organization
- 🤖 AI explanations
- 📊 Optimization score
- 📤 Export functionality
- ⌨️ Keyboard shortcuts
- 📱 Responsive design

---

## Complete User Flow

### Recommended Flow:
1. **Start** → `/context`
   - Answer questions about your travel style
   - Enter trip details (destination, dates, hotel)

2. **Capture** → `/capture`
   - Paste Instagram links or text
   - Add all your inspiration

3. **Review** → `/review`
   - See extracted places
   - Mark must-visit places as anchors ⭐
   - Set time-locks if needed
   - View on map

4. **Itinerary** → `/itinerary`
   - View your optimized route
   - See day-by-day timeline
   - Explore on map
   - Export your plan

---

## Key Features to Try

### 🎯 Anchor System
- Mark places as "must-visit" anchors
- Set specific date/time constraints
- See anchors highlighted on map

### 🗺️ Map Integration
- Interactive Mapbox map
- Route lines between places
- Click markers for details
- Auto-fit to show all places

### 🤖 AI Explanations
- See why each place was added
- Context-aware reasoning
- Vibe matching indicators

### 📊 Route Optimization
- Minimizes backtracking
- Clusters places by proximity
- Optimizes order within days
- Shows optimization score (0-100)

### ⏰ Time Slots
- Morning/Afternoon/Evening/Night organization
- Activity duration estimates
- Travel time calculations

### 🎨 Status Indicators
- **🟢 On-route**: No extra travel time
- **🟡 Detour**: Small detour (5-15 min)
- **🔵 Optional**: Larger detour (>15 min)
- **⭐ Anchor**: Must-visit place

### 📤 Export Options
- Export as readable text file
- Export as JSON for integration
- Includes all details and timing

---

## Tips for Exploration

1. **Start Fresh**: Clear browser storage to reset state
2. **Try Different Vibes**: Test with different travel styles
3. **Add Multiple Places**: See how clustering works
4. **Mark Anchors**: See how anchors affect route
5. **Use Keyboard Shortcuts**: Power user features
6. **Switch Days**: See how places are distributed
7. **Click Around**: Interactive elements everywhere
8. **Export**: See the formatted output

---

## What Makes This Special

✨ **Route-Aware**: Not just recommendations, but optimized movement  
🎯 **Anchor System**: Respects your must-visit places  
🤖 **AI Explanations**: Understand why each place was added  
🗺️ **Visual Planning**: See your route on a map  
⏰ **Time-Aware**: Morning/afternoon/evening organization  
📱 **Responsive**: Works on all devices  
♿ **Accessible**: Keyboard navigation, screen readers  
🚀 **Fast**: Optimized performance  

---

## Quick Start

1. Run `npm run dev`
2. Open `http://localhost:3000`
3. Click through to `/context`
4. Start answering questions!

**Have fun exploring! 🎉**

