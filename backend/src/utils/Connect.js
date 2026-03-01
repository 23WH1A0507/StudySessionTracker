const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || process.env.DATABASE_URI;
        if (!uri) {
            throw new Error('DATABASE_URI is not set in environment');
        }
        await mongoose.connect(uri);
        console.log('Database connected successfully');
        return mongoose;
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
}

const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('Database disconnected successfully');
    } catch (error) {
        console.error('Database disconnection error:', error);
    }
}

module.exports = { connectDB, disconnectDB };