const userModel = require('../models/user.model');
const likeModel = require('../models/likes.model');
const saveModel = require('../models/save.model');
const storageService = require('../services/storage.service');
const { v4: uuid } = require('uuid');

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
                profilePhoto: user.profilePhoto || '',
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

// Update user profile (name and optionally profile photo)
async function updateUserProfile(req, res) {
    try {
        const user = req.user;
        const updates = {};

        // Only update fields that are provided
        if (req.body.fullName) {
            updates.fullName = req.body.fullName;
        }

        // Handle profile photo upload
        if (req.file) {
            const uploadResult = await storageService.uploadFile(req.file.buffer, uuid());
            updates.profilePhoto = uploadResult.url;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No fields to update" });
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            user._id,
            { $set: updates },
            { new: true }
        );

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                _id: updatedUser._id,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                profilePhoto: updatedUser.profilePhoto || ''
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
}

module.exports = {
    getUserProfile,
    getUserLikedFoods,
    updateUserProfile
};
