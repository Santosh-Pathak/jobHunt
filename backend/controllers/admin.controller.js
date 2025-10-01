import { User } from '../models/user.model.js';
import { Job } from '../models/job.model.js';
import Company from '../models/company.model.js';
import { Application } from '../models/application.model.js';
import { Analytics } from '../models/analytics.model.js';

export const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 20, role, search } = req.query;
        
        const filter = {};
        if (role && role !== 'all') filter.role = role;
        if (search) {
            filter.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(filter)
            .select('-password')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(filter);

        res.status(200).json({
            success: true,
            users,
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

export const getAllJobs = async (req, res) => {
    try {
        const { page = 1, limit = 20, status, search } = req.query;
        
        const filter = {};
        if (status && status !== 'all') filter.status = status;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const jobs = await Job.find(filter)
            .populate('company', 'name logo')
            .populate('createdBy', 'fullName email')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Job.countDocuments(filter);

        res.status(200).json({
            success: true,
            jobs,
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

export const getAllCompanies = async (req, res) => {
    try {
        const { page = 1, limit = 20, search } = req.query;
        
        const filter = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { industry: { $regex: search, $options: 'i' } }
            ];
        }

        const companies = await Company.find(filter)
            .populate('createdBy', 'fullName email')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Company.countDocuments(filter);

        res.status(200).json({
            success: true,
            companies,
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

export const getAllApplications = async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        
        const filter = {};
        if (status && status !== 'all') filter.status = status;

        const applications = await Application.find(filter)
            .populate('user', 'fullName email')
            .populate('job', 'title company')
            .populate('job.company', 'name')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Application.countDocuments(filter);

        res.status(200).json({
            success: true,
            applications,
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

export const getPlatformStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalJobs = await Job.countDocuments();
        const totalCompanies = await Company.countDocuments();
        const totalApplications = await Application.countDocuments();

        const activeJobs = await Job.countDocuments({ status: 'active' });
        const verifiedUsers = await User.countDocuments({ isVerified: true });

        const userGrowth = await User.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            { $limit: 12 }
        ]);

        const jobCategories = await Job.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalJobs,
                totalCompanies,
                totalApplications,
                activeJobs,
                verifiedUsers,
                userGrowth,
                jobCategories
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const user = await User.findByIdAndUpdate(
            id,
            { isVerified: status === 'verified' },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateJobStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const job = await Job.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate('company', 'name');

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        res.status(200).json({
            success: true,
            job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateCompanyStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const company = await Company.findByIdAndUpdate(
            id,
            { isActive: status === 'active' },
            { new: true }
        );

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }

        res.status(200).json({
            success: true,
            company
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;

        const job = await Job.findByIdAndDelete(id);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Job deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteCompany = async (req, res) => {
    try {
        const { id } = req.params;

        const company = await Company.findByIdAndDelete(id);
        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Company deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getSystemLogs = async (req, res) => {
    try {
        // This would typically connect to a logging system
        // For now, return mock data
        const logs = [
            {
                timestamp: new Date(),
                level: 'info',
                message: 'System started successfully',
                source: 'server'
            },
            {
                timestamp: new Date(Date.now() - 60000),
                level: 'info',
                message: 'Database connection established',
                source: 'database'
            }
        ];

        res.status(200).json({
            success: true,
            logs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const exportData = async (req, res) => {
    try {
        const { type } = req.params;
        
        let data = [];
        let filename = '';

        switch (type) {
            case 'users':
                data = await User.find().select('-password');
                filename = 'users.json';
                break;
            case 'jobs':
                data = await Job.find().populate('company', 'name');
                filename = 'jobs.json';
                break;
            case 'companies':
                data = await Company.find();
                filename = 'companies.json';
                break;
            case 'applications':
                data = await Application.find()
                    .populate('user', 'fullName email')
                    .populate('job', 'title');
                filename = 'applications.json';
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid export type'
                });
        }

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
