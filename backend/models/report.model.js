import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    contentType: {
        type: String,
        enum: ['job', 'company', 'review', 'message', 'user'],
        required: true
    },
    content: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'contentType'
    },
    reason: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
        default: 'pending'
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewedAt: {
        type: Date
    },
    reviewNotes: {
        type: String,
        trim: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    category: {
        type: String,
        enum: ['spam', 'inappropriate', 'harassment', 'fake', 'other'],
        default: 'other'
    },
    evidence: [{
        type: String, // URLs or file paths
        description: String
    }],
    resolved: {
        type: Boolean,
        default: false
    },
    resolvedAt: {
        type: Date
    },
    resolution: {
        type: String,
        enum: ['action_taken', 'no_action', 'false_report', 'duplicate'],
        default: 'no_action'
    }
}, { timestamps: true });

export const Report = mongoose.model('Report', reportSchema);
