import { Notification } from '../models/notification.model.js';
import { User } from '../models/user.model.js';

export const getAllNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 20, type, read } = req.query;
        const userId = req.user._id;

        const filter = { user: userId };
        if (type) filter.type = type;
        if (read !== undefined) filter.read = read === 'true';

        const notifications = await Notification.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('data.jobId', 'title company')
            .populate('data.companyId', 'name logo');

        const total = await Notification.countDocuments(filter);

        res.status(200).json({
            success: true,
            notifications,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user._id;
        const count = await Notification.countDocuments({ 
            user: userId, 
            read: false 
        });

        res.status(200).json({
            success: true,
            count
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const notification = await Notification.findOneAndUpdate(
            { _id: id, user: userId },
            { read: true, readAt: new Date() },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.status(200).json({
            success: true,
            notification
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user._id;

        await Notification.updateMany(
            { user: userId, read: false },
            { read: true, readAt: new Date() }
        );

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const notification = await Notification.findOneAndDelete({
            _id: id,
            user: userId
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createNotification = async (req, res) => {
    try {
        const { userId, type, title, message, data, priority = 'medium' } = req.body;

        const notification = new Notification({
            user: userId,
            type,
            title,
            message,
            data,
            priority
        });

        await notification.save();

        res.status(201).json({
            success: true,
            notification
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
