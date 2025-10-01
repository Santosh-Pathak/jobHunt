import { Application } from '../models/application.model.js';
import { User } from '../models/user.model.js';
import { Job } from '../models/job.model.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/resumes';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `resume-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and Word documents are allowed'), false);
        }
    }
});

// Create or update application draft
export const createOrUpdateDraft = async (req, res) => {
    try {
        const { 
            jobId, 
            jobTitle, 
            companyName, 
            coverLetter, 
            resumeUrl, 
            expectedSalary, 
            availability, 
            noticePeriod, 
            additionalInfo, 
            customFields,
            isAutoSave = false
        } = req.body;
        
        const userId = req.user._id;

        if (!jobId || !coverLetter) {
            return res.status(400).json({
                success: false,
                message: 'Job ID and cover letter are required'
            });
        }

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Check if user already has a draft for this job
        let draft = await Application.findOne({
            user: userId,
            job: jobId,
            status: 'draft'
        });

        if (draft) {
            // Update existing draft
            draft.coverLetter = coverLetter;
            draft.resume = resumeUrl;
            draft.expectedSalary = expectedSalary;
            draft.availability = availability;
            draft.noticePeriod = noticePeriod;
            draft.additionalInfo = additionalInfo;
            draft.customFields = customFields || {};
            draft.jobTitle = jobTitle;
            draft.companyName = companyName;
            draft.updatedAt = new Date();
            
            await draft.save();
        } else {
            // Create new draft
            draft = new Application({
                user: userId,
                job: jobId,
                company: job.company,
                status: 'draft',
                coverLetter,
                resume: resumeUrl,
                expectedSalary,
                availability,
                noticePeriod,
                additionalInfo,
                customFields: customFields || {},
                jobTitle,
                companyName,
                isAutoSave
            });
            
            await draft.save();
        }

        res.status(200).json({
            success: true,
            message: isAutoSave ? 'Draft auto-saved' : 'Draft saved successfully',
            draft: draft
        });
    } catch (error) {
        console.error('Create/update draft error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save draft'
        });
    }
};

// Get user's drafts
export const getUserDrafts = async (req, res) => {
    try {
        const userId = req.user._id;
        const { page = 1, limit = 10 } = req.query;

        const drafts = await Application.find({
            user: userId,
            status: 'draft'
        })
        .populate('job', 'title company')
        .sort({ updatedAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

        const total = await Application.countDocuments({
            user: userId,
            status: 'draft'
        });

        res.status(200).json({
            success: true,
            drafts,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error('Get drafts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch drafts'
        });
    }
};

// Get specific draft
export const getDraft = async (req, res) => {
    try {
        const { draftId } = req.params;
        const userId = req.user._id;

        const draft = await Application.findOne({
            _id: draftId,
            user: userId,
            status: 'draft'
        }).populate('job', 'title company');

        if (!draft) {
            return res.status(404).json({
                success: false,
                message: 'Draft not found'
            });
        }

        res.status(200).json({
            success: true,
            draft
        });
    } catch (error) {
        console.error('Get draft error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch draft'
        });
    }
};

// Delete draft
export const deleteDraft = async (req, res) => {
    try {
        const { draftId } = req.params;
        const userId = req.user._id;

        const draft = await Application.findOne({
            _id: draftId,
            user: userId,
            status: 'draft'
        });

        if (!draft) {
            return res.status(404).json({
                success: false,
                message: 'Draft not found'
            });
        }

        // Delete resume file if exists
        if (draft.resume && draft.resume.startsWith('uploads/')) {
            const filePath = path.join(process.cwd(), draft.resume);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await Application.findByIdAndDelete(draftId);

        res.status(200).json({
            success: true,
            message: 'Draft deleted successfully'
        });
    } catch (error) {
        console.error('Delete draft error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete draft'
        });
    }
};

// Submit draft as application
export const submitDraft = async (req, res) => {
    try {
        const { draftId } = req.params;
        const userId = req.user._id;

        const draft = await Application.findOne({
            _id: draftId,
            user: userId,
            status: 'draft'
        }).populate('job');

        if (!draft) {
            return res.status(404).json({
                success: false,
                message: 'Draft not found'
            });
        }

        // Check if job is still active
        if (draft.job.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'This job is no longer accepting applications'
            });
        }

        // Check if user already applied to this job
        const existingApplication = await Application.findOne({
            user: userId,
            job: draft.job._id,
            status: { $ne: 'draft' }
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied to this job'
            });
        }

        // Update draft to submitted status
        draft.status = 'pending';
        draft.submittedAt = new Date();
        await draft.save();

        res.status(200).json({
            success: true,
            message: 'Application submitted successfully',
            application: draft
        });
    } catch (error) {
        console.error('Submit draft error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit application'
        });
    }
};

// Upload resume for draft
export const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const resumeUrl = req.file.path;
        const userId = req.user._id;

        res.status(200).json({
            success: true,
            message: 'Resume uploaded successfully',
            resumeUrl,
            filename: req.file.filename
        });
    } catch (error) {
        console.error('Upload resume error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload resume'
        });
    }
};

// Get draft statistics
export const getDraftStats = async (req, res) => {
    try {
        const userId = req.user._id;

        const stats = await Application.aggregate([
            {
                $match: {
                    user: userId,
                    status: 'draft'
                }
            },
            {
                $group: {
                    _id: null,
                    totalDrafts: { $sum: 1 },
                    recentDrafts: {
                        $sum: {
                            $cond: [
                                { $gte: ['$updatedAt', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] },
                                1,
                                0
                            ]
                        }
                    },
                    oldestDraft: { $min: '$createdAt' },
                    newestDraft: { $max: '$updatedAt' }
                }
            }
        ]);

        const result = stats[0] || {
            totalDrafts: 0,
            recentDrafts: 0,
            oldestDraft: null,
            newestDraft: null
        };

        res.status(200).json({
            success: true,
            stats: result
        });
    } catch (error) {
        console.error('Get draft stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch draft statistics'
        });
    }
};

// Clean up old drafts
export const cleanupOldDrafts = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        
        const oldDrafts = await Application.find({
            status: 'draft',
            updatedAt: { $lt: thirtyDaysAgo }
        });

        let deletedCount = 0;
        for (const draft of oldDrafts) {
            // Delete resume file if exists
            if (draft.resume && draft.resume.startsWith('uploads/')) {
                const filePath = path.join(process.cwd(), draft.resume);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            
            await Application.findByIdAndDelete(draft._id);
            deletedCount++;
        }

        res.status(200).json({
            success: true,
            message: `Cleaned up ${deletedCount} old drafts`,
            deletedCount
        });
    } catch (error) {
        console.error('Cleanup drafts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cleanup old drafts'
        });
    }
};

export { upload };
