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
import { 
    Save, 
    FileText, 
    Clock, 
    Edit, 
    Trash2, 
    Send, 
    Download, 
    Upload,
    AlertCircle,
    CheckCircle,
    Eye,
    EyeOff,
    Plus,
    Calendar,
    User,
    Briefcase,
    MapPin,
    DollarSign,
    RefreshCw,
    Archive,
    Star,
    Bookmark
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import apiClient from '@/utils/axiosConfig';
import { APPLICATION_API_END_POINT } from '@/utils/constant';

const ApplicationDraft = ({ jobId, jobTitle, companyName, onDraftSaved, onDraftSubmitted }) => {
    const { user } = useSelector(store => store.auth);
    const [draft, setDraft] = useState({
        jobId: jobId || '',
        jobTitle: jobTitle || '',
        companyName: companyName || '',
        coverLetter: '',
        resume: null,
        resumeUrl: '',
        expectedSalary: '',
        availability: '',
        noticePeriod: '',
        additionalInfo: '',
        customFields: {},
        status: 'draft'
    });
    
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showDrafts, setShowDrafts] = useState(false);
    const [selectedDraft, setSelectedDraft] = useState(null);
    const [autoSave, setAutoSave] = useState(true);
    const [lastSaved, setLastSaved] = useState(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useEffect(() => {
        fetchDrafts();
        
        // Auto-save every 30 seconds if enabled
        if (autoSave) {
            const interval = setInterval(() => {
                if (hasUnsavedChanges) {
                    saveDraft(true);
                }
            }, 30000);
            
            return () => clearInterval(interval);
        }
    }, [autoSave, hasUnsavedChanges]);

    // Track changes
    useEffect(() => {
        setHasUnsavedChanges(true);
    }, [draft]);

    const fetchDrafts = async () => {
        try {
            const response = await apiClient.get(`${APPLICATION_API_END_POINT}/drafts`);
            if (response.data.success) {
                setDrafts(response.data.drafts);
            }
        } catch (error) {
            console.error('Error fetching drafts:', error);
        }
    };

    const saveDraft = async (isAutoSave = false) => {
        if (!draft.jobId || !draft.coverLetter.trim()) {
            if (!isAutoSave) {
                toast.error('Please fill in required fields');
            }
            return;
        }

        setSaving(true);
        try {
            const response = await apiClient.post(`${APPLICATION_API_END_POINT}/drafts`, {
                ...draft,
                userId: user._id,
                isAutoSave
            });

            if (response.data.success) {
                setHasUnsavedChanges(false);
                setLastSaved(new Date());
                if (onDraftSaved) {
                    onDraftSaved(response.data.draft);
                }
                
                if (!isAutoSave) {
                    toast.success('Draft saved successfully');
                }
                
                fetchDrafts();
            } else {
                toast.error(response.data.message || 'Failed to save draft');
            }
        } catch (error) {
            console.error('Save draft error:', error);
            if (!isAutoSave) {
                toast.error('Failed to save draft');
            }
        } finally {
            setSaving(false);
        }
    };

    const loadDraft = (draftId) => {
        const selectedDraft = drafts.find(d => d._id === draftId);
        if (selectedDraft) {
            setDraft({
                ...selectedDraft,
                status: 'draft'
            });
            setSelectedDraft(selectedDraft);
            setHasUnsavedChanges(false);
            toast.success('Draft loaded successfully');
        }
    };

    const deleteDraft = async (draftId) => {
        try {
            const response = await apiClient.delete(`${APPLICATION_API_END_POINT}/drafts/${draftId}`);
            if (response.data.success) {
                setDrafts(drafts.filter(d => d._id !== draftId));
                toast.success('Draft deleted successfully');
            } else {
                toast.error(response.data.message || 'Failed to delete draft');
            }
        } catch (error) {
            console.error('Delete draft error:', error);
            toast.error('Failed to delete draft');
        }
    };

    const submitApplication = async () => {
        if (!draft.jobId || !draft.coverLetter.trim()) {
            toast.error('Please fill in required fields');
            return;
        }

        setLoading(true);
        try {
            const response = await apiClient.post(`${APPLICATION_API_END_POINT}/apply/${draft.jobId}`, {
                ...draft,
                userId: user._id,
                status: 'submitted'
            });

            if (response.data.success) {
                toast.success('Application submitted successfully');
                setHasUnsavedChanges(false);
                
                // Remove from drafts
                setDrafts(drafts.filter(d => d._id !== selectedDraft?._id));
                
                if (onDraftSubmitted) {
                    onDraftSubmitted(response.data.application);
                }
                
                // Reset form
                setDraft({
                    jobId: '',
                    jobTitle: '',
                    companyName: '',
                    coverLetter: '',
                    resume: null,
                    resumeUrl: '',
                    expectedSalary: '',
                    availability: '',
                    noticePeriod: '',
                    additionalInfo: '',
                    customFields: {},
                    status: 'draft'
                });
            } else {
                toast.error(response.data.message || 'Failed to submit application');
            }
        } catch (error) {
            console.error('Submit application error:', error);
            toast.error('Failed to submit application');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast.error('File size must be less than 5MB');
            return;
        }

        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Please upload a PDF or Word document');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('resume', file);
            formData.append('userId', user._id);

            const response = await apiClient.post(`${APPLICATION_API_END_POINT}/upload-resume`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                setDraft(prev => ({
                    ...prev,
                    resume: file,
                    resumeUrl: response.data.resumeUrl
                }));
                toast.success('Resume uploaded successfully');
            } else {
                toast.error(response.data.message || 'Failed to upload resume');
            }
        } catch (error) {
            console.error('Upload resume error:', error);
            toast.error('Failed to upload resume');
        }
    };

    const exportDraft = () => {
        const draftData = {
            jobTitle: draft.jobTitle,
            companyName: draft.companyName,
            coverLetter: draft.coverLetter,
            expectedSalary: draft.expectedSalary,
            availability: draft.availability,
            noticePeriod: draft.noticePeriod,
            additionalInfo: draft.additionalInfo,
            customFields: draft.customFields,
            savedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(draftData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `application-draft-${draft.jobTitle?.replace(/\s+/g, '-') || 'draft'}.json`;
        link.click();
        window.URL.revokeObjectURL(url);
        
        toast.success('Draft exported successfully');
    };

    const importDraft = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                setDraft(prev => ({
                    ...prev,
                    ...importedData,
                    jobId: jobId || prev.jobId,
                    status: 'draft'
                }));
                toast.success('Draft imported successfully');
            } catch (error) {
                toast.error('Invalid draft file');
            }
        };
        reader.readAsText(file);
    };

    const renderDraftList = () => (
        <Dialog open={showDrafts} onOpenChange={setShowDrafts}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Saved Drafts</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {drafts.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No saved drafts yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {drafts.map((draftItem) => (
                                <Card key={draftItem._id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="space-y-3">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold">{draftItem.jobTitle}</h3>
                                                    <p className="text-sm text-muted-foreground">{draftItem.companyName}</p>
                                                </div>
                                                <Badge variant="secondary">Draft</Badge>
                                            </div>
                                            
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Clock className="w-4 h-4 mr-1" />
                                                {new Date(draftItem.updatedAt).toLocaleDateString()}
                                            </div>
                                            
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => {
                                                        loadDraft(draftItem._id);
                                                        setShowDrafts(false);
                                                    }}
                                                >
                                                    <Edit className="w-4 h-4 mr-1" />
                                                    Load
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => deleteDraft(draftItem._id)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground mb-2">Application Draft</h1>
                <p className="text-muted-foreground">
                    Save your application progress and submit when ready
                </p>
            </div>

            {/* Auto-save Status */}
            <Card className="mb-6">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="auto-save"
                                    checked={autoSave}
                                    onChange={(e) => setAutoSave(e.target.checked)}
                                />
                                <Label htmlFor="auto-save">Auto-save every 30 seconds</Label>
                            </div>
                            
                            {lastSaved && (
                                <div className="text-sm text-muted-foreground">
                                    Last saved: {lastSaved.toLocaleTimeString()}
                                </div>
                            )}
                            
                            {hasUnsavedChanges && (
                                <Badge variant="outline" className="text-orange-600">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    Unsaved changes
                                </Badge>
                            )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowDrafts(true)}
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                View Drafts ({drafts.length})
                            </Button>
                            
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={exportDraft}
                                disabled={!draft.jobTitle}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </Button>
                            
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                            >
                                <label htmlFor="import-draft">
                                    <Upload className="w-4 h-4 mr-2" />
                                    Import
                                    <input
                                        id="import-draft"
                                        type="file"
                                        accept=".json"
                                        onChange={importDraft}
                                        className="hidden"
                                    />
                                </label>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Application Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Briefcase className="w-5 h-5 mr-2" />
                        Application Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Job Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="job-title">Job Title</Label>
                            <Input
                                id="job-title"
                                value={draft.jobTitle}
                                onChange={(e) => setDraft(prev => ({ ...prev, jobTitle: e.target.value }))}
                                placeholder="e.g., Software Engineer"
                            />
                        </div>
                        <div>
                            <Label htmlFor="company-name">Company Name</Label>
                            <Input
                                id="company-name"
                                value={draft.companyName}
                                onChange={(e) => setDraft(prev => ({ ...prev, companyName: e.target.value }))}
                                placeholder="e.g., Google"
                            />
                        </div>
                    </div>

                    {/* Cover Letter */}
                    <div>
                        <Label htmlFor="cover-letter">Cover Letter *</Label>
                        <Textarea
                            id="cover-letter"
                            value={draft.coverLetter}
                            onChange={(e) => setDraft(prev => ({ ...prev, coverLetter: e.target.value }))}
                            placeholder="Write your cover letter here..."
                            rows={8}
                            className="resize-none"
                        />
                        <div className="text-sm text-muted-foreground mt-1">
                            {draft.coverLetter.length} characters
                        </div>
                    </div>

                    {/* Resume Upload */}
                    <div>
                        <Label htmlFor="resume">Resume</Label>
                        <div className="flex items-center space-x-4">
                            <Input
                                id="resume"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileUpload}
                                className="flex-1"
                            />
                            {draft.resumeUrl && (
                                <Badge variant="secondary">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Uploaded
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="expected-salary">Expected Salary</Label>
                            <Input
                                id="expected-salary"
                                value={draft.expectedSalary}
                                onChange={(e) => setDraft(prev => ({ ...prev, expectedSalary: e.target.value }))}
                                placeholder="e.g., $80,000"
                            />
                        </div>
                        <div>
                            <Label htmlFor="availability">Availability</Label>
                            <Select
                                value={draft.availability}
                                onValueChange={(value) => setDraft(prev => ({ ...prev, availability: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select availability" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="immediate">Immediate</SelectItem>
                                    <SelectItem value="2-weeks">2 weeks</SelectItem>
                                    <SelectItem value="1-month">1 month</SelectItem>
                                    <SelectItem value="2-months">2 months</SelectItem>
                                    <SelectItem value="3-months">3 months</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="notice-period">Notice Period</Label>
                            <Input
                                id="notice-period"
                                value={draft.noticePeriod}
                                onChange={(e) => setDraft(prev => ({ ...prev, noticePeriod: e.target.value }))}
                                placeholder="e.g., 2 weeks"
                            />
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div>
                        <Label htmlFor="additional-info">Additional Information</Label>
                        <Textarea
                            id="additional-info"
                            value={draft.additionalInfo}
                            onChange={(e) => setDraft(prev => ({ ...prev, additionalInfo: e.target.value }))}
                            placeholder="Any additional information you'd like to share..."
                            rows={4}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => saveDraft(false)}
                                disabled={saving}
                            >
                                {saving ? (
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4 mr-2" />
                                )}
                                Save Draft
                            </Button>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => setShowDrafts(true)}
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                View Drafts
                            </Button>
                            
                            <Button
                                onClick={submitApplication}
                                disabled={loading || !draft.jobTitle || !draft.coverLetter.trim()}
                            >
                                {loading ? (
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4 mr-2" />
                                )}
                                Submit Application
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Draft List Dialog */}
            {renderDraftList()}
        </div>
    );
};

export default ApplicationDraft;
