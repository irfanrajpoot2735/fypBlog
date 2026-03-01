import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const isAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated.",
                success: false
            });
        }
        
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        if (!decode) {
            return res.status(401).json({
                message: "Invalid token",
                success: false
            });
        }
        
        // Get user and check if admin
        const user = await User.findById(decode.userId);
        if (!user) {
            return res.status(401).json({
                message: "User not found",
                success: false
            });
        }
        
        if (user.role !== 'admin') {
            return res.status(403).json({
                message: "Access denied. Admin only.",
                success: false
            });
        }
        
        req.id = decode.userId;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Authentication error",
            success: false
        });
    }
};

export default isAdmin;
