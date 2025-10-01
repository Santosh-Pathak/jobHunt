import { Application } from '../models/application.model.js';
import { Job } from '../models/job.model.js';
import { User } from '../models/user.model.js';
import { Notification } from '../models/notification.model.js';

// Get applications for ATS with advanced filtering and scoring
export const getATSApplications = async (req, res) => {
    try {
        const { jobId, status, dateRange, searchTerm, scoreRange, experience, education } = req.query;
        const userId = req.user._id;

        // Build query
        let query = {};
        
        // Only show applications for jobs owned by the recruiter's company
        if (req.user.role === 'recruiter') {
            const userCompany = await User.findById(userId).populate('company');
            if (!userCompany.company) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Recruiter must be associated with a company' 
                });
            }
            query['job.company'] = userCompany.company._id;
        }

        if (jobId) query['job'] = jobId;
        if (status) query.status = status;
        if (searchTerm) {
            query.$or = [
                { 'user.fullName': { $regex: searchTerm, $options: 'i' } },
                { 'user.email': { $regex: searchTerm, $options: 'i' } }
            ];
        }

        // Date range filter
        if (dateRange) {
            const now = new Date();
            let startDate;
            
            switch (dateRange) {
                case 'today':
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    break;
                case 'week':
                    startDate = new Date(now.setDate(now.getDate() - 7));
                    break;
                case 'month':
                    startDate = new Date(now.setMonth(now.getMonth() - 1));
                    break;
                case 'quarter':
                    startDate = new Date(now.setMonth(now.getMonth() - 3));
                    break;
            }
            
            if (startDate) {
                query.appliedAt = { $gte: startDate };
            }
        }

        // Score range filter
        if (scoreRange) {
            const [min, max] = scoreRange.split('-').map(Number);
            query.score = { $gte: min, $lte: max };
        }

        // Experience filter
        if (experience) {
            query['user.profile.experience'] = { $exists: true, $not: { $size: 0 } };
        }

        // Education filter
        if (education) {
            query['user.profile.education'] = { $exists: true, $not: { $size: 0 } };
        }

        const applications = await Application.find(query)
            .populate('user', 'fullName email phoneNumber profile')
            .populate('job', 'title company location requirements')
            .populate('job.company', 'name')
            .populate('notes.addedBy', 'fullName')
            .sort({ score: -1, appliedAt: -1 })
            .limit(1000);

        // Calculate scores for applications that don't have them
        const applicationsWithScores = await Promise.all(
            applications.map(async (app) => {
                if (!app.score) {
                    app.score = await calculateCandidateScore(app);
                    await app.save();
                }
                return app;
            })
        );

        res.status(200).json({ 
            success: true, 
            applications: applicationsWithScores,
            total: applicationsWithScores.length 
        });
    } catch (error) {
        console.error('Error fetching ATS applications:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get ATS analytics
export const getATSAnalytics = async (req, res) => {
    try {
        const userId = req.user._id;
        let companyFilter = {};

        if (req.user.role === 'recruiter') {
            const userCompany = await User.findById(userId).populate('company');
            if (!userCompany.company) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Recruiter must be associated with a company' 
                });
            }
            companyFilter = { 'job.company': userCompany.company._id };
        }

        // Get all applications for analytics
        const applications = await Application.find(companyFilter)
            .populate('job', 'title company')
            .populate('user', 'profile');

        // Calculate analytics
        const analytics = {
            totalApplications: applications.length,
            statusDistribution: {},
            topSources: [],
            conversionRates: {},
            timeToHire: 0,
            candidateQuality: {}
        };

        // Status distribution
        applications.forEach(app => {
            analytics.statusDistribution[app.status] = (analytics.statusDistribution[app.status] || 0) + 1;
        });

        // Conversion rates
        const totalApplied = applications.length;
        const totalHired = applications.filter(app => app.status === 'hired').length;
        analytics.conversionRates.overall = totalApplied > 0 ? Math.round((totalHired / totalApplied) * 100) : 0;

        // Time to hire (average days from application to hire)
        const hiredApplications = applications.filter(app => app.status === 'hired');
        if (hiredApplications.length > 0) {
            const totalDays = hiredApplications.reduce((sum, app) => {
                const appliedDate = new Date(app.appliedAt);
                const hiredDate = new Date(app.updatedAt);
                return sum + Math.ceil((hiredDate - appliedDate) / (1000 * 60 * 60 * 24));
            }, 0);
            analytics.timeToHire = Math.round(totalDays / hiredApplications.length);
        }

        // Candidate quality metrics
        const scores = applications.filter(app => app.score).map(app => app.score);
        analytics.candidateQuality = {
            averageScore: scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0,
            highQualityCandidates: scores.filter(score => score >= 80).length,
            totalScored: scores.length
        };

        res.status(200).json({ 
            success: true, 
            analytics 
        });
    } catch (error) {
        console.error('Error fetching ATS analytics:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Update application status with notes
export const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;
        const userId = req.user._id;

        if (!status) {
            return res.status(400).json({ 
                success: false, 
                message: 'Status is required' 
            });
        }

        // Validate status
        const validStatuses = ['applied', 'reviewed', 'shortlisted', 'interview', 'hired', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid status' 
            });
        }

        const application = await Application.findById(id)
            .populate('job', 'company')
            .populate('user', 'fullName email');

        if (!application) {
            return res.status(404).json({ 
                success: false, 
                message: 'Application not found' 
            });
        }

        // Verify ownership
        if (req.user.role === 'recruiter') {
            const userCompany = await User.findById(userId).populate('company');
            if (application.job.company.toString() !== userCompany.company._id.toString()) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Unauthorized to update this application' 
                });
            }
        }

        // Update application
        application.status = status;
        application.updatedAt = new Date();
        
        // Add to status history
        application.statusHistory.push({
            status,
            message: notes || '',
            updatedBy: userId,
            updatedAt: new Date()
        });

        await application.save();

        // Create notification
        await Notification.create({
            userId: application.user._id,
            type: 'application_status_update',
            title: 'Application Status Updated',
            message: `Your application for ${application.job.title} has been updated to ${status}.`,
            data: {
                applicationId: application._id,
                jobId: application.job._id,
                status,
                notes
            }
        });

        res.status(200).json({ 
            success: true, 
            message: 'Application status updated successfully',
            application 
        });
    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Add note to application
export const addApplicationNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { note } = req.body;
        const userId = req.user._id;

        if (!note || !note.trim()) {
            return res.status(400).json({ 
                success: false, 
                message: 'Note is required' 
            });
        }

        const application = await Application.findById(id)
            .populate('job', 'company');

        if (!application) {
            return res.status(404).json({ 
                success: false, 
                message: 'Application not found' 
            });
        }

        // Verify ownership
        if (req.user.role === 'recruiter') {
            const userCompany = await User.findById(userId).populate('company');
            if (application.job.company.toString() !== userCompany.company._id.toString()) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Unauthorized to add notes to this application' 
                });
            }
        }

        // Add note
        application.notes.push({
            content: note.trim(),
            addedBy: userId,
            createdAt: new Date()
        });

        await application.save();

        res.status(200).json({ 
            success: true, 
            message: 'Note added successfully',
            application 
        });
    } catch (error) {
        console.error('Error adding application note:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Rate candidate
export const rateCandidate = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, feedback } = req.body;
        const userId = req.user._id;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ 
                success: false, 
                message: 'Rating must be between 1 and 5' 
            });
        }

        const application = await Application.findById(id)
            .populate('job', 'company');

        if (!application) {
            return res.status(404).json({ 
                success: false, 
                message: 'Application not found' 
            });
        }

        // Verify ownership
        if (req.user.role === 'recruiter') {
            const userCompany = await User.findById(userId).populate('company');
            if (application.job.company.toString() !== userCompany.company._id.toString()) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Unauthorized to rate this candidate' 
                });
            }
        }

        // Update rating
        application.rating = rating;
        application.ratingFeedback = feedback || '';
        application.ratedBy = userId;
        application.ratedAt = new Date();

        await application.save();

        res.status(200).json({ 
            success: true, 
            message: 'Candidate rated successfully',
            application 
        });
    } catch (error) {
        console.error('Error rating candidate:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Calculate candidate score based on various factors
const calculateCandidateScore = async (application) => {
    let score = 0;
    const user = application.user;
    const job = application.job;

    // Base score for applying
    score += 10;

    // Skills matching (40% of total score)
    if (user.profile?.skills && job.requirements?.skills) {
        const userSkills = user.profile.skills.map(skill => skill.toLowerCase());
        const requiredSkills = job.requirements.skills.map(skill => skill.toLowerCase());
        const matchingSkills = userSkills.filter(skill => 
            requiredSkills.some(reqSkill => reqSkill.includes(skill) || skill.includes(reqSkill))
        );
        const skillMatchPercentage = (matchingSkills.length / requiredSkills.length) * 100;
        score += Math.min(skillMatchPercentage * 0.4, 40);
    }

    // Experience matching (30% of total score)
    if (user.profile?.experience && job.requirements?.experience) {
        const userExperience = user.profile.experience.length;
        const requiredExperience = job.requirements.experience || 0;
        if (userExperience >= requiredExperience) {
            score += 30;
        } else {
            score += (userExperience / requiredExperience) * 30;
        }
    }

    // Education matching (20% of total score)
    if (user.profile?.education && job.requirements?.education) {
        const userEducation = user.profile.education;
        const requiredEducation = job.requirements.education;
        // Simple education level matching
        if (userEducation.some(edu => edu.degree.toLowerCase().includes(requiredEducation.toLowerCase()))) {
            score += 20;
        }
    }

    // Resume completeness (10% of total score)
    if (user.profile?.resume) {
        score += 10;
    }

    // Cover letter quality (bonus points)
    if (application.coverLetter && application.coverLetter.length > 100) {
        score += 5;
    }

    // Ensure score is between 0 and 100
    return Math.min(Math.max(score, 0), 100);
};

// Get application statistics
export const getApplicationStats = async (req, res) => {
    try {
        const userId = req.user._id;
        let companyFilter = {};

        if (req.user.role === 'recruiter') {
            const userCompany = await User.findById(userId).populate('company');
            if (!userCompany.company) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Recruiter must be associated with a company' 
                });
            }
            companyFilter = { 'job.company': userCompany.company._id };
        }

        const stats = await Application.aggregate([
            { $match: companyFilter },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    avgScore: { $avg: '$score' }
                }
            }
        ]);

        res.status(200).json({ 
            success: true, 
            stats 
        });
    } catch (error) {
        console.error('Error fetching application stats:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};
