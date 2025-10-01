import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        required: true,
        maxlength: 200
    },
    pros: {
        type: String,
        maxlength: 1000
    },
    cons: {
        type: String,
        maxlength: 1000
    },
    overallExperience: {
        type: String,
        required: true,
        maxlength: 2000
    },
    workLifeBalance: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    },
    salaryBenefits: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    },
    careerGrowth: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    },
    management: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    },
    culture: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    },
    recommend: {
        type: Boolean,
        default: true
    },
    anonymous: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    reports: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        reason: {
            type: String,
            required: true,
            enum: ['inappropriate', 'spam', 'fake', 'harassment', 'other']
        },
        reportedAt: {
            type: Date,
            default: Date.now
        }
    }],
    moderationNotes: {
        type: String,
        maxlength: 500
    },
    moderatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    moderatedAt: Date
}, {
    timestamps: true
});

// Indexes for better query performance
reviewSchema.index({ company: 1, status: 1 });
reviewSchema.index({ user: 1, company: 1 });
reviewSchema.index({ rating: 1, status: 1 });
reviewSchema.index({ createdAt: -1 });

// Virtual for company name
reviewSchema.virtual('companyName').get(function() {
    return this.company?.name || 'Unknown Company';
});

// Virtual for author name
reviewSchema.virtual('authorName').get(function() {
    if (this.anonymous) {
        return 'Anonymous';
    }
    return this.user?.fullName || 'Unknown User';
});

// Pre-save middleware to prevent duplicate reviews
reviewSchema.pre('save', async function(next) {
    if (this.isNew) {
        const existingReview = await this.constructor.findOne({
            user: this.user,
            company: this.company
        });
        
        if (existingReview) {
            return next(new Error('You have already reviewed this company'));
        }
    }
    next();
});

// Static method to get company average rating
reviewSchema.statics.getCompanyAverageRating = function(companyId) {
    return this.aggregate([
        { $match: { company: companyId, status: 'approved' } },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 }
            }
        }
    ]);
};

// Static method to get rating distribution
reviewSchema.statics.getRatingDistribution = function(companyId) {
    return this.aggregate([
        { $match: { company: companyId, status: 'approved' } },
        {
            $group: {
                _id: '$rating',
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);
};

// Instance method to calculate overall score
reviewSchema.methods.calculateOverallScore = function() {
    const scores = [
        this.workLifeBalance,
        this.salaryBenefits,
        this.careerGrowth,
        this.management,
        this.culture
    ];
    
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
};

// Instance method to check if user can edit
reviewSchema.methods.canEdit = function(userId) {
    return this.user.toString() === userId.toString() && this.status === 'pending';
};

// Instance method to check if user can delete
reviewSchema.methods.canDelete = function(userId) {
    return this.user.toString() === userId.toString();
};

export const Review = mongoose.model('Review', reviewSchema);
