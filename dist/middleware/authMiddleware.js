"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.generateJwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
// Load environment variables defined in .env
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ISSUER = process.env.JWT_ISSUER;
const JWT_AUDIENCE = process.env.JWT_AUDIENCE;
if (!JWT_SECRET || JWT_SECRET.length < 16) {
    throw new Error("FATAL ERROR: JWT_SECRET must be set and at least 16 characters long.");
}
// Function to generate the token (used in AuthController)
const generateJwtToken = (userId, username, email) => {
    const expireMinutes = parseInt(process.env.JWT_EXPIRE_MINUTES || '60', 10);
    const payload = {
        sub: userId.toHexString(),
        jti: userId.toHexString(),
        role: "User",
    };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
        expiresIn: `${expireMinutes}m`,
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
        subject: userId.toHexString()
    });
};
exports.generateJwtToken = generateJwtToken;
// Middleware to protect routes (maps [Authorize] attribute)
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET, {
            issuer: JWT_ISSUER,
            audience: JWT_AUDIENCE,
        });
        const userId = decoded.sub;
        if (!userId || !mongoose_1.Types.ObjectId.isValid(userId)) {
            return res.status(401).json({ message: 'Invalid token: missing or invalid user ID claim.' });
        }
        req.userId = userId; // Attach user ID for controllers to use (e.g., GetUserId())
        next();
    }
    catch (error) {
        // Handle token expiration, invalid signature, etc.
        let message = 'Invalid token';
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            message = 'Token expired';
        }
        return res.status(401).json({ message });
    }
};
exports.authMiddleware = authMiddleware;
