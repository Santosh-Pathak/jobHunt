import mongoose from 'mongoose';

const jobAlertSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        maxlength: 100
    },
    keywords: [{
        type: String,
        required: true,
        maxlength: 50
    }],
    location: {
        type: String,
        maxlength: 100
    },
    jobType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance']
    },
    experienceLevel: {
        type: String,
        enum: ['entry', 'mid', 'senior', 'lead']
    },
    salaryMin: {
        type: Number,
        min: 0
    },
    salaryMax: {
        type: Number,
        min: 0
    },
    companySize: {
        type: String,
        enum: ['startup', 'small', 'medium', 'large']
    },
    industry: {
        type: String,
        maxlength: 100
    },
    remoteWork: {
        type: Boolean,
        default: false
    },
    frequency: {
        type: String,
        enum: ['instant', 'daily', 'weekly', 'monthly'],
        default: 'daily'
    },
    emailNotifications: {
        type: Boolean,
        default: true
    },
    pushNotifications: {
        type: Boolean,
        default: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastChecked: {
        type: Date,
        default: Date.now
    },
    lastNotificationSent: Date,
    totalMatches: {
        type: Number,
        default: 0
    },
    settings: {
        excludeCompanies: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company'
        }],
        includeCompanies: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company'
        }],
        excludeKeywords: [String],
        minSalaryCurrency: {
            type: String,
            default: 'USD'
        },
        maxSalaryCurrency: {
            type: String,
            default: 'USD'
        }
    }
}, {
    timestamps: true
});

// Indexes for better query performance
jobAlertSchema.index({ user: 1, isActive: 1 });
jobAlertSchema.index({ user: 1, createdAt: -1 });
jobAlertSchema.index({ frequency: 1, lastChecked: 1 });
jobAlertSchema.index({ isActive: 1, frequency: 1 });

// Virtual for alert summary
jobAlertSchema.virtual('summary').get(function() {
    const parts = [];
    if (this.keywords.length > 0) {
        parts.push(this.keywords.slice(0, 3).join(', '));
    }
    if (this.location) {
        parts.push(this.location);
    }
    if (this.jobType) {
        parts.push(this.jobType);
    }
    return parts.join(' • ');
});

// Virtual for notification preferences summary
jobAlertSchema.virtual('notificationSummary').get(function() {
    const prefs = [];
    if (this.emailNotifications) prefs.push('Email');
    if (this.pushNotifications) prefs.push('Push');
    return prefs.join(', ') || 'None';
});

// Pre-save middleware to validate salary range
jobAlertSchema.pre('save', function(next) {
    if (this.salaryMin && this.salaryMax && this.salaryMin > this.salaryMax) {
        return next(new Error('Minimum salary cannot be greater than maximum salary'));
    }
    next();
});

// Pre-save middleware to validate keywords
jobAlertSchema.pre('save', function(next) {
    if (this.keywords.length === 0) {
        return next(new Error('At least one keyword is required'));
    }
    
    // Remove duplicates and empty strings
    this.keywords = [...new Set(this.keywords.filter(keyword => keyword.trim().length > 0))];
    
    if (this.keywords.length === 0) {
        return next(new Error('At least one valid keyword is required'));
    }
    
    next();
});

// Static method to get active alerts for processing
jobAlertSchema.statics.getActiveAlertsForProcessing = function() {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return this.find({
        isActive: true,
        $or: [
            { frequency: 'instant' },
            { frequency: 'daily', lastChecked: { $lte: oneDayAgo } },
            { frequency: 'weekly', lastChecked: { $lte: oneWeekAgo } },
            { frequency: 'monthly', lastChecked: { $lte: oneMonthAgo } }
        ]
    }).populate('user', 'fullName email');
};

// Static method to get user's alert statistics
jobAlertSchema.statics.getUserAlertStats = function(userId) {
    return this.aggregate([
        { $match: { user: userId } },
        {
            $group: {
                _id: null,
                totalAlerts: { $sum: 1 },
                activeAlerts: { $sum: { $cond: ['$isActive', 1, 0] } },
                totalMatches: { $sum: '$totalMatches' },
                avgMatchesPerAlert: { $avg: '$totalMatches' }
            }
        }
    ]);
};

// Instance method to check if alert should be processed
jobAlertSchema.methods.shouldProcess = function() {
    const now = new Date();
    const timeSinceLastCheck = now - this.lastChecked;

    switch (this.frequency) {
        case 'instant':
            return true;
        case 'daily':
            return timeSinceLastCheck >= 24 * 60 * 60 * 1000;
        case 'weekly':
            return timeSinceLastCheck >= 7 * 24 * 60 * 60 * 1000;
        case 'monthly':
            return timeSinceLastCheck >= 30 * 24 * 60 * 60 * 1000;
        default:
            return timeSinceLastCheck >= 24 * 60 * 60 * 1000;
    }
};

// Instance method to update last checked time
jobAlertSchema.methods.updateLastChecked = function() {
    this.lastChecked = new Date();
    return this.save();
};

// Instance method to increment match count
jobAlertSchema.methods.incrementMatches = function(count = 1) {
    this.totalMatches += count;
    return this.save();
};

// Instance method to get search criteria for job matching
jobAlertSchema.methods.getSearchCriteria = function() {
    const criteria = {
        status: 'active'
    };

    // Keywords
    if (this.keywords.length > 0) {
        criteria.$or = [
            { title: { $regex: this.keywords.join('|'), $options: 'i' } },
            { description: { $regex: this.keywords.join('|'), $options: 'i' } },
            { requirements: { $regex: this.keywords.join('|'), $options: 'i' } }
        ];
    }

    // Location
    if (this.location) {
        criteria.location = { $regex: this.location, $options: 'i' };
    }

    // Job type
    if (this.jobType) {
        criteria.jobType = this.jobType;
    }

    // Experience level
    if (this.experienceLevel) {
        const experienceMap = {
            'entry': 0,
            'mid': 3,
            'senior': 5,
            'lead': 8
        };
        criteria.experience = { $lte: experienceMap[this.experienceLevel] };
    }

    // Salary range
    if (this.salaryMin || this.salaryMax) {
        criteria.salary = {};
        if (this.salaryMin) criteria.salary.$gte = this.salaryMin;
        if (this.salaryMax) criteria.salary.$lte = this.salaryMax;
    }

    // Remote work
    if (this.remoteWork) {
        criteria.$or = [
            { ...criteria.$or },
            { location: { $regex: 'remote', $options: 'i' } },
            { location: { $regex: 'work from home', $options: 'i' } }
        ];
    }

    // Exclude companies
    if (this.settings.excludeCompanies.length > 0) {
        criteria.company = { $nin: this.settings.excludeCompanies };
    }

    // Include only specific companies
    if (this.settings.includeCompanies.length > 0) {
        criteria.company = { $in: this.settings.includeCompanies };
    }

    return criteria;
};

export const JobAlert = mongoose.model('JobAlert', jobAlertSchema);