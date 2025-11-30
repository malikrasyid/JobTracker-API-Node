// src/controllers/jobController.ts
import { Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { JobApplication } from '../models/JobApplication';
import { Pipeline } from '../models/Pipeline';
import { AuthenticatedRequest, JobDto, UpdateJobDto, IPipeline } from '../models/types';
import { DefaultPipeline } from '../config/defaultPipeline';
import { NotFoundError, BadRequestError } from '../middleware/errorHandler';

const getUserId = (req: AuthenticatedRequest): Types.ObjectId => {
    if (!req.userId) throw new Error("User ID not found on authenticated request.");
    return new Types.ObjectId(req.userId);
};

// GET /api/jobs
export const getJobs = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = getUserId(req);
        const jobs = await JobApplication.find({ userId: userId }).lean();
        res.status(200).json(jobs);
    } catch (error) {
        next(error);
    }
};

// GET /api/jobs/:id
export const getJobById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = getUserId(req);
        const { id } = req.params;

        const job = await JobApplication.findOne({ _id: id, userId: userId }).lean();

        if (!job) {
            throw new NotFoundError("Job not found or unauthorized");
        }
        res.status(200).json(job);
    } catch (error) {
        next(error);
    }
};

// GET /api/jobs/stage/:stage
export const getJobsByStage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = getUserId(req);
        const { stage } = req.params;
        
        // Matches the limited stage validation in the original C# controller
        const csAllowedStages = ["Applied", "Interview", "Offer", "Rejected"]; 
        if (!csAllowedStages.includes(stage)) {
            throw new BadRequestError("Invalid stage.");
        }

        const jobs = await JobApplication.find({ userId: userId, stage: stage }).lean();
        res.status(200).json(jobs);
    } catch (error) {
        next(error);
    }
};

// POST /api/jobs
export const createJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = getUserId(req);
        const dto: JobDto = req.body;
        let pipeline: IPipeline | null = null;
        
        // 1. Determine Pipeline (User provided or Default)
        if (dto.PipelineId) {
            if (dto.PipelineId === DefaultPipeline.Id.toHexString()) {
                pipeline = DefaultPipeline as unknown as IPipeline; 
            } else {
                pipeline = await Pipeline.findOne({ _id: dto.PipelineId, userId: userId });
            }

            if (!pipeline) {
                throw new BadRequestError("Invalid pipeline ID or unauthorized.");
            }
        } else {
            pipeline = DefaultPipeline as unknown as IPipeline; // Use the default
        }
        
        // 2. Determine Stage
        const requestedStage = dto.Stage?.trim() || null;
        let finalStage: string;
        
        if (!requestedStage || !pipeline.stages.includes(requestedStage)) {
            // Use the first stage in the pipeline or "Applied" as fallback
            finalStage = pipeline.stages.length > 0 ? pipeline.stages[0] : "Applied";
        } else {
            finalStage = requestedStage;
        }

        const job = new JobApplication({
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
    } catch (error) {
        next(error);
    }
};

// PUT /api/jobs/:id
export const updateJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = getUserId(req);
        const { id } = req.params;
        const dto: UpdateJobDto = req.body;
        
        const existingJob = await JobApplication.findOne({ _id: id, userId: userId });
        if (!existingJob) {
            throw new NotFoundError("Job not found or unauthorized");
        }

        let pipeline: IPipeline | null = null;
        
        // 1. Handle Pipeline ID update
        if (dto.PipelineId && dto.PipelineId !== existingJob.pipelineId) {
            // Find or use default pipeline
            if (dto.PipelineId === DefaultPipeline.Id.toHexString()) {
                pipeline = DefaultPipeline as unknown as IPipeline;
            } else {
                pipeline = await Pipeline.findOne({ _id: dto.PipelineId, userId: userId });
            }

            if (!pipeline) {
                throw new BadRequestError("Invalid pipeline ID or unauthorized");
            }
            existingJob.pipelineId = pipeline.id;
            existingJob.pipelineName = pipeline.name;
        }

        // 2. Handle Stage update (Requires pipeline data for validation)
        if (dto.Stage) {
            // Get the current (or new) pipeline stages for validation
            if (!pipeline) {
                // Determine pipeline based on the existing ID
                if (existingJob.pipelineId === DefaultPipeline.Id.toHexString()) {
                    pipeline = DefaultPipeline as unknown as IPipeline;
                } else {
                    pipeline = await Pipeline.findOne({ _id: existingJob.pipelineId, userId: userId });
                }
            }

            // Validate stage against the pipeline
            if (!pipeline || !pipeline.stages.includes(dto.Stage)) {
                throw new BadRequestError("Invalid stage for the selected pipeline");
            }
            existingJob.stage = dto.Stage;
        }

        // 3. Apply other updates
        // Use ?? to check for null/undefined and apply update only if provided
        if (dto.Name !== undefined) existingJob.name = dto.Name;
        if (dto.Company !== undefined) existingJob.company = dto.Company;
        if (dto.Role !== undefined) existingJob.role = dto.Role;
        if (dto.Location !== undefined) existingJob.location = dto.Location;
        if (dto.Source !== undefined) existingJob.source = dto.Source ?? ""; // C# uses null!
        if (dto.AppliedDate !== undefined) existingJob.appliedDate = dto.AppliedDate;
        if (dto.Notes !== undefined) existingJob.notes = dto.Notes;

        existingJob.updatedAt = new Date();

        await existingJob.save();

        res.status(200).json(existingJob);

    } catch (error) {
        next(error);
    }
};

// DELETE /api/jobs/:id
export const deleteJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = getUserId(req);
        const { id } = req.params;

        const result = await JobApplication.deleteOne({ _id: id, userId: userId });

        if (result.deletedCount === 0) {
            throw new NotFoundError("Job not found or unauthorized");
        }

        res.status(200).json({ message: 'Job application deleted successfully' });
    } catch (error) {
        next(error);
    }
};