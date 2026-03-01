import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
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
        enum: ['BLOGS_PUBLISHED', 'TOTAL_VIEWS', 'COMMENTS_RECEIVED', 'ACTIVE_MONTHS', 'GLOBAL_REACH'],
        required: true
    },
    targetValue: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const userMilestoneSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    milestoneId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Milestone',
        required: true
    },
    currentValue: {
        type: Number,
        default: 0
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date
    }
}, { timestamps: true });

export const Milestone = mongoose.model("Milestone", milestoneSchema);
export const UserMilestone = mongoose.model("UserMilestone", userMilestoneSchema);
