import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Run this once to initialize badges and milestones
export const initializeSystem = async () => {
    try {
        console.log('Initializing badges...');
        const badgeRes = await axios.post(`${BACKEND_URL}/badge/initialize`);
        console.log('Badges initialized:', badgeRes.data);

        console.log('Initializing milestones...');
        const milestoneRes = await axios.post(`${BACKEND_URL}/milestone/initialize`);
        console.log('Milestones initialized:', milestoneRes.data);

        return {
            success: true,
            message: 'System initialized successfully'
        };
    } catch (error) {
        console.error('Error initializing system:', error);
        return {
            success: false,
            message: 'Failed to initialize system'
        };
    }
};
