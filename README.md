# 🍱 FoodView

> **Think Instagram Reels meets a donation engine** — a full-stack food-sharing platform connecting restaurants, home chefs, and volunteers to reduce food waste through a modern, mobile-first experience.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Stack](https://img.shields.io/badge/stack-MERN-green.svg)
![Status](https://img.shields.io/badge/status-active-brightgreen.svg)

---

## 📌 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [API Overview](#-api-overview)
- [Screenshots](#-screenshots)
- [Future Roadmap](#-future-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌍 About

FoodView is a comprehensive web application designed to bridge the gap between **food partners** (restaurants, hotels, home chefs) and **consumers/volunteers**. Its primary objective is to reduce food waste and facilitate food sharing through a modern, engaging digital platform.

Two distinct user roles power the platform:

| Role | Description |
|------|-------------|
| 🍽️ **Food Partner** | Restaurants, hotels, or home chefs who list surplus food or menu items |
| 🙋 **User / Volunteer** | Individuals who discover food, claim donations, or purchase items |

---

## ✨ Features

### 🔐 Authentication & Authorization
- Dual-role registration and login flows — Partners and Users are completely separate
- Custom `authOptionalMiddleware` — guests browse freely, logged-in users get a personalized layer, all without blocking access
- JWT-based stateless sessions with 24hr expiry stored in `httpOnly` cookies
- Axios interceptor auto-attaches Bearer token to every request (works even where third-party cookies are blocked)
- Role-based protected routing via React Router DOM v7

### 🎬 Reels-Style Food Feed
- Vertical swipe feed (à la Instagram Reels) built with `ReelFeed.jsx`
- `IntersectionObserver` auto-plays videos only when in the viewport — no wasted loads, smooth mobile performance

### 🫶 Annapurna — Donation Module
- Partners flag surplus food as **zero-cost donations**
- **Haversine formula** calculates real spherical-earth distance between user and pickup point
- Robust claim flow with **double-booking prevention** (handles both real MongoDB ObjectIDs and mock/demo IDs via regex validation)
- **Privacy by design** — no phone numbers ever exposed; contact via platform-mediated actions or QR codes only

### 🎭 Food Mood Selector
- Filter the feed by vibe: `Spicy` · `Comfort` · `Vegan` · `Sweet` · and more
- Intelligent fallback to random suggestions when no strict match is found — no empty screens, ever

### 📍 Geolocation & Reverse Geocoding
- `navigator.geolocation` fetches coordinates from the browser
- OpenStreetMap **Nominatim API** converts coordinates to a human-readable address
- Auto-populated during food listing — zero manual typing for partners on the go

### 🎨 Animations & UI
- **GSAP** scroll triggers and **Framer Motion** layout transitions for micro-interactions throughout the app
- `100dvh` hero section — fixes Safari/Chrome floating toolbar overlap on mobile (one unit change, big impact)
- Mobile-first responsive design with Tailwind CSS utility classes

### 🔒 Security-First Backend
- Passwords hashed with **Bcrypt.js**
- HTTP headers hardened with **Helmet**
- Brute-force protection via **express-rate-limit**
- Custom CSRF protection middleware
- Strict **RBAC** enforced on every sensitive route

### 🖼️ Media Management
- **ImageKit** CDN for efficient image/video hosting, transformation, and fast delivery

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React.js + Vite | SPA framework + optimized build |
| Tailwind CSS | Utility-first styling |
| GSAP | Scroll triggers & complex animations |
| Framer Motion | Layout transitions & micro-interactions |
| React Router DOM v7 | Client-side routing & protected routes |
| Axios | HTTP client with global interceptors |
| Lucide React | Icon library |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express.js | RESTful API server |
| MongoDB + Mongoose | Database + ODM |
| JWT | Stateless authentication |
| Bcrypt.js | Password hashing |
| ImageKit | Media hosting & CDN |
| Helmet | HTTP header security |
| express-rate-limit | Brute-force protection |

### External APIs
| API | Purpose |
|-----|---------|
| OpenStreetMap Nominatim | Reverse geocoding |
| Browser Geolocation API | Coordinate detection |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- ImageKit account
- npm or yarn

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/SiddharthChaturvedii/FoodView.git
cd FoodView
```

**2. Install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

**3. Set up environment variables** (see [below](#-environment-variables))

**4. Run the development servers**
```bash
# Backend (from /backend)
npm run dev

# Frontend (from /frontend)
npm run dev
```

The app will be running at `http://localhost:5173`

---

## 🔑 Environment Variables

Create a `.env` file in the `/backend` directory:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

Create a `.env` file in the `/frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:3000
```

> ⚠️ Never commit `.env` files to version control. A `.env.example` is provided for reference.

---

## 📁 Project Structure

```
FoodView/
├── backend/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── food.controller.js
│   │   └── donation.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js       # JWT + RBAC + Optional Auth
│   │   └── rateLimit.middleware.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── foodPartner.model.js
│   │   ├── foodItem.model.js
│   │   └── interaction.model.js    # Likes / Saves
│   ├── routes/
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ReelFeed.jsx         # IntersectionObserver video feed
    │   │   ├── MoodSelector.jsx     # Food Mood filtering
    │   │   └── LandingPage.jsx      # 100dvh Hero + GSAP animations
    │   ├── context/                 # React Context API state management
    │   ├── pages/
    │   └── utils/
    │       └── axios.js             # Global interceptor configuration
```

---

## 📡 API Overview

### Auth Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/user/register` | Public | Register a new user |
| POST | `/api/user/login` | Public | Login as user |
| POST | `/api/partner/register` | Public | Register a food partner |
| POST | `/api/partner/login` | Public | Login as partner |

### Food Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/food/feed` | Optional Auth | Get food reel feed |
| POST | `/api/food/create` | Partner only | List a new food item |
| GET | `/api/food/mood` | Optional Auth | Mood-based discovery |
| DELETE | `/api/food/:id` | Partner only | Remove a food listing |

### Donation Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/donations` | Optional Auth | Browse donations near you |
| POST | `/api/donations/:id/claim` | User only | Claim a donation |

---

## 🗺️ Screenshots

> *(Add screenshots or a demo GIF here)*

```
Coming soon — or drop a ⭐ and I'll prioritize it!
```

---

## 🔮 Future Roadmap

- [ ] **AI Recommendations** — ML model for personalized food suggestions based on history and mood
- [ ] **Real-Time Chat** — Socket.io for direct donor ↔ claimant communication
- [ ] **Delivery Integration** — 3rd party logistics (Dunzo / Uber Eats) for automated pickup scheduling
- [ ] **PWA Support** — Offline capabilities and native-like installability

---

## 🤝 Contributing

Contributions are welcome! Here's how:

```bash
# 1. Fork the repo
# 2. Create your feature branch
git checkout -b feature/your-feature-name

# 3. Commit your changes
git commit -m "feat: add your feature"

# 4. Push and open a Pull Request
git push origin feature/your-feature-name
```

Please follow conventional commits and open an issue before starting major changes.

---



<div align="center">
  Built with ❤️ by <a href="https://github.com/SiddharthChaturvedii">Siddharth Chaturvedi</a>
  <br/>
  <br/>
  If you found this useful, please consider leaving a ⭐
</div>
