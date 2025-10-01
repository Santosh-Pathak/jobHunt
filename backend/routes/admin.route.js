import express from 'express';
import { 
    getAllUsers,
    getAllJobs,
    getAllCompanies,
    getAllApplications,
    getPlatformStats,
    updateUserStatus,
    updateJobStatus,
    updateCompanyStatus,
    deleteUser,
    deleteJob,
    deleteCompany,
    getSystemLogs,
    exportData
} from '../controllers/admin.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import isAuthorized from '../middlewares/isAuthorized.js';

const router = express.Router();

// Admin dashboard stats - Only recruiters and admins can access
router.get('/stats', isAuthenticated, isAuthorized(['recruiter', 'admin']), getPlatformStats);

// User management - Only admins can access
router.get('/users', isAuthenticated, isAuthorized(['admin']), getAllUsers);
router.patch('/users/:id/status', isAuthenticated, isAuthorized(['admin']), updateUserStatus);
router.delete('/users/:id', isAuthenticated, isAuthorized(['admin']), deleteUser);

// Job management - Recruiters and admins can access
router.get('/jobs', isAuthenticated, isAuthorized(['recruiter', 'admin']), getAllJobs);
router.patch('/jobs/:id/status', isAuthenticated, isAuthorized(['recruiter', 'admin']), updateJobStatus);
router.delete('/jobs/:id', isAuthenticated, isAuthorized(['recruiter', 'admin']), deleteJob);

// Company management - Recruiters and admins can access
router.get('/companies', isAuthenticated, isAuthorized(['recruiter', 'admin']), getAllCompanies);
router.patch('/companies/:id/status', isAuthenticated, isAuthorized(['recruiter', 'admin']), updateCompanyStatus);
router.delete('/companies/:id', isAuthenticated, isAuthorized(['recruiter', 'admin']), deleteCompany);

// Application management - Recruiters and admins can access
router.get('/applications', isAuthenticated, isAuthorized(['recruiter', 'admin']), getAllApplications);

// System logs - Only admins can access
router.get('/logs', isAuthenticated, isAuthorized(['admin']), getSystemLogs);

// Data export - Only admins can access
router.get('/export/:type', isAuthenticated, isAuthorized(['admin']), exportData);

export default router;
