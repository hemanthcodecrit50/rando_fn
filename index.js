const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./db/index.js');
const { app } = require('./app.js');

const startServer = async () => {
    try {
        console.log('Attempting to connect to the database...');
        await connectDB();
        console.log('Database connection successful. Starting server...');
        console.log("Port:", process.env.PORT);
        app.listen(8080||process.env.PORT, () => {
            console.log(`Server is running !! at port ${process.env.PORT}`);
        });
    } catch (error) {
        console.error("MONGO DB CONNECTION FAILED (src/index.js): ", error);
        process.exit(1);
    }
};

startServer();