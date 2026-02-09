const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const likeModel = require("../models/likes.model")
const saveModel = require("../models/save.model")
const { v4: uuid } = require("uuid")


async function createFood(req, res) {
    const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid())

    // Prepare food data
    const foodData = {
        name: req.body.name,
        description: req.body.description,
        video: fileUploadResult.url,
        // Donation Fields
        isDonation: req.body.isDonation === 'true' || req.body.isDonation === true, // Ensure boolean
        quantity: req.body.quantity,
        pickupTime: req.body.pickupTime,
        expiryDate: req.body.expiryDate,
        location: req.body.location ? JSON.parse(req.body.location) : undefined
    };

    // Handle User Role vs Partner Role
    if (req.role === 'user') {
        foodData.user = req.user._id;
        foodData.isDonation = true; // Users can ONLY donate

        // If we want to assign a placeholder partner or leave it null.
        // For now, leaving foodPartner undefined.
    } else {
        foodData.foodPartner = req.foodPartner._id;
    }

    const foodItem = await foodModel.create(foodData);

    res.status(201).json({
        message: "food created successfully",
        food: foodItem
    })

}

async function getFoodItems(req, res) {
    // Filter: Show all standard posts OR non-expired donations
    const query = {
        $or: [
            { isDonation: { $ne: true } }, // Standard posts (isDonation is false or undefined)
            {
                isDonation: true,
                expiryDate: { $gt: new Date() }, // Only future expiry dates
                status: 'available' // Only unclaimed donations
            }
        ]
    };

    const foodItems = await foodModel.find(query).populate("foodPartner")
    res.status(200).json({
        message: "Food items fetched successfully",
        foodItems
    })
}


async function likeFood(req, res) {
    const { foodId } = req.body;
    const user = req.user;

    try {
        const isAlreadyLiked = await likeModel.findOne({
            user: user._id,
            food: foodId
        });

        if (isAlreadyLiked) {
            // Unlike: remove the like
            await likeModel.deleteOne({
                user: user._id,
                food: foodId
            });

            const updatedFood = await foodModel.findByIdAndUpdate(foodId, {
                $inc: { likeCount: -1 }
            }, { new: true });

            return res.status(200).json({
                message: "Food unliked successfully",
                isLiked: false,
                likeCount: updatedFood.likeCount
            });
        }

        // Like: create new like
        await likeModel.create({
            user: user._id,
            food: foodId
        });

        const updatedFood = await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: 1 }
        }, { new: true });

        res.status(201).json({
            message: "Food liked successfully",
            isLiked: true,
            likeCount: updatedFood.likeCount
        });
    } catch (error) {
        res.status(500).json({ message: "Error processing like", error: error.message });
    }
}

async function saveFood(req, res) {

    const { foodId } = req.body;
    const user = req.user;

    const isAlreadySaved = await saveModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadySaved) {
        await saveModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { savesCount: -1 }
        })

        return res.status(200).json({
            message: "Food unsaved successfully"
        })
    }

    const save = await saveModel.create({
        user: user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { savesCount: 1 }
    })

    res.status(201).json({
        message: "Food saved successfully",
        save
    })

}

async function getSaveFood(req, res) {

    const user = req.user;

    const savedFoods = await saveModel.find({ user: user._id }).populate('food');

    if (!savedFoods || savedFoods.length === 0) {
        return res.status(404).json({ message: "No saved foods found" });
    }

    res.status(200).json({
        message: "Saved foods retrieved successfully",
        savedFoods
    });

}


async function claimDonation(req, res) {
    const { foodId } = req.params;
    const { role } = req.body; // 'volunteer' or 'consumer'
    const user = req.user;

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

        // Generate Ticket (Simple UUID for now)
        const ticketId = uuid();

        res.status(200).json({
            message: "Donation claimed successfully",
            ticket: {
                id: ticketId,
                foodName: food.name,
                address: "Food Partner Location", // Ideally fetched from Partner profile
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