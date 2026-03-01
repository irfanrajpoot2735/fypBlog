import React from 'react';
import SystemInitializer from '@/components/SystemInitializer';
import { useSelector } from 'react-redux';
import { ShieldCheck } from 'lucide-react';

const Setup = () => {
    const { user } = useSelector(store => store.auth);

    // Check if user is admin
    if (!user || user.role !== 'admin') {
        return (
            <div className='pt-20 min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
                <div className='max-w-md text-center'>
                    <ShieldCheck className='w-16 h-16 mx-auto mb-4 text-gray-400' />
                    <h1 className='text-3xl font-bold mb-4'>Admin Access Required</h1>
                    <p className='text-gray-600 dark:text-gray-400'>
                        This page is only accessible to administrators.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='pt-20 min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900'>
            <div className='max-w-4xl mx-auto'>
                <h1 className='text-4xl font-bold mb-4 text-center'>System Setup</h1>
                <p className='text-center text-gray-600 dark:text-gray-400 mb-8'>
                    Welcome! Please initialize the system before using the new features.
                </p>
                
                <SystemInitializer />

                <div className='mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow'>
                    <h2 className='text-2xl font-bold mb-4'>New Features Overview</h2>
                    
                    <div className='space-y-4'>
                        <div>
                            <h3 className='text-xl font-semibold mb-2'>📝 Blog Summaries</h3>
                            <p className='text-gray-600 dark:text-gray-400'>
                                Automatically generated summaries for all blog posts. Summaries appear in blog cards and search results.
                            </p>
                        </div>

                        <div>
                            <h3 className='text-xl font-semibold mb-2'>🏆 Author Badges</h3>
                            <p className='text-gray-600 dark:text-gray-400'>
                                Earn badges for achievements like First Post, Trending Author, Consistent Writer, and more!
                            </p>
                        </div>

                        <div>
                            <h3 className='text-xl font-semibold mb-2'>🎯 Milestones</h3>
                            <p className='text-gray-600 dark:text-gray-400'>
                                Track your progress with milestones for blogs published, total views, comments received, and more!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Setup;
