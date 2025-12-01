"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;
const MONGO_DBNAME = process.env.MONGO_DBNAME;
const connectDB = async () => {
    if (!MONGO_URI || !MONGO_DBNAME) {
        console.error("FATAL ERROR: MONGO_URI or MONGO_DBNAME is not set in environment variables.");
        process.exit(1);
    }
    try {
        await mongoose_1.default.connect(MONGO_URI, { dbName: MONGO_DBNAME });
        console.log('✅ MongoDB Connected successfully.');
    }
    catch (err) {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
