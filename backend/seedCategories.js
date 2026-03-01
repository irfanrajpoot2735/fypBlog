import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import { Category } from "./models/category.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const defaultCategories = [
    { name: "Web Development", description: "Articles about web development, frameworks, and best practices" },
    { name: "Digital Marketing", description: "Marketing strategies, SEO, and social media" },
    { name: "Blogging", description: "Tips and tricks for successful blogging" },
    { name: "Photography", description: "Photography techniques, equipment, and editing" },
    { name: "Cooking", description: "Recipes, cooking tips, and culinary adventures" },
    { name: "Technology", description: "Latest tech news, gadgets, and innovations" },
    { name: "Business", description: "Business strategies, entrepreneurship, and startup advice" },
    { name: "Health & Fitness", description: "Wellness, exercise, and healthy living" },
    { name: "Travel", description: "Travel guides, tips, and destination reviews" },
    { name: "Lifestyle", description: "Life hacks, personal development, and lifestyle tips" }
];

const seedCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing categories to avoid slug conflicts
        await Category.deleteMany({});
        console.log('Cleared existing categories');

        // Insert default categories with proper slug generation
        for (const category of defaultCategories) {
            const slug = category.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            
            await Category.create({
                ...category,
                slug
            });
        }

        console.log(`Successfully seeded ${defaultCategories.length} categories`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding categories:', error);
        process.exit(1);
    }
};

seedCategories();
