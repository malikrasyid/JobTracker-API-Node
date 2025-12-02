import express from 'express';
import cors from 'cors';
import { connectDB } from './db/db';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import jobRoutes from './routes/jobRoutes';
import pipelineRoutes from './routes/pipelineRoutes';

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5027;

// Connect to MongoDB
connectDB();

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map(s => s.trim());

console.log('Allowed CORS Origins:', allowedOrigins);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (e.g., mobile apps, direct file access)
        if (!origin) return callback(null, true); 
        
        // If the origin is in our allowed list, allow it
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // Block others
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    // CRITICAL: Ensure all necessary methods and headers are allowed
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body Parser for JSON requests
app.use(express.json());


// Route Definitions (Routes match C# paths: /api/auth, /api/jobs, /api/pipelines)
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/pipelines', pipelineRoutes);

// Global Error Handling Middleware (maps ErrorHandlingMiddleware.cs)
app.use(errorHandler);


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});