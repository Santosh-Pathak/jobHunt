import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'shortlisted', 'interviewed', 'accepted', 'rejected'],
        default: 'pending'
    },
    coverLetter: {
        type: String,
        required: true
    },
    resume: {
        type: String, // URL to resume file
        required: false // Made optional for now
    },
    resumeOriginalName: {
        type: String
    },
    additionalDocuments: [{
        filename: String,
        url: String,
        type: String
    }],
    // Application details
    expectedSalary: {
        type: Number
    },
    availability: {
        type: String
    },
    noticePeriod: {
        type: String
    },
    // Interview details
    interview: {
        scheduled: {
            type: Boolean,
            default: false
        },
        date: Date,
        time: String,
        location: String,
        type: {
            type: String,
            enum: ['phone', 'video', 'in-person', 'technical']
        },
        interviewer: String,
        notes: String,
        feedback: String,
        rating: {
            type: Number,
            min: 1,
            max: 5
        }
    },
    // Communication
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    // Tracking
    viewedByCompany: {
        type: Boolean,
        default: false
    },
    viewedAt: Date,
    // Application source
    source: {
        type: String,
        enum: ['website', 'referral', 'recruiter', 'social_media', 'job_board'],
        default: 'website'
    },
    referrer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Additional information
    customFields: mongoose.Schema.Types.Mixed,
    // Flags
    isActive: {
        type: Boolean,
        default: true
    },
    // Analytics
    applicationScore: {
        type: Number,
        min: 0,
        max: 100
    },
    matchPercentage: {
        type: Number,
        min: 0,
        max: 100
    }
}, { 
    timestamps: true 
});

// Create indexes for better performance
applicationSchema.index({ user: 1, job: 1 }, { unique: true }); // Prevent duplicate applications
applicationSchema.index({ job: 1, status: 1 });
applicationSchema.index({ company: 1, status: 1 });
applicationSchema.index({ createdAt: -1 });
applicationSchema.index({ status: 1, createdAt: -1 });

// Virtual for application age
applicationSchema.virtual('ageInDays').get(function() {
    return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to calculate match percentage
applicationSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            // Calculate match percentage based on job requirements and user profile
            const job = await mongoose.model('Job').findById(this.job).populate('company');
            const user = await mongoose.model('User').findById(this.user);
            
            if (job && user) {
                let matchScore = 0;
                let totalCriteria = 0;
                
                // Check skills match
                if (job.skills && user.profile.skills) {
                    const matchingSkills = job.skills.filter(skill => 
                        user.profile.skills.some(userSkill => 
                            userSkill.toLowerCase().includes(skill.toLowerCase())
                        )
                    );
                    matchScore += (matchingSkills.length / job.skills.length) * 30;
                    totalCriteria += 30;
                }
                
                // Check experience level
                if (job.experienceLevel && user.profile.experience) {
                    const userExperience = user.profile.experience.length;
                    if (userExperience >= job.experienceLevel) {
                        matchScore += 25;
                    } else {
                        matchScore += (userExperience / job.experienceLevel) * 25;
                    }
                    totalCriteria += 25;
                }
                
                // Check location preference
                if (job.location && user.profile.preferences) {
                    const jobLocation = job.location.city || job.location.country;
                    const userLocations = user.profile.preferences.locations || [];
                    if (userLocations.some(loc => 
                        loc.toLowerCase().includes(jobLocation.toLowerCase())
                    )) {
                        matchScore += 20;
                    }
                    totalCriteria += 20;
                }
                
                // Check job type preference
                if (job.jobType && user.profile.preferences) {
                    const userJobTypes = user.profile.preferences.jobTypes || [];
                    if (userJobTypes.includes(job.jobType)) {
                        matchScore += 15;
                    }
                    totalCriteria += 15;
                }
                
                // Check salary expectation
                if (job.salary && user.profile.preferences.salaryRange) {
                    const jobMinSalary = job.salary.min;
                    const userMinSalary = user.profile.preferences.salaryRange.min;
                    if (jobMinSalary >= userMinSalary) {
                        matchScore += 10;
                    }
                    totalCriteria += 10;
                }
                
                this.matchPercentage = totalCriteria > 0 ? Math.round((matchScore / totalCriteria) * 100) : 0;
            }
        } catch (error) {
            console.error('Error calculating match percentage:', error);
        }
    }
    next();
});

// Instance methods
applicationSchema.methods.updateStatus = function(newStatus) {
    this.status = newStatus;
    if (newStatus === 'reviewed') {
        this.viewedByCompany = true;
        this.viewedAt = new Date();
    }
    return this.save();
};

applicationSchema.methods.scheduleInterview = function(interviewData) {
    this.interview = {
        ...this.interview,
        ...interviewData,
        scheduled: true
    };
    this.status = 'interviewed';
    return this.save();
};

// Static methods
applicationSchema.statics.getApplicationsByJob = function(jobId, options = {}) {
    const { page = 1, limit = 20, status, sortBy = 'createdAt' } = options;
    
    const filter = { job: jobId };
    if (status) filter.status = status;
    
    return this.find(filter)
        .populate('user', 'fullName email profile.profilePhoto profile.skills')
        .sort({ [sortBy]: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);
};

applicationSchema.statics.getApplicationsByUser = function(userId, options = {}) {
    const { page = 1, limit = 20, status, sortBy = 'createdAt' } = options;
    
    const filter = { user: userId };
    if (status) filter.status = status;
    
    return this.find(filter)
        .populate('job', 'title company salary location jobType')
        .populate('job.company', 'name logo')
        .sort({ [sortBy]: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);
};

applicationSchema.statics.getApplicationStats = function(companyId) {
    return this.aggregate([
        { $match: { company: mongoose.Types.ObjectId(companyId) } },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);
};

export const Application = mongoose.model('Application', applicationSchema);