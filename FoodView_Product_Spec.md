# FoodView Product Vision & Feature Specification

## 🌟 Executive Summary
FoodView is an immersive, video-first food discovery platform connecting foodies with local creators. It emphasizes "visual appetite" via Reels and "social good" via the Annapurna initiative.

---

## 🏠 Homepage Architecture

### 1. **Immersive Hero Section** (Implemented)
*   **Visuals**: A cinematic scroll-triggered animation sequence (192 frames).
*   **Branding**: Large "FoodView" typography with tagline "Discover • Share • Savor".

### 2. **Navigation Overlay** (Implemented)
*   **Style**: Transparent, glass-morphism header.
*   **Links**: Reels (Play Icon), Annapurna (Heart Icon), Profile (Context-aware).

### 3. **"Taste Ticker" (Reels Carousel)** (Planned)
*   **Concept**: Horizontal auto-scrolling marquee of top-rated food reels.
*   **Purpose**: Acts as a "visual menu" showing what's trending immediately.

### 4. **"Foodie AI" (Recommendation Bot)** (Planned - New Placement)
*   **Location**: Placed prominently *between* the Reels Carousel and the Annapurna section.
*   **Concept**: A conversational AI assistant, not just a feed sorter.
*   **Function**:
    *   Users ask: *"Where can I find the best spicy momos nearby?"* or *"Suggest a quiet place for a date."*
    *   **AI Reply**: Provides specific text recommendations: *"I recommend 'Bistro 57' for their Spicy Momos (Rated 4.5/5)."* acting as a virtual concierge for our Food Partners.
    *   **Philosophy**: We are an ad/discovery platform, not delivery. We guide users to the *experience*.

### 5. **"Annapurna" Teaser Section** (Planned)
*   **Visuals**: **4K Real-life Parallax Image** depicting a food parcel being handed from a partner/volunteer to a person in need. Realistic close-up, high emotion.
*   **Content**: "Mission: Zero Hunger" text with a "Join the Cause" button.

### 6. **Footer** (Planned)
*   **Style**: Dark, earthy theme.
*   **Credits**: "Developed by [Your Name]" with direct links to your LinkedIn, GitHub, and Twitter.
*   **Site Links**: About Us, Partner with Us, Annapurna Initiative.

---

## 🍱 The "Annapurna" Page (Social Impact)
*   **Donation Listing**: Simple list of available items (Name, Partner, Expiry).
*   **Location Tech**:
    *   *Partner*: Address converted to Coordinates (Geocoding) during registration.
    *   *User*: Browser Geolocation API (`navigator.geolocation`) requests permission to get current coords.
    *   *Math*: System calculates distance between the two points.
*   **Booking Flow**: Claim -> Notify Partner -> Partner Confirms.

---

## 🔍 Search & Discovery
*   **Search**: Standard text search (MongoDB) for Dish Names, Partner Names.
*   **Filtering**: Basic filters for Veg/Non-Veg and Distance.

---

## ❌ Deprecated / V2 Features
*   **Cook-off Challenges**: Removed.
*   **Manual Collections**: Replaced by AI recommendations.
