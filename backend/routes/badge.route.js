import express from "express";
import { 
    initializeBadges, 
    getAllBadges, 
    getUserBadges 
} from "../controllers/badge.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

// Initialize badges (admin/setup route)
router.post("/initialize", initializeBadges);

// Get all available badges
router.get("/all", getAllBadges);

// Get user's badges
router.get("/user/:userId", getUserBadges);
router.get("/my-badges", isAuthenticated, getUserBadges);

export default router;
