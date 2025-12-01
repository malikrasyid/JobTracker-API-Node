"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultPipeline = void 0;
const mongoose_1 = require("mongoose");
exports.DefaultPipeline = {
    // Keep the fixed ID for consistency with the C# implementation
    Id: new mongoose_1.Types.ObjectId("000000000000000000000001"),
    Name: "Default Pipeline",
    Stages: [
        "Wishlist",
        "Applied",
        "Screening",
        "Interview",
        "Offer",
        "Rejected"
    ]
};
