import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import isAuthorized from '../middlewares/isAuthorized.js';
import {
    getBulkApplications,
    bulkUpdateApplicationStatus,
    bulkSendEmail,
    bulkScheduleInterviews,
    bulkExportApplications,
    bulkCloseJobs
} from '../controllers/bulkOperations.controller.js';

const router = express.Router();

// Bulk operations routes - only for recruiters and admins
router.get('/applications', isAuthenticated, isAuthorized(['recruiter', 'admin']), getBulkApplications);
router.post('/applications/status', isAuthenticated, isAuthorized(['recruiter', 'admin']), bulkUpdateApplicationStatus);
router.post('/applications/email', isAuthenticated, isAuthorized(['recruiter', 'admin']), bulkSendEmail);
router.post('/applications/interviews', isAuthenticated, isAuthorized(['recruiter', 'admin']), bulkScheduleInterviews);
router.post('/applications/export', isAuthenticated, isAuthorized(['recruiter', 'admin']), bulkExportApplications);
router.post('/jobs/close', isAuthenticated, isAuthorized(['recruiter', 'admin']), bulkCloseJobs);

export default router;
