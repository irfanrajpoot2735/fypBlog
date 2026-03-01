import { Badge, UserBadge } from "../models/badge.model.js";
import { User } from "../models/user.model.js";
import { Blog } from "../models/blog.model.js";

// Initialize default badges (run once during setup)
export const initializeBadges = async (req, res) => {
    try {
        const defaultBadges = [
            {
                name: "First Post",
                emoji: "🏅",
                description: "Published your first blog",
                type: "FIRST_POST",
                criteria: { blogsPublished: 1 },
                level: 1
            },
            {
                name: "Trending Author",
                emoji: "🔥",
                description: "Post crossed 100 views",
                type: "TRENDING_AUTHOR",
                criteria: { viewThreshold: 100 },
                level: 1
            },
            {
                name: "Viral Creator",
                emoji: "🚀",
                description: "Post crossed 1000 views",
                type: "TRENDING_AUTHOR",
                criteria: { viewThreshold: 1000 },
                level: 2
            },
            {
                name: "Consistent Writer",
                emoji: "✍️",
                description: "Weekly posting streak of 4 weeks",
                type: "CONSISTENT_WRITER",
                criteria: { streakWeeks: 4 },
                level: 1
            },
            {
                name: "Dedicated Writer",
                emoji: "📝",
                description: "Weekly posting streak of 12 weeks",
                type: "CONSISTENT_WRITER",
                criteria: { streakWeeks: 12 },
                level: 2
            },
            {
                name: "Top Rated",
                emoji: "⭐",
                description: "Received 50 likes across all posts",
                type: "TOP_RATED",
                criteria: { totalLikes: 50 },
                level: 1
            },
            {
                name: "Highly Acclaimed",
                emoji: "🌟",
                description: "Received 200 likes across all posts",
                type: "TOP_RATED",
                criteria: { totalLikes: 200 },
                level: 2
            },
            {
                name: "Expert Contributor",
                emoji: "🧠",
                description: "Published 10 posts in a specific category",
                type: "EXPERT_CONTRIBUTOR",
                criteria: { categoryPosts: 10 },
                level: 1
            }
        ];

        // Insert badges if they don't exist
        for (const badge of defaultBadges) {
            await Badge.findOneAndUpdate(
                { name: badge.name },
                badge,
                { upsert: true, new: true }
            );
        }

        res.status(200).json({
            success: true,
            message: "Badges initialized successfully",
            count: defaultBadges.length
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to initialize badges"
        });
    }
};

// Get all available badges
export const getAllBadges = async (req, res) => {
    try {
        const badges = await Badge.find().sort({ level: 1 });
        res.status(200).json({
            success: true,
            badges
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch badges"
        });
    }
};

// Get user's badges
export const getUserBadges = async (req, res) => {
    try {
        const userId = req.params.userId || req.id;
        
        const userBadges = await UserBadge.find({ userId })
            .populate('badgeId')
            .sort({ awardedAt: -1 });

        res.status(200).json({
            success: true,
            badges: userBadges
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user badges"
        });
    }
};

// Check and award badges (called after certain events)
export const checkAndAwardBadges = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) return;

        const blogs = await Blog.find({ author: userId, isPublished: true });
        const allBadges = await Badge.find();
        const userBadges = await UserBadge.find({ userId });
        const awardedBadgeIds = userBadges.map(ub => ub.badgeId.toString());

        for (const badge of allBadges) {
            // Skip if already awarded
            if (awardedBadgeIds.includes(badge._id.toString())) continue;

            let shouldAward = false;

            switch (badge.type) {
                case 'FIRST_POST':
                    if (blogs.length >= badge.criteria.blogsPublished) {
                        shouldAward = true;
                    }
                    break;

                case 'TRENDING_AUTHOR':
                    const hasViralPost = blogs.some(blog => blog.views >= badge.criteria.viewThreshold);
                    if (hasViralPost) {
                        shouldAward = true;
                    }
                    break;

                case 'CONSISTENT_WRITER':
                    if (user.statistics.postingStreak >= badge.criteria.streakWeeks) {
                        shouldAward = true;
                    }
                    break;

                case 'TOP_RATED':
                    if (user.statistics.totalLikes >= badge.criteria.totalLikes) {
                        shouldAward = true;
                    }
                    break;

                case 'EXPERT_CONTRIBUTOR':
                    // Check if user has 10+ posts in any single category
                    const categoryCounts = {};
                    blogs.forEach(blog => {
                        categoryCounts[blog.category] = (categoryCounts[blog.category] || 0) + 1;
                    });
                    const hasExpertiseInCategory = Object.values(categoryCounts).some(
                        count => count >= badge.criteria.categoryPosts
                    );
                    if (hasExpertiseInCategory) {
                        shouldAward = true;
                    }
                    break;
            }

            if (shouldAward) {
                const newUserBadge = await UserBadge.create({
                    userId,
                    badgeId: badge._id,
                    awardedAt: new Date()
                });

                await User.findByIdAndUpdate(userId, {
                    $push: { badges: newUserBadge._id }
                });

                console.log(`Badge "${badge.name}" awarded to user ${userId}`);
            }
        }
    } catch (error) {
        console.log("Error checking badges:", error);
    }
};

// Update user statistics (helper function)
export const updateUserStatistics = async (userId) => {
    try {
        const blogs = await Blog.find({ author: userId, isPublished: true });
        
        const totalBlogs = blogs.length;
        const totalViews = blogs.reduce((sum, blog) => sum + blog.views, 0);
        const totalLikes = blogs.reduce((sum, blog) => sum + blog.likes.length, 0);
        
        // Calculate total comments
        const totalComments = blogs.reduce((sum, blog) => sum + blog.comments.length, 0);

        // Calculate posting streak (simplified - based on consecutive weeks)
        const postingStreak = calculatePostingStreak(blogs);
        const lastPostDate = blogs.length > 0 ? blogs[0].createdAt : null;

        await User.findByIdAndUpdate(userId, {
            statistics: {
                totalBlogs,
                totalViews,
                totalComments,
                totalLikes,
                postingStreak,
                lastPostDate
            }
        });

        return { totalBlogs, totalViews, totalComments, totalLikes, postingStreak };
    } catch (error) {
        console.log("Error updating statistics:", error);
    }
};

// Helper function to calculate posting streak
function calculatePostingStreak(blogs) {
    if (blogs.length === 0) return 0;

    // Sort blogs by creation date (most recent first)
    const sortedBlogs = blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    let streak = 0;
    let currentWeek = getWeekNumber(new Date(sortedBlogs[0].createdAt));
    let currentYear = new Date(sortedBlogs[0].createdAt).getFullYear();
    let hasPostThisWeek = true;

    for (const blog of sortedBlogs) {
        const blogDate = new Date(blog.createdAt);
        const blogWeek = getWeekNumber(blogDate);
        const blogYear = blogDate.getFullYear();

        if (blogYear === currentYear && blogWeek === currentWeek) {
            // Same week, continue
            continue;
        } else if (
            (blogYear === currentYear && blogWeek === currentWeek - 1) ||
            (blogYear === currentYear - 1 && currentWeek === 1 && blogWeek === 52)
        ) {
            // Previous week, increment streak
            streak++;
            currentWeek = blogWeek;
            currentYear = blogYear;
        } else {
            // Streak broken
            break;
        }
    }

    return streak + (hasPostThisWeek ? 1 : 0);
}

function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}
