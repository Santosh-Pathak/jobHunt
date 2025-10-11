import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { 
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    Video,
    Phone,
    Mail,
    Plus,
    Edit,
    Trash2,
    Check,
    X,
    AlertCircle,
    CheckCircle,
    ExternalLink
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import apiClient from '@/utils/axiosConfig';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const InterviewScheduler = () => {
    const { user } = useSelector(store => store.auth);
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showScheduleDialog, setShowScheduleDialog] = useState(false);
    const [selectedDate, setSelectedDate] = useState();
    const [selectedTime, setSelectedTime] = useState('');
    const [interviewType, setInterviewType] = useState('');
    const [meetingLink, setMeetingLink] = useState('');
    const [notes, setNotes] = useState('');
    const [editingInterview, setEditingInterview] = useState(null);

    useEffect(() => {
        fetchInterviews();
    }, []);

    const fetchInterviews = async () => {
        try {
            const response = await apiClient.get('/interviews');
            setInterviews(response.data.interviews || []);
        } catch (error) {
            console.error('Error fetching interviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const scheduleInterview = async () => {
        if (!selectedDate || !selectedTime || !interviewType) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const interviewData = {
                date: selectedDate,
                time: selectedTime,
                type: interviewType,
                meetingLink: interviewType === 'video' ? meetingLink : undefined,
                notes,
                status: 'scheduled'
            };

            const response = await apiClient.post('/interviews/schedule', interviewData);
            
            if (response.data.success) {
                toast.success('Interview scheduled successfully');
                setShowScheduleDialog(false);
                resetForm();
                fetchInterviews();
            }
        } catch (error) {
            toast.error('Failed to schedule interview');
        }
    };

    const updateInterviewStatus = async (interviewId, status) => {
        try {
            const response = await apiClient.patch(`/api/v1/interviews/${interviewId}/status`, { status });
            
            if (response.data.success) {
                toast.success('Interview status updated');
                fetchInterviews();
            }
        } catch (error) {
            toast.error('Failed to update interview status');
        }
    };

    const cancelInterview = async (interviewId) => {
        try {
            const response = await apiClient.delete(`/api/v1/interviews/${interviewId}`);
            
            if (response.data.success) {
                toast.success('Interview cancelled');
                fetchInterviews();
            }
        } catch (error) {
            toast.error('Failed to cancel interview');
        }
    };

    const resetForm = () => {
        setSelectedDate(undefined);
        setSelectedTime('');
        setInterviewType('');
        setMeetingLink('');
        setNotes('');
        setEditingInterview(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'scheduled': return 'bg-blue-100 text-blue-800';
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-gray-100 text-gray-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'scheduled': return <Clock className="w-4 h-4" />;
            case 'confirmed': return <CheckCircle className="w-4 h-4" />;
            case 'completed': return <CheckCircle className="w-4 h-4" />;
            case 'cancelled': return <X className="w-4 h-4" />;
            default: return <AlertCircle className="w-4 h-4" />;
        }
    };

    const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Interview Scheduler
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your interview schedule and meetings
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex space-x-4">
                        <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Schedule Interview
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Schedule New Interview</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    {/* Date Selection */}
                                    <div>
                                        <Label>Interview Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !selectedDate && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={selectedDate}
                                                    onSelect={setSelectedDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    {/* Time Selection */}
                                    <div>
                                        <Label>Interview Time</Label>
                                        <Select value={selectedTime} onValueChange={setSelectedTime}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select time" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {timeSlots.map(time => (
                                                    <SelectItem key={time} value={time}>
                                                        {time}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Interview Type */}
                                    <div>
                                        <Label>Interview Type</Label>
                                        <Select value={interviewType} onValueChange={setInterviewType}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="video">Video Call</SelectItem>
                                                <SelectItem value="phone">Phone Call</SelectItem>
                                                <SelectItem value="in-person">In-Person</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Meeting Link (for video calls) */}
                                    {interviewType === 'video' && (
                                        <div>
                                            <Label>Meeting Link</Label>
                                            <Input
                                                value={meetingLink}
                                                onChange={(e) => setMeetingLink(e.target.value)}
                                                placeholder="https://meet.google.com/..."
                                            />
                                        </div>
                                    )}

                                    {/* Notes */}
                                    <div>
                                        <Label>Notes</Label>
                                        <Textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="Additional notes or instructions..."
                                            rows={3}
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-2">
                                        <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={scheduleInterview}>
                                            <Check className="w-4 h-4 mr-2" />
                                            Schedule Interview
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Interviews List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {loading ? (
                        <div className="col-span-2 text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading interviews...</p>
                        </div>
                    ) : interviews.length === 0 ? (
                        <div className="col-span-2 text-center py-12">
                            <CalendarIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                No interviews scheduled
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Schedule your first interview to get started
                            </p>
                            <Button onClick={() => setShowScheduleDialog(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Schedule Interview
                            </Button>
                        </div>
                    ) : (
                        interviews.map((interview) => (
                            <InterviewCard
                                key={interview._id}
                                interview={interview}
                                onUpdateStatus={updateInterviewStatus}
                                onCancel={cancelInterview}
                                getStatusColor={getStatusColor}
                                getStatusIcon={getStatusIcon}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

// Interview Card Component
const InterviewCard = ({ interview, onUpdateStatus, onCancel, getStatusColor, getStatusIcon }) => {
    const [showDetails, setShowDetails] = useState(false);

    const formatDateTime = (date, time) => {
        const interviewDate = new Date(date);
        const [hours, minutes] = time.split(':');
        interviewDate.setHours(parseInt(hours), parseInt(minutes));
        return format(interviewDate, 'PPP p');
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'video': return <Video className="w-4 h-4" />;
            case 'phone': return <Phone className="w-4 h-4" />;
            case 'in-person': return <MapPin className="w-4 h-4" />;
            default: return <CalendarIcon className="w-4 h-4" />;
        }
    };

    const canCancel = interview.status === 'scheduled' || interview.status === 'confirmed';
    const canConfirm = interview.status === 'scheduled';

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
                            <CardTitle className="text-lg">
                                {interview.jobTitle || 'Interview'}
                            </CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {interview.companyName || 'Company'}
                            </p>
                        </div>
                        <Badge className={getStatusColor(interview.status)}>
                            {getStatusIcon(interview.status)}
                            <span className="ml-1 capitalize">{interview.status}</span>
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <CalendarIcon className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{formatDateTime(interview.date, interview.time)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            {getTypeIcon(interview.type)}
                            <span className="text-sm capitalize">{interview.type} Interview</span>
                        </div>

                        {interview.meetingLink && (
                            <div className="flex items-center space-x-2">
                                <ExternalLink className="w-4 h-4 text-gray-500" />
                                <a 
                                    href={interview.meetingLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm"
                                >
                                    Join Meeting
                                </a>
                            </div>
                        )}

                        {interview.notes && (
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {interview.notes.length > 100 
                                        ? `${interview.notes.substring(0, 100)}...` 
                                        : interview.notes
                                    }
                                </p>
                            </div>
                        )}

                        <div className="flex space-x-2 pt-2">
                            {canConfirm && (
                                <Button 
                                    size="sm" 
                                    onClick={() => onUpdateStatus(interview._id, 'confirmed')}
                                >
                                    <Check className="w-4 h-4 mr-1" />
                                    Confirm
                                </Button>
                            )}
                            
                            {canCancel && (
                                <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => onCancel(interview._id)}
                                >
                                    <X className="w-4 h-4 mr-1" />
                                    Cancel
                                </Button>
                            )}

                            <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => setShowDetails(!showDetails)}
                            >
                                <Edit className="w-4 h-4 mr-1" />
                                {showDetails ? 'Hide' : 'Details'}
                            </Button>
                        </div>

                        {showDetails && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="pt-4 border-t"
                            >
                                <div className="space-y-2">
                                    <div>
                                        <Label className="text-sm font-semibold">Interviewer</Label>
                                        <p className="text-sm">{interview.interviewerName || 'TBD'}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold">Duration</Label>
                                        <p className="text-sm">{interview.duration || '60 minutes'}</p>
                                    </div>
                                    {interview.location && (
                                        <div>
                                            <Label className="text-sm font-semibold">Location</Label>
                                            <p className="text-sm">{interview.location}</p>
                                        </div>
                                    )}
                                    {interview.notes && (
                                        <div>
                                            <Label className="text-sm font-semibold">Notes</Label>
                                            <p className="text-sm">{interview.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default InterviewScheduler;
