import express from 'express';
import {
    scheduleInterview,
    getUserInterviews,
    getInterviewById,
    updateInterviewStatus,
    rescheduleInterview,
    cancelInterview,
    getUpcomingInterviews,
    getInterviewStats
} from '../controllers/interview.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

// All routes require authentication
router.use(isAuthenticated);

// Interview management routes
router.post('/schedule', scheduleInterview);
router.get('/', getUserInterviews);
router.get('/upcoming', getUpcomingInterviews);
router.get('/stats', getInterviewStats);
router.get('/:id', getInterviewById);
router.patch('/:id/status', updateInterviewStatus);
router.patch('/:id/reschedule', rescheduleInterview);
router.delete('/:id', cancelInterview);

export default router;
