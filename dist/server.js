"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db/db");
const errorHandler_1 = require("./middleware/errorHandler");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const jobRoutes_1 = __importDefault(require("./routes/jobRoutes"));
const pipelineRoutes_1 = __importDefault(require("./routes/pipelineRoutes"));
require('dotenv').config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5027;
// Connect to MongoDB
(0, db_1.connectDB)();
// Global Middleware
// CORS: Matches the 'AllowFrontend' policy in C# Program.cs
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Body Parser for JSON requests
app.use(express_1.default.json());
// Route Definitions (Routes match C# paths: /api/auth, /api/jobs, /api/pipelines)
app.use('/api/auth', authRoutes_1.default);
app.use('/api/jobs', jobRoutes_1.default);
app.use('/api/pipelines', pipelineRoutes_1.default);
// Global Error Handling Middleware (maps ErrorHandlingMiddleware.cs)
app.use(errorHandler_1.errorHandler);
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
