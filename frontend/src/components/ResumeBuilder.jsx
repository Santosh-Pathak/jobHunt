import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
    Plus, 
    Trash2, 
    Download, 
    Eye, 
    FileText, 
    Award, 
    Briefcase, 
    GraduationCap,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Save,
    Edit,
    Check
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import apiClient from '@/utils/axiosConfig';
import { USER_API_END_POINT } from '@/utils/constant';

const ResumeBuilder = () => {
    const { user } = useSelector(store => store.auth);
    const [activeTab, setActiveTab] = useState('personal');
    const [previewMode, setPreviewMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    
    // Resume data state
    const [resumeData, setResumeData] = useState({
        personalInfo: {
            fullName: user?.fullName || '',
            email: user?.email || '',
            phone: user?.phoneNumber || '',
            location: '',
            linkedin: '',
            portfolio: '',
            summary: ''
        },
        experience: [],
        education: [],
        skills: user?.profile?.skills || [],
        certifications: [],
        projects: []
    });

    const [editingIndex, setEditingIndex] = useState(null);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [currentSection, setCurrentSection] = useState('');

    // Add new item to resume sections
    const addItem = (section, data) => {
        setResumeData(prev => ({
            ...prev,
            [section]: [...prev[section], { ...data, id: Date.now() }]
        }));
        setShowAddDialog(false);
        setEditingIndex(null);
        toast.success(`${section.slice(0, -1)} added successfully`);
    };

    // Update existing item
    const updateItem = (section, index, data) => {
        setResumeData(prev => ({
            ...prev,
            [section]: prev[section].map((item, i) => 
                i === index ? { ...item, ...data } : item
            )
        }));
        setShowAddDialog(false);
        setEditingIndex(null);
        toast.success(`${section.slice(0, -1)} updated successfully`);
    };

    // Delete item
    const deleteItem = (section, index) => {
        setResumeData(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
        toast.success(`${section.slice(0, -1)} deleted successfully`);
    };

    // Save resume
    const saveResume = async () => {
        setSaving(true);
        try {
            const response = await apiClient.post(`${USER_API_END_POINT}/resume/save`, {
                resumeData,
                template: 'modern'
            });
            
            if (response.data.success) {
                toast.success('Resume saved successfully');
            }
        } catch (error) {
            toast.error('Failed to save resume');
        } finally {
            setSaving(false);
        }
    };

    // Download resume as PDF
    const downloadResume = async () => {
        setLoading(true);
        try {
            const response = await apiClient.post(`${USER_API_END_POINT}/resume/generate-pdf`, {
                resumeData,
                template: 'modern'
            }, {
                responseType: 'blob'
            });
            
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${resumeData.personalInfo.fullName}_Resume.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            toast.success('Resume downloaded successfully');
        } catch (error) {
            toast.error('Failed to generate PDF');
        } finally {
            setLoading(false);
        }
    };

    // Render form for adding/editing items
    const renderForm = (section) => {
        const isEditing = editingIndex !== null;
        const currentData = isEditing ? resumeData[section][editingIndex] : {};

        switch (section) {
            case 'experience':
                return (
                    <ExperienceForm 
                        data={currentData}
                        onSubmit={(data) => isEditing ? updateItem(section, editingIndex, data) : addItem(section, data)}
                        onCancel={() => setShowAddDialog(false)}
                    />
                );
            case 'education':
                return (
                    <EducationForm 
                        data={currentData}
                        onSubmit={(data) => isEditing ? updateItem(section, editingIndex, data) : addItem(section, data)}
                        onCancel={() => setShowAddDialog(false)}
                    />
                );
            case 'certifications':
                return (
                    <CertificationForm 
                        data={currentData}
                        onSubmit={(data) => isEditing ? updateItem(section, editingIndex, data) : addItem(section, data)}
                        onCancel={() => setShowAddDialog(false)}
                    />
                );
            case 'projects':
                return (
                    <ProjectForm 
                        data={currentData}
                        onSubmit={(data) => isEditing ? updateItem(section, editingIndex, data) : addItem(section, data)}
                        onCancel={() => setShowAddDialog(false)}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Resume Builder
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Create a professional resume with our easy-to-use builder
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex space-x-4">
                        <Button
                            variant={previewMode ? "outline" : "default"}
                            onClick={() => setPreviewMode(!previewMode)}
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            {previewMode ? 'Edit Mode' : 'Preview Mode'}
                        </Button>
                        <Button onClick={saveResume} disabled={saving}>
                            <Save className="w-4 h-4 mr-2" />
                            {saving ? 'Saving...' : 'Save Resume'}
                        </Button>
                        <Button onClick={downloadResume} disabled={loading}>
                            <Download className="w-4 h-4 mr-2" />
                            {loading ? 'Generating...' : 'Download PDF'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Resume Builder Form */}
                    {!previewMode && (
                        <div className="lg:col-span-2">
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <TabsList className="grid w-full grid-cols-5">
                                    <TabsTrigger value="personal">Personal</TabsTrigger>
                                    <TabsTrigger value="experience">Experience</TabsTrigger>
                                    <TabsTrigger value="education">Education</TabsTrigger>
                                    <TabsTrigger value="skills">Skills</TabsTrigger>
                                    <TabsTrigger value="projects">Projects</TabsTrigger>
                                </TabsList>

                                {/* Personal Information */}
                                <TabsContent value="personal" className="space-y-6">
                                    <PersonalInfoForm 
                                        data={resumeData.personalInfo}
                                        onChange={(data) => setResumeData(prev => ({
                                            ...prev,
                                            personalInfo: { ...prev.personalInfo, ...data }
                                        }))}
                                    />
                                </TabsContent>

                                {/* Experience */}
                                <TabsContent value="experience" className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold">Work Experience</h3>
                                        <Button 
                                            onClick={() => {
                                                setCurrentSection('experience');
                                                setShowAddDialog(true);
                                                setEditingIndex(null);
                                            }}
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Experience
                                        </Button>
                                    </div>
                                    <ExperienceList 
                                        experiences={resumeData.experience}
                                        onEdit={(index) => {
                                            setCurrentSection('experience');
                                            setEditingIndex(index);
                                            setShowAddDialog(true);
                                        }}
                                        onDelete={(index) => deleteItem('experience', index)}
                                    />
                                </TabsContent>

                                {/* Education */}
                                <TabsContent value="education" className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold">Education</h3>
                                        <Button 
                                            onClick={() => {
                                                setCurrentSection('education');
                                                setShowAddDialog(true);
                                                setEditingIndex(null);
                                            }}
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Education
                                        </Button>
                                    </div>
                                    <EducationList 
                                        education={resumeData.education}
                                        onEdit={(index) => {
                                            setCurrentSection('education');
                                            setEditingIndex(index);
                                            setShowAddDialog(true);
                                        }}
                                        onDelete={(index) => deleteItem('education', index)}
                                    />
                                </TabsContent>

                                {/* Skills */}
                                <TabsContent value="skills" className="space-y-6">
                                    <SkillsForm 
                                        skills={resumeData.skills}
                                        onChange={(skills) => setResumeData(prev => ({
                                            ...prev,
                                            skills
                                        }))}
                                    />
                                </TabsContent>

                                {/* Projects */}
                                <TabsContent value="projects" className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold">Projects</h3>
                                        <Button 
                                            onClick={() => {
                                                setCurrentSection('projects');
                                                setShowAddDialog(true);
                                                setEditingIndex(null);
                                            }}
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Project
                                        </Button>
                                    </div>
                                    <ProjectList 
                                        projects={resumeData.projects}
                                        onEdit={(index) => {
                                            setCurrentSection('projects');
                                            setEditingIndex(index);
                                            setShowAddDialog(true);
                                        }}
                                        onDelete={(index) => deleteItem('projects', index)}
                                    />
                                </TabsContent>
                            </Tabs>
                        </div>
                    )}

                    {/* Resume Preview */}
                    <div className="lg:col-span-1">
                        <ResumePreview resumeData={resumeData} />
                    </div>
                </div>

                {/* Add/Edit Dialog */}
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>
                                {editingIndex !== null ? 'Edit' : 'Add'} {currentSection.slice(0, -1)}
                            </DialogTitle>
                        </DialogHeader>
                        {renderForm(currentSection)}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

// Personal Information Form Component
const PersonalInfoForm = ({ data, onChange }) => (
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
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                        id="fullName"
                        value={data.fullName}
                        onChange={(e) => onChange({ fullName: e.target.value })}
                        placeholder="John Doe"
                    />
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => onChange({ email: e.target.value })}
                        placeholder="john@example.com"
                    />
                </div>
                <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        value={data.phone}
                        onChange={(e) => onChange({ phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                    />
                </div>
                <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                        id="location"
                        value={data.location}
                        onChange={(e) => onChange({ location: e.target.value })}
                        placeholder="New York, NY"
                    />
                </div>
                <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                        id="linkedin"
                        value={data.linkedin}
                        onChange={(e) => onChange({ linkedin: e.target.value })}
                        placeholder="linkedin.com/in/johndoe"
                    />
                </div>
                <div>
                    <Label htmlFor="portfolio">Portfolio</Label>
                    <Input
                        id="portfolio"
                        value={data.portfolio}
                        onChange={(e) => onChange({ portfolio: e.target.value })}
                        placeholder="johndoe.com"
                    />
                </div>
            </div>
            <div>
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                    id="summary"
                    value={data.summary}
                    onChange={(e) => onChange({ summary: e.target.value })}
                    placeholder="Brief summary of your professional background..."
                    rows={4}
                />
            </div>
        </CardContent>
    </Card>
);

// Experience Form Component
const ExperienceForm = ({ data = {}, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        company: data.company || '',
        position: data.position || '',
        location: data.location || '',
        startDate: data.startDate || '',
        endDate: data.endDate || '',
        current: data.current || false,
        description: data.description || '',
        achievements: data.achievements || []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="position">Position</Label>
                    <Input
                        id="position"
                        value={formData.position}
                        onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    />
                </div>
                <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                        id="startDate"
                        type="month"
                        value={formData.startDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                        id="endDate"
                        type="month"
                        value={formData.endDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                        disabled={formData.current}
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="current"
                        checked={formData.current}
                        onChange={(e) => setFormData(prev => ({ ...prev, current: e.target.checked }))}
                    />
                    <Label htmlFor="current">Currently working here</Label>
                </div>
            </div>
            <div>
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                />
            </div>
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">
                    <Check className="w-4 h-4 mr-2" />
                    Save
                </Button>
            </div>
        </form>
    );
};

// Experience List Component
const ExperienceList = ({ experiences, onEdit, onDelete }) => (
    <div className="space-y-4">
        {experiences.map((exp, index) => (
            <Card key={exp.id}>
                <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h4 className="font-semibold">{exp.position}</h4>
                            <p className="text-sm text-gray-600">{exp.company}</p>
                            <p className="text-xs text-gray-500">
                                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                            </p>
                            <p className="text-sm mt-2">{exp.description}</p>
                        </div>
                        <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => onEdit(index)}>
                                <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => onDelete(index)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        ))}
        {experiences.length === 0 && (
            <div className="text-center py-8 text-gray-500">
                <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No work experience added yet</p>
            </div>
        )}
    </div>
);

// Education Form Component
const EducationForm = ({ data = {}, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        institution: data.institution || '',
        degree: data.degree || '',
        field: data.field || '',
        startDate: data.startDate || '',
        endDate: data.endDate || '',
        gpa: data.gpa || '',
        description: data.description || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="institution">Institution</Label>
                    <Input
                        id="institution"
                        value={formData.institution}
                        onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="degree">Degree</Label>
                    <Input
                        id="degree"
                        value={formData.degree}
                        onChange={(e) => setFormData(prev => ({ ...prev, degree: e.target.value }))}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="field">Field of Study</Label>
                    <Input
                        id="field"
                        value={formData.field}
                        onChange={(e) => setFormData(prev => ({ ...prev, field: e.target.value }))}
                    />
                </div>
                <div>
                    <Label htmlFor="gpa">GPA</Label>
                    <Input
                        id="gpa"
                        value={formData.gpa}
                        onChange={(e) => setFormData(prev => ({ ...prev, gpa: e.target.value }))}
                    />
                </div>
                <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                        id="startDate"
                        type="month"
                        value={formData.startDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                        id="endDate"
                        type="month"
                        value={formData.endDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                        required
                    />
                </div>
            </div>
            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                />
            </div>
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">
                    <Check className="w-4 h-4 mr-2" />
                    Save
                </Button>
            </div>
        </form>
    );
};

// Education List Component
const EducationList = ({ education, onEdit, onDelete }) => (
    <div className="space-y-4">
        {education.map((edu, index) => (
            <Card key={edu.id}>
                <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h4 className="font-semibold">{edu.degree}</h4>
                            <p className="text-sm text-gray-600">{edu.institution}</p>
                            <p className="text-xs text-gray-500">
                                {edu.startDate} - {edu.endDate}
                            </p>
                            {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
                        </div>
                        <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => onEdit(index)}>
                                <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => onDelete(index)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        ))}
        {education.length === 0 && (
            <div className="text-center py-8 text-gray-500">
                <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No education added yet</p>
            </div>
        )}
    </div>
);

// Skills Form Component
const SkillsForm = ({ skills, onChange }) => {
    const [newSkill, setNewSkill] = useState('');

    const addSkill = () => {
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            onChange([...skills, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        onChange(skills.filter(skill => skill !== skillToRemove));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex space-x-2">
                    <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a skill"
                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <Button onClick={addSkill}>
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                            <span>{skill}</span>
                            <button onClick={() => removeSkill(skill)}>
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

// Project Form Component
const ProjectForm = ({ data = {}, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: data.name || '',
        description: data.description || '',
        technologies: data.technologies || [],
        url: data.url || '',
        github: data.github || '',
        startDate: data.startDate || '',
        endDate: data.endDate || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Project Name</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                />
            </div>
            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="url">Project URL</Label>
                    <Input
                        id="url"
                        value={formData.url}
                        onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    />
                </div>
                <div>
                    <Label htmlFor="github">GitHub URL</Label>
                    <Input
                        id="github"
                        value={formData.github}
                        onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
                    />
                </div>
            </div>
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">
                    <Check className="w-4 h-4 mr-2" />
                    Save
                </Button>
            </div>
        </form>
    );
};

// Project List Component
const ProjectList = ({ projects, onEdit, onDelete }) => (
    <div className="space-y-4">
        {projects.map((project, index) => (
            <Card key={project.id}>
                <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h4 className="font-semibold">{project.name}</h4>
                            <p className="text-sm mt-2">{project.description}</p>
                            {project.url && (
                                <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm">
                                    View Project
                                </a>
                            )}
                        </div>
                        <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => onEdit(index)}>
                                <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => onDelete(index)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        ))}
        {projects.length === 0 && (
            <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No projects added yet</p>
            </div>
        )}
    </div>
);

// Certification Form Component
const CertificationForm = ({ data = {}, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: data.name || '',
        issuer: data.issuer || '',
        date: data.date || '',
        url: data.url || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="name">Certification Name</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="issuer">Issuing Organization</Label>
                    <Input
                        id="issuer"
                        value={formData.issuer}
                        onChange={(e) => setFormData(prev => ({ ...prev, issuer: e.target.value }))}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                        id="date"
                        type="month"
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="url">Verification URL</Label>
                    <Input
                        id="url"
                        value={formData.url}
                        onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    />
                </div>
            </div>
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">
                    <Check className="w-4 h-4 mr-2" />
                    Save
                </Button>
            </div>
        </form>
    );
};

// Resume Preview Component
const ResumePreview = ({ resumeData }) => (
    <Card className="sticky top-6">
        <CardHeader>
            <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Resume Preview
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="bg-white p-6 shadow-lg max-h-96 overflow-y-auto">
                {/* Header */}
                <div className="text-center mb-6 border-b pb-4">
                    <h1 className="text-2xl font-bold">{resumeData.personalInfo.fullName}</h1>
                    <div className="flex justify-center space-x-4 text-sm text-gray-600 mt-2">
                        <span>{resumeData.personalInfo.email}</span>
                        <span>{resumeData.personalInfo.phone}</span>
                        <span>{resumeData.personalInfo.location}</span>
                    </div>
                </div>

                {/* Summary */}
                {resumeData.personalInfo.summary && (
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2">Summary</h2>
                        <p className="text-sm">{resumeData.personalInfo.summary}</p>
                    </div>
                )}

                {/* Experience */}
                {resumeData.experience.length > 0 && (
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2">Experience</h2>
                        {resumeData.experience.map((exp, index) => (
                            <div key={index} className="mb-3">
                                <h3 className="font-semibold">{exp.position}</h3>
                                <p className="text-sm text-gray-600">{exp.company}</p>
                                <p className="text-xs text-gray-500">
                                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                </p>
                                <p className="text-sm mt-1">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Education */}
                {resumeData.education.length > 0 && (
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2">Education</h2>
                        {resumeData.education.map((edu, index) => (
                            <div key={index} className="mb-3">
                                <h3 className="font-semibold">{edu.degree}</h3>
                                <p className="text-sm text-gray-600">{edu.institution}</p>
                                <p className="text-xs text-gray-500">
                                    {edu.startDate} - {edu.endDate}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Skills */}
                {resumeData.skills.length > 0 && (
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2">Skills</h2>
                        <div className="flex flex-wrap gap-1">
                            {resumeData.skills.map((skill, index) => (
                                <span key={index} className="bg-gray-100 px-2 py-1 rounded text-xs">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Projects */}
                {resumeData.projects.length > 0 && (
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2">Projects</h2>
                        {resumeData.projects.map((project, index) => (
                            <div key={index} className="mb-3">
                                <h3 className="font-semibold">{project.name}</h3>
                                <p className="text-sm">{project.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </CardContent>
    </Card>
);

export default ResumeBuilder;
