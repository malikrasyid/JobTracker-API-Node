"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const authMiddleware_1 = require("../middleware/authMiddleware");
const errorHandler_1 = require("../middleware/errorHandler");
const SALT_ROUNDS = 10;
const register = async (req, res, next) => {
    try {
        const { Username, Email, PasswordHash: password } = req.body;
        const existingUser = await User_1.User.findOne({ email: Email });
        if (existingUser) {
            throw new errorHandler_1.BadRequestError("Email already exists.");
        }
        const passwordHash = await bcryptjs_1.default.hash(password, SALT_ROUNDS);
        const user = new User_1.User({
            username: Username,
            email: Email,
            passwordHash: passwordHash,
        });
        await user.save();
        res.status(200).json({ message: "User registered successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { EmailOrUsername, Password } = req.body;
        // Try to find user by email or username (Matches C# logic)
        const user = await User_1.User.findOne({
            $or: [
                { email: EmailOrUsername },
                { username: EmailOrUsername }
            ]
        });
        if (!user || !(await bcryptjs_1.default.compare(Password, user.passwordHash))) {
            throw new errorHandler_1.UnauthorizedError("Invalid credentials");
        }
        // Generate token logic
        const token = (0, authMiddleware_1.generateJwtToken)(user._id, user.username, user.email);
        res.status(200).json({
            token,
            userId: user._id.toHexString(),
            username: user.username,
            email: user.email
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
