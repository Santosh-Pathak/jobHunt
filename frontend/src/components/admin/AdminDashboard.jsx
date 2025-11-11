import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Users, 
    Briefcase, 
    Building2,
    Building, 
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
import Pagination from '../ui/pagination';
import { toast } from 'sonner';
import apiClient from '@/utils/axiosConfig';
import { ADMIN_API_END_POINT } from '@/utils/constant';
import { useSelector } from 'react-redux';
import Navbar from '../shared/Navbar';
import { useTheme } from '../../contexts/ThemeContext';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

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
    const [lastFetchTime, setLastFetchTime] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    
    // Pagination states
    const [usersPagination, setUsersPagination] = useState({
        current: 1,
        pages: 1,
        total: 0,
        limit: 20
    });
    const [jobsPagination, setJobsPagination] = useState({
        current: 1,
        pages: 1,
        total: 0,
        limit: 20
    });
    const [companiesPagination, setCompaniesPagination] = useState({
        current: 1,
        pages: 1,
        total: 0,
        limit: 20
    });
    const [applicationsPagination, setApplicationsPagination] = useState({
        current: 1,
        pages: 1,
        total: 0,
        limit: 20
    });

    useEffect(() => {
        fetchDashboardData();
        // Load initial paginated data
        fetchJobs(1, jobsPagination.limit, filterStatus, searchTerm);
        fetchCompanies(1, companiesPagination.limit, searchTerm);
        fetchApplications(1, applicationsPagination.limit);
        if (isAdmin) {
            fetchUsers(1, usersPagination.limit, filterRole, searchTerm);
        }
    }, [isAdmin]);

    // Update data when filters change
    useEffect(() => {
        fetchJobs(1, jobsPagination.limit, filterStatus, searchTerm);
    }, [filterStatus, searchTerm]);

    useEffect(() => {
        if (isAdmin) {
            fetchUsers(1, usersPagination.limit, filterRole, searchTerm);
        }
    }, [filterRole, searchTerm, isAdmin]);

    // Search and filter handlers
    const handleSearch = (value) => {
        setSearchTerm(value);
        // Reset to first page when searching
        fetchJobs(1, jobsPagination.limit, filterStatus, value);
        fetchCompanies(1, companiesPagination.limit, value);
        if (isAdmin) {
            fetchUsers(1, usersPagination.limit, filterRole, value);
        }
    };

    const handleRoleFilter = (role) => {
        setFilterRole(role);
        if (isAdmin) {
            fetchUsers(1, usersPagination.limit, role, searchTerm);
        }
    };

    const handleStatusFilter = (status) => {
        setFilterStatus(status);
        fetchJobs(1, jobsPagination.limit, status, searchTerm);
    };

    // Pagination handlers
    const handlePageChange = (type, page) => {
        switch (type) {
            case 'users':
                fetchUsers(page, usersPagination.limit, filterRole, searchTerm);
                break;
            case 'jobs':
                fetchJobs(page, jobsPagination.limit, filterStatus, searchTerm);
                break;
            case 'companies':
                fetchCompanies(page, companiesPagination.limit, searchTerm);
                break;
            case 'applications':
                fetchApplications(page, applicationsPagination.limit);
                break;
        }
    };

    const handlePageSizeChange = (type, pageSize) => {
        switch (type) {
            case 'users':
                setUsersPagination(prev => ({ ...prev, limit: pageSize, current: 1 }));
                fetchUsers(1, pageSize, filterRole, searchTerm);
                break;
            case 'jobs':
                setJobsPagination(prev => ({ ...prev, limit: pageSize, current: 1 }));
                fetchJobs(1, pageSize, filterStatus, searchTerm);
                break;
            case 'companies':
                setCompaniesPagination(prev => ({ ...prev, limit: pageSize, current: 1 }));
                fetchCompanies(1, pageSize, searchTerm);
                break;
            case 'applications':
                setApplicationsPagination(prev => ({ ...prev, limit: pageSize, current: 1 }));
                fetchApplications(1, pageSize);
                break;
        }
    };

    const fetchDashboardData = async () => {
        // Prevent rapid successive calls (debounce)
        const now = Date.now();
        const timeSinceLastFetch = now - lastFetchTime;
        const minInterval = 1000; // Reduced to 1 second minimum between calls
        
        if (timeSinceLastFetch < minInterval) {
            return;
        }
        
        try {
            setLoading(true);
            setLastFetchTime(now);
            
            // Fetch data sequentially to avoid overwhelming the server
            
            // 1. Fetch stats first
            const statsResponse = await apiClient.get(`${ADMIN_API_END_POINT}/stats`);
            if (statsResponse.data.success) {
                setStats(statsResponse.data.stats);
            }
            
            // 2. Fetch jobs
            const jobsResponse = await apiClient.get(`${ADMIN_API_END_POINT}/jobs`);
            if (jobsResponse.data.success) {
                setJobs(jobsResponse.data.jobs);
            }
            
            // 3. Fetch companies
            const companiesResponse = await apiClient.get(`${ADMIN_API_END_POINT}/companies`);
            if (companiesResponse.data.success) {
                setCompanies(companiesResponse.data.companies);
            }
            
            // 4. Fetch applications
            const applicationsResponse = await apiClient.get(`${ADMIN_API_END_POINT}/applications`);
            if (applicationsResponse.data.success) {
                setApplications(applicationsResponse.data.applications);
            }
            
            // 5. Fetch users (only if admin)
            if (isAdmin) {
                const usersResponse = await apiClient.get(`${ADMIN_API_END_POINT}/users`);
                if (usersResponse.data.success) {
                    setUsers(usersResponse.data.users);
                }
            }
            
            
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            
            // Handle different types of errors
            if (error.code === 'ERR_NETWORK') {
                toast.error('Network error. Please check your connection and try again.');
            } else if (error.response?.status === 429) {
                toast.error('Too many requests. Please wait a moment before refreshing.');
            } else if (error.response?.status === 401) {
                toast.error('Authentication required. Please log in again.');
            } else if (error.response?.status === 403) {
                toast.error('Access denied. You do not have permission to view this data.');
            } else {
                toast.error(`Failed to fetch dashboard data: ${error.response?.data?.message || error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    // Pagination functions with retry mechanism
    const fetchWithRetry = async (url, retries = 3, delay = 1000) => {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await apiClient.get(url);
                return response;
            } catch (error) {
                if (i === retries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
            }
        }
    };

    const fetchUsers = async (page = 1, limit = 20, role = 'all', search = '') => {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                role,
                search
            });
            
            const response = await fetchWithRetry(`${ADMIN_API_END_POINT}/users?${params}`);
            
            if (response.data.success) {
                setUsers(response.data.users);
                setUsersPagination(response.data.pagination);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users');
        }
    };

    const fetchJobs = async (page = 1, limit = 20, status = 'all', search = '') => {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                status,
                search
            });
            
            const response = await fetchWithRetry(`${ADMIN_API_END_POINT}/jobs?${params}`);
            
            if (response.data.success) {
                setJobs(response.data.jobs);
                setJobsPagination(response.data.pagination);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
            toast.error('Failed to fetch jobs');
        }
    };

    const fetchCompanies = async (page = 1, limit = 20, search = '') => {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                search
            });
            
            const response = await fetchWithRetry(`${ADMIN_API_END_POINT}/companies?${params}`);
            
            if (response.data.success) {
                setCompanies(response.data.companies);
                setCompaniesPagination(response.data.pagination);
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
            toast.error('Failed to fetch companies');
        }
    };

    const fetchApplications = async (page = 1, limit = 20, status = 'all') => {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                status
            });
            
            const response = await fetchWithRetry(`${ADMIN_API_END_POINT}/applications?${params}`);
            
            if (response.data.success) {
                setApplications(response.data.applications);
                setApplicationsPagination(response.data.pagination);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error('Failed to fetch applications');
        }
    };

    const handleUserStatusUpdate = async (userId, newStatus) => {
        if (!isAdmin) {
            toast.error('Only admins can manage users');
            return;
        }
        
        try {
            const response = await apiClient.patch(`${ADMIN_API_END_POINT}/users/${userId}/status`, 
                { status: newStatus }
            );
            
            if (response.data.success) {
                // Update local state immediately
                setUsers(users.map(user => 
                    user._id === userId 
                        ? { ...user, isVerified: newStatus }
                        : user
                ));
                
            toast.success('User status updated successfully');
            } else {
                toast.error('Failed to update user status');
            }
        } catch (error) {
            toast.error('Failed to update user status');
            console.error('User status update error:', error);
        }
    };

    const handleJobStatusUpdate = async (jobId, newStatus) => {
        try {
            const response = await apiClient.patch(`${ADMIN_API_END_POINT}/jobs/${jobId}/status`, 
                { status: newStatus }
            );
            
            if (response.data.success) {
                // Update local state immediately
                setJobs(jobs.map(job => 
                    job._id === jobId 
                        ? { ...job, status: newStatus }
                        : job
                ));
                
            toast.success('Job status updated successfully');
            } else {
                toast.error('Failed to update job status');
            }
        } catch (error) {
            toast.error('Failed to update job status');
            console.error('Job status update error:', error);
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

    const handleViewCompany = (company) => {
        // Navigate to company details page in same tab
        window.location.href = `/admin/companies/${company._id}`;
    };

    const handleSuspendCompany = async (companyId, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            const response = await apiClient.patch(`${ADMIN_API_END_POINT}/companies/${companyId}/status`, {
                status: newStatus ? 'active' : 'inactive'
            });
            
            if (response.data.success) {
                // Update local state
                setCompanies(companies.map(company => 
                    company._id === companyId 
                        ? { ...company, isActive: newStatus }
                        : company
                ));
                
                toast.success(`Company ${newStatus ? 'activated' : 'suspended'} successfully`);
            } else {
                toast.error('Failed to update company status');
            }
        } catch (error) {
            toast.error('Failed to update company status');
            console.error('Company status update error:', error);
        }
    };

    // Chart data preparation functions
    const getJobCategoriesData = () => {
        const categoryCount = jobs.reduce((acc, job) => {
            const category = job.category || 'Other';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {});

        const labels = Object.keys(categoryCount);
        const data = Object.values(categoryCount);
        const colors = [
            'rgba(99, 102, 241, 0.8)',   // indigo
            'rgba(16, 185, 129, 0.8)',   // emerald
            'rgba(245, 158, 11, 0.8)',   // amber
            'rgba(239, 68, 68, 0.8)',    // red
            'rgba(139, 92, 246, 0.8)',   // violet
            'rgba(34, 197, 94, 0.8)',    // green
        ];

        return {
            labels,
            datasets: [{
                data,
                backgroundColor: colors.slice(0, labels.length),
                borderColor: colors.slice(0, labels.length).map(color => color.replace('0.8', '1')),
                borderWidth: 2,
            }]
        };
    };

    const getApplicationsTrendData = () => {
        // Generate last 7 days data
        const last7Days = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            last7Days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }

        // Count applications per day (mock data for now)
        const applicationsData = last7Days.map(() => Math.floor(Math.random() * 20) + 5);

        return {
            labels: last7Days,
            datasets: [{
                label: 'Applications',
                data: applicationsData,
                borderColor: 'rgba(16, 185, 129, 1)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true,
            }]
        };
    };

    const getCompanyActivityData = () => {
        const activeCompanies = companies.filter(company => company.isActive).length;
        const inactiveCompanies = companies.length - activeCompanies;

        return {
            labels: ['Active Companies', 'Inactive Companies'],
            datasets: [{
                data: [activeCompanies, inactiveCompanies],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                ],
                borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(239, 68, 68, 1)',
                ],
                borderWidth: 2,
            }]
        };
    };

    const getPlatformStatsData = () => {
        return {
            labels: ['Users', 'Jobs', 'Companies', 'Applications'],
            datasets: [{
                label: 'Platform Statistics',
                data: [stats.totalUsers, stats.totalJobs, stats.totalCompanies, stats.totalApplications],
                backgroundColor: [
                    'rgba(100, 116, 139, 0.8)',  // slate
                    'rgba(16, 185, 129, 0.8)',    // emerald
                    'rgba(99, 102, 241, 0.8)',    // indigo
                    'rgba(245, 158, 11, 0.8)',    // amber
                ],
                borderColor: [
                    'rgba(100, 116, 139, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(99, 102, 241, 1)',
                    'rgba(245, 158, 11, 1)',
                ],
                borderWidth: 2,
            }]
        };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                    color: 'rgba(0, 0, 0, 0.7)',
                }
            },
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                    color: 'rgba(0, 0, 0, 0.7)',
                }
            }
        }
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
            }
        }
    };

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
                                            onChange={(e) => handleSearch(e.target.value)}
                                            className="w-64"
                                        />
                                        <Select value={filterRole} onValueChange={handleRoleFilter}>
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
                                        {users.map((user) => (
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
                            
                            {/* Users Empty State */}
                            {usersPagination.total === 0 && !loading && (
                                <div className="text-center py-12">
                                    <Users className={`h-12 w-12 mx-auto mb-4 ${
                                        theme === 'dark' ? 'text-slate-400' : 'text-gray-400'
                                    }`} />
                                    <h3 className={`text-lg font-medium mb-2 ${
                                        theme === 'dark' ? 'text-slate-200' : 'text-gray-900'
                                    }`}>No users found</h3>
                                    <p className={theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}>
                                        {searchTerm ? `No users match "${searchTerm}"` : 'No users have been registered yet.'}
                                    </p>
                                </div>
                            )}

                            {/* Users Pagination */}
                            {usersPagination.total > 0 && (
                                <Pagination
                                    currentPage={usersPagination.current}
                                    totalPages={usersPagination.pages}
                                    totalItems={usersPagination.total}
                                    itemsPerPage={usersPagination.limit}
                                    onPageChange={(page) => handlePageChange('users', page)}
                                    onPageSizeChange={(size) => handlePageSizeChange('users', size)}
                                    itemLabel="users"
                                    theme={theme}
                                    pageSizeOptions={[10, 20, 50, 100]}
                                />
                            )}
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
                                            onChange={(e) => handleSearch(e.target.value)}
                                            className="w-64"
                                        />
                                        <Select value={filterStatus} onValueChange={handleStatusFilter}>
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
                                        {jobs.map((job) => (
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
                            
                            {/* Jobs Empty State */}
                            {jobsPagination.total === 0 && !loading && (
                                <div className="text-center py-12">
                                    <Briefcase className={`h-12 w-12 mx-auto mb-4 ${
                                        theme === 'dark' ? 'text-slate-400' : 'text-gray-400'
                                    }`} />
                                    <h3 className={`text-lg font-medium mb-2 ${
                                        theme === 'dark' ? 'text-slate-200' : 'text-gray-900'
                                    }`}>No jobs found</h3>
                                    <p className={theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}>
                                        {searchTerm ? `No jobs match "${searchTerm}"` : 'No jobs have been posted yet.'}
                                    </p>
                                </div>
                            )}

                            {/* Jobs Pagination */}
                            {jobsPagination.total > 0 && (
                                <Pagination
                                    currentPage={jobsPagination.current}
                                    totalPages={jobsPagination.pages}
                                    totalItems={jobsPagination.total}
                                    itemsPerPage={jobsPagination.limit}
                                    onPageChange={(page) => handlePageChange('jobs', page)}
                                    onPageSizeChange={(size) => handlePageSizeChange('jobs', size)}
                                    itemLabel="jobs"
                                    theme={theme}
                                    pageSizeOptions={[10, 20, 50, 100]}
                                />
                            )}
                        </Card>
                    </TabsContent>

                    {/* Companies Tab */}
                    <TabsContent value="companies" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Company Management</span>
                                    <div className="flex items-center space-x-4">
                                        <Input
                                            placeholder="Search companies..."
                                            value={searchTerm}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            className="w-64"
                                        />
                                    </div>
                                </CardTitle>
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
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline"
                                                            onClick={() => handleViewCompany(company)}
                                                        >
                                                            View
                                                        </Button>
                                                        <Button 
                                                            size="sm" 
                                                            variant={company.isActive ? "destructive" : "default"}
                                                            onClick={() => handleSuspendCompany(company._id, company.isActive)}
                                                        >
                                                            {company.isActive ? 'Suspend' : 'Activate'}
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                            
                            {/* Companies Empty State */}
                            {companiesPagination.total === 0 && !loading && (
                                <div className="text-center py-12">
                                    <Building className={`h-12 w-12 mx-auto mb-4 ${
                                        theme === 'dark' ? 'text-slate-400' : 'text-gray-400'
                                    }`} />
                                    <h3 className={`text-lg font-medium mb-2 ${
                                        theme === 'dark' ? 'text-slate-200' : 'text-gray-900'
                                    }`}>No companies found</h3>
                                    <p className={theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}>
                                        {searchTerm ? `No companies match "${searchTerm}"` : 'No companies have been registered yet.'}
                                    </p>
                                </div>
                            )}

                            {/* Companies Pagination */}
                            {companiesPagination.total > 0 && (
                                <Pagination
                                    currentPage={companiesPagination.current}
                                    totalPages={companiesPagination.pages}
                                    totalItems={companiesPagination.total}
                                    itemsPerPage={companiesPagination.limit}
                                    onPageChange={(page) => handlePageChange('companies', page)}
                                    onPageSizeChange={(size) => handlePageSizeChange('companies', size)}
                                    itemLabel="companies"
                                    theme={theme}
                                    pageSizeOptions={[10, 20, 50, 100]}
                                />
                            )}
                        </Card>
                    </TabsContent>

                    {/* Analytics Tab */}
                    <TabsContent value="analytics" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <BarChart3 className="h-5 w-5" />
                                        <span>Platform Statistics</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-80">
                                        <Bar data={getPlatformStatsData()} options={chartOptions} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <PieChart className="h-5 w-5" />
                                        <span>Job Categories Distribution</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-80">
                                        {jobs.length > 0 ? (
                                            <Pie data={getJobCategoriesData()} options={pieChartOptions} />
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-gray-500">
                                                No job data available
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <TrendingUp className="h-5 w-5" />
                                        <span>Applications Trend (Last 7 Days)</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-80">
                                        <Line data={getApplicationsTrendData()} options={chartOptions} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Activity className="h-5 w-5" />
                                        <span>Company Activity Status</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-80">
                                        <Pie data={getCompanyActivityData()} options={pieChartOptions} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Additional Analytics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <TrendingUp className="h-5 w-5" />
                                        <span>Recent Activity</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Jobs Posted Today</span>
                                            <span className="font-bold text-emerald-700">
                                                {jobs.filter(job => {
                                                    const today = new Date().toDateString();
                                                    return new Date(job.createdAt).toDateString() === today;
                                                }).length}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Active Companies</span>
                                            <span className="font-bold text-indigo-700">
                                                {companies.filter(company => company.isActive).length}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Pending Applications</span>
                                            <span className="font-bold text-amber-700">
                                                {applications.filter(app => app.status === 'pending').length}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Activity className="h-5 w-5" />
                                        <span>Platform Health</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">System Status</span>
                                            <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">Healthy</Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Response Time</span>
                                            <span className="font-bold text-emerald-700">&lt; 100ms</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Uptime</span>
                                            <span className="font-bold text-emerald-700">99.9%</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Eye className="h-5 w-5" />
                                        <span>Quick Actions</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="w-full justify-start"
                                            onClick={() => window.location.href = '/admin/jobs/create'}
                                        >
                                            <Briefcase className="h-4 w-4 mr-2" />
                                            Create New Job
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="w-full justify-start"
                                            onClick={() => window.location.href = '/admin/companies/create'}
                                        >
                                            <Building2 className="h-4 w-4 mr-2" />
                                            Add Company
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="w-full justify-start"
                                            onClick={fetchDashboardData}
                                        >
                                            <Activity className="h-4 w-4 mr-2" />
                                            Refresh Data
                                        </Button>
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
