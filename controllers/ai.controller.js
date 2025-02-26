const { Submission } = require("../models/user.models");
const axios = require("axios");

require('dotenv').config();
const { OpenAI } = require('openai'); // Import OpenAI directly

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});








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

        // AI Code review (via OpenAI API)
        console.log("Sending code to ChatGPT for analysis...");
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
        res.status(500).json({ message: "Error processing AI review", error: error.message });
    }
};

// Function to send the code to ChatGPT for review
const getAIReview = async (code, language) => {
    try {
        // Prompt to give context for ChatGPT (You can customize this prompt)
        const prompt = `
            Please review the following code written in ${language} and provide:
            1. Feedback on code quality.
            2. Static analysis results (e.g., potential issues, bugs).
            3. A grade from 1 to 10 based on code quality.
            4. Plagiarism check score (0-100).
            5. Suggestions for code improvement.
            6. Time complexity (Big O notation).
            7. Security issues (if any).

            Code:
            ${code}
        `;

        // Request to OpenAI's GPT model
        const response = await openai.createCompletion({
            model: "gpt-4", // Or any suitable model you prefer
            prompt: prompt,
            max_tokens: 500,
            temperature: 0.7, // You can adjust the creativity of responses
        });

        const aiReview = response.data.choices[0].text.trim();
        
        // Mocking the return data for the sake of example
        return {
            feedback: aiReview, // This should contain AI feedback text
            staticAnalysis: "No major issues detected.",
            grade: Math.floor(Math.random() * 10) + 1,
            plagiarismScore: Math.floor(Math.random() * 100),
            autoFixCode: code.replace("var", "let"), // Example of a refactor (could be dynamic)
            bigO: "O(n^2)", // Example Big O (could be more accurate with context)
            securityIssues: "No vulnerabilities found."
        };
    } catch (error) {
        console.error("Error communicating with OpenAI:", error);
        throw new Error("AI review failed.");
    }
};

module.exports = { reviewCode };
