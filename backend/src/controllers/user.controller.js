const userModel = require('../models/user.model');
const likeModel = require('../models/likes.model');
const saveModel = require('../models/save.model');

// Get current logged-in user's profile
async function getUserProfile(req, res) {
    try {
        const user = req.user;

        // Get counts
        const likedCount = await likeModel.countDocuments({ user: user._id });
        const savedCount = await saveModel.countDocuments({ user: user._id });

        res.status(200).json({
            message: "User profile fetched successfully",
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                createdAt: user.createdAt,
                likedCount,
                savedCount
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile", error: error.message });
    }
}

// Get user's liked foods
async function getUserLikedFoods(req, res) {
    try {
        const user = req.user;
        const likedFoods = await likeModel.find({ user: user._id })
            .populate({
                path: 'food',
                populate: { path: 'foodPartner' }
            });

        res.status(200).json({
            message: "Liked foods fetched successfully",
            likedFoods: likedFoods.map(l => l.food).filter(Boolean)
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching liked foods", error: error.message });
    }
}

module.exports = {
    getUserProfile,
    getUserLikedFoods
};
