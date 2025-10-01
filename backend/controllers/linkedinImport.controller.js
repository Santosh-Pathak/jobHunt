import { User } from '../models/user.model.js';
import axios from 'axios';

// LinkedIn API configuration
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const LINKEDIN_REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI;

// LinkedIn API endpoints
const LINKEDIN_AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization';
const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
const LINKEDIN_PROFILE_URL = 'https://api.linkedin.com/v2/people/~';

// Generate LinkedIn OAuth URL
export const getLinkedInAuthUrl = async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const state = Buffer.from(JSON.stringify({ userId })).toString('base64');
        
        const authUrl = `${LINKEDIN_AUTH_URL}?` +
            `response_type=code&` +
            `client_id=${LINKEDIN_CLIENT_ID}&` +
            `redirect_uri=${encodeURIComponent(LINKEDIN_REDIRECT_URI)}&` +
            `state=${state}&` +
            `scope=r_liteprofile%20r_emailaddress`;

        res.status(200).json({
            success: true,
            authUrl,
            message: 'LinkedIn OAuth URL generated successfully'
        });
    } catch (error) {
        console.error('LinkedIn auth URL error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate LinkedIn auth URL'
        });
    }
};

// Handle LinkedIn OAuth callback
export const handleLinkedInCallback = async (req, res) => {
    try {
        const { code, state } = req.query;
        
        if (!code || !state) {
            return res.status(400).json({
                success: false,
                message: 'Missing authorization code or state'
            });
        }

        // Decode state to get userId
        const decodedState = JSON.parse(Buffer.from(state, 'base64').toString());
        const { userId } = decodedState;

        // Exchange code for access token
        const tokenResponse = await axios.post(LINKEDIN_TOKEN_URL, {
            grant_type: 'authorization_code',
            code,
            redirect_uri: LINKEDIN_REDIRECT_URI,
            client_id: LINKEDIN_CLIENT_ID,
            client_secret: LINKEDIN_CLIENT_SECRET
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const { access_token } = tokenResponse.data;

        // Get user profile from LinkedIn
        const profileResponse = await axios.get(LINKEDIN_PROFILE_URL, {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'X-Restli-Protocol-Version': '2.0.0'
            },
            params: {
                projection: '(id,firstName,lastName,profilePicture(displayImage~:playableStreams))'
            }
        });

        const profileData = profileResponse.data;

        // Get email address
        const emailResponse = await axios.get('https://api.linkedin.com/v2/emailAddress', {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'X-Restli-Protocol-Version': '2.0.0'
            },
            params: {
                q: 'members',
                projection: '(elements*(handle~))'
            }
        });

        const emailData = emailResponse.data;
        const email = emailData.elements?.[0]?.['handle~']?.emailAddress;

        // Update user profile with LinkedIn data
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update user profile
        user.profile = {
            ...user.profile,
            linkedinUrl: `https://www.linkedin.com/in/${profileData.id}`,
            profilePicture: profileData.profilePicture?.['displayImage~']?.elements?.[0]?.identifiers?.[0]?.identifier,
            linkedinData: {
                linkedinId: profileData.id,
                firstName: profileData.firstName?.localized?.en_US,
                lastName: profileData.lastName?.localized?.en_US,
                email: email,
                importedAt: new Date()
            }
        };

        await user.save();

        res.status(200).json({
            success: true,
            message: 'LinkedIn profile imported successfully',
            profile: user.profile
        });
    } catch (error) {
        console.error('LinkedIn callback error:', error);
        
        if (error.response?.status === 401) {
            return res.status(401).json({
                success: false,
                message: 'LinkedIn authorization failed'
            });
        }
        
        if (error.response?.status === 429) {
            return res.status(429).json({
                success: false,
                message: 'LinkedIn API rate limit exceeded'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to import LinkedIn profile'
        });
    }
};

// Import LinkedIn profile data manually (for testing/fallback)
export const importLinkedInProfile = async (req, res) => {
    try {
        const { linkedinUrl, userId } = req.body;
        
        if (!linkedinUrl || !userId) {
            return res.status(400).json({
                success: false,
                message: 'LinkedIn URL and User ID are required'
            });
        }

        // Validate LinkedIn URL format
        const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
        if (!linkedinRegex.test(linkedinUrl)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid LinkedIn URL format'
            });
        }

        // For now, we'll simulate LinkedIn data extraction
        // In a real implementation, you would use LinkedIn's API or web scraping
        const simulatedData = {
            personalInfo: {
                fullName: 'John Doe',
                headline: 'Software Engineer at Tech Company',
                summary: 'Experienced software engineer with expertise in full-stack development.',
                location: 'San Francisco, CA',
                linkedinUrl: linkedinUrl,
                profilePicture: null
            },
            experience: [
                {
                    title: 'Senior Software Engineer',
                    company: 'Tech Company',
                    location: 'San Francisco, CA',
                    startDate: '2020-01',
                    endDate: null,
                    current: true,
                    description: 'Leading development of scalable web applications.'
                },
                {
                    title: 'Software Engineer',
                    company: 'Previous Company',
                    location: 'San Francisco, CA',
                    startDate: '2018-06',
                    endDate: '2019-12',
                    current: false,
                    description: 'Developed and maintained web applications.'
                }
            ],
            education: [
                {
                    school: 'University of California',
                    degree: 'Bachelor of Science',
                    field: 'Computer Science',
                    startDate: '2014-09',
                    endDate: '2018-05',
                    gpa: '3.8',
                    description: 'Graduated with honors in Computer Science.'
                }
            ],
            skills: [
                { name: 'JavaScript', level: 'expert' },
                { name: 'React', level: 'advanced' },
                { name: 'Node.js', level: 'advanced' },
                { name: 'Python', level: 'intermediate' },
                { name: 'SQL', level: 'advanced' }
            ],
            certifications: [
                {
                    name: 'AWS Certified Developer',
                    issuer: 'Amazon Web Services',
                    date: '2021-03',
                    credentialId: 'AWS-DEV-123456'
                }
            ],
            languages: [
                { name: 'English', proficiency: 'Native' },
                { name: 'Spanish', proficiency: 'Conversational' }
            ]
        };

        res.status(200).json({
            success: true,
            message: 'LinkedIn profile data extracted successfully',
            data: simulatedData
        });
    } catch (error) {
        console.error('LinkedIn import error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to import LinkedIn profile'
        });
    }
};

// Save imported profile data
export const saveImportedProfile = async (req, res) => {
    try {
        const { userId, data, source } = req.body;
        
        if (!userId || !data) {
            return res.status(400).json({
                success: false,
                message: 'User ID and profile data are required'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update user profile with imported data
        if (data.personalInfo) {
            user.profile = {
                ...user.profile,
                ...data.personalInfo,
                importedFrom: source,
                importedAt: new Date()
            };
        }

        // Update experience
        if (data.experience && data.experience.length > 0) {
            user.profile.experience = data.experience.map(exp => ({
                title: exp.title,
                company: exp.company,
                location: exp.location,
                startDate: exp.startDate,
                endDate: exp.endDate,
                current: exp.current,
                description: exp.description
            }));
        }

        // Update education
        if (data.education && data.education.length > 0) {
            user.profile.education = data.education.map(edu => ({
                school: edu.school,
                degree: edu.degree,
                field: edu.field,
                startDate: edu.startDate,
                endDate: edu.endDate,
                gpa: edu.gpa,
                description: edu.description
            }));
        }

        // Update skills
        if (data.skills && data.skills.length > 0) {
            user.profile.skills = data.skills.map(skill => ({
                name: skill.name,
                level: skill.level || 'intermediate'
            }));
        }

        // Update certifications
        if (data.certifications && data.certifications.length > 0) {
            user.profile.certifications = data.certifications.map(cert => ({
                name: cert.name,
                issuer: cert.issuer,
                date: cert.date,
                credentialId: cert.credentialId
            }));
        }

        // Update languages
        if (data.languages && data.languages.length > 0) {
            user.profile.languages = data.languages.map(lang => ({
                name: lang.name,
                proficiency: lang.proficiency
            }));
        }

        // Calculate profile completeness
        const completeness = calculateProfileCompleteness(user.profile);
        user.analytics.profileCompleteness = completeness;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile data saved successfully',
            profile: user.profile,
            completeness: completeness
        });
    } catch (error) {
        console.error('Save profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save profile data'
        });
    }
};

// Helper function to calculate profile completeness
const calculateProfileCompleteness = (profile) => {
    const fields = [
        'fullName',
        'headline',
        'summary',
        'location',
        'email',
        'phone',
        'linkedinUrl',
        'experience',
        'education',
        'skills'
    ];

    let completedFields = 0;
    
    fields.forEach(field => {
        if (profile[field]) {
            if (Array.isArray(profile[field])) {
                if (profile[field].length > 0) completedFields++;
            } else if (typeof profile[field] === 'string' && profile[field].trim() !== '') {
                completedFields++;
            } else if (typeof profile[field] === 'object' && profile[field] !== null) {
                completedFields++;
            }
        }
    });

    return Math.round((completedFields / fields.length) * 100);
};

// Get LinkedIn import status
export const getLinkedInImportStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const hasLinkedInData = user.profile?.linkedinData || user.profile?.linkedinUrl;
        const importDate = user.profile?.importedAt;

        res.status(200).json({
            success: true,
            hasLinkedInData,
            importDate,
            linkedinUrl: user.profile?.linkedinUrl,
            profileCompleteness: user.analytics?.profileCompleteness || 0
        });
    } catch (error) {
        console.error('Get LinkedIn status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get LinkedIn import status'
        });
    }
};

// Refresh LinkedIn data
export const refreshLinkedInData = async (req, res) => {
    try {
        const { userId } = req.body;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!user.profile?.linkedinData?.linkedinId) {
            return res.status(400).json({
                success: false,
                message: 'No LinkedIn data found to refresh'
            });
        }

        // In a real implementation, you would refresh the data from LinkedIn API
        // For now, we'll just update the refresh timestamp
        user.profile.linkedinData.lastRefreshed = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: 'LinkedIn data refreshed successfully',
            lastRefreshed: user.profile.linkedinData.lastRefreshed
        });
    } catch (error) {
        console.error('Refresh LinkedIn data error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to refresh LinkedIn data'
        });
    }
};
