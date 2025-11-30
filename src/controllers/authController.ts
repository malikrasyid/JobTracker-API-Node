import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { RegisterDto, LoginDto } from '../models/types';
import { generateJwtToken } from '../middleware/authMiddleware';
import { BadRequestError, UnauthorizedError } from '../middleware/errorHandler';

const SALT_ROUNDS = 10; 

export const register = async (req: Request<{}, {}, RegisterDto>, res: Response, next: NextFunction) => {
    try {
        const { Username, Email, PasswordHash: password } = req.body;

        const existingUser = await User.findOne({ email: Email });
        if (existingUser) {
            throw new BadRequestError("Email already exists.");
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const user = new User({
            username: Username,
            email: Email,
            passwordHash: passwordHash,
        });

        await user.save();
        res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request<{}, {}, LoginDto>, res: Response, next: NextFunction) => {
    try {
        const { EmailOrUsername, Password } = req.body;

        // Try to find user by email or username (Matches C# logic)
        const user = await User.findOne({ 
            $or: [
                { email: EmailOrUsername },
                { username: EmailOrUsername }
            ]
        });

        if (!user || !(await bcrypt.compare(Password, user.passwordHash))) {
            throw new UnauthorizedError("Invalid credentials");
        }

        // Generate token logic
        const token = generateJwtToken(user._id, user.username, user.email);

        res.status(200).json({
            token,
            userId: user._id.toHexString(),
            username: user.username,
            email: user.email
        });

    } catch (error) {
        next(error);
    }
};