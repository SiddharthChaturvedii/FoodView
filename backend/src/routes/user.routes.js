const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit for profile photos
});

const router = express.Router();

// User profile routes (requires authentication)
router.get('/profile', authMiddleware.authUserMiddleware, userController.getUserProfile);
router.get('/liked', authMiddleware.authUserMiddleware, userController.getUserLikedFoods);

// Update profile (name, photo)
router.put('/profile',
    authMiddleware.authUserMiddleware,
    upload.single('profilePhoto'),
    userController.updateUserProfile
);

module.exports = router;
