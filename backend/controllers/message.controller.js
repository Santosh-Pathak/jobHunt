import { Message, Conversation } from '../models/message.model.js';
import { User } from '../models/user.model.js';

export const createConversation = async (req, res) => {
    try {
        const { participants, jobId, applicationId } = req.body;
        const userId = req.user._id;

        // Ensure current user is in participants
        if (!participants.includes(userId)) {
            participants.push(userId);
        }

        // Check if conversation already exists
        let conversation = await Conversation.findOne({
            participants: { $all: participants },
            jobId: jobId || null,
            applicationId: applicationId || null
        });

        if (!conversation) {
            conversation = new Conversation({
                participants,
                jobId: jobId || null,
                applicationId: applicationId || null,
                isActive: true
            });
            await conversation.save();
        }

        await conversation.populate('participants', 'fullName email profile.profilePhoto');

        res.status(201).json({
            success: true,
            conversation
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getConversations = async (req, res) => {
    try {
        const userId = req.user._id;
        const { page = 1, limit = 20 } = req.query;

        const conversations = await Conversation.find({
            participants: userId,
            isActive: true
        })
        .populate('participants', 'fullName email profile.profilePhoto')
        .populate('lastMessage')
        .populate('jobId', 'title company')
        .populate('applicationId')
        .sort({ lastMessageAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

        const total = await Conversation.countDocuments({
            participants: userId,
            isActive: true
        });

        res.status(200).json({
            success: true,
            conversations,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user._id;
        const { page = 1, limit = 50 } = req.query;

        // Verify user is part of conversation
        const conversation = await Conversation.findOne({
            _id: conversationId,
            participants: userId
        });

        if (!conversation) {
            return res.status(403).json({
                success: false,
                message: 'Access denied to this conversation'
            });
        }

        const messages = await Message.find({ conversationId })
            .populate('sender', 'fullName profile.profilePhoto')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Message.countDocuments({ conversationId });

        res.status(200).json({
            success: true,
            messages: messages.reverse(), // Reverse to show oldest first
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { conversationId, content, type = 'text', attachments = [] } = req.body;
        const senderId = req.user._id;

        // Verify user is part of conversation
        const conversation = await Conversation.findOne({
            _id: conversationId,
            participants: senderId
        });

        if (!conversation) {
            return res.status(403).json({
                success: false,
                message: 'Access denied to this conversation'
            });
        }

        const message = new Message({
            sender: senderId,
            recipient: conversation.participants.find(p => p.toString() !== senderId.toString()),
            conversationId,
            content,
            type,
            attachments,
            delivered: true,
            deliveredAt: new Date()
        });

        await message.save();

        // Update conversation
        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: message._id,
            lastMessageAt: new Date()
        });

        await message.populate('sender', 'fullName profile.profilePhoto');

        res.status(201).json({
            success: true,
            message
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user._id;

        // Mark all messages in conversation as read
        await Message.updateMany(
            {
                conversationId,
                recipient: userId,
                read: false
            },
            {
                read: true,
                readAt: new Date()
            }
        );

        res.status(200).json({
            success: true,
            message: 'Messages marked as read'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user._id;

        const unreadCount = await Message.countDocuments({
            recipient: userId,
            read: false
        });

        res.status(200).json({
            success: true,
            count: unreadCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user._id;

        const message = await Message.findOneAndDelete({
            _id: messageId,
            sender: userId
        });

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found or access denied'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Message deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
