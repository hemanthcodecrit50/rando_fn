// Feedback History Schema
const feedbackHistorySchema = new mongoose.Schema({
    submissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission', required: true },
    aiFeedback: { type: String },
    staticAnalysis: { type: String },
    timestamp: { type: Date, default: Date.now }
});

const FeedbackHistory = mongoose.model('FeedbackHistory', feedbackHistorySchema);

module.exports = { FeedbackHistory };
