const foodPartnerModel = require('../models/foodpartner.model');
const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const { v4: uuid } = require('uuid');

async function getFoodPartnerById(req, res) {
    try {
        const foodPartnerId = req.params.id;

        const foodPartner = await foodPartnerModel.findById(foodPartnerId);

        if (!foodPartner) {
            return res.status(404).json({ message: "Food partner not found" });
        }

        const foodItemsByFoodPartner = await foodModel.find({ foodPartner: foodPartnerId });

        res.status(200).json({
            message: "Food partner retrieved successfully",
            foodPartner: {
                _id: foodPartner._id,
                name: foodPartner.name,
                contactName: foodPartner.contactName,
                phone: foodPartner.phone,
                address: foodPartner.address,
                email: foodPartner.email,
                profilePhoto: foodPartner.profilePhoto || '',
                totalMeals: foodPartner.totalMeals || 0,
                customersServed: foodPartner.customersServed || 0,
                foodItems: foodItemsByFoodPartner
            }
        });
    } catch (error) {
        console.error("Get Food Partner Error:", error);
        res.status(500).json({ message: "Error fetching food partner", error: error.message });
    }
}

// Update food partner profile
async function updateFoodPartnerProfile(req, res) {
    try {
        const foodPartner = req.foodPartner;
        const updates = {};

        // Only update fields that are provided
        const allowedFields = ['name', 'phone', 'address', 'totalMeals', 'customersServed'];
        for (const field of allowedFields) {
            if (req.body[field] !== undefined && req.body[field] !== '') {
                updates[field] = req.body[field];
            }
        }

        // Ensure numeric fields are numbers
        if (updates.totalMeals) updates.totalMeals = Number(updates.totalMeals);
        if (updates.customersServed) updates.customersServed = Number(updates.customersServed);

        // Handle profile photo upload
        if (req.file) {
            const uploadResult = await storageService.uploadFile(req.file.buffer, uuid());
            updates.profilePhoto = uploadResult.url;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No fields to update" });
        }

        const updatedPartner = await foodPartnerModel.findByIdAndUpdate(
            foodPartner._id,
            { $set: updates },
            { new: true }
        );

        res.status(200).json({
            message: "Profile updated successfully",
            foodPartner: {
                _id: updatedPartner._id,
                name: updatedPartner.name,
                contactName: updatedPartner.contactName,
                phone: updatedPartner.phone,
                address: updatedPartner.address,
                email: updatedPartner.email,
                profilePhoto: updatedPartner.profilePhoto || '',
                totalMeals: updatedPartner.totalMeals || 0,
                customersServed: updatedPartner.customersServed || 0
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
}

module.exports = {
    getFoodPartnerById,
    updateFoodPartnerProfile
};