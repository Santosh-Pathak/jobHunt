import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import Navbar from '../shared/Navbar';
import { useTheme } from '../../contexts/ThemeContext';
import { 
    Server, 
    Database, 
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
    Activity, 
    BarChart3, 
    PieChart, 
    TrendingUp, 
    TrendingDown, 
    AlertTriangle, 
    CheckCircle, 
    XCircle, 
    Clock, 
    Timer, 
    Gauge, 
    Thermometer, 
    Droplets, 
    Wind, 
    Cloud, 
    CloudRain, 
    CloudSnow, 
    Sun, 
    Moon, 
    Eye, 
    EyeOff, 
    RefreshCw, 
    Settings, 
    Bell, 
    AlertCircle, 
    Info, 
    Shield, 
    Lock, 
    Unlock, 
    Key, 
    Users, 
    User, 
    Building, 
    Briefcase, 
    MessageSquare, 
    FileText, 
    Image, 
    Link, 
    Calendar, 
    MapPin, 
    DollarSign, 
    Star, 
    Heart, 
    ThumbsUp, 
    ThumbsDown, 
    Share2, 
    Download, 
    Upload, 
    Edit, 
    Save, 
    Trash2, 
    Archive, 
    Plus, 
    Minus, 
    X, 
    Check, 
    ChevronDown, 
    ChevronUp, 
    MoreHorizontal, 
    Target
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import apiClient from '@/utils/axiosConfig';

const SystemMonitoring = () => {
    const { theme } = useTheme();
    const { user } = useSelector(store => store.auth);
    const [systemHealth, setSystemHealth] = useState({
        status: 'healthy',
        uptime: 0,
        responseTime: 0,
        errorRate: 0,
        cpuUsage: 0,
        memoryUsage: 0,
        diskUsage: 0,
        networkLatency: 0
    });
    const [performanceMetrics, setPerformanceMetrics] = useState({
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        peakConcurrentUsers: 0,
        databaseConnections: 0,
        cacheHitRate: 0,
        queueSize: 0
    });
    const [alerts, setAlerts] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(true);

    useEffect(() => {
        fetchSystemData();
        
        if (autoRefresh) {
            const interval = setInterval(fetchSystemData, 30000); // Refresh every 30 seconds
            return () => clearInterval(interval);
        }
    }, [autoRefresh]);

    const fetchSystemData = async () => {
        try {
            const [healthRes, metricsRes, alertsRes, logsRes] = await Promise.all([
                apiClient.get('/admin/system/health'),
                apiClient.get('/admin/system/metrics'),
                apiClient.get('/admin/system/alerts'),
                apiClient.get('/admin/system/logs')
            ]);

            setSystemHealth(healthRes.data.health);
            setPerformanceMetrics(metricsRes.data.metrics);
            setAlerts(alertsRes.data.alerts);
            setLogs(logsRes.data.logs);
        } catch (error) {
            console.error('Error fetching system data:', error);
            toast.error('Failed to fetch system data');
        } finally {
            setLoading(false);
        }
    };

    const handleAlertAction = async (alertId, action) => {
        try {
            const res = await apiClient.post(`/admin/system/alerts/${alertId}/${action}`);
            if (res.data.success) {
                toast.success(`Alert ${action}d successfully`);
                fetchSystemData();
            }
        } catch (error) {
            toast.error(`Failed to ${action} alert`);
        }
    };

    const getHealthColor = (status) => {
        switch (status) {
            case 'healthy': return 'text-green-600';
            case 'warning': return 'text-yellow-600';
            case 'critical': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    const getHealthBadge = (status) => {
        switch (status) {
            case 'healthy': return 'bg-green-100 text-green-800';
            case 'warning': return 'bg-yellow-100 text-yellow-800';
            case 'critical': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getAlertSeverity = (severity) => {
        switch (severity) {
            case 'critical': return 'bg-red-100 text-red-800';
            case 'warning': return 'bg-yellow-100 text-yellow-800';
            case 'info': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatUptime = (seconds) => {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${days}d ${hours}h ${minutes}m`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString();
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
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
                                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                    System Monitoring
                                </h1>
                                <p className={`transition-colors duration-300 ${
                                    theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
                                }`}>
                                    Real-time system health monitoring and performance metrics
                                </p>
                            </div>
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setAutoRefresh(!autoRefresh)}
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                                {autoRefresh ? 'Auto Refresh ON' : 'Auto Refresh OFF'}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={fetchSystemData}
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Refresh Now
                            </Button>
                        </div>
                    </div>
                </div>

                {/* System Health Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Server className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">System Status</p>
                                    <Badge className={getHealthBadge(systemHealth.status)}>
                                        {systemHealth.status.toUpperCase()}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Clock className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Uptime</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatUptime(systemHealth.uptime)}
                                    </p>
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
                                    <p className="text-sm font-medium text-gray-600">Response Time</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {systemHealth.responseTime}ms
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Error Rate</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {systemHealth.errorRate}%
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Activity className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Requests</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {performanceMetrics.totalRequests.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Success Rate</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {performanceMetrics.totalRequests > 0 
                                            ? Math.round((performanceMetrics.successfulRequests / performanceMetrics.totalRequests) * 100)
                                            : 0}%
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Users className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Peak Users</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {performanceMetrics.peakConcurrentUsers}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <Database className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">DB Connections</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {performanceMetrics.databaseConnections}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="performance">Performance</TabsTrigger>
                        <TabsTrigger value="alerts">Alerts</TabsTrigger>
                        <TabsTrigger value="logs">Logs</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    {/* Overview */}
                    <TabsContent value="overview">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* System Resources */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Cpu className="w-5 h-5 mr-2" />
                                        System Resources
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium">CPU Usage</span>
                                            <span className="text-sm text-gray-600">{systemHealth.cpuUsage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className={`h-2 rounded-full ${systemHealth.cpuUsage > 80 ? 'bg-red-500' : systemHealth.cpuUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                                style={{ width: `${systemHealth.cpuUsage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium">Memory Usage</span>
                                            <span className="text-sm text-gray-600">{systemHealth.memoryUsage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className={`h-2 rounded-full ${systemHealth.memoryUsage > 80 ? 'bg-red-500' : systemHealth.memoryUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                                style={{ width: `${systemHealth.memoryUsage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium">Disk Usage</span>
                                            <span className="text-sm text-gray-600">{systemHealth.diskUsage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className={`h-2 rounded-full ${systemHealth.diskUsage > 80 ? 'bg-red-500' : systemHealth.diskUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                                style={{ width: `${systemHealth.diskUsage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Network Status */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Wifi className="w-5 h-5 mr-2" />
                                        Network Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Network Latency</span>
                                        <span className="text-sm text-gray-600">{systemHealth.networkLatency}ms</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Connection Status</span>
                                        <Badge className="bg-green-100 text-green-800">Connected</Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">SSL Certificate</span>
                                        <Badge className="bg-green-100 text-green-800">Valid</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Performance */}
                    <TabsContent value="performance">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <BarChart3 className="w-5 h-5 mr-2" />
                                        Request Metrics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">Total Requests</span>
                                            <span className="text-sm text-gray-600">{performanceMetrics.totalRequests.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">Successful Requests</span>
                                            <span className="text-sm text-gray-600">{performanceMetrics.successfulRequests.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">Failed Requests</span>
                                            <span className="text-sm text-gray-600">{performanceMetrics.failedRequests.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">Average Response Time</span>
                                            <span className="text-sm text-gray-600">{performanceMetrics.averageResponseTime}ms</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <PieChart className="w-5 h-5 mr-2" />
                                        Cache Performance
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">Cache Hit Rate</span>
                                            <span className="text-sm text-gray-600">{performanceMetrics.cacheHitRate}%</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">Queue Size</span>
                                            <span className="text-sm text-gray-600">{performanceMetrics.queueSize}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">Database Connections</span>
                                            <span className="text-sm text-gray-600">{performanceMetrics.databaseConnections}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Alerts */}
                    <TabsContent value="alerts">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Bell className="w-5 h-5 mr-2" />
                                    System Alerts ({alerts.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {alerts.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Bell className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                            No active alerts
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            System is running smoothly
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {alerts.map((alert) => (
                                            <AlertItem
                                                key={alert._id}
                                                alert={alert}
                                                onAction={handleAlertAction}
                                                getAlertSeverity={getAlertSeverity}
                                                formatDate={formatDate}
                                            />
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Logs */}
                    <TabsContent value="logs">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <FileText className="w-5 h-5 mr-2" />
                                    System Logs
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {logs.map((log) => (
                                        <LogItem
                                            key={log._id}
                                            log={log}
                                            formatDate={formatDate}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Settings */}
                    <TabsContent value="settings">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Settings className="w-5 h-5 mr-2" />
                                    Monitoring Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">Alert Thresholds</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label htmlFor="cpuThreshold">CPU Usage Threshold</Label>
                                                    <p className="text-sm text-gray-600">Alert when CPU usage exceeds this percentage</p>
                                                </div>
                                                <Button variant="outline" size="sm">
                                                    <Settings className="w-4 h-4 mr-2" />
                                                    Configure
                                                </Button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label htmlFor="memoryThreshold">Memory Usage Threshold</Label>
                                                    <p className="text-sm text-gray-600">Alert when memory usage exceeds this percentage</p>
                                                </div>
                                                <Button variant="outline" size="sm">
                                                    <Settings className="w-4 h-4 mr-2" />
                                                    Configure
                                                </Button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label htmlFor="responseTimeThreshold">Response Time Threshold</Label>
                                                    <p className="text-sm text-gray-600">Alert when response time exceeds this value</p>
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
                                                    <Label htmlFor="emailAlerts">Email Alerts</Label>
                                                    <p className="text-sm text-gray-600">Send email notifications for critical alerts</p>
                                                </div>
                                                <Button variant="outline" size="sm">
                                                    <Bell className="w-4 h-4 mr-2" />
                                                    Configure
                                                </Button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label htmlFor="slackIntegration">Slack Integration</Label>
                                                    <p className="text-sm text-gray-600">Send alerts to Slack channels</p>
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
    </div>
    );
};

// Alert Item Component
const AlertItem = ({ alert, onAction, getAlertSeverity, formatDate }) => {
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
                            <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold">{alert.title}</h3>
                                <Badge className={getAlertSeverity(alert.severity)}>
                                    {alert.severity}
                                </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {alert.message}
                            </p>
                            <p className="text-xs text-gray-500">
                                {formatDate(alert.createdAt)}
                            </p>
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onAction(alert._id, 'acknowledge')}
                            >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Acknowledge
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onAction(alert._id, 'resolve')}
                            >
                                <XCircle className="w-4 h-4 mr-1" />
                                Resolve
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

// Log Item Component
const LogItem = ({ log, formatDate }) => {
    const getLogLevelColor = (level) => {
        switch (level) {
            case 'error': return 'text-red-600';
            case 'warn': return 'text-yellow-600';
            case 'info': return 'text-blue-600';
            case 'debug': return 'text-gray-600';
            default: return 'text-gray-600';
        }
    };

    return (
        <div className="flex items-center space-x-4 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
            <span className={`text-xs font-mono ${getLogLevelColor(log.level)}`}>
                {log.level.toUpperCase()}
            </span>
            <span className="text-xs text-gray-500 font-mono">
                {formatDate(log.timestamp)}
            </span>
            <span className="text-sm flex-1">{log.message}</span>
        </div>
    );
};

export default SystemMonitoring;
