const { Submission } = require("../models/user.models");
const axios = require("axios"); // Simulate AI API call (Replace with real AI service)

const reviewCode = async (req, res) => {
    try {
        const { submissionId } = req.body;

        if (!submissionId) {
            return res.status(400).json({ message: "Submission ID is required." });
        }

        const submission = await Submission.findById(submissionId);
        if (!submission) {
            return res.status(404).json({ message: "Submission not found." });
        }

        // Simulate AI processing (Replace with real AI logic)
        console.log("Sending code to AI for analysis...");
        const aiResponse = await fakeAIAnalysis(submission.code, submission.language);

        // Update submission with AI feedback
        submission.processingStatus = "completed";
        submission.feedback = {
            aiReview: aiResponse.feedback,
            staticAnalysisResults: aiResponse.staticAnalysis,
            grade: aiResponse.grade,
            plagiarismCheck: aiResponse.plagiarismScore
        };
        submission.autoFixCode = aiResponse.autoFixCode;
        submission.bigOAnalysis = aiResponse.bigO;
        submission.securityReview = aiResponse.securityIssues;

        await submission.save();

        res.status(200).json({ message: "AI review completed!", submission });
    } catch (error) {
        res.status(500).json({ message: "Error processing AI review", error: error.message });
    }
};

// Mock AI response (Replace this with actual AI API call)
const fakeAIAnalysis = async (code, language) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                feedback: "Your code follows best practices but could be optimized.",
                staticAnalysis: "No major issues detected.",
                grade: Math.floor(Math.random() * 10) + 1,
                plagiarismScore: Math.floor(Math.random() * 100),
                autoFixCode: code.replace("var", "let"), // Example of refactoring
                bigO: "O(n^2)", // Example complexity
                securityIssues: "No vulnerabilities found."
            });
        }, 2000);
    });
};

module.exports = { reviewCode };
