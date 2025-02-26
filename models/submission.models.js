// Submission Schema

const mongoose = require('mongoose');


const submissionSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    language: { type: String, enum: ['JavaScript', 'Python', 'C++', 'Java', 'Other'], required: true },
    code: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    processingStatus: { type: String, enum: ['pending', 'processing', 'completed', 'error'], default: 'pending' },
    errorLogs: { type: String },
    feedback: {
        aiReview: { type: String },
        staticAnalysisResults: { type: String },
        grade: { type: Number, min: 1, max: 10 },
        plagiarismCheck: { type: Number, min: 0, max: 100 }
    },
    autoFixCode: { type: String },
    bigOAnalysis: { type: String },
    securityReview: { type: String }
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = { Submission };
