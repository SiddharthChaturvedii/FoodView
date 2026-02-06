# 🏗️ FoodView Architecture & File Manifest

This document provides a structured walkthrough of the project codebase, explaining the role of each directory and key file. Use this as a reference for maintenance and future development.

---

## 📂 Project Root
- `README.md`: High-level project overview, installation, and setup instructions.
- `ARCHITECTURE.md`: (This file) Detailed technical breakdown of the file structure.
- `DEPLOYMENT.md`: Step-by-step guide for production environment variables and links.
- `package.json`: Project-wide configuration (if applicable) and scripts.
- `.gitignore`: Specifies files and directories that Git should ignore (e.g., `node_modules`, `.env`).

---

## 🛠️ Backend (`/backend`)
The backend is a Node.js/Express application following a **Controller-Model-Middleware** pattern.

### 📁 `/src`
- `server.js`: The heart of the backend. Initializes the database, applies global middlewares (CORS, JSON), and routes incoming requests.

#### 📁 `/models`
*Defines the data structure for MongoDB using Mongoose.*
- `food.model.js`: Handles both 'Posts' (videos) and 'Donations'. Includes location coordinates and status fields.
- `foodpartner.model.js`: Schema for restaurants/partners. Stores credentials and profile info.
- `user.model.js`: Schema for regular consumers.

#### 📁 `/controllers`
*Contains the business logic for each route.*
- `food.controller.js`: Logic for creating posts, claiming donations, and searching/filtering food items.
- `auth.controller.js`: Manages login, registration, and profile updates for all user types.

#### 📁 `/routes`
*Maps endpoints (URLs) to controller functions.*
- `food.routes.js`: Routes for `/api/food`, `/api/food/:id`, etc.
- `auth.routes.js`: Routes for `/api/auth/register`, `/api/auth/login`, etc.

#### 📁 `/middlewares`
- `auth.middleware.js`: Protects private routes by verifying JWT tokens.

### 📁 `/scripts`
*Utility tools for developers.*
- `ops.js`: **The Unified Operations Manager**. Replaces multiple loose scripts. Used for seeding data, checking status, and cleaning the database.

---

## 🎨 Frontend (`/frontend`)
A React-based single-page application (SPA) focused on a premium, YouTube-inspired UI.

### 📁 `/src`
#### 📁 `/pages`
- `Home.jsx`: The main landing feed where users discover food content.
- `Annapurna.jsx`: Dedicated page for donations and social impact.
- `auth/`: Contains login/registration pages for Users and Food Partners.

#### 📁 `/components`
- `common/Footer.jsx`: The global footer component with social links and credits.
- `annapurna/ImpactTicker.jsx`: The animated "Wall of Kindness" component.
- `ui/`: Reusable primitive components (e.g., buttons, cards).

#### 📁 `/styles`
- `annapurna.css`: Specific styling for the Annapurna page.
- `theme.css`: Global CSS variables for colors, spacing, and typography.
- `index.css`: Root styling and Tailwind imports.

---

## 📦 Deployment Note
- **Database**: MongoDB Atlas is recommended for production.
- **Backend**: Can be deployed to Render, Railway, or Heroku.
- **Frontend**: Can be deployed to Vercel or Netlify.
- **Env Vars**: Always ensure `MONGODB_URI` and `JWT_SECRET` are set in the production environment.
