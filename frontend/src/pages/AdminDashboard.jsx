import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ShieldCheck, FileText, MessageSquare, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsRes, usersRes, adminsRes] = await Promise.all([
                axios.get(`${BACKEND_URL}/v1/admin/stats`, { withCredentials: true }),
                axios.get(`${BACKEND_URL}/v1/admin/users`, { withCredentials: true }),
                axios.get(`${BACKEND_URL}/v1/admin/admins`, { withCredentials: true })
            ]);

            setStats(statsRes.data.stats);
            setUsers(usersRes.data.users);
            setAdmins(adminsRes.data.admins);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            if (error.response?.status === 403) {
                toast.error('Access denied. Admin only.');
            } else {
                toast.error('Failed to load dashboard data');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleMakeAdmin = async (userId) => {
        try {
            const res = await axios.put(
                `${BACKEND_URL}/v1/admin/make-admin/${userId}`,
                {},
                { withCredentials: true }
            );
            
            if (res.data.success) {
                toast.success(res.data.message);
                fetchDashboardData();
            }
        } catch (error) {
            console.error('Error making admin:', error);
            toast.error(error.response?.data?.message || 'Failed to make user admin');
        }
    };

    const handleRemoveAdmin = async (userId) => {
        try {
            const res = await axios.put(
                `${BACKEND_URL}/v1/admin/remove-admin/${userId}`,
                {},
                { withCredentials: true }
            );
            
            if (res.data.success) {
                toast.success(res.data.message);
                fetchDashboardData();
            }
        } catch (error) {
            console.error('Error removing admin:', error);
            toast.error(error.response?.data?.message || 'Failed to remove admin');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            </div>
        );
    }

    return (
        <div className='pt-20 md:ml-[320px] min-h-screen p-4 md:p-8'>
            <div className='max-w-7xl mx-auto'>
                {/* Stats Cards */}
                <div className='pt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
                            <ShieldCheck className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalAdmins || 0}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
                            <FileText className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalBlogs || 0}</div>
                            <p className="text-xs text-gray-500 mt-1">
                                {stats?.totalPublishedBlogs || 0} published
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
                            <MessageSquare className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalComments || 0}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <div className='mb-6 flex gap-4 border-b'>
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`pb-2 px-4 ${activeTab === 'overview' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-500'}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`pb-2 px-4 ${activeTab === 'users' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-500'}`}
                    >
                        All Users
                    </button>
                    <button
                        onClick={() => setActiveTab('admins')}
                        className={`pb-2 px-4 ${activeTab === 'admins' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-500'}`}
                    >
                        Admins
                    </button>
                </div>

                {/* Content based on active tab */}
                {activeTab === 'overview' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Joined</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stats?.recentUsers?.map((user) => (
                                        <TableRow key={user._id}>
                                            <TableCell>{user.firstName} {user.lastName}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                                    {user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {activeTab === 'users' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>All Users ({users.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Blogs</TableHead>
                                            <TableHead>Published</TableHead>
                                            <TableHead>Comments</TableHead>
                                            <TableHead>Badges</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((user) => (
                                            <TableRow key={user._id}>
                                                <TableCell>{user.firstName} {user.lastName}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                                        {user.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{user.blogCount || 0}</TableCell>
                                                <TableCell>{user.publishedBlogCount || 0}</TableCell>
                                                <TableCell>{user.commentCount || 0}</TableCell>
                                                <TableCell>{user.badges?.length || 0}</TableCell>
                                                <TableCell>
                                                    {user.role === 'admin' ? (
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleRemoveAdmin(user._id)}
                                                        >
                                                            Remove Admin
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleMakeAdmin(user._id)}
                                                        >
                                                            Make Admin
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeTab === 'admins' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Admin Users ({admins.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Joined</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {admins.map((admin) => (
                                        <TableRow key={admin._id}>
                                            <TableCell>{admin.firstName} {admin.lastName}</TableCell>
                                            <TableCell>{admin.email}</TableCell>
                                            <TableCell>{new Date(admin.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleRemoveAdmin(admin._id)}
                                                >
                                                    Remove Admin
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
