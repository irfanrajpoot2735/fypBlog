import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import BadgeDisplay from './BadgeDisplay';
import { Loader2 } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const BadgeShowcase = ({ userId }) => {
    const [badges, setBadges] = useState([]);
    const [allBadges, setAllBadges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBadges();
    }, [userId]);

    const fetchBadges = async () => {
        try {
            setLoading(true);
            // Fetch user's badges
            const userBadgesRes = await axios.get(
                userId 
                    ? `${BACKEND_URL}/v1/badge/user/${userId}`
                    : `${BACKEND_URL}/v1/badge/my-badges`,
                { withCredentials: true }
            );
            
            // Fetch all available badges
            const allBadgesRes = await axios.get(`${BACKEND_URL}/v1/badge/all`);
            
            setBadges(userBadgesRes.data.badges || []);
            setAllBadges(allBadgesRes.data.badges || []);
        } catch (error) {
            console.error('Error fetching badges:', error);
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

    const awardedBadgeIds = badges.map(b => b.badgeId._id);

    return (
        <Card className="mt-20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    🏆 Badges & Achievements
                    <span className="text-sm text-gray-500 font-normal">
                        ({badges.length}/{allBadges.length} earned)
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {/* Earned badges first */}
                    {badges.map((userBadge) => (
                        <BadgeDisplay
                            key={userBadge._id}
                            badge={userBadge.badgeId}
                            isAwarded={true}
                        />
                    ))}
                    
                    {/* Unearned badges */}
                    {allBadges
                        .filter(badge => !awardedBadgeIds.includes(badge._id))
                        .map((badge) => (
                            <BadgeDisplay
                                key={badge._id}
                                badge={badge}
                                isAwarded={false}
                            />
                        ))}
                </div>
                
                {badges.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                        No badges earned yet. Keep creating great content!
                    </p>
                )}
            </CardContent>
        </Card>
    );
};

export default BadgeShowcase;
