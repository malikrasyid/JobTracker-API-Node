import { Types } from 'mongoose';

export const DefaultPipeline = {
    // Keep the fixed ID for consistency with the C# implementation
    Id: new Types.ObjectId("000000000000000000000001"), 
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