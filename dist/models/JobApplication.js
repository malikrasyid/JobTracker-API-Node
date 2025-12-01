"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplication = void 0;
const mongoose_1 = require("mongoose");
const JobApplicationSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        index: true,
        alias: 'UserId'
    },
    pipelineId: {
        type: String,
        alias: 'PipelineId'
    },
    pipelineName: {
        type: String,
        required: true,
        alias: 'PipelineName'
    },
    name: {
        type: String,
        required: true,
        alias: 'Name'
    },
    stage: {
        type: String,
        required: true,
        alias: 'Stage'
    },
    company: {
        type: String,
        required: true,
        alias: 'Company'
    },
    role: {
        type: String,
        required: true,
        alias: 'Role'
    },
    location: {
        type: String,
        required: true,
        alias: 'Location'
    },
    source: {
        type: String,
        default: '',
        alias: 'Source'
    },
    appliedDate: {
        type: Date,
        default: Date.now,
        alias: 'AppliedDate'
    },
    notes: {
        type: String,
        alias: 'Notes'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        alias: 'CreatedAt'
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        alias: 'UpdatedAt'
    }
}, {
    collection: 'Jobs',
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
JobApplicationSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
exports.JobApplication = (0, mongoose_1.model)('JobApplication', JobApplicationSchema);
