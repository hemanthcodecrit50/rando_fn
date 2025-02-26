const mongoose = require('mongoose');

// Plagiarism Log Schema
const plagiarismLogSchema = new mongoose.Schema({
    submissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission', required: true },
    similarityScore: { type: Number, min: 0, max: 100, required: true },
    matchedSources: [{ type: String }]
});

const PlagiarismLog = mongoose.model('PlagiarismLog', plagiarismLogSchema);

module.exports = { PlagiarismLog };