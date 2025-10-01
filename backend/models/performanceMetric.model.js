import mongoose from 'mongoose';

const performanceMetricSchema = new mongoose.Schema({
    totalRequests: {
        type: Number,
        default: 0
    },
    successfulRequests: {
        type: Number,
        default: 0
    },
    failedRequests: {
        type: Number,
        default: 0
    },
    averageResponseTime: {
        type: Number,
        default: 0
    },
    peakConcurrentUsers: {
        type: Number,
        default: 0
    },
    databaseConnections: {
        type: Number,
        default: 0
    },
    cacheHitRate: {
        type: Number,
        default: 0
    },
    queueSize: {
        type: Number,
        default: 0
    },
    memoryUsage: {
        type: Number,
        default: 0
    },
    cpuUsage: {
        type: Number,
        default: 0
    },
    diskUsage: {
        type: Number,
        default: 0
    },
    networkLatency: {
        type: Number,
        default: 0
    },
    errorRate: {
        type: Number,
        default: 0
    },
    throughput: {
        type: Number,
        default: 0
    },
    activeSessions: {
        type: Number,
        default: 0
    },
    databaseQueryTime: {
        type: Number,
        default: 0
    },
    cacheSize: {
        type: Number,
        default: 0
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    period: {
        type: String,
        enum: ['minute', 'hour', 'day', 'week', 'month'],
        default: 'hour'
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, { timestamps: true });

// Index for efficient querying
performanceMetricSchema.index({ timestamp: -1 });
performanceMetricSchema.index({ period: 1 });

export const PerformanceMetric = mongoose.model('PerformanceMetric', performanceMetricSchema);
