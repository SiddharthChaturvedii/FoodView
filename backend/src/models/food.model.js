const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    video: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    foodPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foodpartner"
    },
    likeCount: {
        type: Number,
        default: 0
    },
    savesCount: {
        type: Number,
        default: 0
    },
    // Donation Specific Fields
    isDonation: {
        type: Boolean,
        default: false
    },
    quantity: {
        type: String, // e.g., "5kg" or "10 servings"
        required: function () { return this.isDonation; }
    },
    pickupTime: {
        type: String,
        required: function () { return this.isDonation; }
    },
    expiryDate: {
        type: Date,
        required: function () { return this.isDonation; }
    },
    status: {
        type: String,
        enum: ['available', 'claimed', 'picked_up'],
        default: 'available'
    }
})


const foodModel = mongoose.model("food", foodSchema);


module.exports = foodModel;