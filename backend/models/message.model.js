import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    conversationId: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['text', 'file', 'image', 'system'],
        default: 'text'
    },
    attachments: [{
        filename: String,
        url: String,
        size: Number,
        type: String
    }],
    read: {
        type: Boolean,
        default: false
    },
    readAt: Date,
    delivered: {
        type: Boolean,
        default: false
    },
    deliveredAt: Date
}, { timestamps: true });

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    },
    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application'
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    lastMessageAt: Date,
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Create indexes
messageSchema.index({ conversationId: 1, createdAt: -1 });
conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageAt: -1 });

export const Message = mongoose.model('Message', messageSchema);
export const Conversation = mongoose.model('Conversation', conversationSchema);
