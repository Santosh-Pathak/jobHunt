import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import isAuthorized from '../middlewares/isAuthorized.js';
import {
    getSystemHealth,
    getPerformanceMetrics,
    getSystemAlerts,
    getSystemLogs,
    handleAlertAction,
    createSystemAlert,
    logSystemEvent,
    getSystemStats
} from '../controllers/systemMonitoring.controller.js';

const router = express.Router();

// System monitoring routes - only for admins
router.get('/health', isAuthenticated, isAuthorized(['admin']), getSystemHealth);
router.get('/metrics', isAuthenticated, isAuthorized(['admin']), getPerformanceMetrics);
router.get('/alerts', isAuthenticated, isAuthorized(['admin']), getSystemAlerts);
router.get('/logs', isAuthenticated, isAuthorized(['admin']), getSystemLogs);
router.get('/stats', isAuthenticated, isAuthorized(['admin']), getSystemStats);
router.post('/alerts/:alertId/:action', isAuthenticated, isAuthorized(['admin']), handleAlertAction);
router.post('/alerts', isAuthenticated, isAuthorized(['admin']), createSystemAlert);
router.post('/logs', isAuthenticated, isAuthorized(['admin']), logSystemEvent);

export default router;
