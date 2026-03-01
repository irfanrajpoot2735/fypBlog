import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        // required: true
    },
    description: {
        type: String,
        // required:true
    },
    summary: {
        type: String,
        default: ""
    },
    thumbnail: {
        type: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'

    },
    category: {
        type: String
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    views: {
        type: Number,
        default: 0
    },
    viewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isPublished:{
        type:Boolean,
        default:false
    }


}, { timestamps: true })

export const Blog = mongoose.model("Blog", blogSchema)