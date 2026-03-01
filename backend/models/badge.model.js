import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    emoji: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['FIRST_POST', 'TRENDING_AUTHOR', 'CONSISTENT_WRITER', 'TOP_RATED', 'EXPERT_CONTRIBUTOR'],
        required: true
    },
    criteria: {
        type: mongoose.Schema.Types.Mixed, // Flexible criteria object
        required: true
    },
    level: {
        type: Number,
        default: 1
    }
}, { timestamps: true });

const userBadgeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    badgeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Badge',
        required: true
    },
    awardedAt: {
        type: Date,
        default: Date.now
    },
    progress: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export const Badge = mongoose.model("Badge", badgeSchema);
export const UserBadge = mongoose.model("UserBadge", userBadgeSchema);
