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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
    Shield, 
    Flag, 
    Eye, 
    EyeOff, 
    CheckCircle, 
    XCircle, 
    AlertTriangle, 
    User, 
    Building, 
    Briefcase, 
    MessageSquare, 
    Star,
    Filter,
    Search,
    MoreHorizontal,
    Clock,
    UserX,
    UserCheck,
    Trash2,
    Archive,
    RefreshCw,
    Download,
    Upload,
    Settings,
    Bell,
    AlertCircle,
    Info,
    ThumbsUp,
    ThumbsDown,
    Ban,
    CheckSquare,
    Square,
    ChevronDown,
    ChevronUp,
    Plus,
    Edit,
    Save,
    X,
    FileText,
    Image,
    Link,
    Calendar,
    MapPin,
    DollarSign,
    Users,
    TrendingUp,
    TrendingDown,
    Activity,
    BarChart3,
    PieChart,
    Target,
    Award,
    Bookmark,
    Share2,
    Heart,
    MessageCircle,
    Send,
    Reply,
    Forward,
    Copy,
    ExternalLink,
    Lock,
    Unlock,
    Key,
    Database,
    Server,
    Cpu,
    HardDrive,
    Wifi,
    WifiOff,
    Signal,
    SignalZero,
    Battery,
    BatteryLow,
    Zap,
    ZapOff,
    Sun,
    Moon,
    Cloud,
    CloudRain,
    CloudSnow,
    Wind,
    Thermometer,
    Droplets,
    Gauge,
    Timer,
    Stopwatch,
    Clock3,
    Clock4,
    Clock5,
    Clock6,
    Clock7,
    Clock8,
    Clock9,
    Clock10,
    Clock11,
    Clock12,
    Calendar as CalendarIcon,
    CalendarDays,
    CalendarCheck,
    CalendarX,
    CalendarPlus,
    CalendarMinus,
    CalendarRange,
    CalendarSearch,
    CalendarHeart,
    CalendarStar,
    CalendarUser,
    CalendarSettings,
    CalendarEdit,
    CalendarTrash,
    CalendarDownload,
    CalendarUpload,
    CalendarShare,
    CalendarLock,
    CalendarUnlock,
    CalendarKey,
    CalendarDatabase,
    CalendarServer,
    CalendarCpu,
    CalendarHardDrive,
    CalendarWifi,
    CalendarWifiOff,
    CalendarSignal,
    CalendarSignalZero,
    CalendarBattery,
    CalendarBatteryLow,
    CalendarZap,
    CalendarZapOff,
    CalendarSun,
    CalendarMoon,
    CalendarCloud,
    CalendarCloudRain,
    CalendarCloudSnow,
    CalendarWind,
    CalendarThermometer,
    CalendarDroplets,
    CalendarGauge,
    CalendarTimer,
    CalendarStopwatch
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import apiClient from '@/utils/axiosConfig';

const ContentModeration = () => {
    const { user } = useSelector(store => store.auth);
    const [moderationQueue, setModerationQueue] = useState([]);
    const [reportedContent, setReportedContent] = useState([]);
    const [flaggedUsers, setFlaggedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const [filters, setFilters] = useState({
        type: '',
        status: '',
        severity: '',
        dateRange: '',
        searchTerm: ''
    });
    const [moderationStats, setModerationStats] = useState({
        totalPending: 0,
        totalReviewed: 0,
        totalApproved: 0,
        totalRejected: 0,
        totalFlagged: 0,
        averageReviewTime: 0
    });

    useEffect(() => {
        fetchModerationData();
        fetchModerationStats();
    }, [filters]);

    const fetchModerationData = async () => {
        try {
            const [queueRes, reportsRes, usersRes] = await Promise.all([
                apiClient.get('/api/v1/admin/moderation/queue', { params: filters }),
                apiClient.get('/api/v1/admin/moderation/reports', { params: filters }),
                apiClient.get('/api/v1/admin/moderation/flagged-users', { params: filters })
            ]);

            setModerationQueue(queueRes.data.queue || []);
            setReportedContent(reportsRes.data.reports || []);
            setFlaggedUsers(usersRes.data.users || []);
        } catch (error) {
            console.error('Error fetching moderation data:', error);
            toast.error('Failed to fetch moderation data');
        } finally {
            setLoading(false);
        }
    };

    const fetchModerationStats = async () => {
        try {
            const res = await apiClient.get('/api/v1/admin/moderation/stats');
            setModerationStats(res.data.stats);
        } catch (error) {
            console.error('Error fetching moderation stats:', error);
        }
    };

    const handleModerationAction = async (itemId, action, reason) => {
        try {
            const res = await apiClient.post(`/api/v1/admin/moderation/${action}`, {
                itemId,
                reason,
                moderatorId: user._id
            });

            if (res.data.success) {
                toast.success(`Content ${action}d successfully`);
                fetchModerationData();
                fetchModerationStats();
            }
        } catch (error) {
            toast.error(`Failed to ${action} content`);
        }
    };

    const handleBulkAction = async (action, reason) => {
        if (selectedItems.length === 0) {
            toast.error('Please select items to moderate');
            return;
        }

        try {
            const res = await apiClient.post(`/api/v1/admin/moderation/bulk-${action}`, {
                itemIds: selectedItems,
                reason,
                moderatorId: user._id
            });

            if (res.data.success) {
                toast.success(`${selectedItems.length} items ${action}d successfully`);
                setSelectedItems([]);
                fetchModerationData();
                fetchModerationStats();
            }
        } catch (error) {
            toast.error(`Failed to ${action} items`);
        }
    };

    const handleUserAction = async (userId, action, reason) => {
        try {
            const res = await apiClient.post(`/api/v1/admin/users/${action}`, {
                userId,
                reason,
                moderatorId: user._id
            });

            if (res.data.success) {
                toast.success(`User ${action}d successfully`);
                fetchModerationData();
            }
        } catch (error) {
            toast.error(`Failed to ${action} user`);
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'flagged': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString();
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Content Moderation
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Review and moderate platform content, reports, and user behavior
                    </p>
                </div>

                {/* Stats Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <Clock className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Pending Review</p>
                                    <p className="text-2xl font-bold text-gray-900">{moderationStats.totalPending}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Approved</p>
                                    <p className="text-2xl font-bold text-gray-900">{moderationStats.totalApproved}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <XCircle className="w-6 h-6 text-red-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Rejected</p>
                                    <p className="text-2xl font-bold text-gray-900">{moderationStats.totalRejected}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <Flag className="w-6 h-6 text-orange-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Flagged</p>
                                    <p className="text-2xl font-bold text-gray-900">{moderationStats.totalFlagged}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Eye className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Reviewed</p>
                                    <p className="text-2xl font-bold text-gray-900">{moderationStats.totalReviewed}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Timer className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Avg. Review Time</p>
                                    <p className="text-2xl font-bold text-gray-900">{moderationStats.averageReviewTime}m</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <Tabs defaultValue="queue" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="queue">Moderation Queue</TabsTrigger>
                        <TabsTrigger value="reports">Reports</TabsTrigger>
                        <TabsTrigger value="users">Flagged Users</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    {/* Moderation Queue */}
                    <TabsContent value="queue">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="flex items-center">
                                        <Shield className="w-5 h-5 mr-2" />
                                        Moderation Queue ({moderationQueue.length})
                                    </CardTitle>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedItems(moderationQueue.map(item => item._id))}
                                        >
                                            Select All
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedItems([])}
                                            disabled={selectedItems.length === 0}
                                        >
                                            Clear Selection
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* Filters */}
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                                    <div>
                                        <Label htmlFor="typeFilter">Type</Label>
                                        <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All types" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">All types</SelectItem>
                                                <SelectItem value="job">Job Postings</SelectItem>
                                                <SelectItem value="company">Company Profiles</SelectItem>
                                                <SelectItem value="review">Reviews</SelectItem>
                                                <SelectItem value="message">Messages</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="severityFilter">Severity</Label>
                                        <Select value={filters.severity} onValueChange={(value) => setFilters(prev => ({ ...prev, severity: value }))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All severities" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">All severities</SelectItem>
                                                <SelectItem value="high">High</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="low">Low</SelectItem>
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
                                                <SelectItem value="">All statuses</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="approved">Approved</SelectItem>
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
                                                <SelectItem value="">All dates</SelectItem>
                                                <SelectItem value="today">Today</SelectItem>
                                                <SelectItem value="week">This week</SelectItem>
                                                <SelectItem value="month">This month</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="searchFilter">Search</Label>
                                        <Input
                                            id="searchFilter"
                                            placeholder="Search content..."
                                            value={filters.searchTerm}
                                            onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                {/* Bulk Actions */}
                                {selectedItems.length > 0 && (
                                    <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-blue-800 dark:text-blue-200">
                                                {selectedItems.length} items selected
                                            </span>
                                            <div className="flex space-x-2">
                                                <Button size="sm" variant="outline" onClick={() => handleBulkAction('approve', 'Bulk approved')}>
                                                    <CheckCircle className="w-4 h-4 mr-1" />
                                                    Approve All
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => handleBulkAction('reject', 'Bulk rejected')}>
                                                    <XCircle className="w-4 h-4 mr-1" />
                                                    Reject All
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => handleBulkAction('flag', 'Bulk flagged')}>
                                                    <Flag className="w-4 h-4 mr-1" />
                                                    Flag All
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Queue Items */}
                                {loading ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                        <p className="mt-2 text-gray-600">Loading moderation queue...</p>
                                    </div>
                                ) : moderationQueue.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Shield className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                            No items in moderation queue
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            All content has been reviewed
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {moderationQueue.map((item) => (
                                            <ModerationItem
                                                key={item._id}
                                                item={item}
                                                isSelected={selectedItems.includes(item._id)}
                                                onSelect={(id) => {
                                                    setSelectedItems(prev => 
                                                        prev.includes(id) 
                                                            ? prev.filter(itemId => itemId !== id)
                                                            : [...prev, id]
                                                    );
                                                }}
                                                onAction={handleModerationAction}
                                                getSeverityColor={getSeverityColor}
                                                getStatusColor={getStatusColor}
                                                formatDate={formatDate}
                                            />
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Reports */}
                    <TabsContent value="reports">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Flag className="w-5 h-5 mr-2" />
                                    Reported Content ({reportedContent.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {reportedContent.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Flag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                            No reported content
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            All reports have been reviewed
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {reportedContent.map((report) => (
                                            <ReportItem
                                                key={report._id}
                                                report={report}
                                                onAction={handleModerationAction}
                                                formatDate={formatDate}
                                            />
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Flagged Users */}
                    <TabsContent value="users">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <UserX className="w-5 h-5 mr-2" />
                                    Flagged Users ({flaggedUsers.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {flaggedUsers.length === 0 ? (
                                    <div className="text-center py-8">
                                        <UserX className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                            No flagged users
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            All users are in good standing
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {flaggedUsers.map((user) => (
                                            <FlaggedUserItem
                                                key={user._id}
                                                user={user}
                                                onAction={handleUserAction}
                                                formatDate={formatDate}
                                            />
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Settings */}
                    <TabsContent value="settings">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Settings className="w-5 h-5 mr-2" />
                                    Moderation Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">Automated Moderation</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label htmlFor="autoModeration">Enable Auto-Moderation</Label>
                                                    <p className="text-sm text-gray-600">Automatically flag content based on keywords</p>
                                                </div>
                                                <Button variant="outline" size="sm">
                                                    <Settings className="w-4 h-4 mr-2" />
                                                    Configure
                                                </Button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label htmlFor="autoApproval">Auto-Approval for Trusted Users</Label>
                                                    <p className="text-sm text-gray-600">Automatically approve content from verified users</p>
                                                </div>
                                                <Button variant="outline" size="sm">
                                                    <Settings className="w-4 h-4 mr-2" />
                                                    Configure
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                                                    <p className="text-sm text-gray-600">Receive email alerts for high-priority items</p>
                                                </div>
                                                <Button variant="outline" size="sm">
                                                    <Bell className="w-4 h-4 mr-2" />
                                                    Configure
                                                </Button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label htmlFor="slackIntegration">Slack Integration</Label>
                                                    <p className="text-sm text-gray-600">Send moderation alerts to Slack channels</p>
                                                </div>
                                                <Button variant="outline" size="sm">
                                                    <Settings className="w-4 h-4 mr-2" />
                                                    Configure
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

// Moderation Item Component
const ModerationItem = ({ item, isSelected, onSelect, onAction, getSeverityColor, getStatusColor, formatDate }) => {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className={`hover:shadow-lg transition-shadow ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
                <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onSelect(item._id)}
                            className="mt-1"
                        />
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-semibold">{item.title || item.content?.substring(0, 50) + '...'}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {item.type} • {item.user?.fullName || 'Unknown User'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatDate(item.createdAt)}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Badge className={getSeverityColor(item.severity)}>
                                        {item.severity}
                                    </Badge>
                                    <Badge className={getStatusColor(item.status)}>
                                        {item.status}
                                    </Badge>
                                </div>
                            </div>
                            
                            {showDetails && (
                                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <p className="text-sm mb-2">{item.content}</p>
                                    {item.reason && (
                                        <p className="text-sm text-gray-600">
                                            <strong>Reason:</strong> {item.reason}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center justify-between mt-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowDetails(!showDetails)}
                                >
                                    {showDetails ? 'Hide Details' : 'Show Details'}
                                </Button>
                                <div className="flex space-x-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onAction(item._id, 'approve', 'Approved by moderator')}
                                    >
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        Approve
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onAction(item._id, 'reject', 'Rejected by moderator')}
                                    >
                                        <XCircle className="w-4 h-4 mr-1" />
                                        Reject
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onAction(item._id, 'flag', 'Flagged for review')}
                                    >
                                        <Flag className="w-4 h-4 mr-1" />
                                        Flag
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

// Report Item Component
const ReportItem = ({ report, onAction, formatDate }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card>
                <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className="font-semibold">{report.content?.title || 'Reported Content'}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Reported by: {report.reporter?.fullName || 'Anonymous'}
                            </p>
                            <p className="text-sm mb-2">
                                <strong>Reason:</strong> {report.reason}
                            </p>
                            <p className="text-xs text-gray-500">
                                Reported on: {formatDate(report.createdAt)}
                            </p>
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onAction(report._id, 'approve', 'Report reviewed and approved')}
                            >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onAction(report._id, 'reject', 'Report reviewed and rejected')}
                            >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

// Flagged User Item Component
const FlaggedUserItem = ({ user, onAction, formatDate }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card>
                <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className="font-semibold">{user.fullName}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {user.email} • {user.role}
                            </p>
                            <p className="text-sm mb-2">
                                <strong>Flagged for:</strong> {user.flagReason || 'Multiple violations'}
                            </p>
                            <p className="text-xs text-gray-500">
                                Flagged on: {formatDate(user.flaggedAt)}
                            </p>
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onAction(user._id, 'suspend', 'User suspended for violations')}
                            >
                                <Ban className="w-4 h-4 mr-1" />
                                Suspend
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onAction(user._id, 'warn', 'User warned for violations')}
                            >
                                <AlertTriangle className="w-4 h-4 mr-1" />
                                Warn
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onAction(user._id, 'unflag', 'User unflagged after review')}
                            >
                                <UserCheck className="w-4 h-4 mr-1" />
                                Unflag
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default ContentModeration;
