import React from 'react'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'

const BlogCardList = ({ blog }) => {
    const navigate = useNavigate()
    const date = new Date(blog.createdAt)
    const formattedDate = date.toLocaleDateString("en-GB");
    return (
        <div className="bg-white dark:bg-gray-700 dark:border-gray-600 flex flex-col md:flex-row md:gap-10 p-4 rounded-2xl mt-6 shadow-lg border transition-all hover:shadow-xl">
            <div className="flex-shrink-0">
                <img 
                    src={blog.thumbnail} 
                    alt={blog.title} 
                    className='rounded-lg w-full md:w-[300px] md:h-[200px] object-cover hover:scale-105 transition-all' 
                />
            </div>
            <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
                    <span className="flex items-center gap-1">
                        👤 By {blog.author?.firstName || 'Anonymous'}
                    </span>
                    <span>•</span>
                    <span>📅 {formattedDate}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        👁️ {blog.views || 0} views
                    </span>
                    <span>•</span>
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 rounded-full">
                        {blog.category}
                    </span>
                </div>
                <h2 className="text-2xl font-semibold mt-1">{blog.title}</h2>
                <h3 className='text-gray-500 dark:text-gray-400 mt-1'>{blog.subtitle}</h3>
                {blog.summary && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                        {blog.summary}
                    </p>
                )}
                <Button onClick={() => navigate(`/blogs/${blog._id}`)} className="mt-4 px-4 py-2 rounded-lg text-sm">
                    Read More
                </Button>
            </div>
        </div>
    )
}

export default BlogCardList
