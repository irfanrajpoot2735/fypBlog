import { Category } from "../models/category.model.js";
import slugify from "slugify";

// Get all categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true })
            .sort({ name: 1 })
            .select('name slug description');
        
        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch categories"
        });
    }
};

// Create new category
export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        if (!name || name.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }

        const trimmedName = name.trim();
        const generatedSlug = slugify(trimmedName, { lower: true, strict: true });

        // Check if slug already exists
        const existingCategory = await Category.findOne({ slug: generatedSlug });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "Category already exists"
            });
        }

        const category = await Category.create({
            name: trimmedName,
            slug: generatedSlug,   // ✅ FIXED
            description: description || "",
            createdBy: req.id
        });

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
        });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({
            success: false,
            message: "Failed to create category"
        });
    }
};

// Update category
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, isActive } = req.body;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        if (name && name.trim().length > 0) {
            category.name = name.trim();
            category.slug = slugify(name.trim(), { lower: true, strict: true }); // ✅ Update slug too
        }

        if (description !== undefined) {
            category.description = description;
        }

        if (isActive !== undefined) {
            category.isActive = isActive;
        }

        await category.save();

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category
        });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({
            success: false,
            message: "Failed to update category"
        });
    }
};

// Delete category
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({
            success: false,
            message: "Failed to delete category"
        });
    }
};