JobTracker API (Node.js/TypeScript)This repository contains the backend API for tracking job applications and managing application pipelines, rewritten from .NET to Node.js using Express and TypeScript. It utilizes Mongoose for interacting with a MongoDB database.This architecture is optimized for flexible deployment on platforms like Vercel, Heroku, or Render.PrerequisitesBefore running the API, ensure you have the following installed:Node.js (LTS version recommended)npm (Node Package Manager)MongoDB database (local instance or remote service like MongoDB Atlas)ConfigurationThe API uses environment variables for configuration, managed through a .env file in the project root.Action: Create a file named .env in the root directory and populate it with the following structure:# Database
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
⚠️ Security Note: Never commit your .env file to version control. It is already included in .gitignore.Installation and RunningInstall dependencies:npm install
Build the TypeScript project (produces JavaScript in the dist folder):npm run build
Run the API in development mode (watches for changes using ts-node-dev):npm run dev
Run the built API (Production):npm start
The API will start on the port specified in your .env file (default: http://localhost:5027).Project StructureThe TypeScript source code is organized within the src/ directory to maintain logical separation of concerns, mirroring the structure of the original C# project:src/
├── config/           # Default pipeline stages/config (DefaultPipeline.ts)
├── controllers/      # Core business logic handlers (Auth, Jobs, Pipelines)
├── db/               # Database connection setup (db.ts)
├── middleware/       # Global handlers (JWT authentication, Error handling)
├── models/           # Mongoose Schemas and TypeScript DTO/Interface definitions
├── routes/           # Express router definitions, mapping URLs to controllers
└── server.ts         # Main application entry point
API EndpointsAll endpoints are protected by JWT authentication via the authMiddleware, except for the registration and login routes.ResourceMethodPathDescriptionAuthenticationAuthPOST/api/auth/registerRegister a new user.NoneAuthPOST/api/auth/loginLog in and receive a JWT.NoneJobsGET/api/jobsGet all job applications for the authenticated user.RequiredJobsGET/api/jobs/:idGet a specific job by ID.RequiredJobsGET/api/jobs/stage/:stageGet jobs filtered by pipeline stage (e.g., Applied, Interview).RequiredJobsPOST/api/jobsCreate a new job application.RequiredJobsPUT/api/jobs/:idUpdate an existing job.RequiredJobsDELETE/api/jobs/:idDelete a job application.RequiredPipelinesGET/api/pipelinesGet all custom pipelines (and the default pipeline).RequiredPipelinesGET/api/pipelines/:idGet a specific pipeline by ID.RequiredPipelinesPOST/api/pipelinesCreate a new custom pipeline.RequiredPipelinesPUT/api/pipelines/:idUpdate a custom pipeline.RequiredPipelinesDELETE/api/pipelines/:idDelete a custom pipeline.Required