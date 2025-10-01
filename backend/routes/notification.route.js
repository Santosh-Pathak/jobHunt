import express from 'express';
import { 
    getAllNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    getUnreadCount,
    createNotification
} from '../controllers/notification.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

// Get all notifications for a user
router.get('/', isAuthenticated, getAllNotifications);

// Get unread notification count
router.get('/unread-count', isAuthenticated, getUnreadCount);

// Mark notification as read
router.patch('/:id/read', isAuthenticated, markAsRead);

// Mark all notifications as read
router.patch('/mark-all-read', isAuthenticated, markAllAsRead);

// Delete notification
router.delete('/:id', isAuthenticated, deleteNotification);

// Create notification (for internal use)
router.post('/', isAuthenticated, createNotification);

export default router;
