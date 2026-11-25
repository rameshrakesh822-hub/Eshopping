
const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const {
    createOrder,
    getMyOrders
} = require("../controllers/orderController");

// Verify login token
function verifyToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication token required"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

router.post("/", verifyToken, createOrder);
router.get("/my-orders", verifyToken, getMyOrders);

module.exports = router;
