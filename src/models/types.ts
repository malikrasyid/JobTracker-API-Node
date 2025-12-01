import { Request } from 'express';
import { Document, Types } from 'mongoose';

interface IBaseDocument extends Document {
    id?: string; 
    createdAt: Date;
    updatedAt: Date;
}

export interface IUser extends IBaseDocument {
    username: string;
    email: string;
    passwordHash: string; 
    name?: string;
}

export interface IPipeline extends IBaseDocument {
    userId: Types.ObjectId;
    name: string;
    stages: string[];
}

export interface IJobApplication extends IBaseDocument {
    userId: Types.ObjectId;
    pipelineId?: string;
    pipelineName: string;
    name: string;
    stage: string;
    company: string;
    role: string;
    location: string;
    source: string;
    appliedDate: Date;
    notes?: string;
}

export interface LoginDto {
    emailOrUsername: string;
    password: string;
}

export interface RegisterDto {
    username: string;
    email: string;
    passwordHash: string;
}

export interface PipelineDto {
    Name: string;
    Stages: string[];
}

export interface JobDto {
    PipelineId?: string;
    PipelineName?: string;
    Name: string;
    Stage: string;
    Company: string;
    Role: string;
    Location: string;
    Source?: string;
    AppliedDate?: Date;
    Notes?: string;
}

export interface UpdateJobDto {
    PipelineId?: string;
    PipelineName?: string;
    Name?: string;
    Stage?: string;
    Company?: string;
    Role?: string;
    Location?: string;
    Source?: string;
    AppliedDate?: Date;
    Notes?: string;
}

export interface AuthenticatedRequest extends Request {
    userId?: string; 
}