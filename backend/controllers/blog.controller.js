import { Blog } from "../models/blog.model.js";
import { User } from "../models/user.model.js";
import Comment from "../models/comment.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";
import { checkAndAwardBadges, updateUserStatistics } from "./badge.controller.js";
import { checkAndUpdateMilestones } from "./milestone.controller.js";

// Helper function to generate summary from description
const generateSummary = (description, maxLength = 150) => {
    if (!description) return "";
    
    // Remove HTML tags
    const cleanText = description.replace(/<[^>]*>/g, ' ');
    
    // Remove extra whitespace
    const normalized = cleanText.replace(/\s+/g, ' ').trim();
    
    if (normalized.length <= maxLength) return normalized;
    
    // Cut at last complete sentence or word within limit
    const truncated = normalized.substring(0, maxLength);
    const lastPeriod = truncated.lastIndexOf('.');
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastPeriod > maxLength - 50) {
        return truncated.substring(0, lastPeriod + 1);
    } else if (lastSpace > 0) {
        return truncated.substring(0, lastSpace) + '...';
    }
    
    return truncated + '...';
};

// Create a new blog post
export const createBlog = async (req,res) => {
    try {
        const {title, category} = req.body;
        if(!title || !category) {
            return res.status(400).json({
                message:"Blog title and category is required."
            })
        }

        const blog = await Blog.create({
            title,
            category,
            author:req.id
        })

        return res.status(201).json({
            success:true,
            blog,
            message:"Blog Created Successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create blog"
        })
    }
}

export const updateBlog = async (req, res) => {
    try {
        const blogId = req.params.blogId
        const { title, subtitle, description, category } = req.body;
        const file = req.file;

        let blog = await Blog.findById(blogId).populate("author");
        if(!blog){
            return res.status(404).json({
                message:"Blog not found!"
            })
        }
        let thumbnail;
        if (file) {
            const fileUri = getDataUri(file)
            thumbnail = await cloudinary.uploader.upload(fileUri)
        }

        // Generate summary from description
        const summary = generateSummary(description);

        const updateData = {title, subtitle, description, summary, category,author: req.id, thumbnail: thumbnail?.secure_url};
        blog = await Blog.findByIdAndUpdate(blogId, updateData, {new:true});

        // Check for badges and milestones if blog is published
        if (blog.isPublished) {
            await updateUserStatistics(req.id);
            await checkAndAwardBadges(req.id);
            await checkAndUpdateMilestones(req.id);
        }

        res.status(200).json({ success: true, message: "Blog updated successfully", blog });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating blog", error: error.message });
    }
};

export const getAllBlogs = async (_, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 }).populate({
            path: 'author',
            select: 'firstName lastName photoUrl'
        }).populate({
            path: 'comments',
            sort: { createdAt: -1 },
            populate: {
                path: 'userId',
                select: 'firstName lastName photoUrl'
            }
        });
        res.status(200).json({ success: true, blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching blogs", error: error.message });
    }
};

export const getPublishedBlog = async (_,res) => {
    try {
        const blogs = await Blog.find({isPublished:true}).sort({ createdAt: -1 }).populate({path:"author", select:"firstName lastName photoUrl"}).populate({
            path: 'comments',
            sort: { createdAt: -1 },
            populate: {
                path: 'userId',
                select: 'firstName lastName photoUrl'
            }
        });
        if(!blogs){
            return res.status(404).json({
                message:"Blog not found"
            })
        }
        return res.status(200).json({
            success:true,
            blogs,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get published blogs"
        })
    }
}

export const togglePublishBlog = async (req,res) => {
    try {
        const {blogId} = req.params;
        const {publish} = req.query; // true, false
        console.log(req.query);
        
        const blog = await Blog.findById(blogId);
        if(!blog){
            return res.status(404).json({
                message:"Blog not found!"
            });
        }
        // publish status based on the query paramter
        blog.isPublished = !blog.isPublished
        await blog.save();

        // Update user statistics and check for badges/milestones
        if (blog.isPublished) {
            console.log('Blog published, checking badges for user:', blog.author);
            try {
                await updateUserStatistics(blog.author);
                await checkAndAwardBadges(blog.author);
                await checkAndUpdateMilestones(blog.author);
                console.log('Badge and milestone check completed');
            } catch (badgeError) {
                console.error('Error checking badges/milestones:', badgeError);
            }
        }

        const statusMessage = blog.isPublished ? "Published" : "Unpublished";
        return res.status(200).json({
            success:true,
            message:`Blog is ${statusMessage}`
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to update status"
        })
    }
}

export const getOwnBlogs = async (req, res) => {
    try {
        const userId = req.id; // Assuming `req.id` contains the authenticated user’s ID

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const blogs = await Blog.find({ author: userId }).populate({
            path: 'author',
            select: 'firstName lastName photoUrl'
        }).populate({
            path: 'comments',
            sort: { createdAt: -1 },
            populate: {
                path: 'userId',
                select: 'firstName lastName photoUrl'
            }
        });;

        if (!blogs) {
            return res.status(404).json({ message: "No blogs found.", blogs: [], success: false });
        }

        return res.status(200).json({ blogs, success: true });
    } catch (error) {
        res.status(500).json({ message: "Error fetching blogs", error: error.message });
    }
};

// Delete a blog post
export const deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const authorId = req.id
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }
        if (blog.author.toString() !== authorId) {
            return res.status(403).json({ success: false, message: 'Unauthorized to delete this blog' });
        }

        // Delete blog
        await Blog.findByIdAndDelete(blogId);

        // Delete related comments
        await Comment.deleteMany({ postId: blogId });

        // Update user statistics and recheck milestones after deletion
        try {
            await updateUserStatistics(authorId);
            await checkAndUpdateMilestones(authorId);
            console.log('Statistics and milestones updated after blog deletion');
        } catch (updateError) {
            console.error('Error updating statistics after deletion:', updateError);
        }

        res.status(200).json({ success: true, message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting blog", error: error.message });
    }
};

export const likeBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const likeKrneWalaUserKiId = req.id;
        const blog = await Blog.findById(blogId).populate({path:'likes'});
        if (!blog) return res.status(404).json({ message: 'Blog not found', success: false })

        // Check if user already liked the blog
        // const alreadyLiked = blog.likes.includes(userId);

        //like logic started
        await blog.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } });
        await blog.save();

        // Update author statistics and check badges/milestones
        await updateUserStatistics(blog.author);
        await checkAndAwardBadges(blog.author);
        await checkAndUpdateMilestones(blog.author);

        return res.status(200).json({ message: 'Blog liked', blog, success: true });
    } catch (error) {
        console.log(error);

    }
}


export const dislikeBlog = async (req, res) => {
    try {
        const likeKrneWalaUserKiId = req.id;
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId);
        if (!blog) return res.status(404).json({ message: 'post not found', success: false })

        //dislike logic started
        await blog.updateOne({ $pull: { likes: likeKrneWalaUserKiId } });
        await blog.save();

        return res.status(200).json({ message: 'Blog disliked', blog, success: true });
    } catch (error) {
        console.log(error);

    }
}

export const getMyTotalBlogLikes = async (req, res) => {
    try {
      const userId = req.id; // assuming you use authentication middleware
  
      // Step 1: Find all blogs authored by the logged-in user
      const myBlogs = await Blog.find({ author: userId }).select("likes");
  
      // Step 2: Sum up the total likes
      const totalLikes = myBlogs.reduce((acc, blog) => acc + (blog.likes?.length || 0), 0);
  
      res.status(200).json({
        success: true,
        totalBlogs: myBlogs.length,
        totalLikes,
      });
    } catch (error) {
      console.error("Error getting total blog likes:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch total blog likes",
      });
    }
  };

// Track blog view
export const trackBlogView = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.id; // Can be undefined for non-authenticated users

        // Build atomic update operations
        const updateOps = {
            $inc: { views: 1 }
        };

        // Add unique viewer if authenticated and not already viewed
        if (userId) {
            updateOps.$addToSet = { viewedBy: userId };
        }

        // Use atomic update to avoid version conflicts
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            updateOps,
            { new: true }
        );

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        // Update author statistics and check milestones
        await updateUserStatistics(blog.author);
        await checkAndAwardBadges(blog.author);
        await checkAndUpdateMilestones(blog.author);

        res.status(200).json({
            success: true,
            views: blog.views
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to track view"
        });
    }
};

// Get blog by ID with full details
export const getBlogById = async (req, res) => {
    try {
        const blogId = req.params.id;
        
        const blog = await Blog.findById(blogId)
            .populate({
                path: 'author',
                select: 'firstName lastName photoUrl bio occupation badges'
            })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'userId',
                    select: 'firstName lastName photoUrl'
                }
            });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        res.status(200).json({
            success: true,
            blog
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch blog"
        });
    }
};