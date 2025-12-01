"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pipeline = void 0;
const mongoose_1 = require("mongoose");
const PipelineSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
PipelineSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
exports.Pipeline = (0, mongoose_1.model)('Pipeline', PipelineSchema);
