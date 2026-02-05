const mongoose = require('mongoose');
const Food = require('./src/models/food.model');
require('dotenv').config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/food-view";

mongoose.connect(uri)
    .then(async () => {
        const result = await Food.deleteMany({ name: { $regex: /SeaFood/i } });
        console.log(`Deleted ${result.deletedCount} items with name matching 'SeaFood'`);
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
