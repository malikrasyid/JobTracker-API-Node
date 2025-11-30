// src/controllers/pipelineController.ts
import { Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { Pipeline } from '../models/Pipeline';
import { AuthenticatedRequest, PipelineDto } from '../models/types';
import { DefaultPipeline } from '../config/defaultPipeline';
import { NotFoundError, BadRequestError } from '../middleware/errorHandler';

const getUserId = (req: AuthenticatedRequest): Types.ObjectId => {
    if (!req.userId) throw new Error("User ID not found on authenticated request.");
    return new Types.ObjectId(req.userId);
};

// GET /api/pipelines
export const getPipelines = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = getUserId(req);
        
        const pipelines = await Pipeline.find({ userId: userId }).lean();

        // If no user pipelines, return the default pipeline (Matches C# logic)
        if (pipelines.length === 0) {
            return res.status(200).json([
                {
                    Id: DefaultPipeline.Id.toHexString(),
                    Name: DefaultPipeline.Name,
                    Stages: DefaultPipeline.Stages
                }
            ]);
        }
        
        res.status(200).json(pipelines);
    } catch (error) {
        next(error);
    }
};

// GET /api/pipelines/:id
export const getPipelineById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = getUserId(req);
        const { id } = req.params;

        if (id === DefaultPipeline.Id.toHexString()) {
            return res.status(200).json({
                Id: DefaultPipeline.Id.toHexString(),
                Name: DefaultPipeline.Name,
                Stages: DefaultPipeline.Stages
            });
        }
        
        const pipeline = await Pipeline.findOne({ _id: id, userId: userId }).lean();

        if (!pipeline) {
            throw new NotFoundError("Pipeline not found or unauthorized");
        }

        res.status(200).json(pipeline);
    } catch (error) {
        next(error);
    }
};

// POST /api/pipelines
export const createPipeline = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = getUserId(req);
        const dto: PipelineDto = req.body;

        // Validation (Matches C# validation)
        if (!dto.Stages || dto.Stages.length === 0) {
            throw new BadRequestError("At least one stage is required");
        }

        const pipeline = new Pipeline({
            name: dto.Name,
            stages: [...dto.Stages],
            userId: userId,
        });

        await pipeline.save();
        res.status(200).json(pipeline);
    } catch (error) {
        next(error);
    }
};

// PUT /api/pipelines/:id
export const updatePipeline = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = getUserId(req);
        const { id } = req.params;
        const dto: PipelineDto = req.body;

        if (id === DefaultPipeline.Id.toHexString()) {
            throw new BadRequestError("Cannot update the default pipeline.");
        }
        
        const updatedPipeline = await Pipeline.findOneAndUpdate(
            { _id: id, userId: userId }, // Filter
            { 
                $set: { 
                    name: dto.Name,
                    stages: dto.Stages, 
                    updatedAt: new Date(),
                }
            },
            { new: true, runValidators: true } 
        ).lean();

        if (!updatedPipeline) {
            throw new NotFoundError("Pipeline not found or unauthorized");
        }

        res.status(200).json(updatedPipeline);
    } catch (error) {
        next(error);
    }
};

// DELETE /api/pipelines/:id
export const deletePipeline = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = getUserId(req);
        const { id } = req.params;
        
        if (id === DefaultPipeline.Id.toHexString()) {
            throw new BadRequestError("Cannot delete the default pipeline.");
        }

        const result = await Pipeline.deleteOne({ _id: id, userId: userId });

        if (result.deletedCount === 0) {
            throw new NotFoundError("Pipeline not found or unauthorized");
        }

        res.status(200).json({ message: 'Pipeline deleted successfully' });
    } catch (error) {
        next(error);
    }
};