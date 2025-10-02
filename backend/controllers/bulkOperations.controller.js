import { Application } from '../models/application.model.js';
import { Job } from '../models/job.model.js';
import { User } from '../models/user.model.js';
import { Interview } from '../models/interview.model.js';
import { Notification } from '../models/notification.model.js';
import nodemailer from 'nodemailer';
import { createNotification } from './notification.controller.js';

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Get applications for bulk operations with filters
export const getBulkApplications = async (req, res) => {
    try {
        const { jobId, status, dateRange, searchTerm } = req.query;
        const userId = req.user._id;

        // Build query
        let query = {};
        
        // Only show applications for jobs owned by the recruiter's company
        if (req.user.role === 'recruiter') {
            const userCompany = await User.findById(userId).populate('company');
            if (!userCompany.company) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Recruiter must be associated with a company' 
                });
            }
            query['job.company'] = userCompany.company._id;
        }

        if (jobId) query['job'] = jobId;
        if (status) query.status = status;
        if (searchTerm) {
            query.$or = [
                { 'user.fullName': { $regex: searchTerm, $options: 'i' } },
                { 'user.email': { $regex: searchTerm, $options: 'i' } }
            ];
        }

        // Date range filter
        if (dateRange) {
            const now = new Date();
            let startDate;
            
            switch (dateRange) {
                case 'today':
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    break;
                case 'week':
                    startDate = new Date(now.setDate(now.getDate() - 7));
                    break;
                case 'month':
                    startDate = new Date(now.setMonth(now.getMonth() - 1));
                    break;
                case 'quarter':
                    startDate = new Date(now.setMonth(now.getMonth() - 3));
                    break;
            }
            
            if (startDate) {
                query.appliedAt = { $gte: startDate };
            }
        }

        const applications = await Application.find(query)
            .populate('user', 'fullName email phoneNumber profile')
            .populate('job', 'title company location')
            .populate('job.company', 'name')
            .sort({ appliedAt: -1 })
            .limit(1000); // Limit for performance

        res.status(200).json({ 
            success: true, 
            applications,
            total: applications.length 
        });
    } catch (error) {
        console.error('Error fetching bulk applications:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Bulk update application status
export const bulkUpdateApplicationStatus = async (req, res) => {
    try {
        const { applicationIds, status, message } = req.body;
        const userId = req.user._id;

        if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Application IDs are required' 
            });
        }

        if (!status) {
            return res.status(400).json({ 
                success: false, 
                message: 'Status is required' 
            });
        }

        // Validate status
        const validStatuses = ['applied', 'reviewed', 'shortlisted', 'interview', 'hired', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid status' 
            });
        }

        // Limit bulk operations to 100 items
        if (applicationIds.length > 100) {
            return res.status(400).json({ 
                success: false, 
                message: 'Cannot update more than 100 applications at once' 
            });
        }

        // Verify ownership of applications
        const applications = await Application.find({
            _id: { $in: applicationIds }
        }).populate('job', 'company').populate('user', 'fullName email');

        if (req.user.role === 'recruiter') {
            const userCompany = await User.findById(userId).populate('company');
            const unauthorizedApps = applications.filter(app => 
                app.job.company.toString() !== userCompany.company._id.toString()
            );
            
            if (unauthorizedApps.length > 0) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Unauthorized to update some applications' 
                });
            }
        }

        // Update applications
        const updateResult = await Application.updateMany(
            { _id: { $in: applicationIds } },
            { 
                $set: { 
                    status,
                    updatedAt: new Date()
                },
                $push: {
                    statusHistory: {
                        status,
                        message: message || '',
                        updatedBy: userId,
                        updatedAt: new Date()
                    }
                }
            }
        );

        // Send notifications to candidates
        const notifications = applications.map(app => ({
            userId: app.user._id,
            type: 'application_status_update',
            title: 'Application Status Updated',
            message: `Your application for ${app.job.title} has been updated to ${status}.`,
            data: {
                applicationId: app._id,
                jobId: app.job._id,
                status,
                message
            }
        }));

        // Create notifications in batches
        const batchSize = 10;
        for (let i = 0; i < notifications.length; i += batchSize) {
            const batch = notifications.slice(i, i + batchSize);
            await Notification.insertMany(batch);
        }

        res.status(200).json({ 
            success: true, 
            message: `Updated ${updateResult.modifiedCount} applications`,
            updatedCount: updateResult.modifiedCount
        });
    } catch (error) {
        console.error('Error bulk updating application status:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Bulk send email to candidates
export const bulkSendEmail = async (req, res) => {
    try {
        const { applicationIds, subject, message, template } = req.body;
        const userId = req.user._id;

        if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Application IDs are required' 
            });
        }

        if (!subject || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'Subject and message are required' 
            });
        }

        // Limit bulk operations to 50 items for email
        if (applicationIds.length > 50) {
            return res.status(400).json({ 
                success: false, 
                message: 'Cannot send email to more than 50 candidates at once' 
            });
        }

        // Get applications with user details
        const applications = await Application.find({
            _id: { $in: applicationIds }
        }).populate('user', 'fullName email').populate('job', 'title company');

        if (req.user.role === 'recruiter') {
            const userCompany = await User.findById(userId).populate('company');
            const unauthorizedApps = applications.filter(app => 
                app.job.company.toString() !== userCompany.company._id.toString()
            );
            
            if (unauthorizedApps.length > 0) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Unauthorized to email some candidates' 
                });
            }
        }

        // Apply template if specified
        let processedMessage = message;
        if (template) {
            processedMessage = applyEmailTemplate(template, message);
        }

        // Send emails
        const emailPromises = applications.map(async (app) => {
            try {
                const personalizedMessage = processedMessage
                    .replace(/{{candidateName}}/g, app.user.fullName)
                    .replace(/{{jobTitle}}/g, app.job.title)
                    .replace(/{{companyName}}/g, app.job.company.name);

                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: app.user.email,
                    subject: subject,
                    html: personalizedMessage
                });

                return { success: true, applicationId: app._id };
            } catch (error) {
                console.error(`Failed to send email to ${app.user.email}:`, error);
                return { success: false, applicationId: app._id, error: error.message };
            }
        });

        const results = await Promise.all(emailPromises);
        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;

        // Create notifications for successful emails
        const notifications = applications.map(app => ({
            userId: app.user._id,
            type: 'email_received',
            title: 'New Message',
            message: `You have received a new message regarding your application for ${app.job.title}.`,
            data: {
                applicationId: app._id,
                jobId: app.job._id,
                subject
            }
        }));

        await Notification.insertMany(notifications);

        res.status(200).json({ 
            success: true, 
            message: `Email sent to ${successful} candidates${failed > 0 ? `, ${failed} failed` : ''}`,
            sentCount: successful,
            failedCount: failed
        });
    } catch (error) {
        console.error('Error bulk sending email:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Bulk schedule interviews
export const bulkScheduleInterviews = async (req, res) => {
    try {
        const { applicationIds, date, time, type, duration, location, meetingLink } = req.body;
        const userId = req.user._id;

        if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Application IDs are required' 
            });
        }

        if (!date || !time) {
            return res.status(400).json({ 
                success: false, 
                message: 'Date and time are required' 
            });
        }

        // Limit bulk operations to 20 items for interviews
        if (applicationIds.length > 20) {
            return res.status(400).json({ 
                success: false, 
                message: 'Cannot schedule more than 20 interviews at once' 
            });
        }

        // Get applications
        const applications = await Application.find({
            _id: { $in: applicationIds }
        }).populate('user', 'fullName email').populate('job', 'title company');

        if (req.user.role === 'recruiter') {
            const userCompany = await User.findById(userId).populate('company');
            const unauthorizedApps = applications.filter(app => 
                app.job.company.toString() !== userCompany.company._id.toString()
            );
            
            if (unauthorizedApps.length > 0) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Unauthorized to schedule interviews for some applications' 
                });
            }
        }

        // Create interviews
        const interviews = applications.map(app => ({
            jobId: app.job._id,
            candidate: app.user._id,
            recruiter: userId,
            title: `Interview for ${app.job.title}`,
            description: `Interview scheduled for ${app.user.fullName}`,
            date: new Date(date),
            time,
            type: type || 'video',
            duration: duration || 60,
            location: location || 'Remote',
            meetingLink: meetingLink || '',
            status: 'scheduled'
        }));

        const createdInterviews = await Interview.insertMany(interviews);

        // Update application status to interview
        await Application.updateMany(
            { _id: { $in: applicationIds } },
            { 
                $set: { 
                    status: 'interview',
                    updatedAt: new Date()
                },
                $push: {
                    statusHistory: {
                        status: 'interview',
                        message: 'Interview scheduled',
                        updatedBy: userId,
                        updatedAt: new Date()
                    }
                }
            }
        );

        // Create notifications
        const notifications = applications.map((app, index) => ({
            userId: app.user._id,
            type: 'interview_scheduled',
            title: 'Interview Scheduled',
            message: `Your interview for ${app.job.title} has been scheduled for ${date} at ${time}.`,
            data: {
                interviewId: createdInterviews[index]._id,
                jobId: app.job._id,
                date,
                time,
                location: location || 'Remote'
            }
        }));

        await Notification.insertMany(notifications);

        res.status(200).json({ 
            success: true, 
            message: `Scheduled ${createdInterviews.length} interviews`,
            scheduledCount: createdInterviews.length
        });
    } catch (error) {
        console.error('Error bulk scheduling interviews:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Bulk export applications
export const bulkExportApplications = async (req, res) => {
    try {
        const { applicationIds, format } = req.body;
        const userId = req.user._id;

        if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Application IDs are required' 
            });
        }

        // Limit export to 500 items
        if (applicationIds.length > 500) {
            return res.status(400).json({ 
                success: false, 
                message: 'Cannot export more than 500 applications at once' 
            });
        }

        // Get applications with all related data
        const applications = await Application.find({
            _id: { $in: applicationIds }
        })
        .populate('user', 'fullName email phoneNumber profile')
        .populate('job', 'title company location salary')
        .populate('job.company', 'name website')
        .sort({ appliedAt: -1 });

        if (req.user.role === 'recruiter') {
            const userCompany = await User.findById(userId).populate('company');
            const unauthorizedApps = applications.filter(app => 
                app.job.company._id.toString() !== userCompany.company._id.toString()
            );
            
            if (unauthorizedApps.length > 0) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Unauthorized to export some applications' 
                });
            }
        }

        // Prepare data for export
        const exportData = applications.map(app => ({
            'Candidate Name': app.user.fullName,
            'Email': app.user.email,
            'Phone': app.user.phoneNumber || 'N/A',
            'Job Title': app.job.title,
            'Company': app.job.company.name,
            'Location': app.job.location,
            'Salary': app.job.salary || 'N/A',
            'Application Date': app.appliedAt.toLocaleDateString(),
            'Status': app.status,
            'Resume': app.user.profile?.resume ? 'Yes' : 'No',
            'Cover Letter': app.coverLetter || 'N/A',
            'Skills': app.user.profile?.skills?.join(', ') || 'N/A',
            'Experience': app.user.profile?.experience?.length || 0,
            'Education': app.user.profile?.education?.length || 0
        }));

        if (format === 'csv') {
            // Generate CSV
            const csvHeaders = Object.keys(exportData[0]).join(',');
            const csvRows = exportData.map(row => 
                Object.values(row).map(value => 
                    typeof value === 'string' && value.includes(',') 
                        ? `"${value}"` 
                        : value
                ).join(',')
            );
            const csvContent = [csvHeaders, ...csvRows].join('\n');

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=applications_${new Date().toISOString().split('T')[0]}.csv`);
            res.send(csvContent);
        } else if (format === 'xlsx') {
            // Generate Excel (simplified - in production, use a proper Excel library)
            const xlsxContent = generateExcelContent(exportData);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=applications_${new Date().toISOString().split('T')[0]}.xlsx`);
            res.send(xlsxContent);
        } else {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid format. Use csv or xlsx' 
            });
        }
    } catch (error) {
        console.error('Error bulk exporting applications:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Bulk close jobs
export const bulkCloseJobs = async (req, res) => {
    try {
        const { jobIds } = req.body;
        const userId = req.user._id;

        if (!jobIds || !Array.isArray(jobIds) || jobIds.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Job IDs are required' 
            });
        }

        // Limit bulk operations to 50 items
        if (jobIds.length > 50) {
            return res.status(400).json({ 
                success: false, 
                message: 'Cannot close more than 50 jobs at once' 
            });
        }

        // Verify ownership of jobs
        const jobs = await Job.find({ _id: { $in: jobIds } });

        if (req.user.role === 'recruiter') {
            const userCompany = await User.findById(userId).populate('company');
            const unauthorizedJobs = jobs.filter(job => 
                job.company.toString() !== userCompany.company._id.toString()
            );
            
            if (unauthorizedJobs.length > 0) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Unauthorized to close some jobs' 
                });
            }
        }

        // Close jobs
        const updateResult = await Job.updateMany(
            { _id: { $in: jobIds } },
            { 
                $set: { 
                    status: 'closed',
                    updatedAt: new Date()
                }
            }
        );

        res.status(200).json({ 
            success: true, 
            message: `Closed ${updateResult.modifiedCount} jobs`,
            closedCount: updateResult.modifiedCount
        });
    } catch (error) {
        console.error('Error bulk closing jobs:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Helper function to apply email templates
const applyEmailTemplate = (template, message) => {
    const templates = {
        interview_invite: `
            <h2>Interview Invitation</h2>
            <p>Dear {{candidateName}},</p>
            <p>Thank you for your interest in the {{jobTitle}} position at {{companyName}}.</p>
            <p>We would like to invite you for an interview.</p>
            <p>${message}</p>
            <p>Best regards,<br>The {{companyName}} Team</p>
        `,
        rejection: `
            <h2>Application Update</h2>
            <p>Dear {{candidateName}},</p>
            <p>Thank you for your interest in the {{jobTitle}} position at {{companyName}}.</p>
            <p>After careful consideration, we have decided to move forward with other candidates.</p>
            <p>${message}</p>
            <p>We wish you the best in your job search.</p>
            <p>Best regards,<br>The {{companyName}} Team</p>
        `,
        next_steps: `
            <h2>Next Steps</h2>
            <p>Dear {{candidateName}},</p>
            <p>Thank you for your application for the {{jobTitle}} position at {{companyName}}.</p>
            <p>${message}</p>
            <p>Best regards,<br>The {{companyName}} Team</p>
        `
    };

    return templates[template] || message;
};

// Helper function to generate Excel content (simplified)
const generateExcelContent = (data) => {
    // This is a simplified implementation
    // In production, use a proper Excel library like 'xlsx'
    const csvHeaders = Object.keys(data[0]).join(',');
    const csvRows = data.map(row => 
        Object.values(row).map(value => 
            typeof value === 'string' && value.includes(',') 
                ? `"${value}"` 
                : value
        ).join(',')
    );
    return [csvHeaders, ...csvRows].join('\n');
};
