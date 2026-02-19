const foodPartnerModel = require("../models/foodpartner.model")
const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken");


async function authFoodPartnerMiddleware(req, res, next) {

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Please login first"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const foodPartner = await foodPartnerModel.findById(decoded.id);

        if (!foodPartner) {
            return res.status(401).json({ message: "Account not found. Please login again." });
        }

        req.foodPartner = foodPartner

        next()

    } catch (err) {

        return res.status(401).json({
            message: "Invalid token"
        })

    }

}

async function authUserMiddleware(req, res, next) {

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Please login first"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "Account not found. Please login again." });
        }

        req.user = user

        next()

    } catch (err) {

        return res.status(401).json({
            message: "Invalid token"
        })

    }

} // End of authUserMiddleware

async function authAnyMiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Please login first" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Try finding Food Partner
        const foodPartner = await foodPartnerModel.findById(decoded.id);
        if (foodPartner) {
            req.foodPartner = foodPartner;
            req.role = 'partner';
            return next();
        }

        // Try finding User
        const user = await userModel.findById(decoded.id);
        if (user) {
            req.user = user;
            req.role = 'user';
            return next();
        }

        return res.status(401).json({ message: "User not found" });

    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

async function authOptionalMiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    // crucial: if no token, just proceed as guest
    if (!token) return next();

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Try finding Food Partner
        const foodPartner = await foodPartnerModel.findById(decoded.id);
        if (foodPartner) {
            req.foodPartner = foodPartner;
            req.role = 'partner';
            return next();
        }

        // Try finding User
        const user = await userModel.findById(decoded.id);
        if (user) {
            req.user = user;
            req.role = 'user';
            return next();
        }

        // If token valid but user not found, strictly proceed as guest or 401? 
        // Better to treat as guest to avoid blocking public content if account deleted
        return next();

    } catch (err) {
        // If token invalid, proceed as guest
        return next();
    }
}

module.exports = {
    authFoodPartnerMiddleware,
    authUserMiddleware,
    authAnyMiddleware,
    authOptionalMiddleware
}