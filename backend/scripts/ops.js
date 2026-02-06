/**
 * FOODVIEW BACKEND OPERATIONS & DOCUMENTATION
 * ===========================================
 * 
 * PROJECT STRUCTURE MANIFEST:
 * 
 * [CORE]
 * - server.js: Entry point. Sets up Express, middleware, and database connection.
 * - .env: Environment variables (MongoDB URI, JWT secrets, etc.).
 * 
 * [SRC/MODELS]
 * - food.model.js: Defines food items (posts & donations), location coordinates, and metadata.
 * - foodpartner.model.js: Schema for restaurants/partners including business info and password.
 * - user.model.js: Schema for regular users (consumers).
 * 
 * [SRC/CONTROLLERS]
 * - food.controller.js: CRUD operations for food items, donation logic, and location-based filtering.
 * - auth.controller.js: Handles login/registration for both Users and Food Partners.
 * 
 * [SRC/MIDDLEWARES]
 * - auth.middleware.js: Verifies JWT tokens and attaches user/partner to the request object.
 * 
 * [SCRIPTS]
 * - ops.js: This file. Consolidated utilities for maintenance, seeding, and debugging.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Models
const Food = require('../src/models/food.model');
const FoodPartner = require('../src/models/foodpartner.model');
const User = require('../src/models/user.model');

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/food-view";

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`✅ Connected to MongoDB: ${MONGO_URI}`);
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err.message);
        process.exit(1);
    }
};

/**
 * FEATURE: STATUS CHECK
 * Checks counts of all entities in the database.
 */
const checkStatus = async () => {
    await connectDB();
    const foodCount = await Food.countDocuments();
    const partnerCount = await FoodPartner.countDocuments();
    const userCount = await User.countDocuments();

    console.log("\n--- DATABASE STATUS ---");
    console.log(`Food Items:    ${foodCount}`);
    console.log(`Food Partners: ${partnerCount}`);
    console.log(`Users:         ${userCount}`);
    console.log("-----------------------\n");
    process.exit(0);
};

/**
 * FEATURE: INSPECT DONATIONS
 * Lists all food items and indicates if they will show up in the app.
 */
const inspectItems = async () => {
    await connectDB();
    const items = await Food.find({});
    const now = new Date();

    console.log("\n--- ITEMS INSPECTION ---");
    items.forEach(item => {
        const isDonation = item.isDonation === true;
        const expiry = item.expiryDate;
        let willShow = false;

        if (!isDonation) {
            willShow = true; // Standard posts always show
        } else if (isDonation && new Date(expiry) > now) {
            willShow = true; // Donations show only if not expired
        }

        console.log(`ID: ${item._id} | Name: ${item.name.padEnd(25)} | Type: ${isDonation ? 'DONATION' : 'POST'} | Visible: ${willShow ? '✅' : '❌'}`);
    });
    console.log("------------------------\n");
    process.exit(0);
};

/**
 * FEATURE: CLEANUP JUNK
 * Deletes items with 'SeaFood' in the name (typically used for testing).
 */
const cleanupJunk = async () => {
    await connectDB();
    const result = await Food.deleteMany({ name: { $regex: /SeaFood/i } });
    console.log(`🧹 Deleted ${result.deletedCount} items matching 'SeaFood'`);
    process.exit(0);
};

/**
 * FEATURE: SEED DATABASE
 * Resets the database and populates with sample data.
 */
const seedDB = async () => {
    await connectDB();

    // Clear data
    await Food.deleteMany({});
    await FoodPartner.deleteMany({});
    await User.deleteMany({});
    console.log("🗑️  Cleared existing data");

    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create Sample Partner
    const partner = await FoodPartner.create({
        businessName: "Spicy Bites",
        contactName: "Chef Raj",
        phone: "1234567890",
        address: "123 Food Street, Mumbai",
        email: "partner@example.com",
        password: hashedPassword
    });
    console.log("👤 Created Partner: partner@example.com");

    // Create Sample User
    await User.create({
        fullName: "Foodie User",
        email: "user@example.com",
        password: hashedPassword
    });
    console.log("👤 Created User:    user@example.com");

    const sampleVideos = [
        "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
    ];

    const foods = [
        {
            name: "Spicy Schezwan Noodles",
            description: "Hot and spicy noodles with veggies",
            video: sampleVideos[0],
            foodPartner: partner._id,
            isDonation: false,
            likeCount: 5,
            savesCount: 2
        },
        {
            name: "Chocolate Lava Cake",
            description: "Rich chocolate cake with molten center",
            video: sampleVideos[1],
            foodPartner: partner._id,
            isDonation: false,
            likeCount: 12,
            savesCount: 8
        },
        {
            name: "Vegetable Momos",
            description: "Steamed dumplings served with spicy chutney",
            video: sampleVideos[2],
            foodPartner: partner._id,
            isDonation: false,
            likeCount: 20,
            savesCount: 15
        }
    ];

    await Food.insertMany(foods);
    console.log(`🍕 Created ${foods.length} sample food items`);
    console.log("\n✨ Seeding Complete! (All passwords are 'password123')\n");
    process.exit(0);
};

// Help menu
const showHelp = () => {
    console.log(`
🚀 FoodView Ops Manager
Usage: node backend/scripts/ops.js <command>

Commands:
  --status    Show database counts (Users, Partners, Food)
  --inspect   List all food items and their visibility status
  --cleanup   Delete test entries (SeaFood)
  --seed      Reset and seed database with sample data
  --help      Show this menu
    `);
};

// Command Router
const cmd = process.argv[2];
switch (cmd) {
    case '--status': checkStatus(); break;
    case '--inspect': inspectItems(); break;
    case '--cleanup': cleanupJunk(); break;
    case '--seed': seedDB(); break;
    case '--help':
    default: showHelp(); break;
}
