import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import isAuthorized from '../middlewares/isAuthorized.js';
import {
    getModerationQueue,
    getReportedContent,
    getFlaggedUsers,
    getModerationStats,
    moderateContent,
    bulkModerateContent,
    manageUser
} from '../controllers/contentModeration.controller.js';

const router = express.Router();

// Content moderation routes - only for admins
router.get('/queue', isAuthenticated, isAuthorized(['admin']), getModerationQueue);
router.get('/reports', isAuthenticated, isAuthorized(['admin']), getReportedContent);
router.get('/flagged-users', isAuthenticated, isAuthorized(['admin']), getFlaggedUsers);
router.get('/stats', isAuthenticated, isAuthorized(['admin']), getModerationStats);
router.post('/approve', isAuthenticated, isAuthorized(['admin']), moderateContent);
router.post('/reject', isAuthenticated, isAuthorized(['admin']), moderateContent);
router.post('/flag', isAuthenticated, isAuthorized(['admin']), moderateContent);
router.post('/bulk-approve', isAuthenticated, isAuthorized(['admin']), bulkModerateContent);
router.post('/bulk-reject', isAuthenticated, isAuthorized(['admin']), bulkModerateContent);
router.post('/bulk-flag', isAuthenticated, isAuthorized(['admin']), bulkModerateContent);
router.post('/users/suspend', isAuthenticated, isAuthorized(['admin']), manageUser);
router.post('/users/warn', isAuthenticated, isAuthorized(['admin']), manageUser);
router.post('/users/unflag', isAuthenticated, isAuthorized(['admin']), manageUser);
router.post('/users/ban', isAuthenticated, isAuthorized(['admin']), manageUser);

export default router;
