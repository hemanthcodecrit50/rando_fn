const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');

// Import DB_NAME from constants.js
const { DB_NAME } = require('../constants.js');

//this connects to the database
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected!!  DB HOST: ${connectionInstance.connection.host} \n`);
    } catch (error) {
        console.error("MONGODB connection FAILED !!!(db/INDEX.JS): ", error);
        process.exit(1);
    }
}

module.exports = connectDB;