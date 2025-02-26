const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        username: { type: String, unique: true, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        submissionHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }],
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        lastLogin: { type: Date },
        role: { type: String, enum: ['student', 'admin'], default: 'student' }
    }
);

const User = mongoose.model('User', userSchema);

module.exports = { User };
