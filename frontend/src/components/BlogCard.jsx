import React from 'react'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const BlogCard = ({blog}) => {
    const navigate = useNavigate()
    const date = new Date(blog.createdAt)
    const formattedDate = date.toLocaleDateString("en-GB");
    
    // Remove HTML tags and get first line
    const getFirstLine = (html) => {
        if (!html) return '';
        const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        return text.length > 80 ? text.substring(0, 80) + '...' : text;
    };

    return (
        <div className="dark:border-gray-700 hover:scale-105 transition-all">
            <img 
                src={blog.thumbnail} 
                alt={blog.title} 
                className='w-full h-48 object-cover'
            />
            <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                By {blog.author?.firstName || 'Anonymous'} | {blog.category} | {formattedDate}
            </p>
            <h2 className="text-xl font-bold mt-2 line-clamp-2">{blog.title}</h2>
            <h3 className='text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-1'>{blog.subtitle}</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 truncate">
                {getFirstLine(blog.description || blog.summary)}
            </p>
            {blog.views !== undefined && (
                <p className="text-xs text-gray-500 mt-2">
                    👁️ {blog.views} views
                </p>
            )}
            <button 
                onClick={()=>navigate(`/blogs/${blog._id}`)} 
                className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm flex items-center gap-1 group transition-all"
            >
                Read More 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    )
}

export default BlogCard
