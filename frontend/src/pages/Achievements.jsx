import React from 'react';
import BadgeShowcase from '@/components/BadgeShowcase';
import MilestoneDashboard from '@/components/MilestoneDashboard';
import { useSelector } from 'react-redux';

const AchievementsPage = () => {
    const { user } = useSelector(store => store.auth);

    return (
        <div className='pt-20 md:ml-[320px] min-h-screen p-4 md:p-8'>
            <div className='max-w-7xl mx-auto'>
                <div className='space-y-8'>
                    <BadgeShowcase userId={user?._id} />
                    <MilestoneDashboard userId={user?._id} />
                </div>
            </div>
        </div>
    );
};

export default AchievementsPage;
