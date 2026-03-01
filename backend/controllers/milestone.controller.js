import { Milestone, UserMilestone } from "../models/milestone.model.js";
import { User } from "../models/user.model.js";
import { Blog } from "../models/blog.model.js";

// Initialize default milestones (run once during setup)
export const initializeMilestones = async (req, res) => {
    try {
        const defaultMilestones = [
            // Blogs Published
            { name: "10 Blogs Published", emoji: "📌", description: "Published 10 blog posts", type: "BLOGS_PUBLISHED", targetValue: 10 },
            { name: "20 Blogs Published", emoji: "📌", description: "Published 20 blog posts", type: "BLOGS_PUBLISHED", targetValue: 20 },
            { name: "50 Blogs Published", emoji: "📌", description: "Published 50 blog posts", type: "BLOGS_PUBLISHED", targetValue: 50 },
            { name: "100 Blogs Published", emoji: "📌", description: "Published 100 blog posts", type: "BLOGS_PUBLISHED", targetValue: 100 },
            
            // Total Views
            { name: "100 Total Views", emoji: "👁️", description: "Reached 100 total views", type: "TOTAL_VIEWS", targetValue: 100 },
            { name: "500 Total Views", emoji: "👁️", description: "Reached 500 total views", type: "TOTAL_VIEWS", targetValue: 500 },
            { name: "1K Total Views", emoji: "👁️", description: "Reached 1,000 total views", type: "TOTAL_VIEWS", targetValue: 1000 },
            { name: "10K Total Views", emoji: "👁️", description: "Reached 10,000 total views", type: "TOTAL_VIEWS", targetValue: 10000 },
            { name: "100K Total Views", emoji: "👁️", description: "Reached 100,000 total views", type: "TOTAL_VIEWS", targetValue: 100000 },
            
            // Comments Received
            { name: "10 Comments Received", emoji: "💬", description: "Received 10 comments", type: "COMMENTS_RECEIVED", targetValue: 10 },
            { name: "50 Comments Received", emoji: "💬", description: "Received 50 comments", type: "COMMENTS_RECEIVED", targetValue: 50 },
            { name: "100 Comments Received", emoji: "💬", description: "Received 100 comments", type: "COMMENTS_RECEIVED", targetValue: 100 },
            { name: "500 Comments Received", emoji: "💬", description: "Received 500 comments", type: "COMMENTS_RECEIVED", targetValue: 500 },
            
            // Active Months
            { name: "1 Month Active", emoji: "📅", description: "Active for 1 month", type: "ACTIVE_MONTHS", targetValue: 1 },
            { name: "3 Months Active", emoji: "📅", description: "Active for 3 months", type: "ACTIVE_MONTHS", targetValue: 3 },
            { name: "6 Months Active", emoji: "📅", description: "Active for 6 months", type: "ACTIVE_MONTHS", targetValue: 6 },
            { name: "12 Months Active", emoji: "📅", description: "Active for 12 months", type: "ACTIVE_MONTHS", targetValue: 12 },
            
            // Global Reach (unique viewers)
            { name: "10 Unique Readers", emoji: "🌍", description: "Reached 10 unique readers", type: "GLOBAL_REACH", targetValue: 10 },
            { name: "50 Unique Readers", emoji: "🌍", description: "Reached 50 unique readers", type: "GLOBAL_REACH", targetValue: 50 },
            { name: "100 Unique Readers", emoji: "🌍", description: "Reached 100 unique readers", type: "GLOBAL_REACH", targetValue: 100 },
            { name: "500 Unique Readers", emoji: "🌍", description: "Reached 500 unique readers", type: "GLOBAL_REACH", targetValue: 500 }
        ];

        // Insert milestones if they don't exist
        for (const milestone of defaultMilestones) {
            await Milestone.findOneAndUpdate(
                { name: milestone.name },
                milestone,
                { upsert: true, new: true }
            );
        }

        res.status(200).json({
            success: true,
            message: "Milestones initialized successfully",
            count: defaultMilestones.length
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to initialize milestones"
        });
    }
};

// Get all milestones
export const getAllMilestones = async (req, res) => {
    try {
        const milestones = await Milestone.find().sort({ targetValue: 1 });
        res.status(200).json({
            success: true,
            milestones
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch milestones"
        });
    }
};

// Get user's milestone progress
export const getUserMilestones = async (req, res) => {
    try {
        const userId = req.params.userId || req.id;
        
        const userMilestones = await UserMilestone.find({ userId })
            .populate('milestoneId')
            .sort({ 'milestoneId.targetValue': 1 });

        // Get all milestones and create progress records for ones that don't exist
        const allMilestones = await Milestone.find();
        const existingMilestoneIds = userMilestones.map(um => um.milestoneId._id.toString());

        for (const milestone of allMilestones) {
            if (!existingMilestoneIds.includes(milestone._id.toString())) {
                const newUserMilestone = await UserMilestone.create({
                    userId,
                    milestoneId: milestone._id,
                    currentValue: 0,
                    isCompleted: false
                });
                userMilestones.push({
                    ...newUserMilestone.toObject(),
                    milestoneId: milestone
                });
            }
        }

        res.status(200).json({
            success: true,
            milestones: userMilestones
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user milestones"
        });
    }
};

// Check and update milestones
export const checkAndUpdateMilestones = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) return;

        const blogs = await Blog.find({ author: userId, isPublished: true });
        const allMilestones = await Milestone.find();

        // Calculate values
        const totalBlogs = blogs.length;
        const totalViews = blogs.reduce((sum, blog) => sum + blog.views, 0);
        const totalComments = blogs.reduce((sum, blog) => sum + blog.comments.length, 0);
        
        // Calculate active months
        const accountAge = new Date() - new Date(user.createdAt);
        const activeMonths = Math.floor(accountAge / (1000 * 60 * 60 * 24 * 30));
        
        // Calculate unique readers
        const uniqueReaders = new Set();
        blogs.forEach(blog => {
            blog.viewedBy.forEach(viewer => uniqueReaders.add(viewer.toString()));
        });
        const globalReach = uniqueReaders.size;

        for (const milestone of allMilestones) {
            let currentValue = 0;

            switch (milestone.type) {
                case 'BLOGS_PUBLISHED':
                    currentValue = totalBlogs;
                    break;
                case 'TOTAL_VIEWS':
                    currentValue = totalViews;
                    break;
                case 'COMMENTS_RECEIVED':
                    currentValue = totalComments;
                    break;
                case 'ACTIVE_MONTHS':
                    currentValue = activeMonths;
                    break;
                case 'GLOBAL_REACH':
                    currentValue = globalReach;
                    break;
            }

            const isCompleted = currentValue >= milestone.targetValue;

            // Update or create user milestone
            const existingUserMilestone = await UserMilestone.findOne({
                userId,
                milestoneId: milestone._id
            });

            if (existingUserMilestone) {
                if (!existingUserMilestone.isCompleted && isCompleted) {
                    existingUserMilestone.isCompleted = true;
                    existingUserMilestone.completedAt = new Date();
                    console.log(`Milestone "${milestone.name}" completed by user ${userId}`);
                }
                existingUserMilestone.currentValue = currentValue;
                await existingUserMilestone.save();
            } else {
                const newUserMilestone = await UserMilestone.create({
                    userId,
                    milestoneId: milestone._id,
                    currentValue,
                    isCompleted,
                    completedAt: isCompleted ? new Date() : null
                });

                await User.findByIdAndUpdate(userId, {
                    $push: { milestones: newUserMilestone._id }
                });
            }
        }
    } catch (error) {
        console.log("Error checking milestones:", error);
    }
};

// Get milestone dashboard for user
export const getMilestoneDashboard = async (req, res) => {
    try {
        const userId = req.params.userId || req.id;

        // Get all milestones from the system
        const allMilestones = await Milestone.find().sort({ type: 1, targetValue: 1 });

        // Get user's milestone progress
        const userMilestones = await UserMilestone.find({ userId }).populate('milestoneId');

        // Create a map for quick lookup
        const userMilestoneMap = new Map();
        userMilestones.forEach(um => {
            if (um.milestoneId) {
                userMilestoneMap.set(um.milestoneId._id.toString(), um);
            }
        });

        // Group by type - always include all milestones
        const dashboard = {
            BLOGS_PUBLISHED: [],
            TOTAL_VIEWS: [],
            COMMENTS_RECEIVED: [],
            ACTIVE_MONTHS: [],
            GLOBAL_REACH: []
        };

        // Add all milestones with their progress (or default values)
        allMilestones.forEach(milestone => {
            const userProgress = userMilestoneMap.get(milestone._id.toString());
            
            const type = milestone.type;
            dashboard[type].push({
                name: milestone.name,
                emoji: milestone.emoji,
                description: milestone.description,
                targetValue: milestone.targetValue,
                currentValue: userProgress ? userProgress.currentValue : 0,
                progress: userProgress ? Math.min((userProgress.currentValue / milestone.targetValue) * 100, 100) : 0,
                isCompleted: userProgress ? userProgress.isCompleted : false,
                completedAt: userProgress ? userProgress.completedAt : null
            });
        });

        res.status(200).json({
            success: true,
            dashboard
        });
    } catch (error) {
        console.error('Error fetching milestone dashboard:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch milestone dashboard"
        });
    }
};
