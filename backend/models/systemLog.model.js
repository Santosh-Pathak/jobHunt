import mongoose from 'mongoose';

const systemLogSchema = new mongoose.Schema({
    level: {
        type: String,
        enum: ['error', 'warn', 'info', 'debug'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    source: {
        type: String,
        default: 'system'
    },
    component: {
        type: String,
        default: 'unknown'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    sessionId: {
        type: String
    },
    ip: {
        type: String
    },
    userAgent: {
        type: String
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    stack: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    environment: {
        type: String,
        enum: ['development', 'staging', 'production'],
        default: 'development'
    },
    version: {
        type: String,
        default: '1.0.0'
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, { timestamps: true });

// Index for efficient querying
systemLogSchema.index({ timestamp: -1 });
systemLogSchema.index({ level: 1 });
systemLogSchema.index({ source: 1 });
systemLogSchema.index({ userId: 1 });

export const SystemLog = mongoose.model('SystemLog', systemLogSchema);
