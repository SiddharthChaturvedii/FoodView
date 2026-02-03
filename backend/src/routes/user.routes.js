const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// User profile routes (requires authentication)
router.get('/profile', authMiddleware.authUserMiddleware, userController.getUserProfile);
router.get('/liked', authMiddleware.authUserMiddleware, userController.getUserLikedFoods);

module.exports = router;
