const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const likeModel = require("../models/likes.model")
const saveModel = require("../models/save.model")
const { v4: uuid } = require("uuid")


async function createFood(req, res) {
    try {
        // Guard: video file is required
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ message: "Video file is required" });
        }

        const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid());

        // Prepare food data
        const foodData = {
            name: req.body.name,
            description: req.body.description,
            video: fileUploadResult.url,
            // Donation Fields
            isDonation: req.body.isDonation === 'true' || req.body.isDonation === true,
            quantity: req.body.quantity,
            pickupTime: req.body.pickupTime,
            expiryDate: req.body.expiryDate,
        };

        // Safe JSON.parse for location
        if (req.body.location) {
            try {
                foodData.location = JSON.parse(req.body.location);
            } catch {
                return res.status(400).json({ message: "Invalid location format" });
            }
        }

        // Handle User Role vs Partner Role
        if (req.role === 'user') {
            foodData.user = req.user._id;
            foodData.isDonation = true; // Users can ONLY donate
        } else {
            foodData.foodPartner = req.foodPartner._id;
        }

        const foodItem = await foodModel.create(foodData);

        res.status(201).json({
            message: "food created successfully",
            food: foodItem
        });
    } catch (error) {
        console.error("Create Food Error:", error);
        res.status(500).json({ message: "Failed to create food item", error: error.message });
    }
}

async function getFoodItems(req, res) {
    try {
        // Filter: Show all standard posts OR non-expired donations
        // Query: Fetch all food items (Donations & Standard Posts)
        // Previously strict validation hid all user data. Reverting to show all content.
        const query = {};

        const foodItems = await foodModel.find(query).populate("foodPartner");
        res.status(200).json({
            message: "Food items fetched successfully",
            foodItems
        });
    } catch (error) {
        console.error("Get Food Items Error:", error);
        res.status(500).json({ message: "Failed to fetch food items", error: error.message });
    }
}


async function likeFood(req, res) {
    const { foodId } = req.body;
    const user = req.user;

    if (!foodId) {
        return res.status(400).json({ message: "foodId is required" });
    }

    try {
        const isAlreadyLiked = await likeModel.findOne({
            user: user._id,
            food: foodId
        });

        if (isAlreadyLiked) {
            await likeModel.deleteOne({
                user: user._id,
                food: foodId
            });

            const updatedFood = await foodModel.findByIdAndUpdate(foodId, {
                $inc: { likeCount: -1 }
            }, { new: true });

            if (!updatedFood) {
                return res.status(404).json({ message: "Food item not found" });
            }

            return res.status(200).json({
                message: "Food unliked successfully",
                isLiked: false,
                likeCount: Math.max(0, updatedFood.likeCount)
            });
        }

        await likeModel.create({
            user: user._id,
            food: foodId
        });

        const updatedFood = await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: 1 }
        }, { new: true });

        if (!updatedFood) {
            return res.status(404).json({ message: "Food item not found" });
        }

        res.status(201).json({
            message: "Food liked successfully",
            isLiked: true,
            likeCount: updatedFood.likeCount
        });
    } catch (error) {
        console.error("Like Food Error:", error);
        res.status(500).json({ message: "Error processing like", error: error.message });
    }
}

async function saveFood(req, res) {
    try {
        const { foodId } = req.body;
        const user = req.user;

        if (!foodId) {
            return res.status(400).json({ message: "foodId is required" });
        }

        const isAlreadySaved = await saveModel.findOne({
            user: user._id,
            food: foodId
        });

        if (isAlreadySaved) {
            await saveModel.deleteOne({
                user: user._id,
                food: foodId
            });

            await foodModel.findByIdAndUpdate(foodId, {
                $inc: { savesCount: -1 }
            });

            return res.status(200).json({
                message: "Food unsaved successfully"
            });
        }

        const save = await saveModel.create({
            user: user._id,
            food: foodId
        });

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { savesCount: 1 }
        });

        res.status(201).json({
            message: "Food saved successfully",
            save
        });
    } catch (error) {
        console.error("Save Food Error:", error);
        res.status(500).json({ message: "Error saving food", error: error.message });
    }
}

async function getSaveFood(req, res) {
    try {
        const user = req.user;

        const savedFoods = await saveModel.find({ user: user._id }).populate('food');

        // Return empty array instead of 404 — this is not an error, just no data
        if (!savedFoods || savedFoods.length === 0) {
            return res.status(200).json({
                message: "No saved foods found",
                savedFoods: []
            });
        }

        res.status(200).json({
            message: "Saved foods retrieved successfully",
            savedFoods
        });
    } catch (error) {
        console.error("Get Saved Food Error:", error);
        res.status(500).json({ message: "Error retrieving saved foods", error: error.message });
    }
}


async function claimDonation(req, res) {
    const { foodId } = req.params;
    const { role } = req.body;
    const user = req.user;

    if (!role || !['volunteer', 'consumer'].includes(role)) {
        return res.status(400).json({ message: "Role must be 'volunteer' or 'consumer'" });
    }

    try {
        const food = await foodModel.findById(foodId);

        if (!food) {
            return res.status(404).json({ message: "Food item not found" });
        }

        if (!food.isDonation || food.status !== 'available') {
            return res.status(400).json({ message: "This donation is no longer available" });
        }

        // Update Food Status
        food.status = 'claimed';
        await food.save();

        // Gamification for Volunteers
        if (role === 'volunteer') {
            user.volunteerScore = (user.volunteerScore || 0) + 1;

            // Level Logic
            if (user.volunteerScore >= 50) user.volunteerLevel = "Gold";
            else if (user.volunteerScore >= 10) user.volunteerLevel = "Silver";
            else user.volunteerLevel = "Bronze";

            await user.save();
        }

        // Generate Ticket
        const ticketId = uuid();

        res.status(200).json({
            message: "Donation claimed successfully",
            ticket: {
                id: ticketId,
                foodName: food.name,
                address: food.location?.address || "Food Partner Location",
                expiry: food.expiryDate
            },
            userStats: role === 'volunteer' ? {
                score: user.volunteerScore,
                level: user.volunteerLevel
            } : null
        });

    } catch (error) {
        console.error("Claim Donation Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
    getSaveFood,
    claimDonation
}