import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['profile_view', 'job_view', 'application_submit', 'search_performed', 'login', 'logout'],
        required: true
    },
    data: {
        jobId: mongoose.Schema.Types.ObjectId,
        companyId: mongoose.Schema.Types.ObjectId,
        searchQuery: String,
        filters: mongoose.Schema.Types.Mixed,
        page: String,
        referrer: String,
        userAgent: String,
        ipAddress: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    sessionId: String
}, { timestamps: true });

// Create indexes for better performance
analyticsSchema.index({ user: 1, type: 1, timestamp: -1 });
analyticsSchema.index({ timestamp: -1 });

export const Analytics = mongoose.model('Analytics', analyticsSchema);
