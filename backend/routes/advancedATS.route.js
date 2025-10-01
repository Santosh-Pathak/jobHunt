import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import isAuthorized from '../middlewares/isAuthorized.js';
import {
    getATSApplications,
    getATSAnalytics,
    updateApplicationStatus,
    addApplicationNote,
    rateCandidate,
    getApplicationStats
} from '../controllers/advancedATS.controller.js';

const router = express.Router();

// Advanced ATS routes - only for recruiters and admins
router.get('/applications', isAuthenticated, isAuthorized(['recruiter', 'admin']), getATSApplications);
router.get('/analytics', isAuthenticated, isAuthorized(['recruiter', 'admin']), getATSAnalytics);
router.get('/stats', isAuthenticated, isAuthorized(['recruiter', 'admin']), getApplicationStats);
router.put('/applications/:id/status', isAuthenticated, isAuthorized(['recruiter', 'admin']), updateApplicationStatus);
router.post('/applications/:id/notes', isAuthenticated, isAuthorized(['recruiter', 'admin']), addApplicationNote);
router.post('/applications/:id/rating', isAuthenticated, isAuthorized(['recruiter', 'admin']), rateCandidate);

export default router;
