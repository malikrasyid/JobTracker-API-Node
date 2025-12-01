"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        alias: 'Username'
    },
    email: {
        type: String,
        required: true,
        unique: true,
        alias: 'Email'
    },
    passwordHash: {
        type: String,
        required: true,
        alias: 'PasswordHash'
    },
    name: {
        type: String,
        alias: 'Name'
    }
}, {
    collection: 'Users',
    timestamps: { createdAt: 'createdAt', updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
UserSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
exports.User = (0, mongoose_1.model)('User', UserSchema);
