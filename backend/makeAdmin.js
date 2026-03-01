import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

// User model
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    bio: String,
    occupation: String,
    photoUrl: String,
    instagram: String,
    linkedin: String,
    github: String,
    facebook: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

async function makeAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Get email from command line argument
        const email = process.argv[2];

        if (!email) {
            console.log("\n❌ Please provide an email address");
            console.log("Usage: node makeAdmin.js your-email@example.com\n");
            process.exit(1);
        }

        // Find and update user
        const user = await User.findOneAndUpdate(
            { email: email },
            { role: 'admin' },
            { new: true }
        );

        if (!user) {
            console.log(`\n❌ User with email "${email}" not found\n`);
            process.exit(1);
        }

        console.log(`\n✅ Success! ${user.firstName} ${user.lastName} is now an admin`);
        console.log(`📧 Email: ${user.email}`);
        console.log(`👑 Role: ${user.role}\n`);
        console.log("Please logout and login again to see admin features.\n");

        process.exit(0);
    } catch (error) {
        console.error("\n❌ Error:", error.message);
        process.exit(1);
    }
}

makeAdmin();
