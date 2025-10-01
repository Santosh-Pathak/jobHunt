import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'recruiter', 'admin'], 
        required: true,
        default: 'student',
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    lastLogin: {
        type: Date
    },
    profile: {
        bio: {
            type: String,
            default: 'Bio is empty',
        },
        skills: [{
            type: String
        }],
        resume: {
            type: String // URL to resume file
        },
        resumeOriginalName: { // Original name of resume file
            type: String
        },
        company: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Company' // Reference to the Company model
        },
        profilePhoto: {
            type: String,
            default: "" // URL to profile photo
        },
        // Enhanced profile fields
        education: [{
            institution: String,
            degree: String,
            fieldOfStudy: String,
            startDate: Date,
            endDate: Date,
            gpa: String,
            description: String
        }],
        experience: [{
            company: String,
            position: String,
            startDate: Date,
            endDate: Date,
            current: Boolean,
            description: String,
            location: String
        }],
        portfolio: [{
            title: String,
            description: String,
            url: String,
            image: String,
            technologies: [String]
        }],
        certifications: [{
            name: String,
            issuer: String,
            issueDate: Date,
            expiryDate: Date,
            credentialId: String,
            credentialUrl: String
        }],
        languages: [{
            language: String,
            proficiency: {
                type: String,
                enum: ['Beginner', 'Intermediate', 'Advanced', 'Native']
            }
        }],
        socialLinks: {
            linkedin: String,
            github: String,
            twitter: String,
            website: String
        },
        preferences: {
            jobTypes: [String],
            locations: [String],
            salaryRange: {
                min: Number,
                max: Number,
                currency: String
            },
            remoteWork: Boolean,
            notifications: {
                email: Boolean,
                push: Boolean,
                sms: Boolean
            }
        },
        savedJobs: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job'
        }]
    },
    // Analytics and tracking
    analytics: {
        profileViews: {
            type: Number,
            default: 0
        },
        jobApplications: {
            type: Number,
            default: 0
        },
        profileCompleteness: {
            type: Number,
            default: 0
        }
    }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
