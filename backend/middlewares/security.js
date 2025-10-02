import helmet from 'helmet';
import cors from 'cors';
import xss from 'xss';
import validator from 'validator';
import { AuthenticationError, ValidationError } from './errorHandler.js';

// Security headers middleware
export const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            connectSrc: ["'self'", "https://api.linkedin.com"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            manifestSrc: ["'self'"],
            workerSrc: ["'self'"],
            childSrc: ["'self'"],
            formAction: ["'self'"],
            frameAncestors: ["'none'"],
            baseUri: ["'self'"],
            upgradeInsecureRequests: []
        }
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
});

// CORS configuration
export const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            process.env.FRONTEND_URL || 'http://localhost:5173',
            process.env.FRONTEND_URL_ALT || 'http://localhost:3000',
            process.env.PRODUCTION_URL || 'https://jobhunt.com',
            process.env.PRODUCTION_URL_WWW || 'https://www.jobhunt.com',
            process.env.APP_URL || 'https://app.jobhunt.com'
        ].filter(Boolean); // Remove any undefined values
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-API-Key'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset']
};

export const corsMiddleware = cors(corsOptions);

// XSS protection middleware
export const xssProtection = (req, res, next) => {
    const sanitizeObject = (obj) => {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = xss(obj[key], {
                    whiteList: {
                        p: [],
                        br: [],
                        strong: [],
                        em: [],
                        u: [],
                        ol: [],
                        ul: [],
                        li: [],
                        h1: [],
                        h2: [],
                        h3: [],
                        h4: [],
                        h5: [],
                        h6: []
                    },
                    stripIgnoreTag: true,
                    stripIgnoreTagBody: ['script']
                });
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                sanitizeObject(obj[key]);
            }
        }
    };
    
    if (req.body) sanitizeObject(req.body);
    if (req.query) sanitizeObject(req.query);
    if (req.params) sanitizeObject(req.params);
    
    next();
};

// SQL injection protection (for MongoDB, this is less relevant but good practice)
export const sqlInjectionProtection = (req, res, next) => {
    const dangerousPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
        /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
        /(\b(OR|AND)\s+['"]\s*=\s*['"])/i,
        /(\b(OR|AND)\s+1\s*=\s*1)/i,
        /(\b(OR|AND)\s+0\s*=\s*0)/i,
        /(\b(OR|AND)\s+true)/i,
        /(\b(OR|AND)\s+false)/i
    ];
    
    const checkString = (str) => {
        return dangerousPatterns.some(pattern => pattern.test(str));
    };
    
    const checkObject = (obj) => {
        for (const key in obj) {
            if (typeof obj[key] === 'string' && checkString(obj[key])) {
                throw new ValidationError('Potentially malicious input detected');
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                checkObject(obj[key]);
            }
        }
    };
    
    try {
        if (req.body) checkObject(req.body);
        if (req.query) checkObject(req.query);
        if (req.params) checkObject(req.params);
        next();
    } catch (error) {
        next(error);
    }
};

// Input validation and sanitization
export const inputSanitization = (req, res, next) => {
    const sanitizeString = (str) => {
        if (typeof str !== 'string') return str;
        
        // Remove null bytes
        str = str.replace(/\0/g, '');
        
        // Remove control characters except newlines and tabs
        str = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
        
        // Trim whitespace
        str = str.trim();
        
        // Limit length
        if (str.length > 10000) {
            str = str.substring(0, 10000);
        }
        
        return str;
    };
    
    const sanitizeObject = (obj) => {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = sanitizeString(obj[key]);
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                sanitizeObject(obj[key]);
            }
        }
    };
    
    if (req.body) sanitizeObject(req.body);
    if (req.query) sanitizeObject(req.query);
    if (req.params) sanitizeObject(req.params);
    
    next();
};

// File upload security
export const fileUploadSecurity = (req, res, next) => {
    if (!req.file && !req.files) return next();
    
    const files = req.files || [req.file];
    
    for (const file of files) {
        // Check file size
        const maxFileSize = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024; // 10MB
        if (file.size > maxFileSize) {
            return next(new ValidationError(`File size exceeds ${maxFileSize / (1024 * 1024)}MB limit`));
        }
        
        // Check file type
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp'
        ];
        
        if (!allowedTypes.includes(file.mimetype)) {
            return next(new ValidationError('File type not allowed'));
        }
        
        // Check file extension
        const allowedExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
        
        if (!allowedExtensions.includes(fileExtension)) {
            return next(new ValidationError('File extension not allowed'));
        }
        
        // Check for malicious file names
        const maliciousPatterns = [
            /\.\./, // Directory traversal
            /[<>:"|?*]/, // Invalid characters
            /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i, // Reserved names
            /\.(exe|bat|cmd|com|pif|scr|vbs|js|jar|app|deb|pkg|dmg)$/i // Executable extensions
        ];
        
        if (maliciousPatterns.some(pattern => pattern.test(file.originalname))) {
            return next(new ValidationError('Invalid file name'));
        }
    }
    
    next();
};

// Request size limiter
export const requestSizeLimiter = (maxSize = process.env.MAX_REQUEST_SIZE || '10mb') => {
    return (req, res, next) => {
        const contentLength = parseInt(req.get('content-length') || '0');
        const maxSizeBytes = parseSize(maxSize);
        
        if (contentLength > maxSizeBytes) {
            return next(new ValidationError('Request size exceeds limit'));
        }
        
        next();
    };
};

// Parse size string to bytes
const parseSize = (size) => {
    const units = {
        'b': 1,
        'kb': 1024,
        'mb': 1024 * 1024,
        'gb': 1024 * 1024 * 1024
    };
    
    const match = size.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)?$/);
    if (!match) return 10 * 1024 * 1024; // Default 10MB
    
    const value = parseFloat(match[1]);
    const unit = match[2] || 'b';
    
    return value * units[unit];
};

// IP whitelist/blacklist
export const ipFilter = (options = {}) => {
    const { whitelist = [], blacklist = [] } = options;
    
    return (req, res, next) => {
        const clientIP = req.ip || req.connection.remoteAddress;
        
        // Check blacklist first
        if (blacklist.length > 0) {
            const isBlacklisted = blacklist.some(ip => {
                if (typeof ip === 'string') {
                    return clientIP.includes(ip);
                }
                if (ip instanceof RegExp) {
                    return ip.test(clientIP);
                }
                return false;
            });
            
            if (isBlacklisted) {
                return next(new AuthenticationError('Access denied'));
            }
        }
        
        // Check whitelist
        if (whitelist.length > 0) {
            const isWhitelisted = whitelist.some(ip => {
                if (typeof ip === 'string') {
                    return clientIP.includes(ip);
                }
                if (ip instanceof RegExp) {
                    return ip.test(clientIP);
                }
                return false;
            });
            
            if (!isWhitelisted) {
                return next(new AuthenticationError('Access denied'));
            }
        }
        
        next();
    };
};

// User agent validation
export const userAgentValidation = (req, res, next) => {
    const userAgent = req.get('User-Agent') || '';
    
    // Block suspicious user agents
    const suspiciousPatterns = [
        /bot/i,
        /crawler/i,
        /spider/i,
        /scraper/i,
        /wget/i,
        /curl/i,
        /python/i,
        /java/i,
        /php/i
    ];
    
    const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(userAgent));
    
    if (isSuspicious && !req.path.startsWith('/api/v1/bots')) {
        return next(new AuthenticationError('Access denied'));
    }
    
    next();
};

// Referer validation
export const refererValidation = (req, res, next) => {
    const referer = req.get('Referer') || req.get('Referrer') || '';
    const allowedReferers = [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        process.env.FRONTEND_URL_ALT || 'http://localhost:3000',
        process.env.PRODUCTION_URL || 'https://jobhunt.com',
        process.env.PRODUCTION_URL_WWW || 'https://www.jobhunt.com',
        process.env.APP_URL || 'https://app.jobhunt.com'
    ].filter(Boolean); // Remove any undefined values
    
    // Allow requests with no referer (direct access, mobile apps, etc.)
    if (!referer) return next();
    
    const isAllowed = allowedReferers.some(allowed => referer.startsWith(allowed));
    
    if (!isAllowed) {
        return next(new AuthenticationError('Invalid referer'));
    }
    
    next();
};

// CSRF protection
export const csrfProtection = (req, res, next) => {
    // Skip CSRF for GET, HEAD, OPTIONS requests
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }
    
    const token = req.get('X-CSRF-Token') || req.body._csrf;
    const sessionToken = req.session?.csrfToken;
    
    if (!token || !sessionToken || token !== sessionToken) {
        return next(new AuthenticationError('CSRF token mismatch'));
    }
    
    next();
};

// Session security
export const sessionSecurity = (req, res, next) => {
    // Regenerate session ID on login
    if (req.path === '/api/v1/users/login' && req.method === 'POST') {
        req.session.regenerate((err) => {
            if (err) return next(err);
            next();
        });
        return;
    }
    
    // Set secure session options
    if (req.session) {
        req.session.cookie.secure = process.env.NODE_ENV === 'production';
        req.session.cookie.httpOnly = true;
        req.session.cookie.sameSite = 'strict';
    }
    
    next();
};

// API key validation
export const apiKeyValidation = (req, res, next) => {
    const apiKey = req.get('X-API-Key') || req.query.api_key;
    
    if (!apiKey) {
        return next(new AuthenticationError('API key required'));
    }
    
    // Validate API key format
    if (!validator.isUUID(apiKey, 4)) {
        return next(new AuthenticationError('Invalid API key format'));
    }
    
    // Check API key against database
    // This would need to be implemented based on your API key storage
    // For now, we'll just validate the format
    
    next();
};

// Request logging for security monitoring
export const securityLogging = (req, res, next) => {
    const logData = {
        timestamp: new Date().toISOString(),
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent') || '',
        method: req.method,
        url: req.originalUrl,
        referer: req.get('Referer') || '',
        userId: req.user?._id || 'anonymous'
    };
    
    // Log suspicious requests
    const suspiciousPatterns = [
        /\.\./, // Directory traversal
        /<script/i, // XSS attempts
        /union.*select/i, // SQL injection
        /eval\(/i, // Code injection
        /javascript:/i, // JavaScript injection
        /onload=/i, // Event handler injection
        /onerror=/i // Event handler injection
    ];
    
    const isSuspicious = suspiciousPatterns.some(pattern => 
        pattern.test(req.originalUrl) || 
        pattern.test(req.get('User-Agent') || '') ||
        pattern.test(JSON.stringify(req.body))
    );
    
    if (isSuspicious) {
        console.warn('Suspicious request detected:', logData);
    }
    
    next();
};

// Security headers for specific routes
export const securityHeadersForRoute = (route) => {
    return (req, res, next) => {
        if (req.path.startsWith(route)) {
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('X-Frame-Options', 'DENY');
            res.setHeader('X-XSS-Protection', '1; mode=block');
            res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        }
        next();
    };
};

// Export all security middlewares
export default {
    securityHeaders,
    corsMiddleware,
    xssProtection,
    sqlInjectionProtection,
    inputSanitization,
    fileUploadSecurity,
    requestSizeLimiter,
    ipFilter,
    userAgentValidation,
    refererValidation,
    csrfProtection,
    sessionSecurity,
    apiKeyValidation,
    securityLogging,
    securityHeadersForRoute
};
