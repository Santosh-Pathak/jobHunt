import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import Navbar from '../shared/Navbar';
import { useTheme } from '../../contexts/ThemeContext';
import { 
    Users, 
    Mail, 
    Calendar, 
    FileText, 
    Download, 
    Trash2, 
    CheckCircle, 
    AlertCircle,
    Clock,
    Filter,
    Search,
    MoreHorizontal,
    Send,
    Eye,
    EyeOff,
    RefreshCw,
    Archive,
    UserCheck,
    UserX,
    MessageSquare,
    Settings,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import apiClient from '@/utils/axiosConfig';

// Application Card Component
const ApplicationCard = ({ application, isSelected, onSelect, getStatusColor }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className={`hover:shadow-lg transition-shadow ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
                <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                        <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => onSelect(application._id)}
                        />
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold">{application.user.fullName}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {application.job.title} • {application.job.company.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Applied on {formatDate(application.appliedAt)}
                                    </p>
                                </div>
                                <Badge className={getStatusColor(application.status)}>
                                    {application.status}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

// Job Card Component
const JobCard = ({ job, isSelected, onSelect }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className={`hover:shadow-lg transition-shadow ${isSelected ? 'ring-2 ring-green-500' : ''}`}>
                <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                        <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => onSelect(job._id)}
                        />
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold">{job.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {job.company.name} • {job.location}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Posted on {formatDate(job.createdAt)}
                                    </p>
                                </div>
                                <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                                    {job.status}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

// Bulk Status Form Component
const BulkStatusForm = ({ onSubmit, onCancel, loading }) => {
    const [formData, setFormData] = useState({
        status: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData.status, formData.message);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="status">New Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
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
            <div>
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Add a message for the candidates..."
                    rows={3}
                />
            </div>
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading || !formData.status}>
                    {loading ? 'Updating...' : 'Update Status'}
                </Button>
            </div>
        </form>
    );
};

// Bulk Email Form Component
const BulkEmailForm = ({ onSubmit, onCancel, loading }) => {
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        template: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Email subject"
                    required
                />
            </div>
            <div>
                <Label htmlFor="template">Template</Label>
                <Select value={formData.template} onValueChange={(value) => setFormData(prev => ({ ...prev, template: value }))}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">No template</SelectItem>
                        <SelectItem value="interview_invite">Interview Invite</SelectItem>
                        <SelectItem value="rejection">Rejection Notice</SelectItem>
                        <SelectItem value="next_steps">Next Steps</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Email message..."
                    rows={6}
                    required
                />
            </div>
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Email'}
                </Button>
            </div>
        </form>
    );
};

// Export Form Component
const ExportForm = ({ onSubmit, onCancel }) => {
    const [format, setFormat] = useState('csv');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(format);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="format">Export Format</Label>
                <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                </Button>
            </div>
        </form>
    );
};

const BulkOperations = () => {
    const { theme } = useTheme();
    const { user } = useSelector(store => store.auth);
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [selectedApplications, setSelectedApplications] = useState([]);
    const [selectedJobs, setSelectedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bulkActionLoading, setBulkActionLoading] = useState(false);
    const [showBulkEmailDialog, setShowBulkEmailDialog] = useState(false);
    const [showBulkStatusDialog, setShowBulkStatusDialog] = useState(false);
    const [showExportDialog, setShowExportDialog] = useState(false);
    const [filters, setFilters] = useState({
        jobId: 'all',
        status: 'all',
        dateRange: 'all',
        searchTerm: ''
    });

    useEffect(() => {
        fetchData();
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
            if (apiFilters.dateRange === 'all') {
                apiFilters.dateRange = '';
            }
            
            const [applicationsRes, jobsRes] = await Promise.all([
                apiClient.get('/application/bulk', { params: apiFilters }),
                apiClient.get('/job/getadminjobs')
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

    const handleSelectApplication = (applicationId) => {
        setSelectedApplications(prev => 
            prev.includes(applicationId) 
                ? prev.filter(id => id !== applicationId)
                : [...prev, applicationId]
        );
    };

    const handleSelectAllApplications = () => {
        if (selectedApplications.length === applications.length) {
            setSelectedApplications([]);
        } else {
            setSelectedApplications(applications.map(app => app._id));
        }
    };

    const handleSelectJob = (jobId) => {
        setSelectedJobs(prev => 
            prev.includes(jobId) 
                ? prev.filter(id => id !== jobId)
                : [...prev, jobId]
        );
    };

    const handleSelectAllJobs = () => {
        if (selectedJobs.length === jobs.length) {
            setSelectedJobs([]);
        } else {
            setSelectedJobs(jobs.map(job => job._id));
        }
    };

    const bulkUpdateApplicationStatus = async (status, message) => {
        if (selectedApplications.length === 0) {
            toast.error('Please select applications to update');
            return;
        }

        setBulkActionLoading(true);
        try {
            const response = await apiClient.post('/application/bulk-status', {
                applicationIds: selectedApplications,
                status,
                message
            });

            if (response.data.success) {
                toast.success(`Updated ${response.data.updatedCount} applications`);
                setSelectedApplications([]);
                setShowBulkStatusDialog(false);
                fetchData();
            }
        } catch (error) {
            toast.error('Failed to update applications');
        } finally {
            setBulkActionLoading(false);
        }
    };

    const bulkSendEmail = async (emailData) => {
        if (selectedApplications.length === 0) {
            toast.error('Please select applications to email');
            return;
        }

        setBulkActionLoading(true);
        try {
            const response = await apiClient.post('/application/bulk-email', {
                applicationIds: selectedApplications,
                ...emailData
            });

            if (response.data.success) {
                toast.success(`Email sent to ${response.data.sentCount} candidates`);
                setSelectedApplications([]);
                setShowBulkEmailDialog(false);
            }
        } catch (error) {
            toast.error('Failed to send emails');
        } finally {
            setBulkActionLoading(false);
        }
    };

    const bulkScheduleInterviews = async (interviewData) => {
        if (selectedApplications.length === 0) {
            toast.error('Please select applications to schedule interviews');
            return;
        }

        setBulkActionLoading(true);
        try {
            const response = await apiClient.post('/interviews/bulk-schedule', {
                applicationIds: selectedApplications,
                ...interviewData
            });

            if (response.data.success) {
                toast.success(`Scheduled ${response.data.scheduledCount} interviews`);
                setSelectedApplications([]);
                fetchData();
            }
        } catch (error) {
            toast.error('Failed to schedule interviews');
        } finally {
            setBulkActionLoading(false);
        }
    };

    const bulkExportApplications = async (format) => {
        if (selectedApplications.length === 0) {
            toast.error('Please select applications to export');
            return;
        }

        try {
            const response = await apiClient.post('/application/bulk-export', {
                applicationIds: selectedApplications,
                format
            }, {
                responseType: 'blob'
            });

            const blob = new Blob([response.data], { 
                type: format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `applications_${new Date().toISOString().split('T')[0]}.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success(`Exported ${selectedApplications.length} applications`);
            setShowExportDialog(false);
        } catch (error) {
            toast.error('Failed to export applications');
        }
    };

    const bulkCloseJobs = async () => {
        if (selectedJobs.length === 0) {
            toast.error('Please select jobs to close');
            return;
        }

        setBulkActionLoading(true);
        try {
            const response = await apiClient.post('/job/bulk-close', {
                jobIds: selectedJobs
            });

            if (response.data.success) {
                toast.success(`Closed ${response.data.closedCount} jobs`);
                setSelectedJobs([]);
                fetchData();
            }
        } catch (error) {
            toast.error('Failed to close jobs');
        } finally {
            setBulkActionLoading(false);
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
                            Bulk Operations
                        </h1>
                        <p className={`transition-colors duration-300 ${
                            theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
                        }`}>
                            Manage multiple applications and jobs efficiently
                        </p>
                    </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Filter className="w-5 h-5 mr-2" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                                <Label htmlFor="dateFilter">Date Range</Label>
                                <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All dates" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All dates</SelectItem>
                                        <SelectItem value="today">Today</SelectItem>
                                        <SelectItem value="week">This week</SelectItem>
                                        <SelectItem value="month">This month</SelectItem>
                                        <SelectItem value="quarter">This quarter</SelectItem>
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
                    </CardContent>
                </Card>

                {/* Applications Section */}
                <Card className="mb-6">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="flex items-center">
                                <Users className="w-5 h-5 mr-2" />
                                Applications ({applications.length})
                            </CardTitle>
                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleSelectAllApplications}
                                >
                                    {selectedApplications.length === applications.length ? 'Deselect All' : 'Select All'}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedApplications([])}
                                    disabled={selectedApplications.length === 0}
                                >
                                    Clear Selection
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {selectedApplications.length > 0 && (
                            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-800 dark:text-blue-200">
                                        {selectedApplications.length} applications selected
                                    </span>
                                    <div className="flex space-x-2">
                                        <Dialog open={showBulkStatusDialog} onOpenChange={setShowBulkStatusDialog}>
                                            <DialogTrigger asChild>
                                                <Button size="sm" variant="outline">
                                                    <UserCheck className="w-4 h-4 mr-1" />
                                                    Update Status
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Bulk Update Status</DialogTitle>
                                                </DialogHeader>
                                                <BulkStatusForm 
                                                    onSubmit={bulkUpdateApplicationStatus}
                                                    onCancel={() => setShowBulkStatusDialog(false)}
                                                    loading={bulkActionLoading}
                                                />
                                            </DialogContent>
                                        </Dialog>

                                        <Dialog open={showBulkEmailDialog} onOpenChange={setShowBulkEmailDialog}>
                                            <DialogTrigger asChild>
                                                <Button size="sm" variant="outline">
                                                    <Mail className="w-4 h-4 mr-1" />
                                                    Send Email
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Bulk Send Email</DialogTitle>
                                                </DialogHeader>
                                                <BulkEmailForm 
                                                    onSubmit={bulkSendEmail}
                                                    onCancel={() => setShowBulkEmailDialog(false)}
                                                    loading={bulkActionLoading}
                                                />
                                            </DialogContent>
                                        </Dialog>

                                        <Button 
                                            size="sm" 
                                            variant="outline"
                                            onClick={() => bulkScheduleInterviews({
                                                date: new Date().toISOString().split('T')[0],
                                                time: '10:00',
                                                type: 'video',
                                                duration: 60
                                            })}
                                            disabled={bulkActionLoading}
                                        >
                                            <Calendar className="w-4 h-4 mr-1" />
                                            Schedule Interviews
                                        </Button>

                                        <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
                                            <DialogTrigger asChild>
                                                <Button size="sm" variant="outline">
                                                    <Download className="w-4 h-4 mr-1" />
                                                    Export
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Export Applications</DialogTitle>
                                                </DialogHeader>
                                                <ExportForm 
                                                    onSubmit={bulkExportApplications}
                                                    onCancel={() => setShowExportDialog(false)}
                                                />
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            </div>
                        )}

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
                                        isSelected={selectedApplications.includes(application._id)}
                                        onSelect={handleSelectApplication}
                                        getStatusColor={getStatusColor}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Jobs Section */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="flex items-center">
                                <FileText className="w-5 h-5 mr-2" />
                                Jobs ({jobs.length})
                            </CardTitle>
                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleSelectAllJobs}
                                >
                                    {selectedJobs.length === jobs.length ? 'Deselect All' : 'Select All'}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedJobs([])}
                                    disabled={selectedJobs.length === 0}
                                >
                                    Clear Selection
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {selectedJobs.length > 0 && (
                            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-green-800 dark:text-green-200">
                                        {selectedJobs.length} jobs selected
                                    </span>
                                    <div className="flex space-x-2">
                                        <Button 
                                            size="sm" 
                                            variant="outline"
                                            onClick={bulkCloseJobs}
                                            disabled={bulkActionLoading}
                                        >
                                            <Archive className="w-4 h-4 mr-1" />
                                            Close Jobs
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            {jobs.map((job) => (
                                <JobCard
                                    key={job._id}
                                    job={job}
                                    isSelected={selectedJobs.includes(job._id)}
                                    onSelect={handleSelectJob}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
                </div>
            </div>
        </div>
    );
};

export default BulkOperations;
