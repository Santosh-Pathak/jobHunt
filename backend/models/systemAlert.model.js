import mongoose from 'mongoose';

const systemAlertSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ['info', 'warning', 'critical'],
        required: true
    },
    type: {
        type: String,
        enum: ['system', 'performance', 'security', 'database', 'network', 'application'],
        default: 'system'
    },
    status: {
        type: String,
        enum: ['active', 'acknowledged', 'resolved', 'dismissed'],
        default: 'active'
    },
    source: {
        type: String,
        default: 'system'
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    acknowledgedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    acknowledgedAt: {
        type: Date
    },
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    resolvedAt: {
        type: Date
    },
    dismissedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dismissedAt: {
        type: Date
    },
    resolution: {
        type: String,
        trim: true
    },
    automated: {
        type: Boolean,
        default: false
    },
    threshold: {
        type: Number
    },
    currentValue: {
        type: Number
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, { timestamps: true });

export const SystemAlert = mongoose.model('SystemAlert', systemAlertSchema);
