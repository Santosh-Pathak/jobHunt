import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    TrendingUp, 
    Eye, 
    Send, 
    Calendar, 
    Target, 
    Award, 
    Users, 
    Briefcase,
    BarChart3,
    PieChart,
    Activity,
    Download,
    Filter,
    Search,
    Star,
    MapPin,
    Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { useTheme } from '../../contexts/ThemeContext';
import { useSelector } from 'react-redux';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const JobSeekerDashboard = () => {
    const { isDark } = useTheme();
    const { user } = useSelector(store => store.auth);
    const [dashboardData, setDashboardData] = useState({
        stats: {
            applications: 0,
            profileViews: 0,
            savedJobs: 0,
            interviews: 0
        },
        analytics: {
            applicationTrend: [],
            profileViews: [],
            jobMatches: []
        },
        recentActivity: [],
        recommendations: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Simulate API calls
            setTimeout(() => {
                setDashboardData({
                    stats: {
                        applications: 12,
                        profileViews: 45,
                        savedJobs: 8,
                        interviews: 3
                    },
                    analytics: {
                        applicationTrend: [
                            { month: 'Jan', applications: 2 },
                            { month: 'Feb', applications: 4 },
                            { month: 'Mar', applications: 3 },
                            { month: 'Apr', applications: 5 },
                            { month: 'May', applications: 8 },
                            { month: 'Jun', applications: 12 }
                        ],
                        profileViews: [
                            { day: 'Mon', views: 5 },
                            { day: 'Tue', views: 8 },
                            { day: 'Wed', views: 12 },
                            { day: 'Thu', views: 6 },
                            { day: 'Fri', views: 9 },
                            { day: 'Sat', views: 3 },
                            { day: 'Sun', views: 2 }
                        ],
                        jobMatches: [
                            { skill: 'React', match: 85 },
                            { skill: 'JavaScript', match: 92 },
                            { skill: 'Node.js', match: 78 },
                            { skill: 'Python', match: 65 },
                            { skill: 'AWS', match: 45 }
                        ]
                    },
                    recentActivity: [
                        {
                            type: 'application',
                            title: 'Applied to Software Engineer at Google',
                            time: '2 hours ago',
                            status: 'pending'
                        },
                        {
                            type: 'profile_view',
                            title: 'Your profile was viewed by Microsoft',
                            time: '5 hours ago',
                            status: 'viewed'
                        },
                        {
                            type: 'interview',
                            title: 'Interview scheduled with Amazon',
                            time: '1 day ago',
                            status: 'scheduled'
                        }
                    ],
                    recommendations: [
                        {
                            title: 'Senior Frontend Developer',
                            company: 'Netflix',
                            location: 'Los Gatos, CA',
                            salary: '$120k - $180k',
                            match: 95,
                            type: 'Full-time',
                            posted: '2 days ago'
                        },
                        {
                            title: 'Full Stack Engineer',
                            company: 'Spotify',
                            location: 'New York, NY',
                            salary: '$110k - $160k',
                            match: 88,
                            type: 'Full-time',
                            posted: '3 days ago'
                        }
                    ]
                });
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            setLoading(false);
        }
    };

    const applicationChartData = {
        labels: dashboardData.analytics.applicationTrend.map(item => item.month),
        datasets: [
            {
                label: 'Applications',
                data: dashboardData.analytics.applicationTrend.map(item => item.applications),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
            },
        ],
    };

    const profileViewsData = {
        labels: dashboardData.analytics.profileViews.map(item => item.day),
        datasets: [
            {
                label: 'Profile Views',
                data: dashboardData.analytics.profileViews.map(item => item.views),
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderColor: 'rgb(16, 185, 129)',
                borderWidth: 1,
            },
        ],
    };

    const skillMatchData = {
        labels: dashboardData.analytics.jobMatches.map(item => item.skill),
        datasets: [
            {
                data: dashboardData.analytics.jobMatches.map(item => item.match),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                ],
                borderWidth: 0,
            },
        ],
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome back, {user?.fullName}!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Here's your job search overview and insights
                    </p>
                </div>

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
                                        <p className="text-blue-100">Applications</p>
                                        <p className="text-3xl font-bold">{dashboardData.stats.applications}</p>
                                        <p className="text-blue-200 text-sm">+2 this week</p>
                                    </div>
                                    <Send className="h-8 w-8 text-blue-200" />
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
                                        <p className="text-green-100">Profile Views</p>
                                        <p className="text-3xl font-bold">{dashboardData.stats.profileViews}</p>
                                        <p className="text-green-200 text-sm">+12 this week</p>
                                    </div>
                                    <Eye className="h-8 w-8 text-green-200" />
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
                                        <p className="text-purple-100">Saved Jobs</p>
                                        <p className="text-3xl font-bold">{dashboardData.stats.savedJobs}</p>
                                        <p className="text-purple-200 text-sm">+1 this week</p>
                                    </div>
                                    <Target className="h-8 w-8 text-purple-200" />
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
                                        <p className="text-orange-100">Interviews</p>
                                        <p className="text-3xl font-bold">{dashboardData.stats.interviews}</p>
                                        <p className="text-orange-200 text-sm">+1 this week</p>
                                    </div>
                                    <Calendar className="h-8 w-8 text-orange-200" />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Main Content */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                        <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Application Trend Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <TrendingUp className="h-5 w-5" />
                                        <span>Application Trend</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Line data={applicationChartData} options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                display: false
                                            }
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true
                                            }
                                        }
                                    }} />
                                </CardContent>
                            </Card>

                            {/* Profile Views Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Eye className="h-5 w-5" />
                                        <span>Profile Views</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Bar data={profileViewsData} options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                display: false
                                            }
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true
                                            }
                                        }
                                    }} />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Skill Match Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Award className="h-5 w-5" />
                                    <span>Skill Match Analysis</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="h-64">
                                        <Doughnut data={skillMatchData} options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    position: 'bottom'
                                                }
                                            }
                                        }} />
                                    </div>
                                    <div className="space-y-4">
                                        {dashboardData.analytics.jobMatches.map((skill, index) => (
                                            <div key={index} className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">{skill.skill}</span>
                                                    <span className="text-sm text-gray-500">{skill.match}%</span>
                                                </div>
                                                <Progress value={skill.match} className="h-2" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Analytics Tab */}
                    <TabsContent value="analytics" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Application Success Rate</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-green-600 mb-2">25%</div>
                                        <p className="text-gray-500">3 interviews from 12 applications</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Response Time</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-blue-600 mb-2">2.3</div>
                                        <p className="text-gray-500">Average days to response</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Profile Completeness</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <Progress value={85} className="h-3" />
                                        <p className="text-sm text-gray-500">85% complete</p>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span>Experience</span>
                                                <span className="text-green-600">✓</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Education</span>
                                                <span className="text-green-600">✓</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Skills</span>
                                                <span className="text-green-600">✓</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Portfolio</span>
                                                <span className="text-yellow-600">⚠</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Activity Tab */}
                    <TabsContent value="activity" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {dashboardData.recentActivity.map((activity, index) => (
                                        <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                                            <div className={`w-2 h-2 rounded-full ${
                                                activity.status === 'pending' ? 'bg-yellow-500' :
                                                activity.status === 'viewed' ? 'bg-blue-500' :
                                                'bg-green-500'
                                            }`} />
                                            <div className="flex-1">
                                                <p className="font-medium">{activity.title}</p>
                                                <p className="text-sm text-gray-500">{activity.time}</p>
                                            </div>
                                            <Badge variant={
                                                activity.status === 'pending' ? 'secondary' :
                                                activity.status === 'viewed' ? 'default' :
                                                'default'
                                            }>
                                                {activity.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Recommendations Tab */}
                    <TabsContent value="recommendations" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {dashboardData.recommendations.map((job, index) => (
                                <Card key={index} className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="font-semibold text-lg">{job.title}</h3>
                                                <p className="text-gray-600">{job.company}</p>
                                            </div>
                                            <Badge className="bg-green-100 text-green-800">
                                                {job.match}% match
                                            </Badge>
                                        </div>
                                        
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <MapPin className="h-4 w-4 mr-2" />
                                                {job.location?.city || job.location || 'Location not specified'}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Briefcase className="h-4 w-4 mr-2" />
                                                {job.type}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Clock className="h-4 w-4 mr-2" />
                                                Posted {job.posted}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-green-600">{job.salary}</span>
                                            <div className="flex space-x-2">
                                                <Button variant="outline" size="sm">
                                                    Save
                                                </Button>
                                                <Button size="sm">
                                                    Apply
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default JobSeekerDashboard;
