import express from 'express';
import {
    submitReview,
    getReviews,
    likeReview,
    reportReview,
    shareJob,
    getSharedJobs,
    getCompanyStats,
    getTrendingCompanies,
    getUserReviews
} from '../controllers/social.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

// Review routes
router.post('/reviews', isAuthenticated, submitReview);
router.get('/reviews', getReviews);
router.get('/reviews/user', isAuthenticated, getUserReviews);
router.post('/reviews/:id/like', isAuthenticated, likeReview);
router.post('/reviews/:id/report', isAuthenticated, reportReview);

// Job sharing routes
router.post('/share-job', isAuthenticated, shareJob);
router.get('/shared-jobs', getSharedJobs);

// Company statistics routes
router.get('/companies/:companyId/stats', getCompanyStats);
router.get('/companies/trending', getTrendingCompanies);

export default router;
