import { Schema, model, Types } from 'mongoose';
import { IJobApplication } from './types';

const JobApplicationSchema = new Schema<IJobApplication>({
    userId: {
        type: Schema.Types.ObjectId,
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

JobApplicationSchema.virtual('id').get(function(this: IJobApplication) {
    return this._id.toHexString();
});

export const JobApplication = model<IJobApplication>('JobApplication', JobApplicationSchema);