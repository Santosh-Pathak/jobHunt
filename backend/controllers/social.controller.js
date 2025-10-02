import { Review } from '../models/review.model.js';
import Company from '../models/company.model.js';
import { Job } from '../models/job.model.js';
import { User } from '../models/user.model.js';
import { SharedJob } from '../models/sharedJob.model.js';

// Submit a company review
export const submitReview = async (req, res) => {
    try {
        const userId = req.user._id;
        const {
            companyId,
            rating,
            title,
            pros,
            cons,
            overallExperience,
            workLifeBalance,
            salaryBenefits,
            careerGrowth,
            management,
            culture,
            recommend,
            anonymous
        } = req.body;

        // Validate required fields
        if (!companyId || !rating || !title || !overallExperience) {
            return res.status(400).json({
                success: false,
                message: 'Company, rating, title, and overall experience are required'
            });
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        // Check if company exists
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }

        // Check if user has already reviewed this company
        const existingReview = await Review.findOne({ user: userId, company: companyId });
        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this company'
            });
        }

        // Create review
        const review = new Review({
            user: userId,
            company: companyId,
            rating,
            title,
            pros,
            cons,
            overallExperience,
            workLifeBalance,
            salaryBenefits,
            careerGrowth,
            management,
            culture,
            recommend,
            anonymous,
            status: 'pending' // Reviews are moderated
        });

        await review.save();

        // Populate review with user and company details
        await review.populate([
            { path: 'user', select: 'fullName email' },
            { path: 'company', select: 'name logo' }
        ]);

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully and is pending moderation',
            review
        });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit review',
            error: error.message
        });
    }
};

// Get all reviews
export const getReviews = async (req, res) => {
    try {
        const { 
            companyId, 
            rating, 
            page = 1, 
            limit = 10, 
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const filter = { status: 'approved' }; // Only show approved reviews
        if (companyId) filter.company = companyId;
        if (rating) filter.rating = parseInt(rating);

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const reviews = await Review.find(filter)
            .populate('user', 'fullName')
            .populate('company', 'name logo')
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Review.countDocuments(filter);

        res.status(200).json({
            success: true,
            reviews,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reviews',
            error: error.message
        });
    }
};

// Like a review
export const likeReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check if user has already liked this review
        if (review.likes.includes(userId)) {
            return res.status(400).json({
                success: false,
                message: 'You have already liked this review'
            });
        }

        review.likes.push(userId);
        await review.save();

        res.status(200).json({
            success: true,
            message: 'Review liked successfully',
            likesCount: review.likes.length
        });
    } catch (error) {
        console.error('Error liking review:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to like review',
            error: error.message
        });
    }
};

// Report a review
export const reportReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const userId = req.user._id;

        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check if user has already reported this review
        if (review.reports.some(report => report.user.toString() === userId.toString())) {
            return res.status(400).json({
                success: false,
                message: 'You have already reported this review'
            });
        }

        review.reports.push({
            user: userId,
            reason,
            reportedAt: new Date()
        });

        await review.save();

        res.status(200).json({
            success: true,
            message: 'Review reported successfully'
        });
    } catch (error) {
        console.error('Error reporting review:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to report review',
            error: error.message
        });
    }
};

// Share a job
export const shareJob = async (req, res) => {
    try {
        const userId = req.user._id;
        const { jobId, platform, message, includeJobDetails } = req.body;

        // Validate required fields
        if (!jobId || !platform) {
            return res.status(400).json({
                success: false,
                message: 'Job ID and platform are required'
            });
        }

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Create shared job record
        const sharedJob = new SharedJob({
            user: userId,
            job: jobId,
            platform,
            message: message || 'Check out this job opportunity!',
            includeJobDetails,
            sharedAt: new Date()
        });

        await sharedJob.save();

        // Populate shared job with job and user details
        await sharedJob.populate([
            { path: 'job', select: 'title company location' },
            { path: 'user', select: 'fullName' }
        ]);

        res.status(201).json({
            success: true,
            message: 'Job shared successfully',
            sharedJob
        });
    } catch (error) {
        console.error('Error sharing job:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to share job',
            error: error.message
        });
    }
};

// Get shared jobs
export const getSharedJobs = async (req, res) => {
    try {
        const { userId, platform, page = 1, limit = 10 } = req.query;

        const filter = {};
        if (userId) filter.user = userId;
        if (platform) filter.platform = platform;

        const sharedJobs = await SharedJob.find(filter)
            .populate('job', 'title company location')
            .populate('user', 'fullName')
            .sort({ sharedAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await SharedJob.countDocuments(filter);

        res.status(200).json({
            success: true,
            sharedJobs,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error('Error fetching shared jobs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch shared jobs',
            error: error.message
        });
    }
};

// Get company statistics
export const getCompanyStats = async (req, res) => {
    try {
        const { companyId } = req.params;

        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }

        // Get review statistics
        const reviewStats = await Review.aggregate([
            { $match: { company: company._id, status: 'approved' } },
            {
                $group: {
                    _id: null,
                    totalReviews: { $sum: 1 },
                    averageRating: { $avg: '$rating' },
                    averageWorkLifeBalance: { $avg: '$workLifeBalance' },
                    averageSalaryBenefits: { $avg: '$salaryBenefits' },
                    averageCareerGrowth: { $avg: '$careerGrowth' },
                    averageManagement: { $avg: '$management' },
                    averageCulture: { $avg: '$culture' },
                    recommendCount: { $sum: { $cond: ['$recommend', 1, 0] } }
                }
            }
        ]);

        const stats = reviewStats[0] || {
            totalReviews: 0,
            averageRating: 0,
            averageWorkLifeBalance: 0,
            averageSalaryBenefits: 0,
            averageCareerGrowth: 0,
            averageManagement: 0,
            averageCulture: 0,
            recommendCount: 0
        };

        // Get rating distribution
        const ratingDistribution = await Review.aggregate([
            { $match: { company: company._id, status: 'approved' } },
            {
                $group: {
                    _id: '$rating',
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            success: true,
            stats: {
                ...stats,
                recommendPercentage: stats.totalReviews > 0 
                    ? Math.round((stats.recommendCount / stats.totalReviews) * 100) 
                    : 0,
                ratingDistribution: ratingDistribution.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {})
            }
        });
    } catch (error) {
        console.error('Error fetching company stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch company statistics',
            error: error.message
        });
    }
};

// Get trending companies
export const getTrendingCompanies = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const trendingCompanies = await Company.aggregate([
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'company',
                    as: 'reviews'
                }
            },
            {
                $match: {
                    'reviews.status': 'approved',
                    'reviews.createdAt': {
                        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                    }
                }
            },
            {
                $addFields: {
                    recentReviewCount: { $size: '$reviews' },
                    averageRating: { $avg: '$reviews.rating' }
                }
            },
            {
                $sort: {
                    recentReviewCount: -1,
                    averageRating: -1
                }
            },
            {
                $limit: parseInt(limit)
            },
            {
                $project: {
                    name: 1,
                    logo: 1,
                    industry: 1,
                    size: 1,
                    location: 1,
                    recentReviewCount: 1,
                    averageRating: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            trendingCompanies
        });
    } catch (error) {
        console.error('Error fetching trending companies:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch trending companies',
            error: error.message
        });
    }
};

// Get user's review history
export const getUserReviews = async (req, res) => {
    try {
        const userId = req.user._id;
        const { page = 1, limit = 10 } = req.query;

        const reviews = await Review.find({ user: userId })
            .populate('company', 'name logo')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Review.countDocuments({ user: userId });

        res.status(200).json({
            success: true,
            reviews,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error('Error fetching user reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user reviews',
            error: error.message
        });
    }
};
