
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user.models");

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email or username." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new User({ name, username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

// Login user
    const loginUser = async (req, res) => {
        try {
            const { email, password } = req.body;

            // Find user by email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "Invalid email or password." });
            }

            // Compare password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid email or password." });
            }

            // Generate JWT Token
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

            res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
            res.status(200).json({ message: "Login successful!", token });
        } catch (error) {
            res.status(500).json({ message: "Error logging in", error: error.message });
        }
    };

//log out user
const logoutUser = async (req, res) => {
    try {
        res.cookie("token", "", { 
            httpOnly: true, 
            expires: new Date(0), // Expire immediately
            secure: process.env.NODE_ENV === "production"
        });

        res.status(200).json({ message: "Logout successful!" });
    } catch (error) {
        res.status(500).json({ message: "Error logging out", error: error.message });
    }
};


// Get user details
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
};

// Update user profile
const updateUser = async (req, res) => {
    try {
        const { email, profileImage } = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.user.userId, { email, profileImage }, { new: true });
        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};

// Get user submission history
const getUserSubmissions = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate("submissionHistory");
        res.status(200).json(user.submissionHistory);
    } catch (error) {
        res.status(500).json({ message: "Error fetching submissions", error: error.message });
    }
};

module.exports = { registerUser, loginUser,logoutUser, getUser, updateUser, getUserSubmissions };
