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
        enum: ['student', 'recruiter'], // Restrict the role to 'student' or 'recruiter'
        required: true,
        default: 'student',
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
        }
    }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
