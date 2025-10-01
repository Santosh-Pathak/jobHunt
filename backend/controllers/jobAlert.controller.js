import { JobAlert } from '../models/jobAlert.model.js';
import { User } from '../models/user.model.js';
import { Job } from '../models/job.model.js';
import { Notification } from '../models/notification.model.js';

// Create a new job alert
export const createJobAlert = async (req, res) => {
    try {
        const userId = req.user._id;
        const {
            name,
            keywords,
            location,
            jobType,
            experienceLevel,
            salaryMin,
            salaryMax,
            companySize,
            industry,
            remoteWork,
            frequency,
            emailNotifications,
            pushNotifications,
            isActive = true
        } = req.body;

        // Validate required fields
        if (!name || !keywords || keywords.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Alert name and keywords are required'
            });
        }

        // Check if user has reached the maximum number of alerts (20)
        const existingAlertsCount = await JobAlert.countDocuments({ user: userId });
        if (existingAlertsCount >= 20) {
            return res.status(400).json({
                success: false,
                message: 'Maximum number of alerts (20) reached'
            });
        }

        // Create job alert
        const jobAlert = new JobAlert({
            user: userId,
            name,
            keywords,
            location,
            jobType,
            experienceLevel,
            salaryMin,
            salaryMax,
            companySize,
            industry,
            remoteWork,
            frequency,
            emailNotifications,
            pushNotifications,
            isActive,
            lastChecked: new Date()
        });

        await jobAlert.save();

        // Populate alert with user details
        await jobAlert.populate('user', 'fullName email');

        res.status(201).json({
            success: true,
            message: 'Job alert created successfully',
            alert: jobAlert
        });
    } catch (error) {
        console.error('Error creating job alert:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create job alert',
            error: error.message
        });
    }
};

// Get all job alerts for a user
export const getUserJobAlerts = async (req, res) => {
    try {
        const userId = req.user._id;
        const { page = 1, limit = 10, isActive } = req.query;

        const filter = { user: userId };
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        const alerts = await JobAlert.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await JobAlert.countDocuments(filter);

        // Get match counts for each alert
        const alertsWithMatches = await Promise.all(
            alerts.map(async (alert) => {
                const matchesCount = await getJobMatchesCount(alert);
                return {
                    ...alert.toObject(),
                    matchesCount
                };
            })
        );

        res.status(200).json({
            success: true,
            alerts: alertsWithMatches,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error('Error fetching job alerts:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch job alerts',
            error: error.message
        });
    }
};

// Get job alert by ID
export const getJobAlertById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const alert = await JobAlert.findOne({ _id: id, user: userId });
        if (!alert) {
            return res.status(404).json({
                success: false,
                message: 'Job alert not found'
            });
        }

        const matchesCount = await getJobMatchesCount(alert);

        res.status(200).json({
            success: true,
            alert: {
                ...alert.toObject(),
                matchesCount
            }
        });
    } catch (error) {
        console.error('Error fetching job alert:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch job alert',
            error: error.message
        });
    }
};

// Update job alert
export const updateJobAlert = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const updateData = req.body;

        const alert = await JobAlert.findOneAndUpdate(
            { _id: id, user: userId },
            { ...updateData, updatedAt: new Date() },
            { new: true }
        );

        if (!alert) {
            return res.status(404).json({
                success: false,
                message: 'Job alert not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Job alert updated successfully',
            alert
        });
    } catch (error) {
        console.error('Error updating job alert:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update job alert',
            error: error.message
        });
    }
};

// Delete job alert
export const deleteJobAlert = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const alert = await JobAlert.findOneAndDelete({ _id: id, user: userId });
        if (!alert) {
            return res.status(404).json({
                success: false,
                message: 'Job alert not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Job alert deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting job alert:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete job alert',
            error: error.message
        });
    }
};

// Toggle job alert status
export const toggleJobAlert = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        const userId = req.user._id;

        const alert = await JobAlert.findOneAndUpdate(
            { _id: id, user: userId },
            { isActive, updatedAt: new Date() },
            { new: true }
        );

        if (!alert) {
            return res.status(404).json({
                success: false,
                message: 'Job alert not found'
            });
        }

        res.status(200).json({
            success: true,
            message: `Job alert ${isActive ? 'activated' : 'deactivated'} successfully`,
            alert
        });
    } catch (error) {
        console.error('Error toggling job alert:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle job alert',
            error: error.message
        });
    }
};

// Get matching jobs for an alert
export const getMatchingJobs = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const { page = 1, limit = 10 } = req.query;

        const alert = await JobAlert.findOne({ _id: id, user: userId });
        if (!alert) {
            return res.status(404).json({
                success: false,
                message: 'Job alert not found'
            });
        }

        const matchingJobs = await getJobMatches(alert, page, limit);

        res.status(200).json({
            success: true,
            jobs: matchingJobs.jobs,
            pagination: matchingJobs.pagination
        });
    } catch (error) {
        console.error('Error fetching matching jobs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch matching jobs',
            error: error.message
        });
    }
};

// Process job alerts (called by cron job)
export const processJobAlerts = async (req, res) => {
    try {
        const alerts = await JobAlert.find({ isActive: true });
        let processedCount = 0;
        let notificationCount = 0;

        for (const alert of alerts) {
            const shouldProcess = shouldProcessAlert(alert);
            if (!shouldProcess) continue;

            const matchingJobs = await getJobMatches(alert, 1, 10);
            
            if (matchingJobs.jobs.length > 0) {
                // Create notification
                const notification = new Notification({
                    user: alert.user,
                    type: 'job_alert',
                    title: 'New Job Matches',
                    message: `Found ${matchingJobs.jobs.length} new job(s) matching your alert "${alert.name}"`,
                    data: {
                        alertId: alert._id,
                        jobCount: matchingJobs.jobs.length,
                        jobs: matchingJobs.jobs.map(job => job._id)
                    },
                    priority: 'medium'
                });

                await notification.save();
                notificationCount++;

                // Update alert last checked time
                alert.lastChecked = new Date();
                alert.lastNotificationSent = new Date();
                await alert.save();
            }

            processedCount++;
        }

        res.status(200).json({
            success: true,
            message: 'Job alerts processed successfully',
            processed: processedCount,
            notifications: notificationCount
        });
    } catch (error) {
        console.error('Error processing job alerts:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process job alerts',
            error: error.message
        });
    }
};

// Helper function to get job matches for an alert
const getJobMatches = async (alert, page = 1, limit = 10) => {
    const filter = { status: 'active' };

    // Keywords filter
    if (alert.keywords && alert.keywords.length > 0) {
        filter.$or = [
            { title: { $regex: alert.keywords.join('|'), $options: 'i' } },
            { description: { $regex: alert.keywords.join('|'), $options: 'i' } },
            { requirements: { $regex: alert.keywords.join('|'), $options: 'i' } }
        ];
    }

    // Location filter
    if (alert.location) {
        filter.location = { $regex: alert.location, $options: 'i' };
    }

    // Job type filter
    if (alert.jobType) {
        filter.jobType = alert.jobType;
    }

    // Experience level filter
    if (alert.experienceLevel) {
        filter.experience = { $lte: getExperienceValue(alert.experienceLevel) };
    }

    // Salary filter
    if (alert.salaryMin || alert.salaryMax) {
        filter.salary = {};
        if (alert.salaryMin) filter.salary.$gte = alert.salaryMin;
        if (alert.salaryMax) filter.salary.$lte = alert.salaryMax;
    }

    // Company size filter
    if (alert.companySize) {
        // This would need to be implemented based on company data
    }

    // Industry filter
    if (alert.industry) {
        // This would need to be implemented based on company data
    }

    // Remote work filter
    if (alert.remoteWork) {
        filter.$or = [
            { ...filter.$or },
            { location: { $regex: 'remote', $options: 'i' } },
            { location: { $regex: 'work from home', $options: 'i' } }
        ];
    }

    const jobs = await Job.find(filter)
        .populate('company', 'name logo location')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

    const total = await Job.countDocuments(filter);

    return {
        jobs,
        pagination: {
            current: parseInt(page),
            pages: Math.ceil(total / limit),
            total
        }
    };
};

// Helper function to get job matches count
const getJobMatchesCount = async (alert) => {
    const filter = { status: 'active' };

    if (alert.keywords && alert.keywords.length > 0) {
        filter.$or = [
            { title: { $regex: alert.keywords.join('|'), $options: 'i' } },
            { description: { $regex: alert.keywords.join('|'), $options: 'i' } },
            { requirements: { $regex: alert.keywords.join('|'), $options: 'i' } }
        ];
    }

    if (alert.location) {
        filter.location = { $regex: alert.location, $options: 'i' };
    }

    if (alert.jobType) {
        filter.jobType = alert.jobType;
    }

    if (alert.experienceLevel) {
        filter.experience = { $lte: getExperienceValue(alert.experienceLevel) };
    }

    if (alert.salaryMin || alert.salaryMax) {
        filter.salary = {};
        if (alert.salaryMin) filter.salary.$gte = alert.salaryMin;
        if (alert.salaryMax) filter.salary.$lte = alert.salaryMax;
    }

    if (alert.remoteWork) {
        filter.$or = [
            { ...filter.$or },
            { location: { $regex: 'remote', $options: 'i' } },
            { location: { $regex: 'work from home', $options: 'i' } }
        ];
    }

    return await Job.countDocuments(filter);
};

// Helper function to check if alert should be processed
const shouldProcessAlert = (alert) => {
    const now = new Date();
    const lastChecked = alert.lastChecked || alert.createdAt;
    const timeDiff = now - lastChecked;

    switch (alert.frequency) {
        case 'instant':
            return true;
        case 'daily':
            return timeDiff >= 24 * 60 * 60 * 1000; // 24 hours
        case 'weekly':
            return timeDiff >= 7 * 24 * 60 * 60 * 1000; // 7 days
        case 'monthly':
            return timeDiff >= 30 * 24 * 60 * 60 * 1000; // 30 days
        default:
            return timeDiff >= 24 * 60 * 60 * 1000; // Default to daily
    }
};

// Helper function to convert experience level to numeric value
const getExperienceValue = (level) => {
    switch (level) {
        case 'entry': return 0;
        case 'mid': return 3;
        case 'senior': return 5;
        case 'lead': return 8;
        default: return 0;
    }
};
