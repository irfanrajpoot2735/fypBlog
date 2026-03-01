import { User } from "../models/user.model.js";
import { Blog } from "../models/blog.model.js";
import Comment from "../models/comment.model.js";

// Get all users with their statistics
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .populate('badges')
            .populate('milestones');

        // Get blog counts and other statistics for each user
        const usersWithStats = await Promise.all(users.map(async (user) => {
            const blogCount = await Blog.countDocuments({ author: user._id });
            const publishedBlogCount = await Blog.countDocuments({ author: user._id, isPublished: true });
            const commentCount = await Comment.countDocuments({ userId: user._id });

            return {
                ...user.toObject(),
                blogCount,
                publishedBlogCount,
                commentCount
            };
        }));

        res.status(200).json({
            success: true,
            users: usersWithStats,
            totalUsers: usersWithStats.length
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });
    }
};

// Get all admin users
export const getAllAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' })
            .select('-password');

        res.status(200).json({
            success: true,
            admins,
            totalAdmins: admins.length
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch admins"
        });
    }
};

// Make user an admin
export const makeAdmin = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByIdAndUpdate(
            userId,
            { role: 'admin' },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: `${user.firstName} ${user.lastName} is now an admin`,
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to make user admin"
        });
    }
};

// Remove admin role
export const removeAdmin = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByIdAndUpdate(
            userId,
            { role: 'user' },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: `Admin role removed from ${user.firstName} ${user.lastName}`,
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to remove admin role"
        });
    }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalAdmins = await User.countDocuments({ role: 'admin' });
        const totalBlogs = await Blog.countDocuments();
        const totalPublishedBlogs = await Blog.countDocuments({ isPublished: true });
        const totalComments = await Comment.countDocuments();

        // Get recent users (last 10)
        const recentUsers = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalAdmins,
                totalBlogs,
                totalPublishedBlogs,
                totalComments,
                recentUsers
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard stats"
        });
    }
};
