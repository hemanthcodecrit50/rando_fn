const { Submission, PlagiarismLog } = require("../models/user.models");

const checkPlagiarism = async (req, res) => {
    try {
        const { submissionId } = req.body;

        if (!submissionId) {
            return res.status(400).json({ message: "Submission ID is required." });
        }

        const submission = await Submission.findById(submissionId);
        if (!submission) {
            return res.status(404).json({ message: "Submission not found." });
        }

        // Simulated Plagiarism Detection (Replace with real implementation)
        console.log("Checking for plagiarism...");
        const plagiarismResult = await fakePlagiarismCheck(submission.code);

        // Save plagiarism result in logs
        const plagiarismLog = new PlagiarismLog({
            submissionId,
            similarityScore: plagiarismResult.similarityScore,
            matchedSources: plagiarismResult.matchedSources
        });
        await plagiarismLog.save();

        res.status(200).json({
            message: "Plagiarism check completed!",
            similarityScore: plagiarismResult.similarityScore,
            matchedSources: plagiarismResult.matchedSources
        });
    } catch (error) {
        res.status(500).json({ message: "Error checking plagiarism", error: error.message });
    }
};

// Mock plagiarism check (Replace with real plagiarism detection API)
const fakePlagiarismCheck = async (code) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                similarityScore: Math.floor(Math.random() * 100),
                matchedSources: ["https://github.com/example/code1", "https://stackoverflow.com/q/12345"]
            });
        }, 2000);
    });
};

module.exports = { checkPlagiarism };
