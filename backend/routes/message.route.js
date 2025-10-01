import express from 'express';
import { 
    sendMessage,
    getConversations,
    getMessages,
    markAsRead,
    createConversation,
    deleteMessage,
    getUnreadCount
} from '../controllers/message.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

// Create or get conversation
router.post('/conversation', isAuthenticated, createConversation);

// Get user conversations
router.get('/conversations', isAuthenticated, getConversations);

// Get messages for a conversation
router.get('/conversation/:conversationId/messages', isAuthenticated, getMessages);

// Send message
router.post('/send', isAuthenticated, sendMessage);

// Mark messages as read
router.patch('/conversation/:conversationId/read', isAuthenticated, markAsRead);

// Get unread message count
router.get('/unread-count', isAuthenticated, getUnreadCount);

// Delete message
router.delete('/message/:messageId', isAuthenticated, deleteMessage);

export default router;
