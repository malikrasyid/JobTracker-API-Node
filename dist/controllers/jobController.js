"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJob = exports.updateJob = exports.createJob = exports.getJobsByStage = exports.getJobById = exports.getJobs = void 0;
const mongoose_1 = require("mongoose");
const JobApplication_1 = require("../models/JobApplication");
const Pipeline_1 = require("../models/Pipeline");
const defaultPipeline_1 = require("../config/defaultPipeline");
const errorHandler_1 = require("../middleware/errorHandler");
const getUserId = (req) => {
    if (!req.userId)
        throw new Error("User ID not found on authenticated request.");
    return new mongoose_1.Types.ObjectId(req.userId);
};
// GET /api/jobs
const getJobs = async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const jobs = await JobApplication_1.JobApplication.find({ userId: userId }).lean();
        res.status(200).json(jobs);
    }
    catch (error) {
        next(error);
    }
};
exports.getJobs = getJobs;
// GET /api/jobs/:id
const getJobById = async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const { id } = req.params;
        const job = await JobApplication_1.JobApplication.findOne({ _id: id, userId: userId }).lean();
        if (!job) {
            throw new errorHandler_1.NotFoundError("Job not found or unauthorized");
        }
        res.status(200).json(job);
    }
    catch (error) {
        next(error);
    }
};
exports.getJobById = getJobById;
// GET /api/jobs/stage/:stage
const getJobsByStage = async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const { stage } = req.params;
        // Matches the limited stage validation in the original C# controller
        const csAllowedStages = ["Applied", "Interview", "Offer", "Rejected"];
        if (!csAllowedStages.includes(stage)) {
            throw new errorHandler_1.BadRequestError("Invalid stage.");
        }
        const jobs = await JobApplication_1.JobApplication.find({ userId: userId, stage: stage }).lean();
        res.status(200).json(jobs);
    }
    catch (error) {
        next(error);
    }
};
exports.getJobsByStage = getJobsByStage;
// POST /api/jobs
const createJob = async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const dto = req.body;
        let pipeline = null;
        // 1. Determine Pipeline (User provided or Default)
        if (dto.PipelineId) {
            if (dto.PipelineId === defaultPipeline_1.DefaultPipeline.Id.toHexString()) {
                pipeline = defaultPipeline_1.DefaultPipeline;
            }
            else {
                pipeline = await Pipeline_1.Pipeline.findOne({ _id: dto.PipelineId, userId: userId });
            }
            if (!pipeline) {
                throw new errorHandler_1.BadRequestError("Invalid pipeline ID or unauthorized.");
            }
        }
        else {
            pipeline = defaultPipeline_1.DefaultPipeline; // Use the default
        }
        // 2. Determine Stage
        const requestedStage = dto.Stage?.trim() || null;
        let finalStage;
        if (!requestedStage || !pipeline.stages.includes(requestedStage)) {
            // Use the first stage in the pipeline or "Applied" as fallback
            finalStage = pipeline.stages.length > 0 ? pipeline.stages[0] : "Applied";
        }
        else {
            finalStage = requestedStage;
        }
        const job = new JobApplication_1.JobApplication({
            userId: userId,
            pipelineId: pipeline.id, // Use the virtual 'id'
            pipelineName: pipeline.name,
            name: dto.Name,
            company: dto.Company,
            role: dto.Role,
            location: dto.Location,
            stage: finalStage,
            source: dto.Source ?? '',
            appliedDate: dto.AppliedDate ?? new Date(),
            notes: dto.Notes,
        });
        await job.save();
        res.status(200).json(job);
    }
    catch (error) {
        next(error);
    }
};
exports.createJob = createJob;
// PUT /api/jobs/:id
const updateJob = async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const { id } = req.params;
        const dto = req.body;
        const existingJob = await JobApplication_1.JobApplication.findOne({ _id: id, userId: userId });
        if (!existingJob) {
            throw new errorHandler_1.NotFoundError("Job not found or unauthorized");
        }
        let pipeline = null;
        // 1. Handle Pipeline ID update
        if (dto.PipelineId && dto.PipelineId !== existingJob.pipelineId) {
            // Find or use default pipeline
            if (dto.PipelineId === defaultPipeline_1.DefaultPipeline.Id.toHexString()) {
                pipeline = defaultPipeline_1.DefaultPipeline;
            }
            else {
                pipeline = await Pipeline_1.Pipeline.findOne({ _id: dto.PipelineId, userId: userId });
            }
            if (!pipeline) {
                throw new errorHandler_1.BadRequestError("Invalid pipeline ID or unauthorized");
            }
            existingJob.pipelineId = pipeline.id;
            existingJob.pipelineName = pipeline.name;
        }
        // 2. Handle Stage update (Requires pipeline data for validation)
        if (dto.Stage) {
            // Get the current (or new) pipeline stages for validation
            if (!pipeline) {
                // Determine pipeline based on the existing ID
                if (existingJob.pipelineId === defaultPipeline_1.DefaultPipeline.Id.toHexString()) {
                    pipeline = defaultPipeline_1.DefaultPipeline;
                }
                else {
                    pipeline = await Pipeline_1.Pipeline.findOne({ _id: existingJob.pipelineId, userId: userId });
                }
            }
            // Validate stage against the pipeline
            if (!pipeline || !pipeline.stages.includes(dto.Stage)) {
                throw new errorHandler_1.BadRequestError("Invalid stage for the selected pipeline");
            }
            existingJob.stage = dto.Stage;
        }
        // 3. Apply other updates
        // Use ?? to check for null/undefined and apply update only if provided
        if (dto.Name !== undefined)
            existingJob.name = dto.Name;
        if (dto.Company !== undefined)
            existingJob.company = dto.Company;
        if (dto.Role !== undefined)
            existingJob.role = dto.Role;
        if (dto.Location !== undefined)
            existingJob.location = dto.Location;
        if (dto.Source !== undefined)
            existingJob.source = dto.Source ?? ""; // C# uses null!
        if (dto.AppliedDate !== undefined)
            existingJob.appliedDate = dto.AppliedDate;
        if (dto.Notes !== undefined)
            existingJob.notes = dto.Notes;
        existingJob.updatedAt = new Date();
        await existingJob.save();
        res.status(200).json(existingJob);
    }
    catch (error) {
        next(error);
    }
};
exports.updateJob = updateJob;
// DELETE /api/jobs/:id
const deleteJob = async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const { id } = req.params;
        const result = await JobApplication_1.JobApplication.deleteOne({ _id: id, userId: userId });
        if (result.deletedCount === 0) {
            throw new errorHandler_1.NotFoundError("Job not found or unauthorized");
        }
        res.status(200).json({ message: 'Job application deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteJob = deleteJob;
