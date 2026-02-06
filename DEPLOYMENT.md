# 🚀 FoodView Deployment Guide

This guide covers everything you need to configure after deploying your app to a platform like Vercel, Render, or Railway.

---

## 🔧 1. Backend Configuration (Production)
In your hosting provider settings (e.g., Render Dashboard), you MUST add these **Environment Variables**:

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `MONGODB_URI` | Your production database link (MongoDB Atlas). | `mongodb+srv://user:pass@cluster.mongodb.net/prod` |
| `JWT_SECRET` | A long, random string for securing logins. | `your_very_long_random_secret_string` |
| `FRONTEND_URL` | **CRITICAL**: The URL where your frontend is hosted. | `https://foodview-app.vercel.app` |
| `NODE_ENV` | Set to `production` to enable secure cookies. | `production` |

> [!IMPORTANT]
> The `FRONTEND_URL` is what you were asking about! The backend uses this to allow the frontend to talk to it (CORS). Without this, the frontend will be blocked.

---

## 🎨 2. Frontend Configuration (Production)
In your frontend hosting (e.g., Vercel), add this variable:

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `VITE_API_URL` | The URL of your **deployed backend**. | `https://foodview-api.onrender.com` |

---

## 📝 3. Post-Deployment Checklist

### ✅ Database Setup
- [ ] Whitelist `0.0.0.0/0` in MongoDB Atlas so your hosting provider can connect.
- [ ] Run the seeding script once if you want starting data: `npm run seed` (from the backend folder).

### ✅ Security Verification
- [ ] Verify that your site is running on **HTTPS**. Authentication cookies will only work on HTTPS in production.
- [ ] Check that no passwords or JWT secrets are visible in any logs. (I have already removed the loggers, but it's good to check).

### ✅ Link Verification
- [ ] Test the **Food Partner Profile** sharing link. It uses `window.location.href`, so it should automatically point to your live URL.
- [ ] Ensure the **QR Code** in the Annapurna page is still readable and the UPI ID is correct for production.

---

## 💡 Quick Recap of Files to Check
These files are already configured to use the variables above:
1.  **Backend CORS**: [app.js](file:///c:/vscode%20STUDY/WEB%20DEVELOPMENT/PROJECTS/Youtube-project-food-view-main/backend/src/app.js) (uses `FRONTEND_URL`)
2.  **Frontend API**: [api.js](file:///c:/vscode%20STUDY/WEB%20DEVELOPMENT/PROJECTS/Youtube-project-food-view-main/frontend/src/utils/api.js) (uses `VITE_API_URL`)
3.  **Auth Cookies**: [auth.controller.js](file:///c:/vscode%20STUDY/WEB%20DEVELOPMENT/PROJECTS/Youtube-project-food-view-main/backend/src/controllers/auth.controller.js) (uses `NODE_ENV`)
