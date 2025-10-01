import express from 'express';
import {
    createOrUpdateDraft,
    getUserDrafts,
    getDraft,
    deleteDraft,
    submitDraft,
    uploadResume,
    getDraftStats,
    cleanupOldDrafts,
    upload
} from '../controllers/applicationDraft.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

// All routes require authentication
router.use(isAuthenticated);

// Draft CRUD operations
router.post('/drafts', createOrUpdateDraft);
router.get('/drafts', getUserDrafts);
router.get('/drafts/:draftId', getDraft);
router.delete('/drafts/:draftId', deleteDraft);
router.post('/drafts/:draftId/submit', submitDraft);

// File upload
router.post('/upload-resume', upload.single('resume'), uploadResume);

// Statistics and cleanup
router.get('/drafts/stats', getDraftStats);
router.delete('/drafts/cleanup', cleanupOldDrafts);

export default router;
