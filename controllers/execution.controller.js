const axios = require("axios");

const executeCode = async (req, res) => {
    try {
        const { language, code, input } = req.body;

        if (!language || !code) {
            return res.status(400).json({ message: "Language and code are required." });
        }

        // JDoodle API credentials from environment variables
        const JDoodleClientID = process.env.JDOODLE_CLIENT_ID;
        const JDoodleClientSecret = process.env.JDOODLE_CLIENT_SECRET;
        
        // Send code execution request to JDoodle
        const response = await axios.post("https://api.jdoodle.com/v1/execute", {
            clientId: JDoodleClientID,
            clientSecret: JDoodleClientSecret,
            script: code,
            language: getJDoodleLanguage(language),
            versionIndex: "0",
            stdin: input || "",
        });

        res.status(200).json({
            output: response.data.output,
            statusCode: response.data.statusCode,
            memory: response.data.memory,
            cpuTime: response.data.cpuTime,
        });
    } catch (error) {
        res.status(500).json({ message: "Error executing code", error: error.message });
    }
};

// Map user input language to JDoodle language identifiers
const getJDoodleLanguage = (lang) => {
    const mapping = {
        JavaScript: "nodejs",
        Python: "python3",
        "C++": "cpp17",
        Java: "java",
        Other: "nodejs", // Default to JS
    };
    return mapping[lang] || "nodejs";
};

module.exports = { executeCode };
