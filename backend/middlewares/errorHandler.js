import multer from 'multer';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// Custom error classes
export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(message) {
        super(message, 400);
        this.name = 'ValidationError';
    }
}

export class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed') {
        super(message, 401);
        this.name = 'AuthenticationError';
    }
}

export class AuthorizationError extends AppError {
    constructor(message = 'Access denied') {
        super(message, 403);
        this.name = 'AuthorizationError';
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

export class ConflictError extends AppError {
    constructor(message = 'Resource conflict') {
        super(message, 409);
        this.name = 'ConflictError';
    }
}

export class RateLimitError extends AppError {
    constructor(message = 'Too many requests') {
        super(message, 429);
        this.name = 'RateLimitError';
    }
}

export class FileUploadError extends AppError {
    constructor(message = 'File upload failed') {
        super(message, 400);
        this.name = 'FileUploadError';
    }
}

// Handle different types of errors
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new ValidationError(message);
};

const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new ConflictError(message);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new ValidationError(message);
};

const handleJWTError = () => {
    return new AuthenticationError('Invalid token. Please log in again!');
};

const handleJWTExpiredError = () => {
    return new AuthenticationError('Your token has expired! Please log in again.');
};

const handleMulterError = (err) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return new FileUploadError('File too large. Maximum size is 5MB.');
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
        return new FileUploadError('Too many files. Maximum is 1 file.');
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return new FileUploadError('Unexpected file field.');
    }
    return new FileUploadError('File upload failed.');
};

const handleMongoError = (err) => {
    if (err.code === 11000) {
        return handleDuplicateFieldsDB(err);
    }
    if (err.name === 'CastError') {
        return handleCastErrorDB(err);
    }
    if (err.name === 'ValidationError') {
        return handleValidationErrorDB(err);
    }
    return new AppError('Database operation failed', 500);
};

const handleAxiosError = (err) => {
    if (err.response) {
        // Server responded with error status
        const status = err.response.status;
        const message = err.response.data?.message || 'External service error';
        
        if (status === 401) {
            return new AuthenticationError('External service authentication failed');
        }
        if (status === 403) {
            return new AuthorizationError('External service access denied');
        }
        if (status === 404) {
            return new NotFoundError('External resource not found');
        }
        if (status === 429) {
            return new RateLimitError('External service rate limit exceeded');
        }
        
        return new AppError(message, status);
    } else if (err.request) {
        // Request was made but no response received
        return new AppError('External service unavailable', 503);
    } else {
        // Something else happened
        return new AppError('External service error', 500);
    }
};

// Send error response in development
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        success: false,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

// Send error response in production
const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    } else {
        // Programming or other unknown error: don't leak error details
        console.error('ERROR 💥', err);
        
        res.status(500).json({
            success: false,
            message: 'Something went wrong!'
        });
    }
};

// Main error handling middleware
export const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else {
        let error = { ...err };
        error.message = err.message;

        // Handle specific error types
        if (err.name === 'CastError') error = handleCastErrorDB(error);
        if (err.code === 11000) error = handleDuplicateFieldsDB(error);
        if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (err.name === 'JsonWebTokenError') error = handleJWTError();
        if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
        if (err.name === 'MulterError') error = handleMulterError(err);
        if (err.name === 'MongoError') error = handleMongoError(err);
        if (err.isAxiosError) error = handleAxiosError(err);

        sendErrorProd(error, res);
    }
};

// Async error wrapper
export const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

// Rate limiting error handler
export const rateLimitHandler = (req, res, next) => {
    const error = new RateLimitError('Too many requests from this IP, please try again later.');
    next(error);
};

// File upload error handler
export const fileUploadErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        const error = handleMulterError(err);
        return next(error);
    }
    next(err);
};

// Database connection error handler
export const dbConnectionErrorHandler = (err) => {
    console.error('Database connection error:', err);
    
    if (err.name === 'MongoNetworkError') {
        console.error('MongoDB network error. Check your connection.');
    } else if (err.name === 'MongoServerError') {
        console.error('MongoDB server error:', err.message);
    } else if (err.name === 'MongoParseError') {
        console.error('MongoDB parse error:', err.message);
    }
    
    // In production, you might want to restart the process or implement retry logic
    process.exit(1);
};

// Unhandled promise rejection handler
export const unhandledRejectionHandler = (err) => {
    console.error('Unhandled Promise Rejection:', err);
    
    // Close server gracefully
    process.exit(1);
};

// Uncaught exception handler
export const uncaughtExceptionHandler = (err) => {
    console.error('Uncaught Exception:', err);
    
    // Close server gracefully
    process.exit(1);
};

// 404 handler for undefined routes
export const notFoundHandler = (req, res, next) => {
    const error = new NotFoundError(`Can't find ${req.originalUrl} on this server!`);
    next(error);
};

// Validation error handler
export const validationErrorHandler = (errors) => {
    const errorMessages = errors.map(error => error.msg || error.message);
    return new ValidationError(errorMessages.join('. '));
};

// Input sanitization
export const sanitizeInput = (input) => {
    if (typeof input === 'string') {
        // Remove HTML tags and script content
        return input.replace(/<[^>]*>/g, '').replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }
    return input;
};

// File validation
export const validateFile = (file, options = {}) => {
    const {
        maxSize = 5 * 1024 * 1024, // 5MB
        allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        allowedExtensions = ['.pdf', '.doc', '.docx']
    } = options;

    if (!file) {
        throw new FileUploadError('No file provided');
    }

    if (file.size > maxSize) {
        throw new FileUploadError(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
    }

    if (!allowedTypes.includes(file.mimetype)) {
        throw new FileUploadError(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }

    const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    if (!allowedExtensions.includes(fileExtension)) {
        throw new FileUploadError(`File extension not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`);
    }

    return true;
};

// URL validation
export const validateURL = (url) => {
    try {
        new URL(url);
        return true;
    } catch (error) {
        throw new ValidationError('Invalid URL format');
    }
};

// Email validation
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ValidationError('Invalid email format');
    }
    return true;
};

// Phone number validation
export const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
        throw new ValidationError('Invalid phone number format');
    }
    return true;
};

// Date validation
export const validateDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new ValidationError('Invalid date format');
    }
    
    if (start > end) {
        throw new ValidationError('Start date cannot be after end date');
    }
    
    return true;
};

// Salary range validation
export const validateSalaryRange = (minSalary, maxSalary) => {
    if (minSalary < 0 || maxSalary < 0) {
        throw new ValidationError('Salary cannot be negative');
    }
    
    if (minSalary > maxSalary) {
        throw new ValidationError('Minimum salary cannot be greater than maximum salary');
    }
    
    return true;
};

// Character limit validation
export const validateCharacterLimit = (text, limit, fieldName = 'text') => {
    if (text && text.length > limit) {
        throw new ValidationError(`${fieldName} exceeds ${limit} character limit`);
    }
    return true;
};

// Array length validation
export const validateArrayLength = (array, maxLength, fieldName = 'array') => {
    if (array && array.length > maxLength) {
        throw new ValidationError(`${fieldName} cannot have more than ${maxLength} items`);
    }
    return true;
};

// Duplicate detection
export const detectDuplicates = (array, field = null) => {
    if (!array || array.length === 0) return false;
    
    const values = field ? array.map(item => item[field]) : array;
    const uniqueValues = new Set(values);
    
    return values.length !== uniqueValues.size;
};

// Rate limiting check
export const checkRateLimit = (req, limit = 100, windowMs = 15 * 60 * 1000) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    // This is a simplified rate limiting check
    // In production, you'd use Redis or a proper rate limiting library
    if (!req.rateLimitData) {
        req.rateLimitData = {};
    }
    
    if (!req.rateLimitData[key]) {
        req.rateLimitData[key] = { count: 0, resetTime: now + windowMs };
    }
    
    if (now > req.rateLimitData[key].resetTime) {
        req.rateLimitData[key] = { count: 0, resetTime: now + windowMs };
    }
    
    if (req.rateLimitData[key].count >= limit) {
        throw new RateLimitError('Rate limit exceeded');
    }
    
    req.rateLimitData[key].count++;
    return true;
};

export default errorHandler;
