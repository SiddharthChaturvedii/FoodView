const mongoose = require('mongoose');
const Food = require('./src/models/food.model');
require('dotenv').config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/food-view";
console.log("Connecting to:", uri);

mongoose.connect(uri)
    .then(async () => {
        console.log("Connected to MongoDB");

        const count = await Food.countDocuments();
        console.log(`Total Food Items: ${count}`);

        if (count > 0) {
            const items = await Food.find({});
            console.log("--- Items Inspection ---");
            items.forEach(item => {
                const isDonation = item.isDonation;
                const expiry = item.expiryDate;
                const now = new Date();
                let willShow = false;

                if (isDonation !== true) { // Standard post
                    willShow = true;
                } else if (isDonation === true && new Date(expiry) > now) {
                    willShow = true;
                }

                console.log(`ID: ${item._id} | Name: ${item.name} | isDonation: ${isDonation} | Expiry: ${expiry} | Will Show: ${willShow}`);
            });
        } else {
            console.log("No items found in this database.");
        }

        process.exit(0);
    })
    .catch(err => {
        console.error("Error:", err);
        process.exit(1);
    });
