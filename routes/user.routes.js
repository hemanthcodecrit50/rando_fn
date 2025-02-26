


const express = require("express");
const { registerUser, loginUser, getUser, updateUser, getUserSubmissions } = require("../controllers/user.controller");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// User routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", authMiddleware, getUser);
router.patch("/user", authMiddleware, updateUser);
router.get("/user/submissions", authMiddleware, getUserSubmissions);

module.exports = router;
