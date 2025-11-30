import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { AuthenticatedRequest } from '../models/types';

// Load environment variables defined in .env
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_ISSUER = process.env.JWT_ISSUER;
const JWT_AUDIENCE = process.env.JWT_AUDIENCE;

if (!JWT_SECRET || JWT_SECRET.length < 16) {
    throw new Error("FATAL ERROR: JWT_SECRET must be set and at least 16 characters long.");
}

// Function to generate the token (used in AuthController)
export const generateJwtToken = (userId: Types.ObjectId, username: string, email: string): string => {
    const expireMinutes = parseInt(process.env.JWT_EXPIRE_MINUTES || '60', 10);
    const payload = {
        sub: userId.toHexString(), 
        jti: userId.toHexString(), 
        role: "User", 
    };

    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: `${expireMinutes}m`,
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
        subject: userId.toHexString()
    });
};

// Middleware to protect routes (maps [Authorize] attribute)
export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET, {
            issuer: JWT_ISSUER,
            audience: JWT_AUDIENCE,
        }) as jwt.JwtPayload;

        const userId = decoded.sub; 

        if (!userId || !Types.ObjectId.isValid(userId)) {
             return res.status(401).json({ message: 'Invalid token: missing or invalid user ID claim.' });
        }
        
        req.userId = userId; // Attach user ID for controllers to use (e.g., GetUserId())
        next();

    } catch (error) {
        // Handle token expiration, invalid signature, etc.
        let message = 'Invalid token';
        if (error instanceof jwt.TokenExpiredError) {
            message = 'Token expired';
        }
        return res.status(401).json({ message });
    }
};