import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Award, TrendingUp, Flame, PenTool, FileText, Star, Sparkles, Brain } from 'lucide-react';

const BadgeDisplay = ({ badge, isAwarded = false, progress = 0 }) => {
    // Map badge types to icons
    const getIcon = (type) => {
        const iconMap = {
            'FIRST_POST': Award,
            'TRENDING_AUTHOR': TrendingUp,
            'VIRAL_CREATOR': Flame,
            'CONSISTENT_WRITER': PenTool,
            'DEDICATED_WRITER': FileText,
            'TOP_RATED': Star,
            'HIGHLY_ACCLAIMED': Sparkles,
            'EXPERT_CONTRIBUTOR': Brain
        };
        const IconComponent = iconMap[type] || Award;
        return <IconComponent className="h-8 w-8" />;
    };

    // Generate readable criteria text
    const getCriteriaText = (criteria) => {
        if (!criteria) return null;
        
        if (criteria.blogsPublished) {
            return `Publish ${criteria.blogsPublished} blog post${criteria.blogsPublished > 1 ? 's' : ''}`;
        }
        if (criteria.viewThreshold) {
            return `Get ${criteria.viewThreshold.toLocaleString()} views on a single post`;
        }
        if (criteria.streakWeeks) {
            return `Maintain a ${criteria.streakWeeks}-week posting streak`;
        }
        if (criteria.totalLikes) {
            return `Receive ${criteria.totalLikes} total likes across all posts`;
        }
        if (criteria.categoryPosts) {
            return `Publish ${criteria.categoryPosts} posts in a specific category`;
        }
        return null;
    };

    return (
        <Card className={`${isAwarded ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20' : 'opacity-60'} transition-all hover:scale-105`}>
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    <div className="text-yellow-600 dark:text-yellow-400">{getIcon(badge.type)}</div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-sm">{badge.name}</h3>
                            {isAwarded && (
                                <Badge variant="secondary" className="text-xs">
                                    ✓ Earned
                                </Badge>
                            )}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            {badge.description}
                        </p>
                        
                        {!isAwarded && progress > 0 && (
                            <div className="mt-2">
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                    <div
                                        className="bg-blue-600 h-1.5 rounded-full transition-all"
                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{Math.round(progress)}% complete</p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default BadgeDisplay;
