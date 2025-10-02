import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import Navbar from '../shared/Navbar';
import { useTheme } from '../../contexts/ThemeContext';
import { 
    Users, 
    Search, 
    Filter, 
    Star, 
    MessageSquare, 
    Calendar, 
    FileText, 
    Download, 
    Upload,
    Eye,
    EyeOff,
    ThumbsUp,
    ThumbsDown,
    Flag,
    Archive,
    UserCheck,
    UserX,
    Clock,
    TrendingUp,
    BarChart3,
    PieChart,
    Activity,
    Target,
    Award,
    Bookmark,
    Share2,
    MoreHorizontal,
    ChevronDown,
    ChevronUp,
    Plus,
    Edit,
    Trash2,
    Save,
    X,
    CheckCircle,
    AlertCircle,
    Info
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import apiClient from '@/utils/axiosConfig';

// Application Card Component
const ApplicationCard = ({ application, isSelected, onSelect, getStatusColor, getScoreColor }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card 
                className={`hover:shadow-lg transition-shadow cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => onSelect(application)}
            >
                <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold">{application.user.fullName}</h3>
                                {application.score && (
                                    <Badge className={`${getScoreColor(application.score)} bg-gray-100`}>
                                        {application.score}/100
                                    </Badge>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                {application.job.title} • {application.job.company.name}
                            </p>
                            <p className="text-xs text-gray-500 mb-2">
                                Applied on {formatDate(application.appliedAt)}
                            </p>
                            <div className="flex items-center space-x-2">
                                <Badge className={getStatusColor(application.status)}>
                                    {application.status}
                                </Badge>
                                {application.rating && (
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i} 
                                                className={`w-4 h-4 ${i < application.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center space-x-1">
                            {application.notes?.length > 0 && (
                                <MessageSquare className="w-4 h-4 text-blue-500" />
                            )}
                            {application.resume && (
                                <FileText className="w-4 h-4 text-green-500" />
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

// Application Details Component
const ApplicationDetails = ({ application, onUpdateStatus, onAddNote, onRateCandidate, getStatusColor, getScoreColor }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [newNote, setNewNote] = useState('');
    const [newRating, setNewRating] = useState(0);
    const [newFeedback, setNewFeedback] = useState('');

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString();
    };

    const handleAddNote = () => {
        if (newNote.trim()) {
            onAddNote(application._id, newNote);
            setNewNote('');
        }
    };

    const handleRateCandidate = () => {
        if (newRating > 0) {
            onRateCandidate(application._id, newRating, newFeedback);
            setNewRating(0);
            setNewFeedback('');
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>{application.user.fullName}</span>
                    <Badge className={getStatusColor(application.status)}>
                        {application.status}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="notes">Notes</TabsTrigger>
                        <TabsTrigger value="actions">Actions</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">Contact Information</h4>
                            <div className="space-y-1 text-sm">
                                <p><strong>Email:</strong> {application.user.email}</p>
                                <p><strong>Phone:</strong> {application.user.phoneNumber || 'N/A'}</p>
                                <p><strong>Location:</strong> {application.user.profile?.location || 'N/A'}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Application Details</h4>
                            <div className="space-y-1 text-sm">
                                <p><strong>Job:</strong> {application.job.title}</p>
                                <p><strong>Company:</strong> {application.job.company.name}</p>
                                <p><strong>Applied:</strong> {formatDate(application.appliedAt)}</p>
                                <p><strong>Score:</strong> 
                                    <span className={`ml-1 ${getScoreColor(application.score)}`}>
                                        {application.score || 'N/A'}/100
                                    </span>
                                </p>
                            </div>
                        </div>

                        {application.user.profile?.skills && (
                            <div>
                                <h4 className="font-semibold mb-2">Skills</h4>
                                <div className="flex flex-wrap gap-1">
                                    {application.user.profile.skills.map((skill, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {application.coverLetter && (
                            <div>
                                <h4 className="font-semibold mb-2">Cover Letter</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {application.coverLetter}
                                </p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="notes" className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">Add Note</h4>
                            <div className="space-y-2">
                                <Textarea
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    placeholder="Add a note about this candidate..."
                                    rows={3}
                                />
                                <Button onClick={handleAddNote} size="sm">
                                    Add Note
                                </Button>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Previous Notes</h4>
                            {application.notes?.length > 0 ? (
                                <div className="space-y-2">
                                    {application.notes.map((note, index) => (
                                        <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <p className="text-sm">{note.content}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formatDate(note.createdAt)} by {note.addedBy?.fullName || 'Unknown'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No notes yet</p>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="actions" className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">Update Status</h4>
                            <div className="space-y-2">
                                <Select onValueChange={(value) => onUpdateStatus(application._id, value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select new status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="reviewed">Reviewed</SelectItem>
                                        <SelectItem value="shortlisted">Shortlisted</SelectItem>
                                        <SelectItem value="interview">Interview</SelectItem>
                                        <SelectItem value="hired">Hired</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Rate Candidate</h4>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`cursor-pointer w-5 h-5 ${
                                                star <= newRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                            }`}
                                            onClick={() => setNewRating(star)}
                                        />
                                    ))}
                                </div>
                                <Textarea
                                    value={newFeedback}
                                    onChange={(e) => setNewFeedback(e.target.value)}
                                    placeholder="Add feedback..."
                                    rows={2}
                                />
                                <Button onClick={handleRateCandidate} size="sm">
                                    Rate Candidate
                                </Button>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Quick Actions</h4>
                            <div className="space-y-2">
                                <Button variant="outline" size="sm" className="w-full">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Schedule Interview
                                </Button>
                                <Button variant="outline" size="sm" className="w-full">
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Send Message
                                </Button>
                                <Button variant="outline" size="sm" className="w-full">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Resume
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

const AdvancedATS = () => {
    const { theme } = useTheme();
    const { user } = useSelector(store => store.auth);
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        jobId: 'all',
        status: 'all',
        dateRange: '',
        searchTerm: '',
        scoreRange: 'all',
        experience: '',
        education: ''
    });
    const [analytics, setAnalytics] = useState({
        totalApplications: 0,
        statusDistribution: {},
        topSources: [],
        conversionRates: {},
        timeToHire: 0,
        candidateQuality: {}
    });

    useEffect(() => {
        fetchData();
        fetchAnalytics();
    }, [filters]);

    const fetchData = async () => {
        try {
            // Convert 'all' to empty string for API compatibility
            const apiFilters = { ...filters };
            if (apiFilters.jobId === 'all') {
                apiFilters.jobId = '';
            }
            if (apiFilters.status === 'all') {
                apiFilters.status = '';
            }
            if (apiFilters.scoreRange === 'all') {
                apiFilters.scoreRange = '';
            }
            
            const [applicationsRes, jobsRes] = await Promise.all([
                apiClient.get('/api/v1/application/ats', { params: apiFilters }),
                apiClient.get('/api/v1/job/getadminjobs')
            ]);

            setApplications(applicationsRes.data.applications || []);
            setJobs(jobsRes.data.jobs || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalytics = async () => {
        try {
            const res = await apiClient.get('/api/v1/application/analytics');
            setAnalytics(res.data.analytics);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        }
    };

    const updateApplicationStatus = async (applicationId, status, notes) => {
        try {
            const res = await apiClient.put(`/api/v1/application/${applicationId}/status`, {
                status,
                notes
            });

            if (res.data.success) {
                toast.success('Application status updated');
                fetchData();
            }
        } catch (error) {
            toast.error('Failed to update application status');
        }
    };

    const addApplicationNote = async (applicationId, note) => {
        try {
            const res = await apiClient.post(`/api/v1/application/${applicationId}/notes`, {
                note
            });

            if (res.data.success) {
                toast.success('Note added');
                fetchData();
            }
        } catch (error) {
            toast.error('Failed to add note');
        }
    };

    const rateCandidate = async (applicationId, rating, feedback) => {
        try {
            const res = await apiClient.post(`/api/v1/application/${applicationId}/rating`, {
                rating,
                feedback
            });

            if (res.data.success) {
                toast.success('Candidate rated');
                fetchData();
            }
        } catch (error) {
            toast.error('Failed to rate candidate');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'applied': return 'bg-blue-100 text-blue-800';
            case 'reviewed': return 'bg-yellow-100 text-yellow-800';
            case 'shortlisted': return 'bg-green-100 text-green-800';
            case 'interview': return 'bg-purple-100 text-purple-800';
            case 'hired': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className={`min-h-screen transition-all duration-300 ${
            theme === 'dark' 
                ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900' 
                : 'bg-gradient-to-br from-white via-blue-50 to-emerald-50'
        }`}>
            <Navbar />
            
            <div className="pt-16 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                            Advanced ATS
                        </h1>
                        <p className={`transition-colors duration-300 ${
                            theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
                        }`}>
                            Comprehensive applicant tracking and management system
                        </p>
                    </div>

                {/* Analytics Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Applications</p>
                                    <p className="text-2xl font-bold text-gray-900">{analytics.totalApplications}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                                    <p className="text-2xl font-bold text-gray-900">{analytics.conversionRates.overall || 0}%</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Clock className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Avg. Time to Hire</p>
                                    <p className="text-2xl font-bold text-gray-900">{analytics.timeToHire} days</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <Star className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Avg. Candidate Score</p>
                                    <p className="text-2xl font-bold text-gray-900">{analytics.candidateQuality.averageScore || 0}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Applications List */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="flex items-center">
                                        <Users className="w-5 h-5 mr-2" />
                                        Applications ({applications.length})
                                    </CardTitle>
                                    <div className="flex space-x-2">
                                        <Button variant="outline" size="sm">
                                            <Download className="w-4 h-4 mr-1" />
                                            Export
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Upload className="w-4 h-4 mr-1" />
                                            Import
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* Filters */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                    <div>
                                        <Label htmlFor="jobFilter">Job</Label>
                                        <Select value={filters.jobId} onValueChange={(value) => setFilters(prev => ({ ...prev, jobId: value }))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All jobs" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All jobs</SelectItem>
                                                {jobs.map(job => (
                                                    <SelectItem key={job._id} value={job._id}>
                                                        {job.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="statusFilter">Status</Label>
                                        <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All statuses" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All statuses</SelectItem>
                                                <SelectItem value="applied">Applied</SelectItem>
                                                <SelectItem value="reviewed">Reviewed</SelectItem>
                                                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                                                <SelectItem value="interview">Interview</SelectItem>
                                                <SelectItem value="hired">Hired</SelectItem>
                                                <SelectItem value="rejected">Rejected</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="scoreFilter">Score Range</Label>
                                        <Select value={filters.scoreRange} onValueChange={(value) => setFilters(prev => ({ ...prev, scoreRange: value }))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All scores" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All scores</SelectItem>
                                                <SelectItem value="80-100">80-100 (Excellent)</SelectItem>
                                                <SelectItem value="60-79">60-79 (Good)</SelectItem>
                                                <SelectItem value="40-59">40-59 (Fair)</SelectItem>
                                                <SelectItem value="0-39">0-39 (Poor)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="searchFilter">Search</Label>
                                        <Input
                                            id="searchFilter"
                                            placeholder="Search candidates..."
                                            value={filters.searchTerm}
                                            onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                {/* Applications List */}
                                {loading ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                        <p className="mt-2 text-gray-600">Loading applications...</p>
                                    </div>
                                ) : applications.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                            No applications found
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Try adjusting your filters or check back later
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {applications.map((application) => (
                                            <ApplicationCard
                                                key={application._id}
                                                application={application}
                                                isSelected={selectedApplication?._id === application._id}
                                                onSelect={setSelectedApplication}
                                                getStatusColor={getStatusColor}
                                                getScoreColor={getScoreColor}
                                            />
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Application Details */}
                    <div className="lg:col-span-1">
                        {selectedApplication ? (
                            <ApplicationDetails
                                application={selectedApplication}
                                onUpdateStatus={updateApplicationStatus}
                                onAddNote={addApplicationNote}
                                onRateCandidate={rateCandidate}
                                getStatusColor={getStatusColor}
                                getScoreColor={getScoreColor}
                            />
                        ) : (
                            <Card>
                                <CardContent className="p-6 text-center">
                                    <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        Select an Application
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Click on an application to view details and manage the candidate
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default AdvancedATS;
