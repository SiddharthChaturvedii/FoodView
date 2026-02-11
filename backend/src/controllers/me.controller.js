const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model");
const jwt = require("jsonwebtoken");

async function getCurrentUser(req, res) {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Try to find user first
        let user = await userModel.findById(decoded.id).select("-password");
        if (user) {
            return res.status(200).json({
                user: {
                    ...user.toObject(),
                    role: "user"
                }
            });
        }

        // If not user, try food partner
        let partner = await foodPartnerModel.findById(decoded.id).select("-password");
        if (partner) {
            return res.status(200).json({
                user: {
                    ...partner.toObject(),
                    role: "food-partner",
                    // Map partner specific fields to generic ones for easier frontend handling
                    fullName: partner.name,
                    email: partner.email
                }
            });
        }

        return res.status(404).json({ message: "User not found" });

    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = {
    getCurrentUser
};
