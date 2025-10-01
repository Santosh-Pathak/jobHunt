import mongoose from 'mongoose';

const systemHealthSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['healthy', 'warning', 'critical', 'down'],
        required: true
    },
    uptime: {
        type: Number,
        required: true
    },
    responseTime: {
        type: Number,
        required: true
    },
    errorRate: {
        type: Number,
        required: true
    },
    cpuUsage: {
        type: Number,
        required: true
    },
    memoryUsage: {
        type: Number,
        required: true
    },
    diskUsage: {
        type: Number,
        required: true
    },
    networkLatency: {
        type: Number,
        required: true
    },
    activeConnections: {
        type: Number,
        default: 0
    },
    databaseStatus: {
        type: String,
        enum: ['connected', 'disconnected', 'error'],
        default: 'connected'
    },
    cacheStatus: {
        type: String,
        enum: ['active', 'inactive', 'error'],
        default: 'active'
    },
    sslStatus: {
        type: String,
        enum: ['valid', 'expired', 'invalid'],
        default: 'valid'
    },
    lastBackup: {
        type: Date
    },
    nextBackup: {
        type: Date
    },
    version: {
        type: String,
        default: '1.0.0'
    },
    environment: {
        type: String,
        enum: ['development', 'staging', 'production'],
        default: 'development'
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, { timestamps: true });

export const SystemHealth = mongoose.model('SystemHealth', systemHealthSchema);
