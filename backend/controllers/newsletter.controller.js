import { Newsletter } from "../models/newsletter.model.js";

// Subscribe to newsletter
export const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Valid email is required"
            });
        }

        // Check if already subscribed
        const existingSubscription = await Newsletter.findOne({ email });
        
        if (existingSubscription) {
            if (existingSubscription.isActive) {
                return res.status(400).json({
                    success: false,
                    message: "You're already subscribed to our newsletter"
                });
            } else {
                // Reactivate subscription
                existingSubscription.isActive = true;
                existingSubscription.subscribedAt = new Date();
                await existingSubscription.save();
                return res.status(200).json({
                    success: true,
                    message: "Welcome back! Your subscription has been reactivated"
                });
            }
        }

        // Create new subscription
        await Newsletter.create({ email });

        res.status(201).json({
            success: true,
            message: "Successfully subscribed to newsletter!"
        });
    } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        res.status(500).json({
            success: false,
            message: "Failed to subscribe"
        });
    }
};

// Unsubscribe from newsletter
export const unsubscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        const subscription = await Newsletter.findOne({ email });
        
        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found"
            });
        }

        subscription.isActive = false;
        await subscription.save();

        res.status(200).json({
            success: true,
            message: "Successfully unsubscribed from newsletter"
        });
    } catch (error) {
        console.error('Error unsubscribing:', error);
        res.status(500).json({
            success: false,
            message: "Failed to unsubscribe"
        });
    }
};

// Get all subscribers (admin only)
export const getAllSubscribers = async (req, res) => {
    try {
        const subscribers = await Newsletter.find({ isActive: true })
            .sort({ subscribedAt: -1 });

        res.status(200).json({
            success: true,
            count: subscribers.length,
            subscribers
        });
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch subscribers"
        });
    }
};
