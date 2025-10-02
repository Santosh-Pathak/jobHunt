import express from 'express';
import {
    saveResume,
    generatePDFResume,
    getResumeData,
    deleteResume,
    getResumeTemplates,
    uploadResumeFile,
    parseResumeFile
} from '../controllers/resume.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { singleUpload } from '../middlewares/multer.js';

const router = express.Router();

// All routes require authentication
router.use(isAuthenticated);

// Resume builder routes
router.post('/save', saveResume);
router.post('/generate-pdf', generatePDFResume);
router.get('/data', getResumeData);
router.delete('/delete', deleteResume);
router.get('/templates', getResumeTemplates);

// File upload routes
router.post('/upload', singleUpload, uploadResumeFile);
router.post('/parse', parseResumeFile);

export default router;
