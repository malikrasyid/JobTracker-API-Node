"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePipeline = exports.updatePipeline = exports.createPipeline = exports.getPipelineById = exports.getPipelines = void 0;
const mongoose_1 = require("mongoose");
const Pipeline_1 = require("../models/Pipeline");
const defaultPipeline_1 = require("../config/defaultPipeline");
const errorHandler_1 = require("../middleware/errorHandler");
const getUserId = (req) => {
    if (!req.userId)
        throw new Error("User ID not found on authenticated request.");
    return new mongoose_1.Types.ObjectId(req.userId);
};
// GET /api/pipelines
const getPipelines = async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const pipelines = await Pipeline_1.Pipeline.find({ userId: userId }).lean();
        // If no user pipelines, return the default pipeline (Matches C# logic)
        if (pipelines.length === 0) {
            return res.status(200).json([
                {
                    Id: defaultPipeline_1.DefaultPipeline.Id.toHexString(),
                    Name: defaultPipeline_1.DefaultPipeline.Name,
                    Stages: defaultPipeline_1.DefaultPipeline.Stages
                }
            ]);
        }
        res.status(200).json(pipelines);
    }
    catch (error) {
        next(error);
    }
};
exports.getPipelines = getPipelines;
// GET /api/pipelines/:id
const getPipelineById = async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const { id } = req.params;
        if (id === defaultPipeline_1.DefaultPipeline.Id.toHexString()) {
            return res.status(200).json({
                Id: defaultPipeline_1.DefaultPipeline.Id.toHexString(),
                Name: defaultPipeline_1.DefaultPipeline.Name,
                Stages: defaultPipeline_1.DefaultPipeline.Stages
            });
        }
        const pipeline = await Pipeline_1.Pipeline.findOne({ _id: id, userId: userId }).lean();
        if (!pipeline) {
            throw new errorHandler_1.NotFoundError("Pipeline not found or unauthorized");
        }
        res.status(200).json(pipeline);
    }
    catch (error) {
        next(error);
    }
};
exports.getPipelineById = getPipelineById;
// POST /api/pipelines
const createPipeline = async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const dto = req.body;
        // Validation (Matches C# validation)
        if (!dto.Stages || dto.Stages.length === 0) {
            throw new errorHandler_1.BadRequestError("At least one stage is required");
        }
        const pipeline = new Pipeline_1.Pipeline({
            name: dto.Name,
            stages: [...dto.Stages],
            userId: userId,
        });
        await pipeline.save();
        res.status(200).json(pipeline);
    }
    catch (error) {
        next(error);
    }
};
exports.createPipeline = createPipeline;
// PUT /api/pipelines/:id
const updatePipeline = async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const { id } = req.params;
        const dto = req.body;
        if (id === defaultPipeline_1.DefaultPipeline.Id.toHexString()) {
            throw new errorHandler_1.BadRequestError("Cannot update the default pipeline.");
        }
        const updatedPipeline = await Pipeline_1.Pipeline.findOneAndUpdate({ _id: id, userId: userId }, // Filter
        {
            $set: {
                name: dto.Name,
                stages: dto.Stages,
                updatedAt: new Date(),
            }
        }, { new: true, runValidators: true }).lean();
        if (!updatedPipeline) {
            throw new errorHandler_1.NotFoundError("Pipeline not found or unauthorized");
        }
        res.status(200).json(updatedPipeline);
    }
    catch (error) {
        next(error);
    }
};
exports.updatePipeline = updatePipeline;
// DELETE /api/pipelines/:id
const deletePipeline = async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const { id } = req.params;
        if (id === defaultPipeline_1.DefaultPipeline.Id.toHexString()) {
            throw new errorHandler_1.BadRequestError("Cannot delete the default pipeline.");
        }
        const result = await Pipeline_1.Pipeline.deleteOne({ _id: id, userId: userId });
        if (result.deletedCount === 0) {
            throw new errorHandler_1.NotFoundError("Pipeline not found or unauthorized");
        }
        res.status(200).json({ message: 'Pipeline deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deletePipeline = deletePipeline;
