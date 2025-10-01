import mongoose from 'mongoose';

const sharedJobSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    platform: {
        type: String,
        required: true,
        enum: ['linkedin', 'twitter', 'facebook', 'email', 'whatsapp', 'other']
    },
    message: {
        type: String,
        required: true,
        maxlength: 500
    },
    includeJobDetails: {
        type: Boolean,
        default: true
    },
    sharedAt: {
        type: Date,
        default: Date.now
    },
    clicks: {
        type: Number,
        default: 0
    },
    shares: {
        type: Number,
        default: 0
    },
    metadata: {
        originalUrl: String,
        shortenedUrl: String,
        socialMediaId: String,
        platformSpecificData: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});

// Indexes for better query performance
sharedJobSchema.index({ user: 1, sharedAt: -1 });
sharedJobSchema.index({ job: 1, platform: 1 });
sharedJobSchema.index({ platform: 1, sharedAt: -1 });

// Virtual for job title
sharedJobSchema.virtual('jobTitle').get(function() {
    return this.job?.title || 'Unknown Job';
});

// Virtual for company name
sharedJobSchema.virtual('companyName').get(function() {
    return this.job?.company?.name || 'Unknown Company';
});

// Virtual for sharing URL
sharedJobSchema.virtual('sharingUrl').get(function() {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return `${baseUrl}/job/${this.job._id}`;
});

// Pre-save middleware to generate shortened URL
sharedJobSchema.pre('save', async function(next) {
    if (this.isNew && !this.metadata.shortenedUrl) {
        // Generate a shortened URL (in a real app, you'd use a service like bit.ly)
        const shortId = Math.random().toString(36).substring(2, 8);
        this.metadata.shortenedUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/s/${shortId}`;
    }
    next();
});

// Static method to get sharing statistics
sharedJobSchema.statics.getSharingStats = function(jobId) {
    return this.aggregate([
        { $match: { job: jobId } },
        {
            $group: {
                _id: '$platform',
                count: { $sum: 1 },
                totalClicks: { $sum: '$clicks' },
                totalShares: { $sum: '$shares' }
            }
        },
        { $sort: { count: -1 } }
    ]);
};

// Static method to get trending jobs
sharedJobSchema.statics.getTrendingJobs = function(limit = 10, days = 7) {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    return this.aggregate([
        { $match: { sharedAt: { $gte: startDate } } },
        {
            $group: {
                _id: '$job',
                shareCount: { $sum: 1 },
                clickCount: { $sum: '$clicks' },
                platforms: { $addToSet: '$platform' }
            }
        },
        {
            $lookup: {
                from: 'jobs',
                localField: '_id',
                foreignField: '_id',
                as: 'jobDetails'
            }
        },
        { $unwind: '$jobDetails' },
        {
            $lookup: {
                from: 'companies',
                localField: 'jobDetails.company',
                foreignField: '_id',
                as: 'companyDetails'
            }
        },
        { $unwind: '$companyDetails' },
        {
            $project: {
                job: '$jobDetails',
                company: '$companyDetails',
                shareCount: 1,
                clickCount: 1,
                platforms: 1,
                engagementScore: { $add: ['$shareCount', '$clickCount'] }
            }
        },
        { $sort: { engagementScore: -1 } },
        { $limit: limit }
    ]);
};

// Instance method to track click
sharedJobSchema.methods.trackClick = function() {
    this.clicks += 1;
    return this.save();
};

// Instance method to track share
sharedJobSchema.methods.trackShare = function() {
    this.shares += 1;
    return this.save();
};

// Instance method to generate platform-specific sharing URL
sharedJobSchema.methods.getPlatformSharingUrl = function() {
    const jobUrl = this.sharingUrl;
    const message = encodeURIComponent(this.message);
    
    switch (this.platform) {
        case 'linkedin':
            return `https://www.linkedin.com/sharing/share-offsite/?url=${jobUrl}`;
        case 'twitter':
            return `https://twitter.com/intent/tweet?text=${message}&url=${jobUrl}`;
        case 'facebook':
            return `https://www.facebook.com/sharer/sharer.php?u=${jobUrl}`;
        case 'whatsapp':
            return `https://wa.me/?text=${message}%20${jobUrl}`;
        case 'email':
            return `mailto:?subject=${encodeURIComponent('Job Opportunity')}&body=${message}%20${jobUrl}`;
        default:
            return jobUrl;
    }
};

export const SharedJob = mongoose.model('SharedJob', sharedJobSchema);
