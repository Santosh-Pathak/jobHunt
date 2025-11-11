/**
 * Interview Controller - Integrated with Microservices
 * 
 * Uses Notification microservice for emails and Event bus for events
 */

import { Interview } from '../models/interview.model.js';
import { User } from '../models/user.model.js';
import { Job } from '../models/job.model.js';
import { Application } from '../models/application.model.js';
import { Notification } from '../models/notification.model.js';
import notificationService from '../services/notificationService.js';
import eventPublisher from '../services/eventPublisher.js';

// Schedule a new interview
export const scheduleInterview = async (req, res) => {
    try {
        const userId = req.user._id;
        const { 
            jobId, 
            applicationId, 
            date, 
            time, 
            type, 
            meetingLink, 
            location, 
            notes, 
            duration = 60,
            interviewerName,
            interviewerEmail 
        } = req.body;

        // Validate required fields
        if (!date || !time || !type) {
            return res.status(400).json({
                success: false,
                message: 'Date, time, and type are required'
            });
        }

        // Check if the interview date is in the future
        const interviewDateTime = new Date(`${date}T${time}`);
        if (interviewDateTime <= new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Interview must be scheduled for a future date and time'
            });
        }

        // Create interview
        const interview = new Interview({
            user: userId,
            job: jobId,
            application: applicationId,
            date: new Date(date),
            time,
            type,
            meetingLink: type === 'video' ? meetingLink : undefined,
            location: type === 'in-person' ? location : undefined,
            notes,
            duration,
            interviewerName,
            interviewerEmail,
            status: 'scheduled',
            createdBy: userId
        });

        await interview.save();

        // Populate interview with job and user details
        await interview.populate([
            { path: 'job', select: 'title company' },
            { path: 'user', select: 'fullName email' },
            { path: 'application', select: 'status' }
        ]);

        // Create notification for the user (keep local for quick access)
        const notification = new Notification({
            user: userId,
            type: 'interview_scheduled',
            title: 'Interview Scheduled',
            message: `Your interview for ${interview.job.title} has been scheduled for ${date} at ${time}`,
            data: {
                interviewId: interview._id,
                jobId: jobId
            },
            priority: 'high'
        });

        await notification.save();

        // Publish interview.scheduled event
        console.log('Publishing interview.scheduled event...');
        await eventPublisher.publishInterviewScheduled({
            _id: interview._id,
            applicationId: applicationId,
            jobId: jobId,
            candidateId: userId,
            candidateEmail: interview.user?.email,
            date: date,
            time: time,
            type: type,
            location: location,
            meetingLink: meetingLink,
            scheduledAt: interview.createdAt
        });

        // Send interview invitation email via Notification microservice
        console.log('Sending interview invitation email...');
        await notificationService.sendInterviewInvitation({
            applicant: { 
                email: interview.user?.email, 
                fullName: interview.user?.fullName 
            },
            interview: {
                date: date,
                time: time,
                type: type,
                location: location,
                meetingLink: meetingLink,
                duration: duration
            },
            job: { title: interview.job?.title }
        });

        // Send email notification (if interviewer email is provided)
        if (interviewerEmail) {
            // TODO: Implement email notification to interviewer
            console.log(`Email notification would be sent to ${interviewerEmail}`);
        }

        res.status(201).json({
            success: true,
            message: 'Interview scheduled successfully',
            interview
        });
    } catch (error) {
        console.error('Error scheduling interview:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to schedule interview',
            error: error.message
        });
    }
};

// Get all interviews for a user
export const getUserInterviews = async (req, res) => {
    try {
        const userId = req.user._id;
        const { status, type, page = 1, limit = 10 } = req.query;

        const filter = { user: userId };
        if (status) filter.status = status;
        if (type) filter.type = type;

        const interviews = await Interview.find(filter)
            .populate('job', 'title company location')
            .populate('application', 'status')
            .sort({ date: 1, time: 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Interview.countDocuments(filter);

        res.status(200).json({
            success: true,
            interviews,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error('Error fetching interviews:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch interviews',
            error: error.message
        });
    }
};

// Get interview by ID
export const getInterviewById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const interview = await Interview.findOne({ _id: id, user: userId })
            .populate('job', 'title company location description')
            .populate('application', 'status coverLetter')
            .populate('user', 'fullName email phoneNumber');

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            });
        }

        res.status(200).json({
            success: true,
            interview
        });
    } catch (error) {
        console.error('Error fetching interview:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch interview',
            error: error.message
        });
    }
};

// Update interview status
export const updateInterviewStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user._id;

        const validStatuses = ['scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const interview = await Interview.findOneAndUpdate(
            { _id: id, user: userId },
            { status, updatedAt: new Date() },
            { new: true }
        ).populate('job', 'title company');

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            });
        }

        // Create notification for status change
        const notification = new Notification({
            user: userId,
            type: 'interview_status',
            title: 'Interview Status Updated',
            message: `Your interview for ${interview.job.title} status has been updated to ${status}`,
            data: {
                interviewId: interview._id,
                jobId: interview.job._id
            }
        });

        await notification.save();

        res.status(200).json({
            success: true,
            message: 'Interview status updated successfully',
            interview
        });
    } catch (error) {
        console.error('Error updating interview status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update interview status',
            error: error.message
        });
    }
};

// Reschedule interview
export const rescheduleInterview = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, time, notes } = req.body;
        const userId = req.user._id;

        if (!date || !time) {
            return res.status(400).json({
                success: false,
                message: 'New date and time are required'
            });
        }

        // Check if the new interview date is in the future
        const interviewDateTime = new Date(`${date}T${time}`);
        if (interviewDateTime <= new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Interview must be rescheduled for a future date and time'
            });
        }

        const interview = await Interview.findOneAndUpdate(
            { _id: id, user: userId },
            { 
                date: new Date(date), 
                time, 
                notes: notes || interview.notes,
                status: 'rescheduled',
                updatedAt: new Date()
            },
            { new: true }
        ).populate('job', 'title company');

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            });
        }

        // Create notification for rescheduling
        const notification = new Notification({
            user: userId,
            type: 'interview_rescheduled',
            title: 'Interview Rescheduled',
            message: `Your interview for ${interview.job.title} has been rescheduled to ${date} at ${time}`,
            data: {
                interviewId: interview._id,
                jobId: interview.job._id
            },
            priority: 'high'
        });

        await notification.save();

        res.status(200).json({
            success: true,
            message: 'Interview rescheduled successfully',
            interview
        });
    } catch (error) {
        console.error('Error rescheduling interview:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reschedule interview',
            error: error.message
        });
    }
};

// Cancel interview
export const cancelInterview = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const userId = req.user._id;

        const interview = await Interview.findOneAndUpdate(
            { _id: id, user: userId },
            { 
                status: 'cancelled',
                cancellationReason: reason,
                cancelledAt: new Date(),
                updatedAt: new Date()
            },
            { new: true }
        ).populate('job', 'title company');

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            });
        }

        // Create notification for cancellation
        const notification = new Notification({
            user: userId,
            type: 'interview_cancelled',
            title: 'Interview Cancelled',
            message: `Your interview for ${interview.job.title} has been cancelled`,
            data: {
                interviewId: interview._id,
                jobId: interview.job._id
            }
        });

        await notification.save();

        res.status(200).json({
            success: true,
            message: 'Interview cancelled successfully',
            interview
        });
    } catch (error) {
        console.error('Error cancelling interview:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel interview',
            error: error.message
        });
    }
};

// Get upcoming interviews
export const getUpcomingInterviews = async (req, res) => {
    try {
        const userId = req.user._id;
        const { limit = 5 } = req.query;

        const now = new Date();
        const interviews = await Interview.find({
            user: userId,
            status: { $in: ['scheduled', 'confirmed'] },
            $or: [
                { date: { $gt: now } },
                { 
                    date: { $eq: new Date(now.toDateString()) },
                    time: { $gt: now.toTimeString().substring(0, 5) }
                }
            ]
        })
        .populate('job', 'title company')
        .sort({ date: 1, time: 1 })
        .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            interviews
        });
    } catch (error) {
        console.error('Error fetching upcoming interviews:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch upcoming interviews',
            error: error.message
        });
    }
};

// Get interview statistics
export const getInterviewStats = async (req, res) => {
    try {
        const userId = req.user._id;

        const stats = await Interview.aggregate([
            { $match: { user: userId } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalInterviews = await Interview.countDocuments({ user: userId });
        const upcomingInterviews = await Interview.countDocuments({
            user: userId,
            status: { $in: ['scheduled', 'confirmed'] },
            date: { $gte: new Date() }
        });

        res.status(200).json({
            success: true,
            stats: {
                total: totalInterviews,
                upcoming: upcomingInterviews,
                byStatus: stats.reduce((acc, stat) => {
                    acc[stat._id] = stat.count;
                    return acc;
                }, {})
            }
        });
    } catch (error) {
        console.error('Error fetching interview stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch interview statistics',
            error: error.message
        });
    }
};
