import rateLimit from 'express-rate-limit';
import { RateLimitError } from './errorHandler.js';

// In-memory store for rate limiting (in production, use Redis)
const store = new Map();

// Custom store implementation
const customStore = {
    incr: (key, cb) => {
        const now = Date.now();
        const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000; // 15 minutes
        const limit = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100; // requests per window
        
        if (!store.has(key)) {
            store.set(key, { count: 1, resetTime: now + windowMs });
            return cb(null, 1, store.get(key).resetTime);
        }
        
        const data = store.get(key);
        
        if (now > data.resetTime) {
            store.set(key, { count: 1, resetTime: now + windowMs });
            return cb(null, 1, store.get(key).resetTime);
        }
        
        data.count++;
        store.set(key, data);
        
        if (data.count > limit) {
            return cb(new RateLimitError('Rate limit exceeded'), data.count, data.resetTime);
        }
        
        return cb(null, data.count, data.resetTime);
    },
    
    decrement: (key) => {
        if (store.has(key)) {
            const data = store.get(key);
            data.count = Math.max(0, data.count - 1);
            store.set(key, data);
        }
    },
    
    resetKey: (key) => {
        store.delete(key);
    }
};

// General rate limiter
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: customStore,
    keyGenerator: (req) => {
        return req.ip || req.connection.remoteAddress;
    },
    skip: (req) => {
        // Skip rate limiting for admin users
        return req.user && req.user.role === 'admin';
    }
});

// Strict rate limiter for sensitive operations
export const strictLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests for this operation, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: customStore,
    keyGenerator: (req) => {
        return `${req.ip || req.connection.remoteAddress}:${req.route?.path || req.path}`;
    }
});

// Login rate limiter
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 login attempts per windowMs
    message: {
        success: false,
        message: 'Too many login attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: customStore,
    keyGenerator: (req) => {
        return `${req.ip || req.connection.remoteAddress}:login`;
    },
    skipSuccessfulRequests: true, // Don't count successful requests
    skipFailedRequests: false // Count failed requests
});

// Registration rate limiter
export const registrationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // limit each IP to 3 registrations per hour
    message: {
        success: false,
        message: 'Too many registration attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: customStore,
    keyGenerator: (req) => {
        return `${req.ip || req.connection.remoteAddress}:register`;
    }
});

// Password reset rate limiter
export const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // limit each IP to 3 password reset attempts per hour
    message: {
        success: false,
        message: 'Too many password reset attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: customStore,
    keyGenerator: (req) => {
        return `${req.ip || req.connection.remoteAddress}:password-reset`;
    }
});

// Application submission rate limiter
export const applicationLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 50, // limit each user to 50 applications per day
    message: {
        success: false,
        message: 'Daily application limit reached, please try again tomorrow.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: customStore,
    keyGenerator: (req) => {
        return `${req.user?._id || req.ip || req.connection.remoteAddress}:applications`;
    },
    skip: (req) => {
        // Skip for admin users
        return req.user && req.user.role === 'admin';
    }
});

// Job posting rate limiter
export const jobPostingLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 10, // limit each company to 10 job postings per day
    message: {
        success: false,
        message: 'Daily job posting limit reached, please try again tomorrow.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: customStore,
    keyGenerator: (req) => {
        return `${req.user?.company || req.user?._id || req.ip || req.connection.remoteAddress}:job-postings`;
    },
    skip: (req) => {
        // Skip for admin users
        return req.user && req.user.role === 'admin';
    }
});

// Message sending rate limiter
export const messageLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit each user to 10 messages per minute
    message: {
        success: false,
        message: 'Message rate limit exceeded, please slow down.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: customStore,
    keyGenerator: (req) => {
        return `${req.user?._id || req.ip || req.connection.remoteAddress}:messages`;
    }
});

// Search rate limiter
export const searchLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // limit each IP to 30 searches per minute
    message: {
        success: false,
        message: 'Search rate limit exceeded, please slow down.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: customStore,
    keyGenerator: (req) => {
        return `${req.ip || req.connection.remoteAddress}:search`;
    }
});

// File upload rate limiter
export const fileUploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // limit each user to 20 file uploads per hour
    message: {
        success: false,
        message: 'File upload limit reached, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: customStore,
    keyGenerator: (req) => {
        return `${req.user?._id || req.ip || req.connection.remoteAddress}:file-uploads`;
    }
});

// API key rate limiter (for external API access)
export const apiKeyLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // limit each API key to 100 requests per minute
    message: {
        success: false,
        message: 'API rate limit exceeded.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: customStore,
    keyGenerator: (req) => {
        return req.headers['x-api-key'] || req.ip || req.connection.remoteAddress;
    }
});

// LinkedIn import rate limiter
export const linkedinImportLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // limit each user to 5 LinkedIn imports per hour
    message: {
        success: false,
        message: 'LinkedIn import limit reached, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: customStore,
    keyGenerator: (req) => {
        return `${req.user?._id || req.ip || req.connection.remoteAddress}:linkedin-import`;
    }
});

// Custom rate limiter factory
export const createCustomLimiter = (options) => {
    const defaultOptions = {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100,
        message: {
            success: false,
            message: 'Rate limit exceeded.'
        },
        standardHeaders: true,
        legacyHeaders: false,
        store: customStore
    };
    
    return rateLimit({ ...defaultOptions, ...options });
};

// Rate limit by user ID
export const userBasedLimiter = (maxRequests, windowMs = 15 * 60 * 1000) => {
    return rateLimit({
        windowMs,
        max: maxRequests,
        message: {
            success: false,
            message: 'User rate limit exceeded.'
        },
        standardHeaders: true,
        legacyHeaders: false,
        store: customStore,
        keyGenerator: (req) => {
            return req.user?._id || req.ip || req.connection.remoteAddress;
        }
    });
};

// Rate limit by IP address
export const ipBasedLimiter = (maxRequests, windowMs = 15 * 60 * 1000) => {
    return rateLimit({
        windowMs,
        max: maxRequests,
        message: {
            success: false,
            message: 'IP rate limit exceeded.'
        },
        standardHeaders: true,
        legacyHeaders: false,
        store: customStore,
        keyGenerator: (req) => {
            return req.ip || req.connection.remoteAddress;
        }
    });
};

// Rate limit by endpoint
export const endpointBasedLimiter = (maxRequests, windowMs = 15 * 60 * 1000) => {
    return rateLimit({
        windowMs,
        max: maxRequests,
        message: {
            success: false,
            message: 'Endpoint rate limit exceeded.'
        },
        standardHeaders: true,
        legacyHeaders: false,
        store: customStore,
        keyGenerator: (req) => {
            return `${req.ip || req.connection.remoteAddress}:${req.route?.path || req.path}`;
        }
    });
};

// Dynamic rate limiter based on user role
export const roleBasedLimiter = (roleLimits = {}) => {
    return (req, res, next) => {
        const userRole = req.user?.role || 'anonymous';
        const limit = roleLimits[userRole] || roleLimits.default || 100;
        
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000,
            max: limit,
            message: {
                success: false,
                message: 'Rate limit exceeded for your role.'
            },
            standardHeaders: true,
            legacyHeaders: false,
            store: customStore,
            keyGenerator: (req) => {
                return `${req.user?._id || req.ip || req.connection.remoteAddress}:${userRole}`;
            }
        });
        
        limiter(req, res, next);
    };
};

// Burst rate limiter (allows bursts but limits sustained usage)
export const burstLimiter = (burstLimit = 10, sustainedLimit = 100, windowMs = 15 * 60 * 1000) => {
    return rateLimit({
        windowMs,
        max: burstLimit,
        message: {
            success: false,
            message: 'Burst rate limit exceeded.'
        },
        standardHeaders: true,
        legacyHeaders: false,
        store: customStore,
        keyGenerator: (req) => {
            return `${req.ip || req.connection.remoteAddress}:burst`;
        },
        skip: (req) => {
            // Check sustained rate limit
            const key = `${req.ip || req.connection.remoteAddress}:sustained`;
            const data = store.get(key);
            if (data && data.count >= sustainedLimit) {
                return false; // Don't skip, apply burst limit
            }
            return true; // Skip burst limit, apply sustained limit
        }
    });
};

// Rate limit bypass for trusted sources
export const bypassLimiter = (trustedSources = []) => {
    return (req, res, next) => {
        const clientIP = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('User-Agent') || '';
        
        // Check if request is from trusted source
        const isTrusted = trustedSources.some(source => {
            if (typeof source === 'string') {
                return clientIP.includes(source) || userAgent.includes(source);
            }
            if (source instanceof RegExp) {
                return source.test(clientIP) || source.test(userAgent);
            }
            return false;
        });
        
        if (isTrusted) {
            return next(); // Bypass rate limiting
        }
        
        // Apply rate limiting
        return generalLimiter(req, res, next);
    };
};

// Rate limit cleanup (remove expired entries)
export const cleanupRateLimits = () => {
    const now = Date.now();
    for (const [key, data] of store.entries()) {
        if (now > data.resetTime) {
            store.delete(key);
        }
    }
};

// Run cleanup every 5 minutes
setInterval(cleanupRateLimits, 5 * 60 * 1000);

// Export all limiters
export default {
    generalLimiter,
    strictLimiter,
    loginLimiter,
    registrationLimiter,
    passwordResetLimiter,
    applicationLimiter,
    jobPostingLimiter,
    messageLimiter,
    searchLimiter,
    fileUploadLimiter,
    apiKeyLimiter,
    linkedinImportLimiter,
    createCustomLimiter,
    userBasedLimiter,
    ipBasedLimiter,
    endpointBasedLimiter,
    roleBasedLimiter,
    burstLimiter,
    bypassLimiter,
    cleanupRateLimits
};
