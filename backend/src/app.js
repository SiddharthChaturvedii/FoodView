const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes = require('./routes/food-partner.routes');
const userRoutes = require('./routes/user.routes');
const cors = require('cors');

const app = express();

// Trust proxy is required for secure cookies on Render/Heroku etc
app.set('trust proxy', 1);

// Security Headers
app.use(helmet());

// Rate Limiting (Brute-force protection for Auth)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many login/register attempts, please try again after 15 minutes"
});
app.use('/api/auth', authLimiter);

// CORS configuration - uses environment variable for production
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    process.env.FRONTEND_URL,
    "https://food-view-smoky.vercel.app"
].filter(Boolean);

const corsOrigin = (origin, callback) => {
    // Treat no origin (like mobile apps or curl) or allowed origins as valid
    if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
    } else {
        console.warn(`CORS Blocked: ${origin}`); // Changed to warn to reduce noise
        callback(new Error('Not allowed by CORS'));
    }
};
app.use(cors({
    origin: corsOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Hello World");
})

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
