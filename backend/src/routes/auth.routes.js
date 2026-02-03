const express = require('express');
const authController = require("../controllers/auth.controller")
const meController = require("../controllers/me.controller");

const router = express.Router();

// Get current user (unified)
router.get('/me', meController.getCurrentUser);

// user auth APIs
router.post('/user/register', authController.registerUser)
router.post('/user/login', authController.loginUser)
router.get('/user/logout', authController.logoutUser)



// food partner auth APIs
router.post('/food-partner/register', authController.registerFoodPartner)
router.post('/food-partner/login', authController.loginFoodPartner)
router.get('/food-partner/logout', authController.logoutFoodPartner)



module.exports = router;