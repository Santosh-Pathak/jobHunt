import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
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
    application: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
            },
            message: 'Time must be in HH:MM format'
        }
    },
    type: {
        type: String,
        enum: ['video', 'phone', 'in-person'],
        required: true
    },
    meetingLink: {
        type: String,
        required: function() {
            return this.type === 'video';
        }
    },
    location: {
        type: String,
        required: function() {
            return this.type === 'in-person';
        }
    },
    notes: {
        type: String,
        maxlength: 1000
    },
    duration: {
        type: Number,
        default: 60,
        min: 15,
        max: 480 // 8 hours max
    },
    interviewerName: {
        type: String
    },
    interviewerEmail: {
        type: String,
        validate: {
            validator: function(v) {
                return !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: 'Invalid email format'
        }
    },
    status: {
        type: String,
        enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
        default: 'scheduled'
    },
    cancellationReason: {
        type: String,
        maxlength: 500
    },
    feedback: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comments: {
            type: String,
            maxlength: 1000
        },
        strengths: [String],
        areasForImprovement: [String],
        nextSteps: {
            type: String,
            maxlength: 500
        }
    },
    reminders: [{
        type: {
            type: String,
            enum: ['email', 'sms', 'push'],
            required: true
        },
        sentAt: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['sent', 'delivered', 'failed'],
            default: 'sent'
        }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cancelledAt: Date,
    completedAt: Date
}, {
    timestamps: true
});

// Indexes for better query performance
interviewSchema.index({ user: 1, date: 1 });
interviewSchema.index({ job: 1, date: 1 });
interviewSchema.index({ status: 1, date: 1 });
interviewSchema.index({ user: 1, status: 1 });

// Virtual for formatted date and time
interviewSchema.virtual('formattedDateTime').get(function() {
    const date = this.date.toLocaleDateString();
    const time = this.time;
    return `${date} at ${time}`;
});

// Virtual for checking if interview is upcoming
interviewSchema.virtual('isUpcoming').get(function() {
    const now = new Date();
    const interviewDateTime = new Date(`${this.date.toDateString()}T${this.time}`);
    return interviewDateTime > now && ['scheduled', 'confirmed'].includes(this.status);
});

// Virtual for checking if interview is past
interviewSchema.virtual('isPast').get(function() {
    const now = new Date();
    const interviewDateTime = new Date(`${this.date.toDateString()}T${this.time}`);
    return interviewDateTime < now;
});

// Pre-save middleware to validate date is in the future
interviewSchema.pre('save', function(next) {
    if (this.isNew || this.isModified('date') || this.isModified('time')) {
        const interviewDateTime = new Date(`${this.date.toDateString()}T${this.time}`);
        if (interviewDateTime <= new Date()) {
            return next(new Error('Interview must be scheduled for a future date and time'));
        }
    }
    next();
});

// Pre-save middleware to update status based on date
interviewSchema.pre('save', function(next) {
    if (this.isModified('date') || this.isModified('time')) {
        const now = new Date();
        const interviewDateTime = new Date(`${this.date.toDateString()}T${this.time}`);
        
        if (interviewDateTime < now && this.status === 'scheduled') {
            this.status = 'completed';
            this.completedAt = new Date();
        }
    }
    next();
});

// Static method to get upcoming interviews
interviewSchema.statics.getUpcomingInterviews = function(userId, limit = 10) {
    const now = new Date();
    return this.find({
        user: userId,
        status: { $in: ['scheduled', 'confirmed'] },
        $or: [
            { date: { $gt: now } },
            { 
                date: { $eq: new Date(now.toDateString()) },
                time: { $gt: now.toTimeString().substring(0, 5) }
            }
        ]
    })
    .populate('job', 'title company')
    .sort({ date: 1, time: 1 })
    .limit(limit);
};

// Static method to get interview statistics
interviewSchema.statics.getInterviewStats = function(userId) {
    return this.aggregate([
        { $match: { user: userId } },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);
};

// Instance method to send reminder
interviewSchema.methods.sendReminder = function(type) {
    this.reminders.push({
        type,
        sentAt: new Date(),
        status: 'sent'
    });
    return this.save();
};

// Instance method to add feedback
interviewSchema.methods.addFeedback = function(feedback) {
    this.feedback = feedback;
    this.status = 'completed';
    this.completedAt = new Date();
    return this.save();
};

export const Interview = mongoose.model('Interview', interviewSchema);
