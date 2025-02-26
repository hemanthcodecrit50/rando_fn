const { Submission } = require("../models/submission.models"); 
const { User } = require("../models/user.models");


// Submit a new code review request
const submitCode = async (req, res) => {
    try {
        const { title, description, language, code } = req.body;
        
        if (!title || !language || !code) {
            return res.status(400).json({ message: "Title, language, and code are required." });
        }

        const newSubmission = new Submission({
            author: req.user.userId,
            title,
            description,
            language,
            code,
            processingStatus: "pending"
        });

        const savedSubmission = await newSubmission.save();

        // Add submission to user's history
        await User.findByIdAndUpdate(req.user.userId, { 
            $push: { submissionHistory: savedSubmission._id } 
        });

        res.status(201).json({ message: "Submission created successfully!", submission: savedSubmission });
    } catch (error) {
        res.status(500).json({ message: "Error submitting code", error: error.message });
    }
};

// Get all submissions with filtering
const getSubmissions = async (req, res) => {
    try {
        const { language, status, minGrade, maxGrade } = req.query;
        let filter = {};

        if (language) filter.language = language;
        if (status) filter.processingStatus = status;
        if (minGrade || maxGrade) {
            filter["feedback.grade"] = {};
            if (minGrade) filter["feedback.grade"].$gte = parseInt(minGrade);
            if (maxGrade) filter["feedback.grade"].$lte = parseInt(maxGrade);
        }

        const submissions = await Submission.find(filter).populate("author", "username email");
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching submissions", error: error.message });
    }
};

// Get a single submission by ID
const getSubmissionById = async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id).populate("author", "username email");
        if (!submission) {
            return res.status(404).json({ message: "Submission not found." });
        }
        res.status(200).json(submission);
    } catch (error) {
        res.status(500).json({ message: "Error fetching submission", error: error.message });
    }
};


const updateSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body; // The fields to update

        const updatedSubmission = await Submission.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedSubmission) {
            return res.status(404).json({ message: "Submission not found." });
        }

        res.status(200).json({ message: "Submission updated successfully!", submission: updatedSubmission });
    } catch (error) {
        res.status(500).json({ message: "Error updating submission", error: error.message });
    }
};


const updateSubmissionStatus = async (req, res) => {
    try {
        const { status } = req.body;

        // Ensure status is valid
        const validStatuses = ["pending", "in review", "completed"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value." });
        }

        const submission = await Submission.findById(req.params.id);
        if (!submission) {
            return res.status(404).json({ message: "Submission not found." });
        }

        // Only allow admins or the author to update status
        if (submission.author.toString() !== req.user.userId && !req.user.isAdmin) {
            return res.status(403).json({ message: "Unauthorized to update this submission." });
        }

        submission.processingStatus = status;
        const updatedSubmission = await submission.save();

        res.status(200).json({ message: "Submission status updated.", submission: updatedSubmission });
    } catch (error) {
        res.status(500).json({ message: "Error updating submission", error: error.message });
    }
};


const deleteSubmission = async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id);
        
        if (!submission) {
            return res.status(404).json({ message: "Submission not found." });
        }

        // Check if the logged-in user is the author
        if (submission.author.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Unauthorized to delete this submission." });
        }

        await submission.deleteOne();

        // Remove submission from user's history
        await User.findByIdAndUpdate(req.user.userId, {
            $pull: { submissionHistory: req.params.id }
        });

        res.status(200).json({ message: "Submission deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error deleting submission", error: error.message });
    }
};


module.exports = { submitCode, getSubmissions, getSubmissionById, updateSubmission, updateSubmissionStatus, deleteSubmission} ;
