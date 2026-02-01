# FoodView Homepage - Implementation Plan

## Overview
The FoodView homepage is what users see **after signing in**. This document outlines the sections to implement **now** vs. features to add **later**.

---

# 🏠 HOMEPAGE SECTIONS (Immediate Implementation)

These sections will be on the **main homepage** (`/` route):

---

## 1. ✅ Navbar (Transparent)
**Status:** Just added by you!
- **Logo:** "FoodView" (links to home)
- **Reels Button:** Links to `/explore` (full-screen reel section)
- **Annapurna Button:** Links to `/annapurna` (donation initiative)
- Transparent with backdrop blur, fixed at top

---

## 2. ✅ Hero Section (Scroll Trigger Animation)
**Status:** Already implemented!
- 192-frame scroll-triggered animation
- "FoodView" branding with tagline "Discover • Share • Savor"
- Smooth scroll indicator (arrow bounce)

---

## 3. 🔜 Horizontal Reels Carousel
**Status:** To be implemented

**Design:**
- Full-width section with horizontal auto-scroll (left → right)
- Displays existing demo reels from the database
- Continuous loop animation
- Each reel card shows:
  - Video thumbnail (auto-playing on hover optional)
  - Food partner name
  - Like count
- Clicking a reel opens `/explore` with that reel focused

**Technical Notes:**
- Fetch reels from `GET /api/food`
- Use CSS animation or GSAP for smooth horizontal scroll
- Similar to marquee/ticker effect

---

## 4. 🔜 Map Section (Nearby Food Partners)
**Status:** To be implemented

**Design (inspired by LiveTrack):**
- Interactive map showing food partner locations
- Markers for restaurants/vendors
- Popup on marker click showing:
  - Name
  - Featured dish
  - Rating
  - "View Profile" button
- Optional: "Near Me" button to center on user location

**Technical Notes:**
- Use Leaflet.js or Google Maps API
- Food partners need `latitude` and `longitude` in their profile
- Already have food partner data in backend

---

## 5. 🔜 Footer
**Status:** To be implemented

**Design (inspired by LiveTrack):**
- Dark/themed footer matching the brand
- Links:
  - About FoodView
  - About Annapurna
  - Contact Us
  - Privacy Policy
  - Terms of Service
- Social media icons
- Copyright notice
- "Made with ❤️ in India" or similar tagline

---

# 📍 LINKED PAGES (Not on Homepage)

## Explore / Reels (`/explore`)
- Full-screen vertical reel feed (Instagram Reels style)
- Accessed via Navbar "Reels" button
- Already partially implemented in `Home.jsx` with `ReelFeed` component
- Contains: like, save, share actions

## Annapurna (`/annapurna`)
- Food donation initiative page
- Accessed via Navbar "Annapurna" button
- Has its own hero section (dark theme, animated text)

## Saved (`/saved`)
- User's saved/bookmarked reels
- Accessed via bottom navigation

---

# 💡 IDEAS (Future Implementation)

These are features to consider for later versions:

---

### 1. Categories / Cuisine Explorer
- Grid or chips: Indian, Italian, Chinese, Mexican, Desserts, Street Food, etc.
- **Complexity:** Requires food partners to tag cuisine when uploading food items
- **Prerequisite:** Add `category` field to food item model
- You mentioned you have a component for this - can integrate later

---

### 2. Personalized "For You" Feed
- AI-curated content based on:
  - Liked content
  - Saved items
  - Cuisine preferences
- **Complexity:** Requires ML/recommendation engine
- **Prerequisite:** User behavior tracking, preference storage

---

### 3. Weekly Challenges / Events
- Community cooking challenges
- Food festival highlights
- Leaderboard for top creators
- **Complexity:** Requires event management system

---

### 4. Food Partner Spotlight
- Featured restaurant/vendor of the day
- Special offers or new menu items
- **Complexity:** Requires admin dashboard to select featured partners

---

### 5. Saved Collections
- Create custom collections (e.g., "Date Night Ideas", "Quick Meals")
- **Complexity:** Requires collection model and UI

---

### 6. Search Functionality
- Search for reels, food items, partners
- Filter by cuisine, location, rating
- **Complexity:** Requires search indexing (Elasticsearch or similar)

---

# 📋 IMPLEMENTATION ORDER

| Priority | Section | Location | Status |
|----------|---------|----------|--------|
| 1 | Navbar | Homepage | ✅ Done |
| 2 | Hero Scroll Animation | Homepage | ✅ Done |
| 3 | Horizontal Reels Carousel | Homepage | 🔜 Next |
| 4 | Map Section | Homepage | 🔜 Soon |
| 5 | Footer | Homepage | 🔜 Soon |
| 6 | Explore/Reels Page | `/explore` | ⚡ Exists (needs polish) |
| 7 | Annapurna Page | `/annapurna` | ⚡ Exists (needs content) |

---

# 📐 Visual Layout

```
┌─────────────────────────────────────────┐
│  [FoodView Logo]    [Reels] [Annapurna] │  ← Navbar (fixed, transparent)
├─────────────────────────────────────────┤
│                                         │
│         HERO (Scroll Animation)         │
│              "FoodView"                 │
│         Discover • Share • Savor        │
│                  ↓                      │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│     🎬 REELS CAROUSEL (Auto-scroll)     │
│  ← [Reel] [Reel] [Reel] [Reel] [Reel]   │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│         📍 MAP (Food Partners)          │
│         [Interactive Leaflet Map]       │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│              FOOTER                     │
│    About | Contact | Social | © 2026    │
│                                         │
└─────────────────────────────────────────┘
```

---

## Ready to Proceed?

Once you confirm this plan, I will start implementing:
1. **Horizontal Reels Carousel** (using existing reel data)
2. **Map Section** (Leaflet.js integration)
3. **Footer** (styled like LiveTrack)

Let me know if you want to adjust anything!
