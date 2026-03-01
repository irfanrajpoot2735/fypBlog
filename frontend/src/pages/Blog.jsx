import BlogCard from '@/components/BlogCard'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setBlog } from '@/redux/blogSlice'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const Blog = () => {
    const dispatch = useDispatch()
    const { blog } = useSelector(store => store.blog)
    const [categories, setCategories] = useState([])
    const [trendingBlogs, setTrendingBlogs] = useState([])
    const [suggestedBlogs, setSuggestedBlogs] = useState([])
    const [categoryLimit, setCategoryLimit] = useState(10)
    const [suggestedLimit, setSuggestedLimit] = useState(10)
    const [email, setEmail] = useState('')
    const [subscribing, setSubscribing] = useState(false)
    const navigate = useNavigate()

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
                setSuggestedBlogs(res.data.blogs.slice(0, 30))
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
        <div className='pt-10 bg-white dark:bg-gray-900'>
            <div className='max-w-[1400px] mx-auto text-center flex flex-col space-y-4 items-center px-2'>
                <h1 className='text-4xl font-bold text-center pt-10'>Our Blogs</h1>
                <hr className='w-24 text-center border-2 border-red-500 rounded-full' />
            </div>
            
            <div className='max-w-[1400px] mx-auto flex gap-4 py-10 px-2'>
                {/* Blog Grid */}
                <div className='flex-1'>
                    <div className='grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-2 md:px-0'>
                        {blog?.map((blog, index) => (
                            <BlogCard blog={blog} key={index} />
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className='bg-white hidden lg:block dark:bg-gray-800 w-[300px] p-5 rounded-md space-y-6 h-fit sticky top-20'>
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
                        <form onSubmit={handleSubscribe} className="flex flex-col gap-2 mt-4">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex h-10 w-full rounded-md border bg-gray-100 dark:bg-gray-900 px-3 py-2 text-sm"
                            />
                            <Button type="submit" disabled={subscribing} className="w-full">
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
                                    onClick={() => navigate(`/blogs/${blog._id}`)}
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
                                    onClick={() => navigate(`/blogs/${blog._id}`)}
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

export default Blog
