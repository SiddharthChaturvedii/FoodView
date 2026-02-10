const express = require('express');
const foodPartnerController = require("../controllers/food-partner.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit for profile photos
});

const router = express.Router();

// Update food partner profile (requires food partner auth)
router.put('/profile',
    authMiddleware.authFoodPartnerMiddleware,
    upload.single('profilePhoto'),
    foodPartnerController.updateFoodPartnerProfile
);

/* /api/food-partner/:id — public profile view (any authenticated user) */
router.get("/:id",
    authMiddleware.authUserMiddleware,
    foodPartnerController.getFoodPartnerById)

module.exports = router;