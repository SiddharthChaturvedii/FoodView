// create server
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes = require('./routes/food-partner.routes');
const userRoutes = require('./routes/user.routes');
const cors = require('cors');

const app = express();

// CORS configuration - uses environment variable for production
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    process.env.FRONTEND_URL
].filter(Boolean);

const corsOrigin = (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
    } else {
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
