import express from 'express';
import {
    getLinkedInAuthUrl,
    handleLinkedInCallback,
    importLinkedInProfile,
    saveImportedProfile,
    getLinkedInImportStatus,
    refreshLinkedInData
} from '../controllers/linkedinImport.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

// LinkedIn OAuth routes
router.post('/auth-url', isAuthenticated, getLinkedInAuthUrl);
router.get('/callback', handleLinkedInCallback);

// LinkedIn import routes
router.post('/import', isAuthenticated, importLinkedInProfile);
router.post('/save', isAuthenticated, saveImportedProfile);
router.get('/status/:userId', isAuthenticated, getLinkedInImportStatus);
router.post('/refresh', isAuthenticated, refreshLinkedInData);

export default router;
