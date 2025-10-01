import express from 'express';
import { 
    trackEvent,
    getUserAnalytics,
    getJobAnalytics,
    getCompanyAnalytics,
    getPlatformAnalytics,
    getDashboardStats
} from '../controllers/analytics.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

// Track user events
router.post('/track', isAuthenticated, trackEvent);

// Get user analytics
router.get('/user', isAuthenticated, getUserAnalytics);

// Get job analytics (for recruiters)
router.get('/job/:jobId', isAuthenticated, getJobAnalytics);

// Get company analytics
router.get('/company/:companyId', isAuthenticated, getCompanyAnalytics);

// Get platform analytics (admin only)
router.get('/platform', isAuthenticated, getPlatformAnalytics);

// Get dashboard stats
router.get('/dashboard', isAuthenticated, getDashboardStats);

export default router;
