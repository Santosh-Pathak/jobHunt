import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['job_application', 'job_match', 'interview_scheduled', 'application_status', 'job_alert', 'message', 'system'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    data: {
        jobId: mongoose.Schema.Types.ObjectId,
        applicationId: mongoose.Schema.Types.ObjectId,
        companyId: mongoose.Schema.Types.ObjectId,
        interviewId: mongoose.Schema.Types.ObjectId,
        customData: mongoose.Schema.Types.Mixed
    },
    read: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    channels: {
        email: {
            type: Boolean,
            default: false
        },
        push: {
            type: Boolean,
            default: true
        },
        sms: {
            type: Boolean,
            default: false
        }
    },
    sentAt: Date,
    readAt: Date
}, { timestamps: true });

export const Notification = mongoose.model('Notification', notificationSchema);
