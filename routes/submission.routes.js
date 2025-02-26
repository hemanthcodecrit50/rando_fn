const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
        submitCode, getSubmissions, getSubmissionById , 
        updateSubmission, updateSubmissionStatus, deleteSubmission
    } = require("../controllers/submission.controller");

const router = express.Router();

// Submission routes
router.post("/submission", authMiddleware, submitCode);
router.get("/submission", authMiddleware, getSubmissions);
router.get("/submission/:id", authMiddleware, getSubmissionById);
router.patch("/submission/:id", authMiddleware, updateSubmission); //to update submission partially
router.delete('/:id', authMiddleware, deleteSubmission);
router.patch('/:id/status', authMiddleware, updateSubmissionStatus);

module.exports = router;
