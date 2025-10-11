import { Analytics } from '../models/analytics.model.js';
import { User } from '../models/user.model.js';
import { Job } from '../models/job.model.js';
import Company from '../models/company.model.js';
import { Application } from '../models/application.model.js';

export const trackEvent = async (req, res) => {
    try {
        const { type, data } = req.body;
        const userId = req.user._id;

        const analytics = new Analytics({
            user: userId,
            type,
            data: {
                ...data,
                userAgent: req.get('User-Agent'),
                ipAddress: req.ip
            },
            sessionId: req.sessionID
        });

        await analytics.save();

        res.status(201).json({
            success: true,
            message: 'Event tracked successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getUserAnalytics = async (req, res) => {
    try {
        const userId = req.user._id;
        const { period = '30d' } = req.query;

        const dateFilter = getDateFilter(period);
        
        const analytics = await Analytics.aggregate([
            { $match: { user: userId, timestamp: dateFilter } },
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 },
                    lastActivity: { $max: '$timestamp' }
                }
            }
        ]);

        const profileViews = await Analytics.countDocuments({
            user: userId,
            type: 'profile_view',
            timestamp: dateFilter
        });

        const jobApplications = await Application.countDocuments({
            user: userId,
            createdAt: dateFilter
        });

        res.status(200).json({
            success: true,
            analytics: {
                events: analytics,
                profileViews,
                jobApplications
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getJobAnalytics = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.user._id;

        // Verify user owns this job
        const job = await Job.findOne({ _id: jobId, createdBy: userId });
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        const views = await Analytics.countDocuments({
            'data.jobId': jobId,
            type: 'job_view'
        });

        const applications = await Application.countDocuments({
            job: jobId
        });

        const applicationSources = await Analytics.aggregate([
            { $match: { 'data.jobId': jobId, type: 'application_submit' } },
            {
                $group: {
                    _id: '$data.referrer',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            analytics: {
                views,
                applications,
                applicationSources
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getCompanyAnalytics = async (req, res) => {
    try {
        const { companyId } = req.params;
        const userId = req.user._id;

        // Verify user owns this company
        const company = await Company.findOne({ _id: companyId, userId: userId });
        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }

        const jobs = await Job.find({ company: companyId });
        const jobIds = jobs.map(job => job._id);

        const totalViews = await Analytics.countDocuments({
            'data.jobId': { $in: jobIds },
            type: 'job_view'
        });

        const totalApplications = await Application.countDocuments({
            job: { $in: jobIds }
        });

        const jobStats = await Promise.all(jobs.map(async (job) => {
            const views = await Analytics.countDocuments({
                'data.jobId': job._id,
                type: 'job_view'
            });
            const applications = await Application.countDocuments({
                job: job._id
            });
            return {
                jobId: job._id,
                title: job.title,
                views,
                applications
            };
        }));

        res.status(200).json({
            success: true,
            analytics: {
                totalViews,
                totalApplications,
                jobStats
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getPlatformAnalytics = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        const totalUsers = await User.countDocuments();
        const totalJobs = await Job.countDocuments();
        const totalCompanies = await Company.countDocuments();
        const totalApplications = await Application.countDocuments();

        const userGrowth = await User.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        const jobCategories = await Job.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.status(200).json({
            success: true,
            analytics: {
                totalUsers,
                totalJobs,
                totalCompanies,
                totalApplications,
                userGrowth,
                jobCategories
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const userRole = req.user.role;

        if (userRole === 'student') {
            const applications = await Application.countDocuments({ user: userId });
            const savedJobs = await User.findById(userId).select('savedJobs');
            const profileViews = await Analytics.countDocuments({
                user: userId,
                type: 'profile_view'
            });

            res.status(200).json({
                success: true,
                stats: {
                    applications,
                    savedJobs: savedJobs?.savedJobs?.length || 0,
                    profileViews
                }
            });
        } else if (userRole === 'recruiter') {
            const jobs = await Job.countDocuments({ createdBy: userId });
            const applications = await Application.countDocuments({
                job: { $in: await Job.find({ createdBy: userId }).select('_id') }
            });
            const companies = await Company.countDocuments({ userId: userId });

            res.status(200).json({
                success: true,
                stats: {
                    jobs,
                    applications,
                    companies
                }
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

function getDateFilter(period) {
    const now = new Date();
    const filter = {};

    switch (period) {
        case '7d':
            filter.$gte = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case '30d':
            filter.$gte = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
        case '90d':
            filter.$gte = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
        case '1y':
            filter.$gte = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
        default:
            filter.$gte = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    return filter;
}
