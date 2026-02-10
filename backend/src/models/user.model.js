const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        select: false
    },
    profilePhoto: {
        type: String,
        default: ''
    },
    volunteerScore: {
        type: Number,
        default: 0
    },
    volunteerLevel: {
        type: String,
        default: "Bronze",
        enum: ["Bronze", "Silver", "Gold", "Platinum"]
    }
},
    {
        timestamps: true
    }
)

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;