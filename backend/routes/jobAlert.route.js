import express from 'express';
import {
    createJobAlert,
    getUserJobAlerts,
    getJobAlertById,
    updateJobAlert,
    deleteJobAlert,
    toggleJobAlert,
    getMatchingJobs,
    processJobAlerts
} from '../controllers/jobAlert.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

// All routes require authentication except processJobAlerts (cron job)
router.post('/', isAuthenticated, createJobAlert);
router.get('/', isAuthenticated, getUserJobAlerts);
router.get('/:id', isAuthenticated, getJobAlertById);
router.put('/:id', isAuthenticated, updateJobAlert);
router.delete('/:id', isAuthenticated, deleteJobAlert);
router.patch('/:id/toggle', isAuthenticated, toggleJobAlert);
router.get('/:id/matches', isAuthenticated, getMatchingJobs);

// Cron job route (no authentication required)
router.post('/process', processJobAlerts);

export default router;
