const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { submitCode, getSubmissions, getSubmissionById } = require("../controllers/submission.controller");

const router = express.Router();

// Submission routes
router.post("/submission", authMiddleware, submitCode);
router.get("/submission", authMiddleware, getSubmissions);
router.get("/submission/:id", authMiddleware, getSubmissionById);

module.exports = router;
