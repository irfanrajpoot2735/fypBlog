import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import isAdmin from "../middleware/isAdmin.js";
import {
    getAllUsers,
    getAllAdmins,
    makeAdmin,
    removeAdmin,
    getDashboardStats
} from "../controllers/admin.controller.js";

const router = express.Router();

// All routes require authentication and admin role
router.get("/users", isAuthenticated, isAdmin, getAllUsers);
router.get("/admins", isAuthenticated, isAdmin, getAllAdmins);
router.get("/stats", isAuthenticated, isAdmin, getDashboardStats);
router.put("/make-admin/:userId", isAuthenticated, isAdmin, makeAdmin);
router.put("/remove-admin/:userId", isAuthenticated, isAdmin, removeAdmin);

export default router;
