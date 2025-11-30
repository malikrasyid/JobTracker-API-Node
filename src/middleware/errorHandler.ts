// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export class ApiError extends Error {
    public statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        // Important for TypeScript to correctly check error instance
        Object.setPrototypeOf(this, ApiError.prototype); 
    }
}

// Corresponds to UnauthorizedAccessException (401)
export class UnauthorizedError extends ApiError {
    constructor(message = "Unauthorized") {
        super(401, message);
    }
}

// Corresponds to ArgumentException or general bad input (400)
export class BadRequestError extends ApiError {
    constructor(message = "Bad Request") {
        super(400, message);
    }
}

// Corresponds to KeyNotFoundException (404)
export class NotFoundError extends ApiError {
    constructor(message = "Not Found") {
        super(404, message);
    }
}

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500;
    let message = 'Internal Server Error';

    if (err instanceof ApiError) {
        // Handle custom API errors (400, 401, 404)
        statusCode = err.statusCode;
        message = err.message;
    } else {
        // Handle common Mongoose/System errors
        if (err.name === 'ValidationError' || err.name === 'CastError') {
             // Mongoose validation or bad ObjectId format
            statusCode = 400;
            message = 'Invalid data provided.';
        } else if (err.message.includes('E11000 duplicate key error')) {
            // MongoDB duplicate key error (e.g., duplicate email)
            statusCode = 400;
            message = 'Resource already exists.';
        }
    }
    
    // Log the error (similar to ILogger logging in C#)
    console.error(`Request failed (${statusCode}): ${message}`, err);

    // Send the JSON response
    const result = { 
        message: message,
        statusCode: statusCode 
    };

    res.status(statusCode).json(result);
};