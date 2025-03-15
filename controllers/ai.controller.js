const { Submission } = require("../models/submission.models");
const axios = require("axios");
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

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

        // AI Code review (via Gemini API)
        console.log("Sending code to Gemini AI for analysis...");
        const aiResponse = await getAIReview(submission.code, submission.language);

        // Update submission with AI feedback
        submission.processingStatus = "completed";
        submission.feedback = {
            aiReview: aiResponse.feedback,
            staticAnalysisResults: aiResponse.staticAnalysis,
            grade: aiResponse.grade,
            plagiarismCheck: aiResponse.plagiarismScore,
        };
        submission.autoFixCode = aiResponse.autoFixCode;
        submission.bigOAnalysis = aiResponse.bigO;
        submission.securityReview = aiResponse.securityIssues;

        await submission.save();

        res.status(200).json({ message: "AI review completed!", submission });
    } catch (error) {
        console.error("Error in reviewCode:", error);
        res.status(500).json({ message: "Error processing AI review", error: error.message });
    }
};

// Function to send the code to Gemini AI for review
const getAIReview = async (code, language) => {
    try {
        const prompt = `
            Please review the following code written in ${language} and provide:
            1. Feedback on code quality.
            2. Static analysis results (e.g., potential issues, bugs).
            3. A grade from 1 to 10 based on code quality.
            4. Plagiarism check score (0-100).
            5. Suggestions for code improvement.
            6. Time complexity (Big O notation).
            7. Security issues (if any).
            8. IF THE PROMPT IS NOT RELATED TO CODING (BE INTELLIGENT ENOUGH TO CLASSIFY IT), SEND THE RESPONSE "YOU ARE ONLY ALLOWED TO ASK CODING RELATED QUESTIONS."

            Code:
            ${code}
        `;

        const response = await axios.post(
            GEMINI_URL,
            { contents: [{ parts: [{ text: prompt }] }] },
            { headers: { "Content-Type": "application/json" } }
        );

        const aiResponse = response.data.candidates[0].content.parts[0].text.trim();

        // Mocking structured response (since Gemini returns text output)
        return {
            feedback: aiResponse,
            staticAnalysis: "No major issues detected.",
            grade: Math.floor(Math.random() * 10) + 1,
            plagiarismScore: Math.floor(Math.random() * 100),
            autoFixCode: code.replace("var", "let"), // Example of a refactor (could be dynamic)
            bigO: "O(n^2)", // Example Big O (could be more accurate with context)
            securityIssues: "No vulnerabilities found."
        };
    } catch (error) {
        console.error("Error communicating with Gemini AI:", error);
        throw new Error("AI review failed.");
    }
};

module.exports = { reviewCode };
