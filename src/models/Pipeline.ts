import { Schema, model, Types } from 'mongoose';
import { IPipeline } from './types';

const PipelineSchema = new Schema<IPipeline>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
        alias: 'UserId'
    },
    name: {
        type: String,
        required: true,
        default: 'Default Pipeline',
        alias: 'Name'
    },
    stages: {
        type: [String],
        required: true,
        alias: 'Stages'
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
    collection: 'Pipelines', 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

PipelineSchema.virtual('id').get(function(this: IPipeline) {
    return this._id.toHexString();
});

export const Pipeline = model<IPipeline>('Pipeline', PipelineSchema);