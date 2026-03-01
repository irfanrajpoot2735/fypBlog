import React from 'react';
import { Card, CardContent } from './ui/card';
import { CheckCircle2, FileText, Eye, MessageCircle, Calendar, Globe } from 'lucide-react';

const MilestoneCard = ({ milestone, currentValue, isCompleted, completedAt }) => {
    const progress = Math.min((currentValue / milestone.targetValue) * 100, 100);

    // Map milestone types to icons
    const getIcon = (type) => {
        const iconMap = {
            'BLOGS_PUBLISHED': FileText,
            'TOTAL_VIEWS': Eye,
            'COMMENTS_RECEIVED': MessageCircle,
            'ACTIVE_MONTHS': Calendar,
            'GLOBAL_REACH': Globe
        };
        const IconComponent = iconMap[type] || FileText;
        return <IconComponent className="h-8 w-8" />;
    };

    // Generate instructions for achieving the milestone
    const getAchievementInstructions = (type, targetValue) => {
        const instructions = {
            'BLOGS_PUBLISHED': `Write and publish ${targetValue} blog posts`,
            'TOTAL_VIEWS': `Accumulate ${targetValue.toLocaleString()} total views across all your posts`,
            'COMMENTS_RECEIVED': `Get ${targetValue} comments on your blog posts`,
            'ACTIVE_MONTHS': `Stay active for ${targetValue} month${targetValue > 1 ? 's' : ''} by posting regularly`,
            'GLOBAL_REACH': `Reach ${targetValue} unique readers across your blog posts`
        };
        return instructions[type] || 'Complete the specified task';
    };

    return (
        <Card className={`${isCompleted ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : ''} transition-all`}>
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    <div className={`${isCompleted ? 'text-green-600' : 'text-blue-600 dark:text-blue-400'}`}>
                        {getIcon(milestone.type)}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-sm">{milestone.name}</h3>
                            {isCompleted && (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                            )}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            {milestone.description}
                        </p>
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-600 dark:text-gray-400">
                                    {currentValue} / {milestone.targetValue}
                                </span>
                                <span className="font-semibold">{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                    className={`${isCompleted ? 'bg-green-600' : 'bg-blue-600'} h-2 rounded-full transition-all`}
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>

                        {isCompleted && completedAt && (
                            <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                                Completed on {new Date(completedAt).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default MilestoneCard;
