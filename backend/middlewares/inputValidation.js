import { body, param, query, validationResult } from 'express-validator';
import { ValidationError } from './errorHandler.js';

// Common validation rules
export const commonValidations = {
    email: body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    password: body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    
    phoneNumber: body('phoneNumber')
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    
    fullName: body('fullName')
        .isLength({ min: 2, max: 50 })
        .withMessage('Full name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Full name can only contain letters and spaces'),
    
    mongoId: param('id')
        .isMongoId()
        .withMessage('Invalid ID format'),
    
    optionalMongoId: param('id')
        .optional()
        .isMongoId()
        .withMessage('Invalid ID format'),
    
    pagination: [
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Page must be a positive integer'),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be between 1 and 100')
    ]
};

// User validation rules
export const userValidations = {
    register: [
        commonValidations.email,
        commonValidations.password,
        commonValidations.fullName,
        commonValidations.phoneNumber,
        body('role')
            .isIn(['jobseeker', 'recruiter', 'admin'])
            .withMessage('Role must be jobseeker, recruiter, or admin')
    ],
    
    login: [
        commonValidations.email,
        body('password')
            .notEmpty()
            .withMessage('Password is required')
    ],
    
    updateProfile: [
        body('fullName')
            .optional()
            .isLength({ min: 2, max: 50 })
            .withMessage('Full name must be between 2 and 50 characters'),
        body('headline')
            .optional()
            .isLength({ max: 100 })
            .withMessage('Headline cannot exceed 100 characters'),
        body('summary')
            .optional()
            .isLength({ max: 1000 })
            .withMessage('Summary cannot exceed 1000 characters'),
        body('location')
            .optional()
            .isLength({ max: 100 })
            .withMessage('Location cannot exceed 100 characters'),
        body('skills')
            .optional()
            .isArray({ max: 50 })
            .withMessage('Skills cannot exceed 50 items'),
        body('skills.*')
            .optional()
            .isLength({ min: 1, max: 50 })
            .withMessage('Each skill must be between 1 and 50 characters'),
        body('experience')
            .optional()
            .isArray({ max: 20 })
            .withMessage('Experience cannot exceed 20 entries'),
        body('education')
            .optional()
            .isArray({ max: 10 })
            .withMessage('Education cannot exceed 10 entries')
    ],
    
    changePassword: [
        body('currentPassword')
            .notEmpty()
            .withMessage('Current password is required'),
        body('newPassword')
            .isLength({ min: 8 })
            .withMessage('New password must be at least 8 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
            .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
        body('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.newPassword) {
                    throw new Error('Password confirmation does not match');
                }
                return true;
            })
    ]
};

// Job validation rules
export const jobValidations = {
    create: [
        body('title')
            .isLength({ min: 3, max: 100 })
            .withMessage('Job title must be between 3 and 100 characters'),
        body('description')
            .isLength({ min: 50, max: 5000 })
            .withMessage('Job description must be between 50 and 5000 characters'),
        body('requirements')
            .isArray({ min: 1 })
            .withMessage('At least one requirement is required'),
        body('requirements.*')
            .isLength({ min: 1, max: 200 })
            .withMessage('Each requirement must be between 1 and 200 characters'),
        body('location')
            .isLength({ min: 2, max: 100 })
            .withMessage('Location must be between 2 and 100 characters'),
        body('salary.min')
            .isInt({ min: 0 })
            .withMessage('Minimum salary must be a positive number'),
        body('salary.max')
            .isInt({ min: 0 })
            .withMessage('Maximum salary must be a positive number'),
        body('jobType')
            .isIn(['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'])
            .withMessage('Invalid job type'),
        body('experienceLevel')
            .isIn(['Entry Level', 'Mid Level', 'Senior Level', 'Executive'])
            .withMessage('Invalid experience level'),
        body('category')
            .isLength({ min: 2, max: 50 })
            .withMessage('Category must be between 2 and 50 characters')
    ],
    
    update: [
        commonValidations.mongoId,
        body('title')
            .optional()
            .isLength({ min: 3, max: 100 })
            .withMessage('Job title must be between 3 and 100 characters'),
        body('description')
            .optional()
            .isLength({ min: 50, max: 5000 })
            .withMessage('Job description must be between 50 and 5000 characters'),
        body('requirements')
            .optional()
            .isArray({ min: 1 })
            .withMessage('At least one requirement is required'),
        body('salary.min')
            .optional()
            .isInt({ min: 0 })
            .withMessage('Minimum salary must be a positive number'),
        body('salary.max')
            .optional()
            .isInt({ min: 0 })
            .withMessage('Maximum salary must be a positive number')
    ],
    
    search: [
        query('q')
            .optional()
            .isLength({ min: 1, max: 100 })
            .withMessage('Search query must be between 1 and 100 characters'),
        query('location')
            .optional()
            .isLength({ max: 100 })
            .withMessage('Location cannot exceed 100 characters'),
        query('salaryMin')
            .optional()
            .isInt({ min: 0 })
            .withMessage('Minimum salary must be a positive number'),
        query('salaryMax')
            .optional()
            .isInt({ min: 0 })
            .withMessage('Maximum salary must be a positive number'),
        query('jobType')
            .optional()
            .isIn(['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'])
            .withMessage('Invalid job type'),
        query('experienceLevel')
            .optional()
            .isIn(['Entry Level', 'Mid Level', 'Senior Level', 'Executive'])
            .withMessage('Invalid experience level'),
        ...commonValidations.pagination
    ]
};

// Application validation rules
export const applicationValidations = {
    apply: [
        commonValidations.mongoId,
        body('coverLetter')
            .optional()
            .isLength({ max: 2000 })
            .withMessage('Cover letter cannot exceed 2000 characters'),
        body('expectedSalary')
            .optional()
            .isInt({ min: 0 })
            .withMessage('Expected salary must be a positive number'),
        body('availability')
            .optional()
            .isIn(['immediate', '2-weeks', '1-month', '2-months', '3-months'])
            .withMessage('Invalid availability option'),
        body('noticePeriod')
            .optional()
            .isLength({ max: 100 })
            .withMessage('Notice period cannot exceed 100 characters')
    ],
    
    updateStatus: [
        commonValidations.mongoId,
        body('status')
            .isIn(['pending', 'reviewed', 'shortlisted', 'interview', 'hired', 'rejected', 'withdrawn'])
            .withMessage('Invalid status'),
        body('notes')
            .optional()
            .isLength({ max: 500 })
            .withMessage('Notes cannot exceed 500 characters')
    ]
};

// Company validation rules
export const companyValidations = {
    create: [
        body('name')
            .isLength({ min: 2, max: 100 })
            .withMessage('Company name must be between 2 and 100 characters'),
        commonValidations.email,
        body('industry')
            .isLength({ min: 2, max: 50 })
            .withMessage('Industry must be between 2 and 50 characters'),
        body('size')
            .isIn(['1-10', '11-50', '51-200', '200+'])
            .withMessage('Invalid company size'),
        body('location')
            .isLength({ min: 2, max: 100 })
            .withMessage('Location must be between 2 and 100 characters'),
        body('website')
            .optional()
            .isURL()
            .withMessage('Please provide a valid website URL'),
        body('description')
            .optional()
            .isLength({ max: 1000 })
            .withMessage('Description cannot exceed 1000 characters')
    ],
    
    update: [
        commonValidations.mongoId,
        body('name')
            .optional()
            .isLength({ min: 2, max: 100 })
            .withMessage('Company name must be between 2 and 100 characters'),
        body('industry')
            .optional()
            .isLength({ min: 2, max: 50 })
            .withMessage('Industry must be between 2 and 50 characters'),
        body('size')
            .optional()
            .isIn(['1-10', '11-50', '51-200', '200+'])
            .withMessage('Invalid company size'),
        body('website')
            .optional()
            .isURL()
            .withMessage('Please provide a valid website URL')
    ]
};

// Message validation rules
export const messageValidations = {
    send: [
        body('recipientId')
            .isMongoId()
            .withMessage('Invalid recipient ID'),
        body('message')
            .isLength({ min: 1, max: 1000 })
            .withMessage('Message must be between 1 and 1000 characters'),
        body('messageType')
            .optional()
            .isIn(['text', 'image', 'file'])
            .withMessage('Invalid message type')
    ],
    
    getConversation: [
        commonValidations.mongoId,
        ...commonValidations.pagination
    ]
};

// Resume validation rules
export const resumeValidations = {
    upload: [
        body('title')
            .optional()
            .isLength({ min: 1, max: 100 })
            .withMessage('Resume title must be between 1 and 100 characters'),
        body('isDefault')
            .optional()
            .isBoolean()
            .withMessage('isDefault must be a boolean value')
    ],
    
    generate: [
        body('template')
            .isIn(['modern', 'classic', 'creative', 'minimal'])
            .withMessage('Invalid template type'),
        body('sections')
            .isArray()
            .withMessage('Sections must be an array'),
        body('sections.*')
            .isIn(['personal', 'summary', 'experience', 'education', 'skills', 'certifications', 'projects'])
            .withMessage('Invalid section type')
    ]
};

// Interview validation rules
export const interviewValidations = {
    schedule: [
        body('jobId')
            .isMongoId()
            .withMessage('Invalid job ID'),
        body('applicantId')
            .isMongoId()
            .withMessage('Invalid applicant ID'),
        body('interviewType')
            .isIn(['phone', 'video', 'in-person'])
            .withMessage('Invalid interview type'),
        body('scheduledDate')
            .isISO8601()
            .withMessage('Invalid date format'),
        body('duration')
            .isInt({ min: 15, max: 480 })
            .withMessage('Duration must be between 15 and 480 minutes'),
        body('location')
            .optional()
            .isLength({ max: 200 })
            .withMessage('Location cannot exceed 200 characters'),
        body('notes')
            .optional()
            .isLength({ max: 500 })
            .withMessage('Notes cannot exceed 500 characters')
    ],
    
    update: [
        commonValidations.mongoId,
        body('status')
            .optional()
            .isIn(['scheduled', 'completed', 'cancelled', 'rescheduled'])
            .withMessage('Invalid status'),
        body('feedback')
            .optional()
            .isLength({ max: 1000 })
            .withMessage('Feedback cannot exceed 1000 characters')
    ]
};

// Social features validation rules
export const socialValidations = {
    shareJob: [
        body('jobId')
            .isMongoId()
            .withMessage('Invalid job ID'),
        body('platform')
            .isIn(['linkedin', 'twitter', 'facebook', 'email'])
            .withMessage('Invalid platform'),
        body('message')
            .optional()
            .isLength({ max: 280 })
            .withMessage('Message cannot exceed 280 characters')
    ],
    
    reviewCompany: [
        body('companyId')
            .isMongoId()
            .withMessage('Invalid company ID'),
        body('rating')
            .isInt({ min: 1, max: 5 })
            .withMessage('Rating must be between 1 and 5'),
        body('title')
            .isLength({ min: 5, max: 100 })
            .withMessage('Review title must be between 5 and 100 characters'),
        body('content')
            .isLength({ min: 20, max: 1000 })
            .withMessage('Review content must be between 20 and 1000 characters')
    ]
};

// Job alert validation rules
export const jobAlertValidations = {
    create: [
        body('keywords')
            .isArray({ min: 1 })
            .withMessage('At least one keyword is required'),
        body('keywords.*')
            .isLength({ min: 1, max: 50 })
            .withMessage('Each keyword must be between 1 and 50 characters'),
        body('location')
            .optional()
            .isLength({ max: 100 })
            .withMessage('Location cannot exceed 100 characters'),
        body('salaryMin')
            .optional()
            .isInt({ min: 0 })
            .withMessage('Minimum salary must be a positive number'),
        body('salaryMax')
            .optional()
            .isInt({ min: 0 })
            .withMessage('Maximum salary must be a positive number'),
        body('frequency')
            .isIn(['daily', 'weekly', 'monthly'])
            .withMessage('Invalid frequency')
    ]
};

// LinkedIn import validation rules
export const linkedinValidations = {
    import: [
        body('linkedinUrl')
            .optional()
            .isURL()
            .withMessage('Invalid LinkedIn URL'),
        body('userId')
            .isMongoId()
            .withMessage('Invalid user ID')
    ],
    
    save: [
        body('userId')
            .isMongoId()
            .withMessage('Invalid user ID'),
        body('data')
            .isObject()
            .withMessage('Profile data is required'),
        body('source')
            .isIn(['linkedin', 'manual'])
            .withMessage('Invalid data source')
    ]
};

// Application draft validation rules
export const draftValidations = {
    create: [
        body('jobId')
            .isMongoId()
            .withMessage('Invalid job ID'),
        body('coverLetter')
            .isLength({ min: 1, max: 2000 })
            .withMessage('Cover letter must be between 1 and 2000 characters'),
        body('expectedSalary')
            .optional()
            .isInt({ min: 0 })
            .withMessage('Expected salary must be a positive number'),
        body('availability')
            .optional()
            .isIn(['immediate', '2-weeks', '1-month', '2-months', '3-months'])
            .withMessage('Invalid availability option')
    ],
    
    update: [
        commonValidations.mongoId,
        body('coverLetter')
            .optional()
            .isLength({ min: 1, max: 2000 })
            .withMessage('Cover letter must be between 1 and 2000 characters')
    ]
};

// Validation result handler
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        const validationError = new ValidationError(errorMessages.join('. '));
        return next(validationError);
    }
    next();
};

// Custom validation functions
export const customValidations = {
    // Check if salary range is valid
    validateSalaryRange: (req, res, next) => {
        const { salaryMin, salaryMax } = req.body;
        if (salaryMin && salaryMax && salaryMin > salaryMax) {
            return next(new ValidationError('Minimum salary cannot be greater than maximum salary'));
        }
        next();
    },
    
    // Check if date range is valid
    validateDateRange: (req, res, next) => {
        const { startDate, endDate } = req.body;
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            return next(new ValidationError('Start date cannot be after end date'));
        }
        next();
    },
    
    // Check if user has permission to access resource
    checkResourceAccess: (resourceType) => {
        return (req, res, next) => {
            const userId = req.user._id;
            const resourceId = req.params.id;
            
            // This would need to be implemented based on your specific business logic
            // For now, we'll just pass through
            next();
        };
    },
    
    // Sanitize input to prevent XSS
    sanitizeInput: (req, res, next) => {
        const sanitizeObject = (obj) => {
            for (const key in obj) {
                if (typeof obj[key] === 'string') {
                    obj[key] = obj[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                    obj[key] = obj[key].replace(/<[^>]*>/g, '');
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    sanitizeObject(obj[key]);
                }
            }
        };
        
        sanitizeObject(req.body);
        sanitizeObject(req.query);
        next();
    }
};

export default {
    commonValidations,
    userValidations,
    jobValidations,
    applicationValidations,
    companyValidations,
    messageValidations,
    resumeValidations,
    interviewValidations,
    socialValidations,
    jobAlertValidations,
    linkedinValidations,
    draftValidations,
    handleValidationErrors,
    customValidations
};
