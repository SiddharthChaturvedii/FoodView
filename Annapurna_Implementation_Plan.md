# 🍱 Annapurna Page Implementation Plan
**Mission: Zero Hunger**

This document outlines the detailed structure for the `/annapurna` page (`http://localhost:5173/annapurna`).

**Note:** The Home Page (`/`) Hero animation remains completely untouched. This plan applies ONLY to the separate Annapurna page.

---

## 🏗️ Page Architecture

### 1. **Annapurna Page Hero**
*   **Visual**: A high-impact Static Image or simple loop (Dark theme).
*   **Headline**: "Bridging the Gap Between Abundance and Need."
*   **Call to Action**: "Donate Food" / "Find Food".
*   *Note: distinct from the Home Page scroll animation.*

---

### 2. **Live Impact Stats**
*   **Design**: A sleek stats bar immediately following the hero.
*   **Metrics**:
    *   🥘 **Total Meals Served**
    *   🤝 **Active Partners**
    *   📍 **Cities Covered**

---

### 3. **Available Donations (The "List")**
*   **Concept**: A real-time feed of available food parcels.
*   **Layout**: Grid of cards.
*   **Distance Logic**:
    *   Uses **Haversine Formula** to calculate distance between User's browser location and Partner's stored coordinates.
    *   Requires user permission for Location Access.
*   **Card Data**:
    *   **Image**: Photo of the food or Partner Logo.
    *   **Heading**: Meal Name.
    *   **Partner**: "Hotel Saffron".
    *   **Urgency**: ⏳ "Expires in: 3h".
    *   **Distance**: 📍 "1.2 km away".
    *   **Action**: `[ CLAIM ]` Button.

---

### 4. **"Wall of Kindness" (Feedback Ticker)**
*   **Feature Link**: Uses the **TasteTicker** animation engine.
*   **Concept**: Horizontal scrolling feedback cards.
*   **Content**: "Seva Shelter: Thank you for the meal!"

---

### 5. **"Share Your Story" (Feedback Form)**
*   **Fields**: Name, Message, Rating.
*   **Submit**: Adds to the Wall of Kindness.

---

## 🛠️ Technical Plan

1.  **Backend**:
    *   `Feedback` Model & API.
2.  **Frontend Layout**:
    *   `<ImpactTicker />` (cloned from TasteTicker).
    *   `<DonationList />` (with Geolocation logic).
    *   `<FeedbackForm />`.
