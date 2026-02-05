const mongoose = require('mongoose');
const Food = require('./src/models/food.model');
const FoodPartner = require('./src/models/foodpartner.model');
const User = require('./src/models/user.model');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/food-view")

    .then(async () => {
        console.log("Connected to MongoDB");

        const foodCount = await Food.countDocuments();
        console.log(`Total Food Items: ${foodCount}`);

        const partnerCount = await FoodPartner.countDocuments();
        console.log(`Total Food Partners: ${partnerCount}`);

        const userCount = await User.countDocuments();
        console.log(`Total Users: ${userCount}`);

        process.exit(0);
    })
    .catch(err => {
        console.error("Error:", err);
        process.exit(1);
    });
