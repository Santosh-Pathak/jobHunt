import { SystemHealth } from '../models/systemHealth.model.js';
import { SystemAlert } from '../models/systemAlert.model.js';
import { SystemLog } from '../models/systemLog.model.js';
import { PerformanceMetric } from '../models/performanceMetric.model.js';
import os from 'os';
import fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

// Get system health
export const getSystemHealth = async (req, res) => {
    try {
        // Get system metrics
        const cpuUsage = await getCpuUsage();
        const memoryUsage = await getMemoryUsage();
        const diskUsage = await getDiskUsage();
        const networkLatency = await getNetworkLatency();

        // Determine overall health status
        let status = 'healthy';
        if (cpuUsage > 80 || memoryUsage > 80 || diskUsage > 80) {
            status = 'critical';
        } else if (cpuUsage > 60 || memoryUsage > 60 || diskUsage > 60) {
            status = 'warning';
        }

        // Get uptime
        const uptime = process.uptime();

        // Calculate response time (simplified)
        const responseTime = Math.random() * 100 + 50; // Mock response time

        // Calculate error rate (simplified)
        const errorRate = Math.random() * 5; // Mock error rate

        const health = {
            status,
            uptime: Math.floor(uptime),
            responseTime: Math.round(responseTime),
            errorRate: Math.round(errorRate * 100) / 100,
            cpuUsage: Math.round(cpuUsage),
            memoryUsage: Math.round(memoryUsage),
            diskUsage: Math.round(diskUsage),
            networkLatency: Math.round(networkLatency)
        };

        // Save to database
        await SystemHealth.create(health);

        res.status(200).json({ 
            success: true, 
            health 
        });
    } catch (error) {
        console.error('Error fetching system health:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get performance metrics
export const getPerformanceMetrics = async (req, res) => {
    try {
        // Get metrics from database or calculate
        const metrics = await PerformanceMetric.findOne().sort({ createdAt: -1 });

        if (!metrics) {
            // Generate mock metrics if none exist
            const mockMetrics = {
                totalRequests: Math.floor(Math.random() * 10000) + 50000,
                successfulRequests: Math.floor(Math.random() * 8000) + 45000,
                failedRequests: Math.floor(Math.random() * 500) + 100,
                averageResponseTime: Math.floor(Math.random() * 200) + 100,
                peakConcurrentUsers: Math.floor(Math.random() * 100) + 200,
                databaseConnections: Math.floor(Math.random() * 20) + 10,
                cacheHitRate: Math.floor(Math.random() * 20) + 70,
                queueSize: Math.floor(Math.random() * 50) + 10
            };

            await PerformanceMetric.create(mockMetrics);
            return res.status(200).json({ 
                success: true, 
                metrics: mockMetrics 
            });
        }

        res.status(200).json({ 
            success: true, 
            metrics 
        });
    } catch (error) {
        console.error('Error fetching performance metrics:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get system alerts
export const getSystemAlerts = async (req, res) => {
    try {
        const { status, severity, limit = 50 } = req.query;

        let query = {};
        if (status) query.status = status;
        if (severity) query.severity = severity;

        const alerts = await SystemAlert.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.status(200).json({ 
            success: true, 
            alerts 
        });
    } catch (error) {
        console.error('Error fetching system alerts:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get system logs
export const getSystemLogs = async (req, res) => {
    try {
        const { level, limit = 100 } = req.query;

        let query = {};
        if (level) query.level = level;

        const logs = await SystemLog.find(query)
            .sort({ timestamp: -1 })
            .limit(parseInt(limit));

        res.status(200).json({ 
            success: true, 
            logs 
        });
    } catch (error) {
        console.error('Error fetching system logs:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Handle alert actions
export const handleAlertAction = async (req, res) => {
    try {
        const { alertId, action } = req.params;

        const validActions = ['acknowledge', 'resolve', 'dismiss'];
        if (!validActions.includes(action)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid action' 
            });
        }

        const alert = await SystemAlert.findById(alertId);
        if (!alert) {
            return res.status(404).json({ 
                success: false, 
                message: 'Alert not found' 
            });
        }

        // Update alert status
        switch (action) {
            case 'acknowledge':
                alert.status = 'acknowledged';
                alert.acknowledgedAt = new Date();
                break;
            case 'resolve':
                alert.status = 'resolved';
                alert.resolvedAt = new Date();
                break;
            case 'dismiss':
                alert.status = 'dismissed';
                alert.dismissedAt = new Date();
                break;
        }

        await alert.save();

        res.status(200).json({ 
            success: true, 
            message: `Alert ${action}d successfully` 
        });
    } catch (error) {
        console.error('Error handling alert action:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Create system alert
export const createSystemAlert = async (req, res) => {
    try {
        const { title, message, severity, type, data } = req.body;

        if (!title || !message || !severity) {
            return res.status(400).json({ 
                success: false, 
                message: 'Title, message, and severity are required' 
            });
        }

        const validSeverities = ['info', 'warning', 'critical'];
        if (!validSeverities.includes(severity)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid severity' 
            });
        }

        const alert = await SystemAlert.create({
            title,
            message,
            severity,
            type: type || 'system',
            data: data || {},
            status: 'active',
            createdAt: new Date()
        });

        res.status(201).json({ 
            success: true, 
            message: 'Alert created successfully',
            alert 
        });
    } catch (error) {
        console.error('Error creating system alert:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Log system event
export const logSystemEvent = async (req, res) => {
    try {
        const { level, message, source, data } = req.body;

        if (!level || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'Level and message are required' 
            });
        }

        const validLevels = ['error', 'warn', 'info', 'debug'];
        if (!validLevels.includes(level)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid log level' 
            });
        }

        const log = await SystemLog.create({
            level,
            message,
            source: source || 'system',
            data: data || {},
            timestamp: new Date()
        });

        res.status(201).json({ 
            success: true, 
            message: 'Log entry created successfully',
            log 
        });
    } catch (error) {
        console.error('Error logging system event:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get system statistics
export const getSystemStats = async (req, res) => {
    try {
        const stats = {
            alerts: await SystemAlert.countDocuments(),
            activeAlerts: await SystemAlert.countDocuments({ status: 'active' }),
            resolvedAlerts: await SystemAlert.countDocuments({ status: 'resolved' }),
            logs: await SystemLog.countDocuments(),
            errorLogs: await SystemLog.countDocuments({ level: 'error' }),
            warningLogs: await SystemLog.countDocuments({ level: 'warn' }),
            healthChecks: await SystemHealth.countDocuments(),
            performanceMetrics: await PerformanceMetric.countDocuments()
        };

        res.status(200).json({ 
            success: true, 
            stats 
        });
    } catch (error) {
        console.error('Error fetching system stats:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Helper functions for system metrics
const getCpuUsage = async () => {
    try {
        const cpus = os.cpus();
        let totalIdle = 0;
        let totalTick = 0;

        cpus.forEach(cpu => {
            for (const type in cpu.times) {
                totalTick += cpu.times[type];
            }
            totalIdle += cpu.times.idle;
        });

        const idle = totalIdle / cpus.length;
        const total = totalTick / cpus.length;
        const usage = 100 - Math.floor(100 * idle / total);
        
        return Math.max(0, Math.min(100, usage));
    } catch (error) {
        console.error('Error getting CPU usage:', error);
        return 0;
    }
};

const getMemoryUsage = async () => {
    try {
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const usage = (usedMem / totalMem) * 100;
        
        return Math.max(0, Math.min(100, usage));
    } catch (error) {
        console.error('Error getting memory usage:', error);
        return 0;
    }
};

const getDiskUsage = async () => {
    try {
        // This is a simplified implementation
        // In production, you'd use a library like 'diskusage' or 'node-disk-info'
        const stats = await readFile('/proc/diskstats', 'utf8');
        // Mock disk usage calculation
        return Math.floor(Math.random() * 30) + 40; // Mock 40-70% usage
    } catch (error) {
        console.error('Error getting disk usage:', error);
        return 0;
    }
};

const getNetworkLatency = async () => {
    try {
        // Mock network latency
        return Math.floor(Math.random() * 50) + 10; // 10-60ms
    } catch (error) {
        console.error('Error getting network latency:', error);
        return 0;
    }
};
