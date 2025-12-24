# 📱 Phase 03: Social Intent Capture

## Goal

Build the "Social Link Drop Zone" where users can paste Instagram links (reels, posts) or text references, and the system captures this raw social intent for processing.

---

## PRD Reference

> Users can paste:
> - Instagram Reel links
> - Instagram post links
> - Multiple links at once
> - Manual text references
>
> User does NOT need to:
> - Extract place names
> - Organize lists
> - Validate locations manually

---

## Deliverables

### 1. Drop Zone UI

- [ ] Large, inviting drop area
- [ ] Paste detection (Cmd+V / Ctrl+V)
- [ ] Drag-and-drop support (for text)
- [ ] Multi-line paste support
- [ ] Visual feedback on paste/drop

### 2. Link Parsing

- [ ] Instagram Reel URL detection
- [ ] Instagram Post URL detection
- [ ] Generic URL detection
- [ ] Plain text capture
- [ ] Duplicate detection

### 3. Captured Items Display

- [ ] List of captured items
- [ ] Item type indicator (reel/post/text)
- [ ] Remove/edit individual items
- [ ] Reorder capability
- [ ] Processing status indicator

### 4. API Route for URL Processing

- [ ] Validate URL format
- [ ] Queue for metadata extraction (Phase 04)
- [ ] Rate limiting consideration

---

## Technical Requirements

### Data Model

```tsx
// types/social-intent.ts

type IntentSource = 'instagram-reel' | 'instagram-post' | 'url' | 'text';

type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface SocialIntent {
  id: string;
  source: IntentSource;
  rawInput: string;           // Original pasted content
  url?: string;               // Extracted URL if applicable
  createdAt: Date;
  status: ProcessingStatus;
  
  // Populated after processing (Phase 04)
  extractedData?: ExtractedData;
}

interface ExtractedData {
  caption?: string;
  hashtags?: string[];
  taggedLocation?: string;
  inferredPlaces?: InferredPlace[];
  thumbnailUrl?: string;
}

interface InferredPlace {
  name: string;
  confidence: 'high' | 'medium' | 'low';
  activityType?: string;
  city?: string;
}
```

### URL Patterns

```typescript
// lib/url-patterns.ts

const INSTAGRAM_PATTERNS = {
  reel: /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:reel|reels)\/([A-Za-z0-9_-]+)/,
  post: /(?:https?:\/\/)?(?:www\.)?instagram\.com\/p\/([A-Za-z0-9_-]+)/,
  profile: /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([A-Za-z0-9_.]+)/,
};

function parseInstagramUrl(input: string): {
  type: 'reel' | 'post' | 'profile' | 'unknown';
  id?: string;
} {
  // Implementation
}

function extractAllUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
}
```

### Folder Structure

```
src/
├── app/
│   └── (planner)/
│       └── capture/
│           └── page.tsx          # Social capture page
│   └── api/
│       └── intent/
│           └── route.ts          # API for processing
├── components/
│   └── social-capture/
│       ├── drop-zone.tsx         # Main drop area
│       ├── captured-list.tsx     # List of items
│       ├── captured-item.tsx     # Individual item
│       ├── paste-helper.tsx      # Instruction text
│       └── processing-badge.tsx  # Status indicator
├── lib/
│   ├── url-patterns.ts           # URL parsing
│   └── intent-parser.ts          # Input parsing logic
└── stores/
    └── intent-store.ts           # Social intent state
```

---

## Component Specifications

### DropZone

```tsx
interface DropZoneProps {
  onCapture: (intents: SocialIntent[]) => void;
  disabled?: boolean;
}

// Features:
// - Listens for paste events (document-level)
// - Visual state: idle, active (dragging), success
// - Parses multi-line input
// - Handles mixed content (URLs + text)
```

**Visual States:**
1. **Idle**: Subtle border, instruction text
2. **Active** (dragging/focus): Highlighted border, pulse animation
3. **Success**: Brief checkmark animation
4. **Error**: Shake + error message

### CapturedList

```tsx
interface CapturedListProps {
  items: SocialIntent[];
  onRemove: (id: string) => void;
  onReorder: (items: SocialIntent[]) => void;
}

// Features:
// - Drag-to-reorder (optional for MVP)
// - Swipe-to-delete on mobile
// - Bulk actions (clear all)
```

### CapturedItem

```tsx
interface CapturedItemProps {
  intent: SocialIntent;
  onRemove: () => void;
}

// Display:
// - Icon based on source type
// - Truncated URL/text
// - Processing status badge
// - Remove button
```

---

## Input Processing Logic

```typescript
// lib/intent-parser.ts

interface ParseResult {
  intents: SocialIntent[];
  warnings: string[];
}

function parseInput(rawInput: string): ParseResult {
  const lines = rawInput.split('\n').filter(Boolean);
  const intents: SocialIntent[] = [];
  const warnings: string[] = [];
  const seenUrls = new Set<string>();
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    // Check for Instagram URLs
    const urls = extractAllUrls(trimmed);
    
    for (const url of urls) {
      // Duplicate check
      if (seenUrls.has(url)) {
        warnings.push(`Duplicate URL skipped: ${url}`);
        continue;
      }
      seenUrls.add(url);
      
      const instaResult = parseInstagramUrl(url);
      
      intents.push({
        id: generateId(),
        source: instaResult.type === 'reel' 
          ? 'instagram-reel' 
          : instaResult.type === 'post'
            ? 'instagram-post'
            : 'url',
        rawInput: url,
        url,
        createdAt: new Date(),
        status: 'pending',
      });
    }
    
    // If no URLs found, treat as plain text reference
    if (urls.length === 0) {
      intents.push({
        id: generateId(),
        source: 'text',
        rawInput: trimmed,
        createdAt: new Date(),
        status: 'pending',
      });
    }
  }
  
  return { intents, warnings };
}
```

---

## Animations

```tsx
// Drop zone pulse on active
const dropZoneVariants = {
  idle: { 
    borderColor: 'var(--border-subtle)',
    scale: 1 
  },
  active: { 
    borderColor: 'var(--accent-primary)',
    scale: 1.01,
    transition: { duration: 0.2 }
  },
  success: {
    borderColor: 'var(--status-on-route)',
    scale: [1, 1.02, 1],
    transition: { duration: 0.3 }
  }
};

// Item enter animation
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: { duration: 0.15 }
  }
};
```

---

## State Management

```tsx
// stores/intent-store.ts

interface IntentStore {
  intents: SocialIntent[];
  
  // Actions
  addIntents: (intents: SocialIntent[]) => void;
  removeIntent: (id: string) => void;
  updateIntentStatus: (id: string, status: ProcessingStatus) => void;
  clearAllIntents: () => void;
  
  // Computed
  pendingCount: () => number;
  hasIntents: () => boolean;
}
```

---

## Accessibility

- [ ] Drop zone is focusable and activated via keyboard
- [ ] Clear instructions for screen readers
- [ ] List items have proper roles and labels
- [ ] Status changes announced via aria-live
- [ ] Keyboard shortcuts documented

---

## Acceptance Criteria

- [ ] Pasting a single Instagram reel link works
- [ ] Pasting multiple links (one per line) works
- [ ] Pasting a mix of links and text works
- [ ] Duplicate URLs are detected and warned
- [ ] Items appear in list immediately
- [ ] Items can be removed individually
- [ ] Clear all works
- [ ] Visual feedback on paste/drop
- [ ] Works on mobile (long-press paste)
- [ ] Keyboard accessible

---

## Example Test Cases

```
// Test Input 1: Single reel
https://www.instagram.com/reel/ABC123/

// Test Input 2: Multiple links
https://www.instagram.com/reel/ABC123/
https://www.instagram.com/p/XYZ789/
https://www.instagram.com/reel/DEF456/

// Test Input 3: Mixed content
https://www.instagram.com/reel/ABC123/
That cool rooftop bar in Bangkok
https://www.instagram.com/p/XYZ789/
ICONSIAM for NYE

// Test Input 4: Duplicates
https://www.instagram.com/reel/ABC123/
https://www.instagram.com/reel/ABC123/  <- should warn
```

---

## Edge Cases

- [ ] Very long URLs
- [ ] Malformed URLs
- [ ] Non-Instagram URLs (treat as generic)
- [ ] Empty paste
- [ ] Paste with only whitespace
- [ ] Unicode characters in text references
- [ ] Private account URLs (still capture, handle in processing)

---

## Next Phase

Once complete, proceed to → `04-ANCHORS.md`

