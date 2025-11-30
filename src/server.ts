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

// Global Middleware

// CORS: Matches the 'AllowFrontend' policy in C# Program.cs
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
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