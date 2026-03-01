import express from "express";
import { getAllSubscribers, subscribeNewsletter, unsubscribeNewsletter } from "../controllers/newsletter.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

router.post("/subscribe", subscribeNewsletter);
router.post("/unsubscribe", unsubscribeNewsletter);
router.get("/subscribers", isAuthenticated, isAdmin, getAllSubscribers);

export default router;
