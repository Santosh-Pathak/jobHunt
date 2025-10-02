import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Users, 
    Briefcase, 
    Building2, 
    FileText, 
    TrendingUp, 
    Eye, 
    MessageSquare,
    Settings,
    BarChart3,
    PieChart,
    Activity,
    Download,
    Filter,
    Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { toast } from 'sonner';
import apiClient from '@/utils/axiosConfig';
import { ADMIN_API_END_POINT } from '@/utils/constant';
import { useSelector } from 'react-redux';
import Navbar from '../shared/Navbar';
import { useTheme } from '../../contexts/ThemeContext';

const AdminDashboard = () => {
    const { user } = useSelector(store => store.auth);
    const { theme } = useTheme();
    const isAdmin = user?.role === 'admin';
    const isRecruiter = user?.role === 'recruiter';
    
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalJobs: 0,
        totalCompanies: 0,
        totalApplications: 0,
        userGrowth: [],
        jobCategories: []
    });
    
    const [users, setUsers] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchDashboardData();
    }, [isAdmin]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
            // Always fetch stats, jobs, companies, and applications (recruiters can access these)
            const promises = [
                apiClient.get(`${ADMIN_API_END_POINT}/stats`),
                apiClient.get(`${ADMIN_API_END_POINT}/jobs`),
                apiClient.get(`${ADMIN_API_END_POINT}/companies`),
                apiClient.get(`${ADMIN_API_END_POINT}/applications`)
            ];
            
            // Only admins can fetch users
            if (isAdmin) {
                promises.push(apiClient.get(`${ADMIN_API_END_POINT}/users`));
            }
            
            const responses = await Promise.all(promises);
            
            setStats(responses[0].data.stats);
            setJobs(responses[1].data.jobs);
            setCompanies(responses[2].data.companies);
            setApplications(responses[3].data.applications);
            
            // Only set users if admin
            if (isAdmin && responses[4]) {
                setUsers(responses[4].data.users);
            }
        } catch (error) {
            toast.error('Failed to fetch dashboard data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserStatusUpdate = async (userId, newStatus) => {
        if (!isAdmin) {
            toast.error('Only admins can manage users');
            return;
        }
        
        try {
            await apiClient.patch(`${ADMIN_API_END_POINT}/users/${userId}/status`, 
                { status: newStatus }
            );
            toast.success('User status updated successfully');
            fetchDashboardData();
        } catch (error) {
            toast.error('Failed to update user status');
        }
    };

    const handleJobStatusUpdate = async (jobId, newStatus) => {
        try {
            await apiClient.patch(`${ADMIN_API_END_POINT}/jobs/${jobId}/status`, 
                { status: newStatus }
            );
            toast.success('Job status updated successfully');
            fetchDashboardData();
        } catch (error) {
            toast.error('Failed to update job status');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!isAdmin) {
            toast.error('Only admins can delete users');
            return;
        }
        
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await apiClient.delete(`${ADMIN_API_END_POINT}/users/${userId}`);
                toast.success('User deleted successfully');
                fetchDashboardData();
            } catch (error) {
                toast.error('Failed to delete user');
            }
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-all duration-300 ${
            theme === 'dark' 
                ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900' 
                : 'bg-gradient-to-br from-white via-blue-50 to-emerald-50'
        }`}>
            <Navbar />
            
            {/* Main content with proper top padding */}
            <div className="pt-16">
                {/* Header */}
                <div className={`shadow-sm border-b transition-all duration-300 ${
                    theme === 'dark' 
                        ? 'bg-slate-800/50 border-slate-700' 
                        : 'bg-white/50 border-slate-200'
                }`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className={`text-3xl font-bold transition-colors duration-300 ${
                                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                    {isAdmin ? 'Admin Dashboard' : 'Recruiter Dashboard'}
                                </h1>
                                <p className={`mt-1 transition-colors duration-300 ${
                                    theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
                                }`}>
                                    {isAdmin ? 'Manage your platform efficiently' : 'Manage your jobs and companies'}
                                </p>
                            </div>
                        <div className="flex items-center space-x-4">
                            <Button variant="outline" className="flex items-center space-x-2">
                                <Download className="h-4 w-4" />
                                <span>Export Data</span>
                            </Button>
                            <Button className="flex items-center space-x-2">
                                <Settings className="h-4 w-4" />
                                <span>Settings</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100">Total Users</p>
                                        <p className="text-3xl font-bold">{stats.totalUsers}</p>
                                    </div>
                                    <Users className="h-8 w-8 text-blue-200" />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-100">Total Jobs</p>
                                        <p className="text-3xl font-bold">{stats.totalJobs}</p>
                                    </div>
                                    <Briefcase className="h-8 w-8 text-green-200" />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-100">Total Companies</p>
                                        <p className="text-3xl font-bold">{stats.totalCompanies}</p>
                                    </div>
                                    <Building2 className="h-8 w-8 text-purple-200" />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-orange-100">Total Applications</p>
                                        <p className="text-3xl font-bold">{stats.totalApplications}</p>
                                    </div>
                                    <FileText className="h-8 w-8 text-orange-200" />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Main Content */}
                <Tabs defaultValue={isAdmin ? "users" : "jobs"} className="space-y-6">
                    <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-4' : 'grid-cols-3'}`}>
                        {isAdmin && <TabsTrigger value="users">Users</TabsTrigger>}
                        <TabsTrigger value="jobs">Jobs</TabsTrigger>
                        <TabsTrigger value="companies">Companies</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>

                    {/* Users Tab - Admin Only */}
                    {isAdmin && (
                        <TabsContent value="users" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>User Management</span>
                                    <div className="flex items-center space-x-4">
                                        <Input
                                            placeholder="Search users..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-64"
                                        />
                                        <Select value={filterRole} onValueChange={setFilterRole}>
                                            <SelectTrigger className="w-32">
                                                <SelectValue placeholder="Role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Roles</SelectItem>
                                                <SelectItem value="student">Student</SelectItem>
                                                <SelectItem value="recruiter">Recruiter</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Joined</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.map((user) => (
                                            <TableRow key={user._id}>
                                                <TableCell className="font-medium">{user.fullName}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                                                        {user.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={user.isVerified ? 'default' : 'secondary'}>
                                                        {user.isVerified ? 'Verified' : 'Unverified'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleUserStatusUpdate(user._id, !user.isVerified)}
                                                        >
                                                            {user.isVerified ? 'Suspend' : 'Activate'}
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleDeleteUser(user._id)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    )}

                    {/* Jobs Tab */}
                    <TabsContent value="jobs" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Job Management</span>
                                    <div className="flex items-center space-x-4">
                                        <Input
                                            placeholder="Search jobs..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-64"
                                        />
                                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                                            <SelectTrigger className="w-32">
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Status</SelectItem>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="paused">Paused</SelectItem>
                                                <SelectItem value="closed">Closed</SelectItem>
                                                <SelectItem value="draft">Draft</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Company</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Applications</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredJobs.map((job) => (
                                            <TableRow key={job._id}>
                                                <TableCell className="font-medium">{job.title}</TableCell>
                                                <TableCell>{job.company?.name}</TableCell>
                                                <TableCell>{job.jobType}</TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        job.status === 'active' ? 'default' :
                                                        job.status === 'paused' ? 'secondary' :
                                                        job.status === 'closed' ? 'destructive' : 'outline'
                                                    }>
                                                        {job.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{job.applicationsCount}</TableCell>
                                                <TableCell>{new Date(job.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleJobStatusUpdate(job._id, 'paused')}
                                                        >
                                                            Pause
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleJobStatusUpdate(job._id, 'closed')}
                                                        >
                                                            Close
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Companies Tab */}
                    <TabsContent value="companies" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Company Management</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Industry</TableHead>
                                            <TableHead>Size</TableHead>
                                            <TableHead>Jobs Posted</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {companies.map((company) => (
                                            <TableRow key={company._id}>
                                                <TableCell className="font-medium">{company.name}</TableCell>
                                                <TableCell>{company.industry}</TableCell>
                                                <TableCell>{company.size}</TableCell>
                                                <TableCell>{company.jobsCount || 0}</TableCell>
                                                <TableCell>
                                                    <Badge variant={company.isActive ? 'default' : 'secondary'}>
                                                        {company.isActive ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Button size="sm" variant="outline">
                                                            View
                                                        </Button>
                                                        <Button size="sm" variant="destructive">
                                                            Suspend
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Analytics Tab */}
                    <TabsContent value="analytics" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <BarChart3 className="h-5 w-5" />
                                        <span>User Growth</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-64 flex items-center justify-center text-gray-500">
                                        Chart will be implemented with Chart.js
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <PieChart className="h-5 w-5" />
                                        <span>Job Categories</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-64 flex items-center justify-center text-gray-500">
                                        Chart will be implemented with Chart.js
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
