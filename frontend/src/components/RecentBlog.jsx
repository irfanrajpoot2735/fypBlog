import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BlogCard from './BlogCard';
import BlogCardList from './BlogCardList';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useNavigate } from 'react-router-dom';
import { setBlog } from '@/redux/blogSlice';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const RecentBlog = () => {
    const { blog } = useSelector(store => store.blog)
    const [categories, setCategories] = useState([])
    const [trendingBlogs, setTrendingBlogs] = useState([])
    const [suggestedBlogs, setSuggestedBlogs] = useState([])
    const [categoryLimit, setCategoryLimit] = useState(10)
    const [suggestedLimit, setSuggestedLimit] = useState(10)
    const [email, setEmail] = useState('')
    const [subscribing, setSubscribing] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        getAllPublishedBlogs()
        fetchCategories()
        fetchTrendingBlogs()
        fetchSuggestedBlogs()
    }, [])

    const getAllPublishedBlogs = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/v1/blog/get-published-blogs`, { withCredentials: true })
            if (res.data.success) {
                dispatch(setBlog(res.data.blogs))
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/v1/category/`)
            if (res.data.success) {
                setCategories(res.data.categories)
            }
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    const fetchTrendingBlogs = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/v1/blog/get-published-blogs`)
            if (res.data.success) {
                // Sort by views and get top 10
                const trending = res.data.blogs
                    .sort((a, b) => (b.views || 0) - (a.views || 0))
                    .slice(0, 10)
                setTrendingBlogs(trending)
            }
        } catch (error) {
            console.error('Error fetching trending blogs:', error)
        }
    }

    const fetchSuggestedBlogs = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/v1/blog/get-published-blogs`)
            if (res.data.success) {
                // Get random or recent blogs for suggestions
                setSuggestedBlogs(res.data.blogs.slice(0, 30)) // Get 30 for pagination
            }
        } catch (error) {
            console.error('Error fetching suggested blogs:', error)
        }
    }

    const handleSubscribe = async (e) => {
        e.preventDefault()
        if (!email) {
            toast.error('Please enter your email')
            return
        }

        try {
            setSubscribing(true)
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/v1/newsletter/subscribe`, { email })
            if (res.data.success) {
                toast.success(res.data.message)
                setEmail('')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to subscribe')
        } finally {
            setSubscribing(false)
        }
    }

    return (
        <div className='bg-gray-100 dark:bg-gray-800 pb-10'>
            <div className='max-w-6xl mx-auto  flex flex-col space-y-4 items-center'>
                <h1 className='text-4xl font-bold pt-10 '>Recent Blogs</h1>
                <hr className=' w-24 text-center border-2 border-red-500 rounded-full' />
            </div>
            <div className='max-w-7xl mx-auto flex gap-6'>
                <div>
                    <div className='mt-10 px-4 md:px-0'>
                        {
                            blog?.slice(0, 4)?.map((blog, index) => {
                                return <BlogCardList key={index} blog={blog} />
                            })
                        }
                    </div>

                </div>
                <div className='bg-white hidden md:block dark:bg-gray-700 w-[350px] p-5 rounded-md mt-10 space-y-6'>
                    {/* Popular Categories */}
                    <div>
                        <h1 className='text-2xl font-semibold mb-4'>Popular categories</h1>
                        <div className='flex flex-wrap gap-3'>
                            {categories.slice(0, categoryLimit).map((category) => (
                                <Badge 
                                    onClick={() => navigate(`/search?q=${category.name}`)} 
                                    key={category._id} 
                                    className="cursor-pointer"
                                >
                                    {category.name}
                                </Badge>
                            ))}
                        </div>
                        {categories.length > categoryLimit && (
                            <Button 
                                variant="link" 
                                onClick={() => setCategoryLimit(prev => prev + 10)}
                                className="mt-2 p-0 h-auto text-sm"
                            >
                                View More
                            </Button>
                        )}
                    </div>

                    {/* Newsletter Subscription */}
                    <div>
                        <h1 className='text-xl font-semibold'>Subscribe to Newsletter</h1>
                        <p className='text-sm text-gray-600 dark:text-gray-400 mt-2'>
                            Get the latest posts and updates delivered straight to your inbox.
                        </p>
                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 mt-4">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex h-10 w-full rounded-md border bg-gray-200 dark:bg-gray-800 px-3 py-2 text-sm"
                            />
                            <Button type="submit" disabled={subscribing}>
                                {subscribing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Subscribing</> : 'Subscribe'}
                            </Button>
                        </form>
                    </div>

                    {/* Trending Blogs */}
                    <div>
                        <h2 className="text-xl font-semibold mb-3">Trending Blogs</h2>
                        <ul className="space-y-3">
                            {trendingBlogs.map((blog) => (
                                <li
                                    key={blog._id}
                                    onClick={() => navigate(`/blog/${blog._id}`)}
                                    className="text-sm dark:text-gray-100 hover:underline cursor-pointer flex justify-between items-start"
                                >
                                    <span className="flex-1">{blog.title}</span>
                                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                                        {blog.views || 0} views
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Suggested Blogs */}
                    <div>
                        <h2 className="text-xl font-semibold mb-3">Suggested Blogs</h2>
                        <ul className="space-y-3">
                            {suggestedBlogs.slice(0, suggestedLimit).map((blog) => (
                                <li
                                    key={blog._id}
                                    onClick={() => navigate(`/blog/${blog._id}`)}
                                    className="text-sm dark:text-gray-100 hover:underline cursor-pointer"
                                >
                                    {blog.title}
                                </li>
                            ))}
                        </ul>
                        {suggestedBlogs.length > suggestedLimit && (
                            <Button 
                                variant="link" 
                                onClick={() => setSuggestedLimit(prev => prev + 10)}
                                className="mt-2 p-0 h-auto text-sm"
                            >
                                View More
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecentBlog
