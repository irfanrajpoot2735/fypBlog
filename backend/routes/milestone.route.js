import express from "express";
import { 
    initializeMilestones, 
    getAllMilestones, 
    getUserMilestones,
    getMilestoneDashboard
} from "../controllers/milestone.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

// Initialize milestones (admin/setup route)
router.post("/initialize", initializeMilestones);

// Get all available milestones
router.get("/all", getAllMilestones);

// Get user's milestone progress
router.get("/user/:userId", getUserMilestones);
router.get("/my-milestones", isAuthenticated, getUserMilestones);

// Get milestone dashboard
router.get("/dashboard/:userId", getMilestoneDashboard);
router.get("/my-dashboard", isAuthenticated, getMilestoneDashboard);

export default router;
