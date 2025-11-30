import { Schema, model, Types } from 'mongoose';
import { IUser } from './types';

const UserSchema = new Schema<IUser>({
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

UserSchema.virtual('id').get(function(this: IUser) {
    return this._id.toHexString();
});

export const User = model<IUser>('User', UserSchema);