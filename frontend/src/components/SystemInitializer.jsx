import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const SystemInitializer = () => {
    const [loading, setLoading] = useState(false);
    const [badgesStatus, setBadgesStatus] = useState(null);
    const [milestonesStatus, setMilestonesStatus] = useState(null);

    const initializeBadges = async () => {
        try {
            setLoading(true);
            const res = await axios.post(`${BACKEND_URL}/v1/badge/initialize`);
            if (res.data.success) {
                setBadgesStatus('success');
                toast.success('Badges initialized successfully!');
            }
        } catch (error) {
            setBadgesStatus('error');
            toast.error('Failed to initialize badges');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const initializeMilestones = async () => {
        try {
            setLoading(true);
            const res = await axios.post(`${BACKEND_URL}/v1/milestone/initialize`);
            if (res.data.success) {
                setMilestonesStatus('success');
                toast.success('Milestones initialized successfully!');
            }
        } catch (error) {
            setMilestonesStatus('error');
            toast.error('Failed to initialize milestones');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const initializeAll = async () => {
        await initializeBadges();
        await initializeMilestones();
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>System Initialization</CardTitle>
                <CardDescription>
                    Run this once to initialize the badges and milestones system.
                    This will create default badges and milestones in the database.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                        <span className="font-semibold">Badges System</span>
                        {badgesStatus === 'success' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                        {badgesStatus === 'error' && <XCircle className="h-5 w-5 text-red-600" />}
                    </div>
                    <Button 
                        onClick={initializeBadges} 
                        disabled={loading || badgesStatus === 'success'}
                        size="sm"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Initialize'}
                    </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                        <span className="font-semibold">Milestones System</span>
                        {milestonesStatus === 'success' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                        {milestonesStatus === 'error' && <XCircle className="h-5 w-5 text-red-600" />}
                    </div>
                    <Button 
                        onClick={initializeMilestones} 
                        disabled={loading || milestonesStatus === 'success'}
                        size="sm"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Initialize'}
                    </Button>
                </div>

                <div className="pt-4 border-t">
                    <Button 
                        onClick={initializeAll} 
                        disabled={loading || (badgesStatus === 'success' && milestonesStatus === 'success')}
                        className="w-full"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Initializing...
                            </>
                        ) : (
                            'Initialize All'
                        )}
                    </Button>
                </div>

                {badgesStatus === 'success' && milestonesStatus === 'success' && (
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <p className="text-sm text-green-800 dark:text-green-200">
                            ✅ System initialized successfully! The badges and milestones system is now ready to use.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default SystemInitializer;
