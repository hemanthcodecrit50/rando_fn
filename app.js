// Import express for setting up the server
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware setup
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Import routes
const userRoutes = require("./routes/user.routes");
const submissionRoutes = require("./routes/submission.routes");
const aiReviewRoutes = require("./routes/ai.routes.js");
const plagiarismRoutes = require("./routes/plagiarism.routes");
const executeRoutes = require("./routes/execution.routes");

// Use routes
app.use("/api", userRoutes);  // Now your user APIs will be accessible under /api/
app.use("/api", submissionRoutes);
app.use("/api", aiReviewRoutes);
app.use("/api", plagiarismRoutes);
app.use("/api", executeRoutes);








module.exports = { app };




