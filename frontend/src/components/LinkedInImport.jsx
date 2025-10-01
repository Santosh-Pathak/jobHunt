import React, { useState } from 'react';
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
    Linkedin, 
    Download, 
    Upload, 
    CheckCircle, 
    AlertCircle, 
    Info, 
    ExternalLink,
    User,
    Briefcase,
    GraduationCap,
    Award,
    MapPin,
    Calendar,
    Globe,
    Mail,
    Phone,
    FileText,
    RefreshCw,
    X,
    Plus,
    Edit,
    Trash2,
    Save,
    Eye,
    EyeOff
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import apiClient from '@/utils/axiosConfig';
import { USER_API_END_POINT } from '@/utils/constant';

const LinkedInImport = () => {
    const { user } = useSelector(store => store.auth);
    const [importMethod, setImportMethod] = useState('manual'); // 'manual', 'api', 'file'
    const [linkedinUrl, setLinkedinUrl] = useState('');
    const [importedData, setImportedData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [editingField, setEditingField] = useState(null);
    
    // Form data for manual entry
    const [formData, setFormData] = useState({
        personalInfo: {
            fullName: user?.fullName || '',
            headline: '',
            summary: '',
            location: '',
            email: user?.email || '',
            phone: user?.phoneNumber || '',
            linkedinUrl: '',
            website: '',
            profilePicture: ''
        },
        experience: [],
        education: [],
        skills: [],
        certifications: [],
        languages: [],
        projects: []
    });

    const handleLinkedInImport = async () => {
        if (!linkedinUrl) {
            toast.error('Please enter a LinkedIn URL');
            return;
        }

        setLoading(true);
        try {
            // Simulate LinkedIn API call (in real implementation, this would call LinkedIn API)
            const response = await apiClient.post(`${USER_API_END_POINT}/linkedin/import`, {
                linkedinUrl,
                userId: user._id
            });

            if (response.data.success) {
                setImportedData(response.data.data);
                toast.success('LinkedIn profile imported successfully');
            } else {
                toast.error(response.data.message || 'Failed to import LinkedIn profile');
            }
        } catch (error) {
            console.error('LinkedIn import error:', error);
            if (error.response?.status === 429) {
                toast.error('LinkedIn API rate limit exceeded. Please try again later.');
            } else if (error.response?.status === 403) {
                toast.error('LinkedIn API access denied. Please check your permissions.');
            } else {
                toast.error('Failed to import LinkedIn profile. Please try manual entry.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleManualEntry = () => {
        setImportMethod('manual');
        setImportedData(null);
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.type !== 'application/json') {
            toast.error('Please upload a JSON file');
            return;
        }

        try {
            const text = await file.text();
            const data = JSON.parse(text);
            
            // Validate LinkedIn export format
            if (data.personalInfo || data.experience || data.education) {
                setImportedData(data);
                toast.success('LinkedIn data imported from file');
            } else {
                toast.error('Invalid LinkedIn export format');
            }
        } catch (error) {
            toast.error('Failed to parse LinkedIn export file');
        }
    };

    const handleSaveImport = async () => {
        try {
            const dataToSave = importedData || formData;
            
            const response = await apiClient.post(`${USER_API_END_POINT}/profile/import`, {
                userId: user._id,
                data: dataToSave,
                source: 'linkedin'
            });

            if (response.data.success) {
                toast.success('Profile data saved successfully');
                // Update user profile in Redux store
                // dispatch(updateUserProfile(response.data.profile));
            } else {
                toast.error(response.data.message || 'Failed to save profile data');
            }
        } catch (error) {
            console.error('Save import error:', error);
            toast.error('Failed to save profile data');
        }
    };

    const addExperience = () => {
        setFormData(prev => ({
            ...prev,
            experience: [...prev.experience, {
                title: '',
                company: '',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                description: ''
            }]
        }));
    };

    const addEducation = () => {
        setFormData(prev => ({
            ...prev,
            education: [...prev.education, {
                school: '',
                degree: '',
                field: '',
                startDate: '',
                endDate: '',
                gpa: '',
                description: ''
            }]
        }));
    };

    const addSkill = () => {
        setFormData(prev => ({
            ...prev,
            skills: [...prev.skills, {
                name: '',
                level: 'intermediate'
            }]
        }));
    };

    const removeItem = (type, index) => {
        setFormData(prev => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index)
        }));
    };

    const updateItem = (type, index, field, value) => {
        setFormData(prev => ({
            ...prev,
            [type]: prev[type].map((item, i) => 
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    const renderExperienceSection = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                    <Briefcase className="w-5 h-5 mr-2" />
                    Work Experience
                </h3>
                <Button onClick={addExperience} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                </Button>
            </div>
            
            {formData.experience.map((exp, index) => (
                <Card key={index}>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">Experience {index + 1}</h4>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem('experience', index)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor={`exp-title-${index}`}>Job Title</Label>
                                <Input
                                    id={`exp-title-${index}`}
                                    value={exp.title}
                                    onChange={(e) => updateItem('experience', index, 'title', e.target.value)}
                                    placeholder="e.g., Software Engineer"
                                />
                            </div>
                            <div>
                                <Label htmlFor={`exp-company-${index}`}>Company</Label>
                                <Input
                                    id={`exp-company-${index}`}
                                    value={exp.company}
                                    onChange={(e) => updateItem('experience', index, 'company', e.target.value)}
                                    placeholder="e.g., Google"
                                />
                            </div>
                            <div>
                                <Label htmlFor={`exp-location-${index}`}>Location</Label>
                                <Input
                                    id={`exp-location-${index}`}
                                    value={exp.location}
                                    onChange={(e) => updateItem('experience', index, 'location', e.target.value)}
                                    placeholder="e.g., San Francisco, CA"
                                />
                            </div>
                            <div>
                                <Label htmlFor={`exp-start-${index}`}>Start Date</Label>
                                <Input
                                    id={`exp-start-${index}`}
                                    type="month"
                                    value={exp.startDate}
                                    onChange={(e) => updateItem('experience', index, 'startDate', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor={`exp-end-${index}`}>End Date</Label>
                                <Input
                                    id={`exp-end-${index}`}
                                    type="month"
                                    value={exp.endDate}
                                    onChange={(e) => updateItem('experience', index, 'endDate', e.target.value)}
                                    disabled={exp.current}
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id={`exp-current-${index}`}
                                    checked={exp.current}
                                    onChange={(e) => updateItem('experience', index, 'current', e.target.checked)}
                                />
                                <Label htmlFor={`exp-current-${index}`}>Currently working here</Label>
                            </div>
                        </div>
                        
                        <div className="mt-4">
                            <Label htmlFor={`exp-desc-${index}`}>Description</Label>
                            <Textarea
                                id={`exp-desc-${index}`}
                                value={exp.description}
                                onChange={(e) => updateItem('experience', index, 'description', e.target.value)}
                                placeholder="Describe your role and achievements..."
                                rows={3}
                            />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    const renderEducationSection = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Education
                </h3>
                <Button onClick={addEducation} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Education
                </Button>
            </div>
            
            {formData.education.map((edu, index) => (
                <Card key={index}>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">Education {index + 1}</h4>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem('education', index)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor={`edu-school-${index}`}>School/University</Label>
                                <Input
                                    id={`edu-school-${index}`}
                                    value={edu.school}
                                    onChange={(e) => updateItem('education', index, 'school', e.target.value)}
                                    placeholder="e.g., Stanford University"
                                />
                            </div>
                            <div>
                                <Label htmlFor={`edu-degree-${index}`}>Degree</Label>
                                <Input
                                    id={`edu-degree-${index}`}
                                    value={edu.degree}
                                    onChange={(e) => updateItem('education', index, 'degree', e.target.value)}
                                    placeholder="e.g., Bachelor of Science"
                                />
                            </div>
                            <div>
                                <Label htmlFor={`edu-field-${index}`}>Field of Study</Label>
                                <Input
                                    id={`edu-field-${index}`}
                                    value={edu.field}
                                    onChange={(e) => updateItem('education', index, 'field', e.target.value)}
                                    placeholder="e.g., Computer Science"
                                />
                            </div>
                            <div>
                                <Label htmlFor={`edu-gpa-${index}`}>GPA (Optional)</Label>
                                <Input
                                    id={`edu-gpa-${index}`}
                                    value={edu.gpa}
                                    onChange={(e) => updateItem('education', index, 'gpa', e.target.value)}
                                    placeholder="e.g., 3.8"
                                />
                            </div>
                            <div>
                                <Label htmlFor={`edu-start-${index}`}>Start Date</Label>
                                <Input
                                    id={`edu-start-${index}`}
                                    type="month"
                                    value={edu.startDate}
                                    onChange={(e) => updateItem('education', index, 'startDate', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor={`edu-end-${index}`}>End Date</Label>
                                <Input
                                    id={`edu-end-${index}`}
                                    type="month"
                                    value={edu.endDate}
                                    onChange={(e) => updateItem('education', index, 'endDate', e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <div className="mt-4">
                            <Label htmlFor={`edu-desc-${index}`}>Description</Label>
                            <Textarea
                                id={`edu-desc-${index}`}
                                value={edu.description}
                                onChange={(e) => updateItem('education', index, 'description', e.target.value)}
                                placeholder="Describe your academic achievements..."
                                rows={3}
                            />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    const renderSkillsSection = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Skills
                </h3>
                <Button onClick={addSkill} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.skills.map((skill, index) => (
                    <Card key={index}>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-medium">Skill {index + 1}</h4>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeItem('skills', index)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor={`skill-name-${index}`}>Skill Name</Label>
                                    <Input
                                        id={`skill-name-${index}`}
                                        value={skill.name}
                                        onChange={(e) => updateItem('skills', index, 'name', e.target.value)}
                                        placeholder="e.g., JavaScript"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`skill-level-${index}`}>Proficiency Level</Label>
                                    <Select
                                        value={skill.level}
                                        onValueChange={(value) => updateItem('skills', index, 'level', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="beginner">Beginner</SelectItem>
                                            <SelectItem value="intermediate">Intermediate</SelectItem>
                                            <SelectItem value="advanced">Advanced</SelectItem>
                                            <SelectItem value="expert">Expert</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
                        <Linkedin className="w-8 h-8 mr-3 text-blue-600" />
                        LinkedIn Profile Import
                    </h1>
                    <p className="text-muted-foreground">
                        Import your LinkedIn profile data to quickly build your JobHunt profile
                    </p>
                </div>

                {/* Import Methods */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Import Method</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Button
                                variant={importMethod === 'api' ? 'default' : 'outline'}
                                onClick={() => setImportMethod('api')}
                                className="flex flex-col items-center p-6"
                            >
                                <Linkedin className="w-8 h-8 mb-2" />
                                LinkedIn API
                                <span className="text-xs mt-1">Connect directly</span>
                            </Button>
                            
                            <Button
                                variant={importMethod === 'file' ? 'default' : 'outline'}
                                onClick={() => setImportMethod('file')}
                                className="flex flex-col items-center p-6"
                            >
                                <Upload className="w-8 h-8 mb-2" />
                                Upload File
                                <span className="text-xs mt-1">JSON export</span>
                            </Button>
                            
                            <Button
                                variant={importMethod === 'manual' ? 'default' : 'outline'}
                                onClick={handleManualEntry}
                                className="flex flex-col items-center p-6"
                            >
                                <FileText className="w-8 h-8 mb-2" />
                                Manual Entry
                                <span className="text-xs mt-1">Fill manually</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* LinkedIn API Import */}
                {importMethod === 'api' && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>LinkedIn API Import</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="linkedin-url">LinkedIn Profile URL</Label>
                                <Input
                                    id="linkedin-url"
                                    value={linkedinUrl}
                                    onChange={(e) => setLinkedinUrl(e.target.value)}
                                    placeholder="https://www.linkedin.com/in/your-profile"
                                />
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <Button onClick={handleLinkedInImport} disabled={loading}>
                                    {loading ? (
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Download className="w-4 h-4 mr-2" />
                                    )}
                                    Import Profile
                                </Button>
                                
                                <Button variant="outline" asChild>
                                    <a href="https://www.linkedin.com/developers/apps" target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Get API Access
                                    </a>
                                </Button>
                            </div>
                            
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                <div className="flex items-start">
                                    <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="font-medium text-blue-800 dark:text-blue-200">
                                            LinkedIn API Access Required
                                        </p>
                                        <p className="text-blue-700 dark:text-blue-300 mt-1">
                                            To use this feature, you need to create a LinkedIn app and get API access. 
                                            This allows us to securely import your profile data.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* File Upload */}
                {importMethod === 'file' && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Upload LinkedIn Export</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="file-upload">LinkedIn Export File</Label>
                                <Input
                                    id="file-upload"
                                    type="file"
                                    accept=".json"
                                    onChange={handleFileUpload}
                                />
                            </div>
                            
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                <div className="flex items-start">
                                    <Info className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="font-medium text-green-800 dark:text-green-200">
                                            How to Export from LinkedIn
                                        </p>
                                        <p className="text-green-700 dark:text-green-300 mt-1">
                                            1. Go to LinkedIn Settings & Privacy<br/>
                                            2. Click "Data Privacy" → "Get a copy of your data"<br/>
                                            3. Select "Profile data" and request download<br/>
                                            4. Upload the JSON file here
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Manual Entry Form */}
                {importMethod === 'manual' && (
                    <div className="space-y-6">
                        {/* Personal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <User className="w-5 h-5 mr-2" />
                                    Personal Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="full-name">Full Name</Label>
                                        <Input
                                            id="full-name"
                                            value={formData.personalInfo.fullName}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                personalInfo: { ...prev.personalInfo, fullName: e.target.value }
                                            }))}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="headline">Professional Headline</Label>
                                        <Input
                                            id="headline"
                                            value={formData.personalInfo.headline}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                personalInfo: { ...prev.personalInfo, headline: e.target.value }
                                            }))}
                                            placeholder="e.g., Software Engineer at Google"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            value={formData.personalInfo.location}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                personalInfo: { ...prev.personalInfo, location: e.target.value }
                                            }))}
                                            placeholder="e.g., San Francisco, CA"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.personalInfo.email}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                personalInfo: { ...prev.personalInfo, email: e.target.value }
                                            }))}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            value={formData.personalInfo.phone}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                personalInfo: { ...prev.personalInfo, phone: e.target.value }
                                            }))}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="linkedin-url">LinkedIn URL</Label>
                                        <Input
                                            id="linkedin-url"
                                            value={formData.personalInfo.linkedinUrl}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                personalInfo: { ...prev.personalInfo, linkedinUrl: e.target.value }
                                            }))}
                                            placeholder="https://www.linkedin.com/in/your-profile"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <Label htmlFor="summary">Professional Summary</Label>
                                    <Textarea
                                        id="summary"
                                        value={formData.personalInfo.summary}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            personalInfo: { ...prev.personalInfo, summary: e.target.value }
                                        }))}
                                        placeholder="Write a brief summary of your professional background..."
                                        rows={4}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Experience Section */}
                        {renderExperienceSection()}

                        {/* Education Section */}
                        {renderEducationSection()}

                        {/* Skills Section */}
                        {renderSkillsSection()}
                    </div>
                )}

                {/* Imported Data Preview */}
                {importedData && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center">
                                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                                    Imported Data Preview
                                </span>
                                <Button
                                    variant="outline"
                                    onClick={() => setPreviewMode(!previewMode)}
                                >
                                    {previewMode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                                    {previewMode ? 'Hide' : 'Show'} Preview
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        {previewMode && (
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium mb-2">Personal Information</h4>
                                        <div className="bg-muted p-4 rounded-lg">
                                            <p><strong>Name:</strong> {importedData.personalInfo?.fullName}</p>
                                            <p><strong>Headline:</strong> {importedData.personalInfo?.headline}</p>
                                            <p><strong>Location:</strong> {importedData.personalInfo?.location}</p>
                                            <p><strong>Summary:</strong> {importedData.personalInfo?.summary}</p>
                                        </div>
                                    </div>
                                    
                                    {importedData.experience && importedData.experience.length > 0 && (
                                        <div>
                                            <h4 className="font-medium mb-2">Experience ({importedData.experience.length})</h4>
                                            <div className="space-y-2">
                                                {importedData.experience.map((exp, index) => (
                                                    <div key={index} className="bg-muted p-3 rounded-lg">
                                                        <p><strong>{exp.title}</strong> at {exp.company}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {exp.startDate} - {exp.endDate || 'Present'}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {importedData.education && importedData.education.length > 0 && (
                                        <div>
                                            <h4 className="font-medium mb-2">Education ({importedData.education.length})</h4>
                                            <div className="space-y-2">
                                                {importedData.education.map((edu, index) => (
                                                    <div key={index} className="bg-muted p-3 rounded-lg">
                                                        <p><strong>{edu.degree}</strong> in {edu.field}</p>
                                                        <p className="text-sm text-muted-foreground">{edu.school}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {importedData.skills && importedData.skills.length > 0 && (
                                        <div>
                                            <h4 className="font-medium mb-2">Skills ({importedData.skills.length})</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {importedData.skills.map((skill, index) => (
                                                    <Badge key={index} variant="secondary">
                                                        {skill.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        )}
                    </Card>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                    <Button variant="outline">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveImport}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Profile Data
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LinkedInImport;
