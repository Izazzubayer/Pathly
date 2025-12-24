# 🎨 Design System

## Overview

This project uses **shadcn/ui** as the component library with the **zinc** color palette. We leverage shadcn components fully to avoid building custom UI from scratch.

**Reference:** [shadcn/ui Colors - Zinc](https://ui.shadcn.com/colors)

---

## Color Palette: Zinc

Using shadcn's zinc theme for a calm, minimal, professional feel.

```css
/* Zinc Scale (Light Mode) */
--zinc-50:  #fafafa;
--zinc-100: #f4f4f5;
--zinc-200: #e4e4e7;
--zinc-300: #d4d4d8;
--zinc-400: #a1a1aa;
--zinc-500: #71717a;
--zinc-600: #52525b;
--zinc-700: #3f3f46;
--zinc-800: #27272a;
--zinc-900: #18181b;
--zinc-950: #09090b;
```

### Semantic Color Mapping

| Purpose | Light Mode | Dark Mode | CSS Variable |
|---------|------------|-----------|--------------|
| Background | zinc-50 | zinc-950 | `--background` |
| Foreground | zinc-950 | zinc-50 | `--foreground` |
| Card | zinc-50 | zinc-900 | `--card` |
| Primary | zinc-900 | zinc-50 | `--primary` |
| Secondary | zinc-100 | zinc-800 | `--secondary` |
| Muted | zinc-100 | zinc-800 | `--muted` |
| Accent | zinc-100 | zinc-800 | `--accent` |
| Border | zinc-200 | zinc-800 | `--border` |

---

## Custom Status Colors

For route/place status indicators (extends shadcn's palette):

```css
:root {
  /* Status Colors - Add to globals.css */
  --status-on-route: 142 76% 36%;    /* Green - On the way */
  --status-detour: 45 93% 47%;       /* Amber - Small detour */
  --status-optional: 217 91% 60%;    /* Blue - Optional */
  --status-anchor: 262 83% 58%;      /* Violet - Must visit */
}
```

### Status Badge Usage

| Status | Color | Icon | Label |
|--------|-------|------|-------|
| On Route | Green | 🟢 | "On the way" |
| Detour | Amber | 🟡 | "Small detour" |
| Optional | Blue | 🔵 | "Optional" |
| Anchor | Violet | ⭐ | "Must visit" |

---

## shadcn/ui Components to Use

### Core UI Components

| Component | Use Case | Install Command |
|-----------|----------|-----------------|
| `button` | All actions, CTAs | `npx shadcn@latest add button` |
| `card` | Place cards, info panels | `npx shadcn@latest add card` |
| `badge` | Status indicators, tags | `npx shadcn@latest add badge` |
| `input` | Text inputs | `npx shadcn@latest add input` |
| `textarea` | Multi-line input | `npx shadcn@latest add textarea` |
| `label` | Form labels | `npx shadcn@latest add label` |
| `dialog` | Modals, confirmations | `npx shadcn@latest add dialog` |
| `drawer` | Mobile panels, detours drawer | `npx shadcn@latest add drawer` |
| `sheet` | Side panels | `npx shadcn@latest add sheet` |
| `tooltip` | Hover info | `npx shadcn@latest add tooltip` |
| `popover` | Floating content | `npx shadcn@latest add popover` |
| `skeleton` | Loading states | `npx shadcn@latest add skeleton` |
| `spinner` | Loading indicator | `npx shadcn@latest add spinner` |
| `separator` | Visual dividers | `npx shadcn@latest add separator` |
| `scroll-area` | Scrollable regions | `npx shadcn@latest add scroll-area` |

### Form Components

| Component | Use Case | Install Command |
|-----------|----------|-----------------|
| `form` | Form handling with react-hook-form | `npx shadcn@latest add form` |
| `select` | Dropdowns | `npx shadcn@latest add select` |
| `radio-group` | Option selection (vibe, energy) | `npx shadcn@latest add radio-group` |
| `checkbox` | Multi-select options | `npx shadcn@latest add checkbox` |
| `switch` | Toggles | `npx shadcn@latest add switch` |
| `slider` | Range inputs | `npx shadcn@latest add slider` |
| `calendar` | Date picker | `npx shadcn@latest add calendar` |

### Navigation & Layout

| Component | Use Case | Install Command |
|-----------|----------|-----------------|
| `tabs` | Day selector, view switching | `npx shadcn@latest add tabs` |
| `navigation-menu` | Main navigation | `npx shadcn@latest add navigation-menu` |
| `breadcrumb` | Step navigation | `npx shadcn@latest add breadcrumb` |
| `resizable` | Split view panels | `npx shadcn@latest add resizable` |
| `collapsible` | Expandable sections | `npx shadcn@latest add collapsible` |
| `accordion` | FAQ, expandable lists | `npx shadcn@latest add accordion` |

### Feedback

| Component | Use Case | Install Command |
|-----------|----------|-----------------|
| `alert` | Warnings, info messages | `npx shadcn@latest add alert` |
| `alert-dialog` | Destructive confirmations | `npx shadcn@latest add alert-dialog` |
| `sonner` | Toast notifications | `npx shadcn@latest add sonner` |
| `progress` | Progress bars | `npx shadcn@latest add progress` |

### Data Display

| Component | Use Case | Install Command |
|-----------|----------|-----------------|
| `avatar` | User profiles | `npx shadcn@latest add avatar` |
| `hover-card` | Preview on hover | `npx shadcn@latest add hover-card` |
| `table` | Data tables (if needed) | `npx shadcn@latest add table` |

---

## Component Mapping by Feature

### Phase 02: Context Builder

```
Chat Interface:
├── Card (message bubbles)
├── RadioGroup (option selection)
├── Button (continue, back)
├── Progress (step indicator)
└── Calendar (date picker for trip dates)
```

### Phase 03: Social Capture

```
Drop Zone:
├── Card (drop area container)
├── Input (paste area)
├── Badge (link type indicator)
├── Button (remove, clear)
├── Skeleton (processing state)
└── ScrollArea (captured items list)
```

### Phase 04: Anchors

```
Review UI:
├── Card (place cards)
├── Badge (confidence, status)
├── Switch (anchor toggle)
├── Dialog (edit place)
├── Calendar (time-lock picker)
├── Command (place search)
└── Separator (sections)
```

### Phase 05-07: Map & Itinerary

```
Itinerary Views:
├── Tabs (day selector)
├── Card (timeline places)
├── Badge (status indicators)
├── Drawer (detours panel - mobile)
├── Sheet (detours panel - desktop)
├── Resizable (split view)
├── Tooltip (info on hover)
├── AlertDialog (regenerate confirmation)
└── Sonner (action feedback)
```

---

## Typography

Using shadcn's default typography (Tailwind's font stack):

```css
/* System font stack - already in shadcn */
font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
```

### Text Scale (Tailwind)

| Class | Size | Use Case |
|-------|------|----------|
| `text-xs` | 12px | Captions, badges |
| `text-sm` | 14px | Secondary text, labels |
| `text-base` | 16px | Body text |
| `text-lg` | 18px | Emphasized body |
| `text-xl` | 20px | Section headers |
| `text-2xl` | 24px | Page headers |
| `text-3xl` | 30px | Hero text |

---

## Spacing

Using Tailwind's default spacing scale:

| Token | Value | Use Case |
|-------|-------|----------|
| `1` | 4px | Tight spacing |
| `2` | 8px | Compact elements |
| `3` | 12px | Default gaps |
| `4` | 16px | Section padding |
| `6` | 24px | Card padding |
| `8` | 32px | Section gaps |
| `12` | 48px | Large sections |
| `16` | 64px | Page padding |

---

## Shadows

Using shadcn's shadow tokens:

```css
/* Already defined by shadcn */
shadow-sm    /* Subtle elevation */
shadow       /* Default cards */
shadow-md    /* Hover states */
shadow-lg    /* Modals, popovers */
```

---

## Border Radius

Using shadcn's radius tokens:

```css
/* In tailwind.config / globals.css */
--radius: 0.625rem;  /* 10px - shadcn default */

/* Classes */
rounded-sm   /* 4px */
rounded      /* 6px */
rounded-md   /* 8px */
rounded-lg   /* var(--radius) = 10px */
rounded-xl   /* 12px */
```

---

## Animation

Using Tailwind's built-in animations + shadcn defaults:

```css
/* Built-in */
animate-spin
animate-pulse
animate-bounce

/* shadcn adds */
animate-accordion-down
animate-accordion-up
```

For custom animations, use **Framer Motion** (already in stack):

```tsx
import { motion } from 'framer-motion';

// Fade in
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
```

---

## Dark Mode

shadcn handles dark mode via `class` strategy:

```tsx
// In layout.tsx or providers
<html className="dark">
```

Toggle with `next-themes`:

```bash
npm install next-themes
```

```tsx
import { ThemeProvider } from 'next-themes';

<ThemeProvider attribute="class" defaultTheme="system">
  {children}
</ThemeProvider>
```

---

## Quick Install Command

Install all commonly needed components at once:

```bash
npx shadcn@latest add button card badge input label dialog drawer sheet tooltip skeleton spinner separator scroll-area tabs radio-group switch calendar progress sonner alert-dialog
```

---

## Custom Components (Minimal)

Only create custom components for:

1. **StatusBadge** - Wraps shadcn Badge with status colors
2. **PlaceCard** - Composition of Card + Badge + Button
3. **TimelineItem** - Composition for itinerary timeline
4. **MapContainer** - Mapbox wrapper (not a shadcn concern)

Everything else uses shadcn directly.

---

## Accessibility

shadcn components are accessible by default:
- ✅ ARIA attributes
- ✅ Keyboard navigation
- ✅ Focus management
- ✅ Screen reader support

Just follow shadcn's usage patterns.

---

## File Structure

```
src/
├── components/
│   ├── ui/              # shadcn components (auto-generated)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   └── custom/          # Our compositions
│       ├── status-badge.tsx
│       ├── place-card.tsx
│       └── timeline-item.tsx
├── lib/
│   └── utils.ts         # cn() helper (shadcn provides)
└── app/
    └── globals.css      # shadcn styles + custom status colors
```

---

## Summary

| Aspect | Approach |
|--------|----------|
| Components | shadcn/ui (pre-built) |
| Colors | Zinc palette |
| Typography | Tailwind defaults |
| Spacing | Tailwind scale |
| Icons | Lucide (shadcn default) |
| Animation | Tailwind + Framer Motion |
| Dark Mode | next-themes + class strategy |
| Custom Code | Minimal - compositions only |

**Philosophy:** Use shadcn. Don't reinvent.

