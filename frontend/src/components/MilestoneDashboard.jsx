import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import MilestoneCard from './MilestoneCard';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const MilestoneDashboard = ({ userId }) => {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMilestones();
    }, [userId]);

    const fetchMilestones = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                userId 
                    ? `${BACKEND_URL}/v1/milestone/dashboard/${userId}`
                    : `${BACKEND_URL}/v1/milestone/my-dashboard`,
                { withCredentials: true }
            );
            
            setDashboard(response.data.dashboard);
        } catch (error) {
            console.error('Error fetching milestones:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!dashboard) {
        return <div>Failed to load milestones</div>;
    }

    const milestoneCategories = [
        { key: 'BLOGS_PUBLISHED', label: 'Blogs Published', icon: '📌' },
        { key: 'TOTAL_VIEWS', label: 'Total Views', icon: '👁️' },
        { key: 'COMMENTS_RECEIVED', label: 'Comments', icon: '💬' },
        { key: 'ACTIVE_MONTHS', label: 'Active Time', icon: '📅' },
        { key: 'GLOBAL_REACH', label: 'Global Reach', icon: '🌍' }
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    🎯 Milestones & Progress
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="BLOGS_PUBLISHED" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                        {milestoneCategories.map(cat => (
                            <TabsTrigger key={cat.key} value={cat.key} className="text-xs">
                                {cat.icon}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    
                    {milestoneCategories.map(cat => (
                        <TabsContent key={cat.key} value={cat.key} className="mt-4">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold">{cat.label}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Track your progress in {cat.label.toLowerCase()} category
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {dashboard[cat.key]?.map((milestone, idx) => (
                                    <MilestoneCard
                                        key={idx}
                                        milestone={{
                                            name: milestone.name,
                                            emoji: milestone.emoji,
                                            description: milestone.description,
                                            targetValue: milestone.targetValue,
                                            type: cat.key
                                        }}
                                        currentValue={milestone.currentValue}
                                        isCompleted={milestone.isCompleted}
                                        completedAt={milestone.completedAt}
                                    />
                                ))}
                                
                                {dashboard[cat.key]?.length === 0 && (
                                    <p className="text-gray-500 col-span-2 text-center py-8">
                                        No milestones in this category yet
                                    </p>
                                )}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default MilestoneDashboard;
