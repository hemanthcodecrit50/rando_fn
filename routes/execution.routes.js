const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { executeCode } = require("../controllers/execution.controller");

const router = express.Router();

// Code Execution Route
router.post("/execute", authMiddleware, executeCode);

module.exports = router;
