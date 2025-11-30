import mongoose from 'mongoose';

require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
const MONGO_DBNAME = process.env.MONGO_DBNAME;

export const connectDB = async () => {
    if (!MONGO_URI || !MONGO_DBNAME) {
        console.error("FATAL ERROR: MONGO_URI or MONGO_DBNAME is not set in environment variables.");
        process.exit(1);
    }
    
    try {
        await mongoose.connect(MONGO_URI, { dbName: MONGO_DBNAME });
        console.log('✅ MongoDB Connected successfully.');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    }
};