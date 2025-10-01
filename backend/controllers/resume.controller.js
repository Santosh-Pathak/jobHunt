import { User } from '../models/user.model.js';
import { Job } from '../models/job.model.js';
import { Application } from '../models/application.model.js';
import cloudinary from '../utils/cloudinary.js';
import { getDataUri } from '../utils/datauri.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// Save resume data
export const saveResume = async (req, res) => {
    try {
        const userId = req.user._id;
        const { resumeData, template } = req.body;

        // Update user's resume data
        const user = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    'profile.resumeData': resumeData,
                    'profile.resumeTemplate': template
                }
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Resume saved successfully',
            resumeData: user.profile.resumeData
        });
    } catch (error) {
        console.error('Error saving resume:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save resume',
            error: error.message
        });
    }
};

// Generate PDF resume
export const generatePDFResume = async (req, res) => {
    try {
        const userId = req.user._id;
        const { resumeData, template } = req.body;

        // Create PDF document
        const doc = new PDFDocument({
            size: 'A4',
            margin: 50
        });

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${resumeData.personalInfo.fullName}_Resume.pdf"`);

        // Pipe PDF to response
        doc.pipe(res);

        // Add content to PDF
        addResumeContent(doc, resumeData, template);

        // Finalize PDF
        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate PDF',
            error: error.message
        });
    }
};

// Add resume content to PDF
const addResumeContent = (doc, resumeData, template) => {
    const { personalInfo, experience, education, skills, projects, certifications } = resumeData;

    // Header
    doc.fontSize(24).font('Helvetica-Bold').text(personalInfo.fullName, 50, 50, { align: 'center' });
    
    // Contact information
    doc.fontSize(10).font('Helvetica').text(
        `${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.location}`,
        50, 80, { align: 'center' }
    );

    if (personalInfo.linkedin) {
        doc.text(`LinkedIn: ${personalInfo.linkedin}`, 50, 95, { align: 'center' });
    }
    if (personalInfo.portfolio) {
        doc.text(`Portfolio: ${personalInfo.portfolio}`, 50, 110, { align: 'center' });
    }

    let yPosition = 130;

    // Professional Summary
    if (personalInfo.summary) {
        doc.fontSize(14).font('Helvetica-Bold').text('PROFESSIONAL SUMMARY', 50, yPosition);
        yPosition += 20;
        doc.fontSize(10).font('Helvetica').text(personalInfo.summary, 50, yPosition, {
            width: 500,
            align: 'justify'
        });
        yPosition += doc.heightOfString(personalInfo.summary, { width: 500 }) + 20;
    }

    // Experience
    if (experience && experience.length > 0) {
        doc.fontSize(14).font('Helvetica-Bold').text('EXPERIENCE', 50, yPosition);
        yPosition += 20;

        experience.forEach(exp => {
            doc.fontSize(12).font('Helvetica-Bold').text(exp.position, 50, yPosition);
            yPosition += 15;
            doc.fontSize(10).font('Helvetica').text(`${exp.company} | ${exp.location}`, 50, yPosition);
            yPosition += 12;
            doc.fontSize(9).font('Helvetica').text(`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`, 50, yPosition);
            yPosition += 15;

            if (exp.description) {
                doc.fontSize(10).font('Helvetica').text(exp.description, 50, yPosition, {
                    width: 500,
                    align: 'justify'
                });
                yPosition += doc.heightOfString(exp.description, { width: 500 }) + 15;
            }
        });
    }

    // Education
    if (education && education.length > 0) {
        doc.fontSize(14).font('Helvetica-Bold').text('EDUCATION', 50, yPosition);
        yPosition += 20;

        education.forEach(edu => {
            doc.fontSize(12).font('Helvetica-Bold').text(edu.degree, 50, yPosition);
            yPosition += 15;
            doc.fontSize(10).font('Helvetica').text(edu.institution, 50, yPosition);
            yPosition += 12;
            doc.fontSize(9).font('Helvetica').text(`${edu.startDate} - ${edu.endDate}`, 50, yPosition);
            yPosition += 15;

            if (edu.gpa) {
                doc.fontSize(10).font('Helvetica').text(`GPA: ${edu.gpa}`, 50, yPosition);
                yPosition += 15;
            }
        });
    }

    // Skills
    if (skills && skills.length > 0) {
        doc.fontSize(14).font('Helvetica-Bold').text('SKILLS', 50, yPosition);
        yPosition += 20;
        doc.fontSize(10).font('Helvetica').text(skills.join(' • '), 50, yPosition, {
            width: 500
        });
        yPosition += 30;
    }

    // Projects
    if (projects && projects.length > 0) {
        doc.fontSize(14).font('Helvetica-Bold').text('PROJECTS', 50, yPosition);
        yPosition += 20;

        projects.forEach(project => {
            doc.fontSize(12).font('Helvetica-Bold').text(project.name, 50, yPosition);
            yPosition += 15;

            if (project.description) {
                doc.fontSize(10).font('Helvetica').text(project.description, 50, yPosition, {
                    width: 500,
                    align: 'justify'
                });
                yPosition += doc.heightOfString(project.description, { width: 500 }) + 15;
            }

            if (project.url) {
                doc.fontSize(9).font('Helvetica').text(`URL: ${project.url}`, 50, yPosition);
                yPosition += 12;
            }
        });
    }

    // Certifications
    if (certifications && certifications.length > 0) {
        doc.fontSize(14).font('Helvetica-Bold').text('CERTIFICATIONS', 50, yPosition);
        yPosition += 20;

        certifications.forEach(cert => {
            doc.fontSize(12).font('Helvetica-Bold').text(cert.name, 50, yPosition);
            yPosition += 15;
            doc.fontSize(10).font('Helvetica').text(cert.issuer, 50, yPosition);
            yPosition += 12;
            doc.fontSize(9).font('Helvetica').text(cert.date, 50, yPosition);
            yPosition += 20;
        });
    }
};

// Get saved resume data
export const getResumeData = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).select('profile.resumeData profile.resumeTemplate');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            resumeData: user.profile.resumeData || {},
            template: user.profile.resumeTemplate || 'modern'
        });
    } catch (error) {
        console.error('Error getting resume data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get resume data',
            error: error.message
        });
    }
};

// Delete resume
export const deleteResume = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findByIdAndUpdate(
            userId,
            {
                $unset: {
                    'profile.resumeData': 1,
                    'profile.resumeTemplate': 1
                }
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Resume deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting resume:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete resume',
            error: error.message
        });
    }
};

// Get resume templates
export const getResumeTemplates = async (req, res) => {
    try {
        const templates = [
            {
                id: 'modern',
                name: 'Modern',
                description: 'Clean and professional design',
                preview: '/templates/modern-preview.png'
            },
            {
                id: 'classic',
                name: 'Classic',
                description: 'Traditional and formal layout',
                preview: '/templates/classic-preview.png'
            },
            {
                id: 'creative',
                name: 'Creative',
                description: 'Modern with creative elements',
                preview: '/templates/creative-preview.png'
            },
            {
                id: 'minimal',
                name: 'Minimal',
                description: 'Simple and clean design',
                preview: '/templates/minimal-preview.png'
            }
        ];

        res.status(200).json({
            success: true,
            templates
        });
    } catch (error) {
        console.error('Error getting templates:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get templates',
            error: error.message
        });
    }
};

// Upload resume file
export const uploadResumeFile = async (req, res) => {
    try {
        const userId = req.user._id;
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Validate file type
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.mimetype)) {
            return res.status(400).json({
                success: false,
                message: 'Only PDF and Word documents are allowed'
            });
        }

        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return res.status(400).json({
                success: false,
                message: 'File size must be less than 5MB'
            });
        }

        // Upload to Cloudinary
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
            resource_type: 'raw',
            folder: 'resumes'
        });

        // Update user's resume file
        const user = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    'profile.resume': cloudResponse.secure_url,
                    'profile.resumeOriginalName': file.originalname
                }
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Resume uploaded successfully',
            resumeUrl: cloudResponse.secure_url,
            originalName: file.originalname
        });
    } catch (error) {
        console.error('Error uploading resume:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload resume',
            error: error.message
        });
    }
};

// Parse resume file (extract text for auto-filling)
export const parseResumeFile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { resumeUrl } = req.body;

        if (!resumeUrl) {
            return res.status(400).json({
                success: false,
                message: 'Resume URL is required'
            });
        }

        // This would integrate with a resume parsing service
        // For now, return a mock response
        const parsedData = {
            personalInfo: {
                fullName: '',
                email: '',
                phone: '',
                location: ''
            },
            experience: [],
            education: [],
            skills: [],
            summary: ''
        };

        res.status(200).json({
            success: true,
            parsedData
        });
    } catch (error) {
        console.error('Error parsing resume:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to parse resume',
            error: error.message
        });
    }
};
