import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useEffect, useRef, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import JoditEditor from 'jodit-react';
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setBlog } from '@/redux/blogSlice'
import ImageCropper from '@/components/ImageCropper'
import { Loader2, Plus } from 'lucide-react'

const UpdateBlog = () => {
    const editor = useRef(null);
   
    const [loading, setLoading] = useState(false)
    const [publish, setPublish] = useState(false)
    const [cropperOpen, setCropperOpen] = useState(false)
    const [tempImageSrc, setTempImageSrc] = useState(null)
    const [categories, setCategories] = useState([])
    const [loadingCategories, setLoadingCategories] = useState(true)
    const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false)
    const [newCategoryName, setNewCategoryName] = useState("")
    const [newCategoryDescription, setNewCategoryDescription] = useState("")
    const [creatingCategory, setCreatingCategory] = useState(false)
    const params = useParams()
    const id = params.blogId
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { blog } = useSelector(store => store.blog)
    const selectBlog = blog.find(blog => blog._id === id)
    const [content, setContent] = useState(selectBlog.description);

    const [blogData, setBlogData] = useState({
        title: selectBlog?.title,
        subtitle: selectBlog?.subtitle,
        description: content,
        category: selectBlog?.category,
    });
    const [previewThumbnail, setPreviewThumbnail] = useState(selectBlog?.thumbnail);

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
                setBlogData({ ...blogData, category: res.data.category.name })
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBlogData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const selectCategory = (value) => {
        if (value === "create_new") {
            setShowNewCategoryDialog(true)
        } else {
            setBlogData({ ...blogData, category: value });
        }
    };

    const selectThumbnail = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const fileReader = new FileReader();
            fileReader.onloadend = () => {
                setTempImageSrc(fileReader.result);
                setCropperOpen(true);
            };
            fileReader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (croppedFile, croppedDataUrl) => {
        setBlogData({ ...blogData, thumbnail: croppedFile });
        setPreviewThumbnail(croppedDataUrl);
    };

    const updateBlogHandler = async () => {

        const formData = new FormData();
        formData.append("title", blogData.title);
        formData.append("subtitle", blogData.subtitle);
        formData.append("description", content);
        formData.append("category", blogData.category);
        formData.append("file", blogData.thumbnail);
        try {
            setLoading(true)
            const res = await axios.put(`${import.meta.env.VITE_API_URL}/v1/blog/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true,
            })
            if (res.data.success) {
                toast.success(res.data.message)
                // dispatch([...course, setCourse(res.data.course)])
                console.log(blogData);


            }
        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false)
        }
    }

    const togglePublishUnpublish = async (action) => {
        console.log("action", action);

        try {
            const res = await axios.patch(`${import.meta.env.VITE_API_URL}/v1/blog/${id}`, {
                params: {
                    action
                },
                withCredentials: true
            })
            if (res.data.success) {
                setPublish(!publish)
                toast.success(res.data.message)
                navigate(`/dashboard/your-blog`)
            } else {
                toast.error("Failed to update")
            }
        } catch (error) {
            console.log(error);

        }
    }

    const deleteBlog = async () => {
        try {
            const res = await axios.delete(`${import.meta.env.VITE_API_URL}/v1/blog/delete/${id}`, { withCredentials: true })
            if (res.data.success) {
                const updatedBlogData = blog.filter((blogItem) => blogItem?._id !== id);
                dispatch(setBlog(updatedBlogData))
                toast.success(res.data.message)
                navigate('/dashboard/your-blog')
            }
            console.log(res.data.message);

        } catch (error) {
            console.log(error);
            toast.error("something went error")
        }

    }

    return (
        <div className='pb-10 px-3 pt-20 md:ml-[320px]'>
            <div className='max-w-6xl mx-auto mt-8'>
                <Card className="w-full bg-white dark:bg-gray-800 p-5 space-y-2">
                    <h1 className=' text-4xl font-bold '>Basic Blog Information</h1>
                    <p className=''>Make changes to your blogs here. Click publish when you're done.</p>
                    <div className="space-x-2">
                        <Button onClick={() => togglePublishUnpublish(selectBlog.isPublished ? "false" : "true")}
                        >
                            {selectBlog?.isPublished ? "UnPublish" : "Publish"}
                        </Button>
                        <Button variant="destructive" onClick={deleteBlog}>Remove Course</Button>
                    </div>
                    <div className='pt-10'>
                        <Label>Title</Label>
                        <Input type="text" placeholder="Enter a title" name="title" value={blogData.title} onChange={handleChange} className="dark:border-gray-300" />
                    </div>
                    <div>
                        <Label>Subtitle</Label>
                        <Input type="text" placeholder="Enter a subtitle" name="subtitle" value={blogData.subtitle} onChange={handleChange} className="dark:border-gray-300" />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <JoditEditor
                            ref={editor}
                            value={blogData.description}
                            onChange={newContent => setContent(newContent)}
                            className="jodit_toolbar"

                        />
                    </div>
                    <div>
                        <Label>Category</Label>
                        <Select onValueChange={selectCategory} value={blogData.category} className="dark:border-gray-300">
                            <SelectTrigger className="w-full">
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
                    <div>
                        <Label>Thumbnail</Label>
                        <Input
                            id="file"
                            type="file"
                            onChange={selectThumbnail}
                            accept="image/*"
                            className="w-fit dark:border-gray-300"
                        />
                        {previewThumbnail && (
                            <div className="mt-2">
                                <img
                                    src={previewThumbnail}
                                    className="w-64 h-48 object-cover rounded-lg"
                                    alt="Course Thumbnail"
                                />
                            </div>
                        )}
                    </div>
                    <div className='flex gap-3'>
                        <Button variant="outline" onClick={()=>navigate(-1)}>Back</Button>
                        <Button onClick={updateBlogHandler}>
                            {
                                loading ? "Please Wait" : "Save"
                            }
                        </Button>
                    </div>

                </Card>
            </div>
            
            <ImageCropper
                isOpen={cropperOpen}
                onClose={() => setCropperOpen(false)}
                imageSrc={tempImageSrc}
                onCropComplete={handleCropComplete}
            />
        </div>
    )
}

export default UpdateBlog
