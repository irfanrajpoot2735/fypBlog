import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { setBlog } from '@/redux/blogSlice'
import axios from 'axios'
import { Loader2, Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const CreateBlog = () => {
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("")
    const [categories, setCategories] = useState([])
    const [loadingCategories, setLoadingCategories] = useState(true)
    const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false)
    const [newCategoryName, setNewCategoryName] = useState("")
    const [newCategoryDescription, setNewCategoryDescription] = useState("")
    const [creatingCategory, setCreatingCategory] = useState(false)
    const {blog} = useSelector(store=>store.blog)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            setLoadingCategories(true)
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/v1/category/`)
            if (res.data.success) {
                setCategories(res.data.categories)
            }
        } catch (error) {
            console.error('Error fetching categories:', error)
            toast.error("Failed to load categories")
        } finally {
            setLoadingCategories(false)
        }
    }

    const createNewCategory = async () => {
        if (!newCategoryName.trim()) {
            toast.error("Category name is required")
            return
        }

        try {
            setCreatingCategory(true)
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/v1/category/`,
                { name: newCategoryName.trim(), description: newCategoryDescription.trim() },
                { withCredentials: true }
            )
            
            if (res.data.success) {
                toast.success(res.data.message)
                setCategories([...categories, res.data.category])
                setCategory(res.data.category.name)
                setNewCategoryName("")
                setNewCategoryDescription("")
                setShowNewCategoryDialog(false)
            }
        } catch (error) {
            console.error('Error creating category:', error)
            toast.error(error.response?.data?.message || "Failed to create category")
        } finally {
            setCreatingCategory(false)
        }
    }

    const getSelectedCategory = (value) => {
        if (value === "create_new") {
            setShowNewCategoryDialog(true)
        } else {
            setCategory(value)
        }
    }
    
    const createBlogHandler = async () => {
        
        try {
            setLoading(true)
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/v1/blog/`, { title, category }, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            })
            if (res.data.success) {
                dispatch(setBlog([...blog, res.data.blog]))
                navigate(`/dashboard/write-blog/${res.data.blog._id}`)
                toast.success(res.data.message)
            } else {
                toast.error("Something went wrong");
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

    }
    return (
        <div className='p-4 md:pr-20 h-screen md:ml-[320px] pt-20'>
            <Card className="md:p-10 p-4 dark:bg-gray-800">
            <h1 className='text-2xl font-bold'>Lets create blog</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex eius necessitatibus fugit vel distinctio architecto, ut ratione rem nobis eaque?</p>
            <div className='mt-10 '>
                <div>
                    <Label>Title</Label>
                    <Input type="text" placeholder="Your Blog Name" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-white dark:bg-gray-700" />
                </div>
                <div className='mt-4 mb-5'>
                    <Label>Category</Label>
                    <div className="flex gap-2 items-start">
                        <Select onValueChange={getSelectedCategory} value={category}>
                            <SelectTrigger className="w-full bg-white dark:bg-gray-700">
                                <SelectValue placeholder={loadingCategories ? "Loading categories..." : "Select a category"} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Categories</SelectLabel>
                                    {loadingCategories ? (
                                        <SelectItem value="loading" disabled>
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                <span>Loading...</span>
                                            </div>
                                        </SelectItem>
                                    ) : categories.length > 0 ? (
                                        <>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat._id} value={cat.name}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                            <SelectItem value="create_new" className="text-blue-600 font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Plus className="h-3 w-3" />
                                                    <span>Create New Category</span>
                                                </div>
                                            </SelectItem>
                                        </>
                                    ) : (
                                        <SelectItem value="create_new" className="text-blue-600 font-medium">
                                            <div className="flex items-center gap-2">
                                                <Plus className="h-3 w-3" />
                                                <span>Create New Category</span>
                                            </div>
                                        </SelectItem>
                                    )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* New Category Dialog */}
                <Dialog open={showNewCategoryDialog} onOpenChange={setShowNewCategoryDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Category</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="categoryName">Category Name *</Label>
                                <Input
                                    id="categoryName"
                                    type="text"
                                    placeholder="e.g., Web Development"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="categoryDescription">Description (optional)</Label>
                                <Input
                                    id="categoryDescription"
                                    type="text"
                                    placeholder="Brief description of the category"
                                    value={newCategoryDescription}
                                    onChange={(e) => setNewCategoryDescription(e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowNewCategoryDialog(false)
                                        setNewCategoryName("")
                                        setNewCategoryDescription("")
                                    }}
                                    disabled={creatingCategory}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={createNewCategory}
                                    disabled={creatingCategory || !newCategoryName.trim()}
                                >
                                    {creatingCategory ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        "Create Category"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                <div className='flex gap-2'>
                    {/* <Button  variant="outline">Cancel</Button> */}
                    <Button className="" disabled={loading} onClick={createBlogHandler}>
                        {
                            loading ? <><Loader2 className='mr-1 h-4 w-4 animate-spin' />Please wait</> : "Create"
                        }
                    </Button>
                </div>
            </div>
            </Card>
           
        </div>
    )
}

export default CreateBlog
