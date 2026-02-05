const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const Food = require('./src/models/food.model');
const FoodPartner = require('./src/models/foodpartner.model');
const User = require('./src/models/user.model');
require('dotenv').config();

const sampleVideos = [
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/hackathon");
        console.log("Connected to MongoDB for seeding");

        // Clear existing data
        await Food.deleteMany({});
        await FoodPartner.deleteMany({});
        await User.deleteMany({});
        console.log("Cleared existing data");

        // Create Food Partner
        const hashedPassword = await bcrypt.hash("password123", 10);
        const partner = await FoodPartner.create({
            name: "Spicy Bites",
            contactName: "Chef Raj",
            phone: "1234567890",
            address: "123 Food Street, Mumbai",
            email: "partner@example.com",
            password: hashedPassword
        });
        console.log("Created Food Partner: partner@example.com / password123");

        // Create User
        const user = await User.create({
            fullName: "Foodie User",
            email: "user@example.com",
            password: hashedPassword
        });
        console.log("Created User: user@example.com / password123");

        // Create Food Items
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
        console.log(`Created ${foods.length} food items`);

        console.log("Seeding complete!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}

seed();
