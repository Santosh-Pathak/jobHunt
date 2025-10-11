import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
    Bell, 
    Plus, 
    Edit, 
    Trash2, 
    Mail, 
    Smartphone, 
    Globe,
    Search,
    MapPin,
    DollarSign,
    Briefcase,
    Clock,
    CheckCircle,
    AlertCircle,
    Settings,
    Filter,
    Calendar,
    TrendingUp,
    Eye,
    EyeOff
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import apiClient from '@/utils/axiosConfig';

const JobAlerts = () => {
    const { user } = useSelector(store => store.auth);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [editingAlert, setEditingAlert] = useState(null);

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        try {
            const response = await apiClient.get('/job-alerts');
            setAlerts(response.data.alerts || []);
        } catch (error) {
            console.error('Error fetching alerts:', error);
        } finally {
            setLoading(false);
        }
    };

    const createAlert = async (alertData) => {
        try {
            const response = await apiClient.post('/job-alerts', alertData);
            
            if (response.data.success) {
                toast.success('Job alert created successfully');
                setShowCreateDialog(false);
                fetchAlerts();
            }
        } catch (error) {
            toast.error('Failed to create job alert');
        }
    };

    const updateAlert = async (alertId, alertData) => {
        try {
            const response = await apiClient.put(`/job-alerts/${alertId}`, alertData);
            
            if (response.data.success) {
                toast.success('Job alert updated successfully');
                setEditingAlert(null);
                fetchAlerts();
            }
        } catch (error) {
            toast.error('Failed to update job alert');
        }
    };

    const deleteAlert = async (alertId) => {
        try {
            const response = await apiClient.delete(`/job-alerts/${alertId}`);
            
            if (response.data.success) {
                toast.success('Job alert deleted successfully');
                fetchAlerts();
            }
        } catch (error) {
            toast.error('Failed to delete job alert');
        }
    };

    const toggleAlert = async (alertId, isActive) => {
        try {
            const response = await apiClient.patch(`/job-alerts/${alertId}/toggle`, { isActive });
            
            if (response.data.success) {
                toast.success(`Job alert ${isActive ? 'activated' : 'deactivated'}`);
                fetchAlerts();
            }
        } catch (error) {
            toast.error('Failed to toggle job alert');
        }
    };

    const getFrequencyText = (frequency) => {
        switch (frequency) {
            case 'instant': return 'Instant';
            case 'daily': return 'Daily';
            case 'weekly': return 'Weekly';
            case 'monthly': return 'Monthly';
            default: return 'Daily';
        }
    };

    const getStatusColor = (isActive) => {
        return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Job Alerts
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Stay updated with the latest job opportunities that match your criteria
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex space-x-4">
                        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Alert
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Create Job Alert</DialogTitle>
                                </DialogHeader>
                                <JobAlertForm 
                                    onSubmit={createAlert}
                                    onCancel={() => setShowCreateDialog(false)}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Alerts List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {loading ? (
                        <div className="col-span-2 text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading alerts...</p>
                        </div>
                    ) : alerts.length === 0 ? (
                        <div className="col-span-2 text-center py-12">
                            <Bell className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                No job alerts yet
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Create your first job alert to get notified about relevant opportunities
                            </p>
                            <Button onClick={() => setShowCreateDialog(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Create First Alert
                            </Button>
                        </div>
                    ) : (
                        alerts.map((alert) => (
                            <JobAlertCard
                                key={alert._id}
                                alert={alert}
                                onEdit={setEditingAlert}
                                onDelete={deleteAlert}
                                onToggle={toggleAlert}
                                getFrequencyText={getFrequencyText}
                                getStatusColor={getStatusColor}
                            />
                        ))
                    )}
                </div>

                {/* Edit Dialog */}
                <Dialog open={!!editingAlert} onOpenChange={() => setEditingAlert(null)}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Edit Job Alert</DialogTitle>
                        </DialogHeader>
                        <JobAlertForm 
                            alert={editingAlert}
                            onSubmit={(data) => updateAlert(editingAlert._id, data)}
                            onCancel={() => setEditingAlert(null)}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

// Job Alert Form Component
const JobAlertForm = ({ alert, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: alert?.name || '',
        keywords: alert?.keywords?.join(', ') || '',
        location: alert?.location || '',
        jobType: alert?.jobType || '',
        experienceLevel: alert?.experienceLevel || '',
        salaryMin: alert?.salaryMin || '',
        salaryMax: alert?.salaryMax || '',
        companySize: alert?.companySize || '',
        industry: alert?.industry || '',
        remoteWork: alert?.remoteWork || false,
        frequency: alert?.frequency || 'daily',
        emailNotifications: alert?.emailNotifications || true,
        pushNotifications: alert?.pushNotifications || true,
        isActive: alert?.isActive ?? true
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const alertData = {
            ...formData,
            keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
            salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
            salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : undefined
        };

        onSubmit(alertData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Alert Name</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Frontend Developer Jobs"
                    required
                />
            </div>

            <div>
                <Label htmlFor="keywords">Keywords</Label>
                <Input
                    id="keywords"
                    value={formData.keywords}
                    onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                    placeholder="React, JavaScript, Frontend (comma-separated)"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Separate multiple keywords with commas
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="e.g., New York, Remote"
                    />
                </div>

                <div>
                    <Label htmlFor="jobType">Job Type</Label>
                    <Select value={formData.jobType} onValueChange={(value) => setFormData(prev => ({ ...prev, jobType: value }))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="full-time">Full-time</SelectItem>
                            <SelectItem value="part-time">Part-time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="internship">Internship</SelectItem>
                            <SelectItem value="freelance">Freelance</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="experienceLevel">Experience Level</Label>
                    <Select value={formData.experienceLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, experienceLevel: value }))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="entry">Entry Level</SelectItem>
                            <SelectItem value="mid">Mid Level</SelectItem>
                            <SelectItem value="senior">Senior Level</SelectItem>
                            <SelectItem value="lead">Lead/Principal</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="companySize">Company Size</Label>
                    <Select value={formData.companySize} onValueChange={(value) => setFormData(prev => ({ ...prev, companySize: value }))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="startup">Startup (1-50)</SelectItem>
                            <SelectItem value="small">Small (51-200)</SelectItem>
                            <SelectItem value="medium">Medium (201-1000)</SelectItem>
                            <SelectItem value="large">Large (1000+)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="salaryMin">Minimum Salary</Label>
                    <Input
                        id="salaryMin"
                        type="number"
                        value={formData.salaryMin}
                        onChange={(e) => setFormData(prev => ({ ...prev, salaryMin: e.target.value }))}
                        placeholder="e.g., 50000"
                    />
                </div>

                <div>
                    <Label htmlFor="salaryMax">Maximum Salary</Label>
                    <Input
                        id="salaryMax"
                        type="number"
                        value={formData.salaryMax}
                        onChange={(e) => setFormData(prev => ({ ...prev, salaryMax: e.target.value }))}
                        placeholder="e.g., 100000"
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                    placeholder="e.g., Technology, Healthcare, Finance"
                />
            </div>

            <div className="flex items-center space-x-2">
                <Switch
                    id="remoteWork"
                    checked={formData.remoteWork}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, remoteWork: checked }))}
                />
                <Label htmlFor="remoteWork">Include remote work opportunities</Label>
            </div>

            <div>
                <Label htmlFor="frequency">Notification Frequency</Label>
                <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="instant">Instant</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-3">
                <Label>Notification Preferences</Label>
                <div className="flex items-center space-x-2">
                    <Switch
                        id="emailNotifications"
                        checked={formData.emailNotifications}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                    <Label htmlFor="emailNotifications">Email notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch
                        id="pushNotifications"
                        checked={formData.pushNotifications}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, pushNotifications: checked }))}
                    />
                    <Label htmlFor="pushNotifications">Push notifications</Label>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Alert is active</Label>
            </div>

            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {alert ? 'Update Alert' : 'Create Alert'}
                </Button>
            </div>
        </form>
    );
};

// Job Alert Card Component
const JobAlertCard = ({ alert, onEdit, onDelete, onToggle, getFrequencyText, getStatusColor }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg">{alert.name}</CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Created {formatDate(alert.createdAt)}
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(alert.isActive)}>
                                {alert.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onToggle(alert._id, !alert.isActive)}
                            >
                                {alert.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {alert.keywords && alert.keywords.length > 0 && (
                            <div>
                                <Label className="text-sm font-semibold">Keywords</Label>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {alert.keywords.map((keyword, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                            {keyword}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            {alert.location && (
                                <div className="flex items-center space-x-1">
                                    <MapPin className="w-4 h-4 text-gray-500" />
                                    <span>{alert.location}</span>
                                </div>
                            )}
                            {alert.jobType && (
                                <div className="flex items-center space-x-1">
                                    <Briefcase className="w-4 h-4 text-gray-500" />
                                    <span className="capitalize">{alert.jobType}</span>
                                </div>
                            )}
                            {alert.experienceLevel && (
                                <div className="flex items-center space-x-1">
                                    <TrendingUp className="w-4 h-4 text-gray-500" />
                                    <span className="capitalize">{alert.experienceLevel}</span>
                                </div>
                            )}
                            <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span>{getFrequencyText(alert.frequency)}</span>
                            </div>
                        </div>

                        {(alert.salaryMin || alert.salaryMax) && (
                            <div className="flex items-center space-x-1 text-sm">
                                <DollarSign className="w-4 h-4 text-gray-500" />
                                <span>
                                    {alert.salaryMin && alert.salaryMax 
                                        ? `$${alert.salaryMin.toLocaleString()} - $${alert.salaryMax.toLocaleString()}`
                                        : alert.salaryMin 
                                            ? `$${alert.salaryMin.toLocaleString()}+`
                                            : `Up to $${alert.salaryMax.toLocaleString()}`
                                    }
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between items-center pt-2">
                            <div className="flex space-x-2">
                                <Button size="sm" variant="outline" onClick={() => onEdit(alert)}>
                                    <Edit className="w-4 h-4 mr-1" />
                                    Edit
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => onDelete(alert._id)}>
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    Delete
                                </Button>
                            </div>
                            <div className="text-xs text-gray-500">
                                {alert.matchesCount || 0} matches found
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default JobAlerts;
