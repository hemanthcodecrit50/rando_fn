const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { reviewCode } = require("../controllers/ai.controller");

const router = express.Router();

// AI Review route
router.post("/ai-review", authMiddleware, reviewCode);

module.exports = router;
