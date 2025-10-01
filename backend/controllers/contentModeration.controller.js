import { ModerationQueue } from '../models/moderationQueue.model.js';
import { Report } from '../models/report.model.js';
import { User } from '../models/user.model.js';
import { Job } from '../models/job.model.js';
import { Company } from '../models/company.model.js';
import { Review } from '../models/review.model.js';
import { Notification } from '../models/notification.model.js';

// Get moderation queue
export const getModerationQueue = async (req, res) => {
    try {
        const { type, status, severity, dateRange, searchTerm } = req.query;
        const userId = req.user._id;

        // Build query
        let query = {};

        if (type) query.type = type;
        if (status) query.status = status;
        if (severity) query.severity = severity;
        if (searchTerm) {
            query.$or = [
                { title: { $regex: searchTerm, $options: 'i' } },
                { content: { $regex: searchTerm, $options: 'i' } }
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
            }
            
            if (startDate) {
                query.createdAt = { $gte: startDate };
            }
        }

        const queue = await ModerationQueue.find(query)
            .populate('user', 'fullName email')
            .populate('contentId')
            .sort({ createdAt: -1 })
            .limit(100);

        res.status(200).json({ 
            success: true, 
            queue,
            total: queue.length 
        });
    } catch (error) {
        console.error('Error fetching moderation queue:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get reported content
export const getReportedContent = async (req, res) => {
    try {
        const { type, status, dateRange, searchTerm } = req.query;

        let query = {};

        if (type) query.contentType = type;
        if (status) query.status = status;
        if (searchTerm) {
            query.$or = [
                { reason: { $regex: searchTerm, $options: 'i' } },
                { 'content.title': { $regex: searchTerm, $options: 'i' } }
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
            }
            
            if (startDate) {
                query.createdAt = { $gte: startDate };
            }
        }

        const reports = await Report.find(query)
            .populate('reporter', 'fullName email')
            .populate('content')
            .sort({ createdAt: -1 })
            .limit(100);

        res.status(200).json({ 
            success: true, 
            reports,
            total: reports.length 
        });
    } catch (error) {
        console.error('Error fetching reported content:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get flagged users
export const getFlaggedUsers = async (req, res) => {
    try {
        const { status, dateRange, searchTerm } = req.query;

        let query = { flagged: true };

        if (status) query.status = status;
        if (searchTerm) {
            query.$or = [
                { fullName: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } }
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
            }
            
            if (startDate) {
                query.flaggedAt = { $gte: startDate };
            }
        }

        const users = await User.find(query)
            .select('fullName email role flaggedAt flagReason status')
            .sort({ flaggedAt: -1 })
            .limit(100);

        res.status(200).json({ 
            success: true, 
            users,
            total: users.length 
        });
    } catch (error) {
        console.error('Error fetching flagged users:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get moderation statistics
export const getModerationStats = async (req, res) => {
    try {
        const stats = await ModerationQueue.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const reportStats = await Report.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const userStats = await User.aggregate([
            {
                $match: { flagged: true }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Calculate average review time
        const reviewTimes = await ModerationQueue.find({ 
            status: { $in: ['approved', 'rejected'] },
            reviewedAt: { $exists: true }
        }).select('createdAt reviewedAt');

        const avgReviewTime = reviewTimes.length > 0 
            ? reviewTimes.reduce((sum, item) => {
                const reviewTime = (new Date(item.reviewedAt) - new Date(item.createdAt)) / (1000 * 60); // minutes
                return sum + reviewTime;
            }, 0) / reviewTimes.length
            : 0;

        const moderationStats = {
            totalPending: stats.find(s => s._id === 'pending')?.count || 0,
            totalApproved: stats.find(s => s._id === 'approved')?.count || 0,
            totalRejected: stats.find(s => s._id === 'rejected')?.count || 0,
            totalFlagged: userStats.reduce((sum, stat) => sum + stat.count, 0),
            totalReviewed: stats.find(s => s._id === 'approved')?.count + stats.find(s => s._id === 'rejected')?.count || 0,
            averageReviewTime: Math.round(avgReviewTime)
        };

        res.status(200).json({ 
            success: true, 
            stats: moderationStats 
        });
    } catch (error) {
        console.error('Error fetching moderation stats:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Moderate content (approve/reject/flag)
export const moderateContent = async (req, res) => {
    try {
        const { itemId, action, reason, moderatorId } = req.body;

        if (!itemId || !action || !moderatorId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }

        const validActions = ['approve', 'reject', 'flag'];
        if (!validActions.includes(action)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid action' 
            });
        }

        const item = await ModerationQueue.findById(itemId);
        if (!item) {
            return res.status(404).json({ 
                success: false, 
                message: 'Item not found' 
            });
        }

        // Update moderation queue item
        item.status = action;
        item.reviewedBy = moderatorId;
        item.reviewedAt = new Date();
        item.reviewReason = reason;
        await item.save();

        // Update the actual content based on action
        if (action === 'approve') {
            await approveContent(item.contentId, item.type);
        } else if (action === 'reject') {
            await rejectContent(item.contentId, item.type);
        } else if (action === 'flag') {
            await flagContent(item.contentId, item.type);
        }

        // Create notification for content owner
        await Notification.create({
            userId: item.user,
            type: 'content_moderation',
            title: `Content ${action}d`,
            message: `Your ${item.type} has been ${action}d by moderators.`,
            data: {
                contentId: item.contentId,
                type: item.type,
                action,
                reason
            }
        });

        res.status(200).json({ 
            success: true, 
            message: `Content ${action}d successfully` 
        });
    } catch (error) {
        console.error('Error moderating content:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Bulk moderate content
export const bulkModerateContent = async (req, res) => {
    try {
        const { itemIds, action, reason, moderatorId } = req.body;

        if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Item IDs are required' 
            });
        }

        if (!action || !moderatorId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Action and moderator ID are required' 
            });
        }

        const validActions = ['approve', 'reject', 'flag'];
        if (!validActions.includes(action)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid action' 
            });
        }

        // Limit bulk operations to 50 items
        if (itemIds.length > 50) {
            return res.status(400).json({ 
                success: false, 
                message: 'Cannot moderate more than 50 items at once' 
            });
        }

        const items = await ModerationQueue.find({ _id: { $in: itemIds } });

        // Update all items
        await ModerationQueue.updateMany(
            { _id: { $in: itemIds } },
            {
                $set: {
                    status: action,
                    reviewedBy: moderatorId,
                    reviewedAt: new Date(),
                    reviewReason: reason
                }
            }
        );

        // Update actual content
        for (const item of items) {
            if (action === 'approve') {
                await approveContent(item.contentId, item.type);
            } else if (action === 'reject') {
                await rejectContent(item.contentId, item.type);
            } else if (action === 'flag') {
                await flagContent(item.contentId, item.type);
            }

            // Create notification
            await Notification.create({
                userId: item.user,
                type: 'content_moderation',
                title: `Content ${action}d`,
                message: `Your ${item.type} has been ${action}d by moderators.`,
                data: {
                    contentId: item.contentId,
                    type: item.type,
                    action,
                    reason
                }
            });
        }

        res.status(200).json({ 
            success: true, 
            message: `${items.length} items ${action}d successfully` 
        });
    } catch (error) {
        console.error('Error bulk moderating content:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// User management actions
export const manageUser = async (req, res) => {
    try {
        const { userId, action, reason, moderatorId } = req.body;

        if (!userId || !action || !moderatorId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }

        const validActions = ['suspend', 'warn', 'unflag', 'ban'];
        if (!validActions.includes(action)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid action' 
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Update user based on action
        switch (action) {
            case 'suspend':
                user.status = 'suspended';
                user.suspendedAt = new Date();
                user.suspensionReason = reason;
                break;
            case 'warn':
                user.warnings = (user.warnings || 0) + 1;
                user.lastWarningAt = new Date();
                user.warningReason = reason;
                break;
            case 'unflag':
                user.flagged = false;
                user.flagReason = null;
                user.flaggedAt = null;
                break;
            case 'ban':
                user.status = 'banned';
                user.bannedAt = new Date();
                user.banReason = reason;
                break;
        }

        await user.save();

        // Create notification
        await Notification.create({
            userId: user._id,
            type: 'account_action',
            title: `Account ${action}d`,
            message: `Your account has been ${action}d by moderators.`,
            data: {
                action,
                reason,
                moderatorId
            }
        });

        res.status(200).json({ 
            success: true, 
            message: `User ${action}d successfully` 
        });
    } catch (error) {
        console.error('Error managing user:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Helper functions
const approveContent = async (contentId, type) => {
    switch (type) {
        case 'job':
            await Job.findByIdAndUpdate(contentId, { status: 'active', moderated: true });
            break;
        case 'company':
            await Company.findByIdAndUpdate(contentId, { status: 'active', moderated: true });
            break;
        case 'review':
            await Review.findByIdAndUpdate(contentId, { status: 'approved', moderated: true });
            break;
    }
};

const rejectContent = async (contentId, type) => {
    switch (type) {
        case 'job':
            await Job.findByIdAndUpdate(contentId, { status: 'rejected', moderated: true });
            break;
        case 'company':
            await Company.findByIdAndUpdate(contentId, { status: 'rejected', moderated: true });
            break;
        case 'review':
            await Review.findByIdAndUpdate(contentId, { status: 'rejected', moderated: true });
            break;
    }
};

const flagContent = async (contentId, type) => {
    switch (type) {
        case 'job':
            await Job.findByIdAndUpdate(contentId, { flagged: true, moderated: true });
            break;
        case 'company':
            await Company.findByIdAndUpdate(contentId, { flagged: true, moderated: true });
            break;
        case 'review':
            await Review.findByIdAndUpdate(contentId, { flagged: true, moderated: true });
            break;
    }
};
