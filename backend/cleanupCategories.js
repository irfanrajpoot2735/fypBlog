import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const cleanupCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Drop the entire categories collection to start fresh
        await mongoose.connection.db.dropCollection('categories').catch(() => {
            console.log('No categories collection to drop');
        });
        
        console.log('Cleaned up categories collection');
        process.exit(0);
    } catch (error) {
        console.error('Error cleaning up:', error);
        process.exit(1);
    }
};

cleanupCategories();
