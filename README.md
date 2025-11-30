# JobTracker API (Node.js/TypeScript)

This repository contains the backend API for tracking job applications and managing application pipelines, rewritten from .NET to Node.js using Express and TypeScript. It utilizes Mongoose for interacting with a MongoDB database.
This architecture is optimized for flexible deployment on platforms like Vercel, Heroku, or Render.

## Prerequisites
Before running the API, ensure you have the following installed:
1. Node.js (LTS version recommended)
2. npm (Node Package Manager)
3. MongoDB database (local instance or remote service like MongoDB Atlas)

## Configuration
The API uses environment variables for configuration, managed through a .env file in the project root.
Action: Create a file named `.env` in the root directory and populate it with the following structure:
```
# Database
MONGO_URI=mongodb://localhost:27017/jobtracker_db_name
MONGO_DBNAME=jobtracker_db

# JWT Configuration (Security Note: Secret must be at least 16 characters long for HS256)
JWT_SECRET=a_very_long_and_secure_secret_key_at_least_16_chars_long
JWT_ISSUER=JobTrackerApi
JWT_AUDIENCE=JobTrackerClient
JWT_EXPIRE_MINUTES=60

# Server
PORT=5027
CORS_ORIGIN=http://localhost:5173  # Change this to your frontend URL in production
```
⚠️ **Security Note**: Never commit your `.env` file to version control. It is already included in `.gitignore`.

## Installation and Running
1. Install dependencies:
   ```bash
   npm install
   ```
2. Build the TypeScript project (produces JavaScript in the dist folder):
   ```bash
   npm run build
   ```
3. Run the API in development mode (watches for changes using ts-node-dev):
   ```bash
   npm run dev
   ```
4. Run the built API (Production):
   ```bash
   npm start
   ```
The API will start on the port specified in your `.env` file (default: `http://localhost:5027`).

## Project Structure
The TypeScript source code is organized within the `src/` directory to maintain logical separation of concerns, mirroring the structure of the original C# project:
```
src/
├── config/           # Default pipeline stages/config (DefaultPipeline.ts)
├── controllers/      # Core business logic handlers (Auth, Jobs, Pipelines)
├── db/               # Database connection setup (db.ts)
├── middleware/       # Global handlers (JWT authentication, Error handling)
├── models/           # Mongoose Schemas and TypeScript DTO/Interface definitions
├── routes/           # Express router definitions, mapping URLs to controllers
└── server.ts         # Main application entry point
```

## API Endpoints
All endpoints are protected by JWT authentication via the `authMiddleware`, except for the registration and login routes.
| **Resource** | **Method** | **Path** | **Description** | **Authentication** |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Register a new user. | None |
| **Auth** | `POST` | `/api/auth/login` | Log in and receive a JWT. | None |
| **Jobs** | `GET` | `/api/jobs` | Get all job applications for the authenticated user. | Required |
| **Jobs** | `GET` | `/api/jobs/:id` | Get a specific job by ID. | Required |
| **Jobs** | `GET` | `/api/jobs/stage/:stage` | Get jobs filtered by pipeline stage (e.g., `Applied`, `Interview`). | Required |
| **Jobs** | `POST` | `/api/jobs` | Create a new job application. | Required |
| **Jobs** | `PUT` | `/api/jobs/:id` | Update an existing job. | Required |
| **Jobs** | `DELETE` | `/api/jobs/:id` | Delete a job application. | Required |
| **Pipelines** | `GET` | `/api/pipelines` | Get all custom pipelines (and the default pipeline). | Required |
| **Pipelines** | `GET` | `/api/pipelines/:id` | Get a specific pipeline by ID. | Required |
| **Pipelines** | `POST` | `/api/pipelines` | Create a new custom pipeline. | Required |
| **Pipelines** | `PUT` | `/api/pipelines/:id` | Update a custom pipeline. | Required |
| **Pipelines** | `DELETE` | `/api/pipelines/:id` | Delete a custom pipeline. | Required |
