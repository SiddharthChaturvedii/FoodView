const mongoose = require('mongoose');
const Food = require('./src/models/food.model');
require('dotenv').config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/food-view";

mongoose.connect(uri)
    .then(async () => {
        const item = await Food.findOne({ name: { $regex: /SeaFood/i } });
        console.log("Seafood Item Details:");
        console.log(JSON.stringify(item, null, 2));
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
