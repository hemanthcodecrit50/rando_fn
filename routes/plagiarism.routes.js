const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { checkPlagiarism } = require("../controllers/plagiarism.controller");

const router = express.Router();

// Plagiarism Check Route
router.post("/plagiarism-check", authMiddleware, checkPlagiarism);

module.exports = router;
