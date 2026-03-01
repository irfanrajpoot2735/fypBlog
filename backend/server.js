import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import blogRoute from "./routes/blog.route.js";
import commentRoute from "./routes/comment.route.js";
import badgeRoute from "./routes/badge.route.js";
import milestoneRoute from "./routes/milestone.route.js";
import adminRoute from "./routes/admin.route.js";
import categoryRoute from "./routes/category.route.js";
import newsletterRoute from "./routes/newsletter.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ---------- Middleware ---------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

/* ---------- Routes ---------- */
app.use("/api/v1/user", userRoute);
app.use("/api/v1/blog", blogRoute);
app.use("/api/v1/comment", commentRoute);
app.use("/api/v1/badge", badgeRoute);
app.use("/api/v1/milestone", milestoneRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/newsletter", newsletterRoute);

/* ---------- Health Check ---------- */
app.get("/", (_, res) => {
  res.send("API is running");
});

/* ---------- Start Server AFTER DB ---------- */
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });
