import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
    Share2, 
    Star, 
    ThumbsUp, 
    MessageSquare, 
    Building2, 
    Users, 
    Calendar,
    MapPin,
    ExternalLink,
    Plus,
    Edit,
    Trash2,
    Flag,
    Heart,
    Bookmark,
    Send,
    Filter,
    Search,
    TrendingUp,
    Award,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import apiClient from '@/utils/axiosConfig';

const SocialFeatures = () => {
    const { user } = useSelector(store => store.auth);
    const [activeTab, setActiveTab] = useState('reviews');
    const [reviews, setReviews] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [sharedJobs, setSharedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showReviewDialog, setShowReviewDialog] = useState(false);
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        fetchSocialData();
    }, []);

    const fetchSocialData = async () => {
        try {
            const [reviewsRes, companiesRes, sharedJobsRes] = await Promise.all([
                apiClient.get('/api/v1/reviews'),
                apiClient.get('/api/v1/companies'),
                apiClient.get('/api/v1/social/shared-jobs')
            ]);

            setReviews(reviewsRes.data.reviews || []);
            setCompanies(companiesRes.data.companies || []);
            setSharedJobs(sharedJobsRes.data.sharedJobs || []);
        } catch (error) {
            console.error('Error fetching social data:', error);
        } finally {
            setLoading(false);
        }
    };

    const shareJob = async (jobId, platform) => {
        try {
            const response = await apiClient.post('/api/v1/social/share-job', {
                jobId,
                platform,
                message: `Check out this job opportunity!`
            });

            if (response.data.success) {
                toast.success(`Job shared on ${platform} successfully`);
                fetchSocialData();
            }
        } catch (error) {
            toast.error('Failed to share job');
        }
    };

    const submitReview = async (reviewData) => {
        try {
            const response = await apiClient.post('/api/v1/reviews', reviewData);
            
            if (response.data.success) {
                toast.success('Review submitted successfully');
                setShowReviewDialog(false);
                fetchSocialData();
            }
        } catch (error) {
            toast.error('Failed to submit review');
        }
    };

    const likeReview = async (reviewId) => {
        try {
            const response = await apiClient.post(`/api/v1/reviews/${reviewId}/like`);
            
            if (response.data.success) {
                toast.success('Review liked');
                fetchSocialData();
            }
        } catch (error) {
            toast.error('Failed to like review');
        }
    };

    const reportReview = async (reviewId, reason) => {
        try {
            const response = await apiClient.post(`/api/v1/reviews/${reviewId}/report`, { reason });
            
            if (response.data.success) {
                toast.success('Review reported');
            }
        } catch (error) {
            toast.error('Failed to report review');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Social Features
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Share jobs, read reviews, and connect with the community
                    </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="reviews">Company Reviews</TabsTrigger>
                        <TabsTrigger value="share">Share Jobs</TabsTrigger>
                        <TabsTrigger value="community">Community</TabsTrigger>
                    </TabsList>

                    {/* Company Reviews Tab */}
                    <TabsContent value="reviews" className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold">Company Reviews</h2>
                            <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Write Review
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Write a Company Review</DialogTitle>
                                    </DialogHeader>
                                    <ReviewForm 
                                        onSubmit={submitReview}
                                        onCancel={() => setShowReviewDialog(false)}
                                        companies={companies}
                                    />
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* Reviews List */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {loading ? (
                                <div className="col-span-2 text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="mt-2 text-gray-600">Loading reviews...</p>
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="col-span-2 text-center py-12">
                                    <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        No reviews yet
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        Be the first to share your experience
                                    </p>
                                    <Button onClick={() => setShowReviewDialog(true)}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Write First Review
                                    </Button>
                                </div>
                            ) : (
                                reviews.map((review) => (
                                    <ReviewCard
                                        key={review._id}
                                        review={review}
                                        onLike={likeReview}
                                        onReport={reportReview}
                                    />
                                ))
                            )}
                        </div>
                    </TabsContent>

                    {/* Share Jobs Tab */}
                    <TabsContent value="share" className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold">Share Jobs</h2>
                            <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Share Job
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Share a Job</DialogTitle>
                                    </DialogHeader>
                                    <ShareJobForm 
                                        onSubmit={shareJob}
                                        onCancel={() => setShowShareDialog(false)}
                                    />
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* Shared Jobs List */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {sharedJobs.map((sharedJob) => (
                                <SharedJobCard key={sharedJob._id} sharedJob={sharedJob} />
                            ))}
                        </div>
                    </TabsContent>

                    {/* Community Tab */}
                    <TabsContent value="community" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Community Stats */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Users className="w-5 h-5 mr-2" />
                                        Community Stats
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span>Total Reviews</span>
                                            <span className="font-semibold">{reviews.length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Companies Reviewed</span>
                                            <span className="font-semibold">{companies.length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Jobs Shared</span>
                                            <span className="font-semibold">{sharedJobs.length}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Top Companies */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Award className="w-5 h-5 mr-2" />
                                        Top Rated Companies
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {companies.slice(0, 5).map((company) => (
                                            <div key={company._id} className="flex justify-between items-center">
                                                <span className="text-sm">{company.name}</span>
                                                <div className="flex items-center">
                                                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                                    <span className="text-sm font-semibold">
                                                        {company.averageRating?.toFixed(1) || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Activity */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <TrendingUp className="w-5 h-5 mr-2" />
                                        Recent Activity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="text-sm text-gray-600">
                                            <p>• New review for TechCorp</p>
                                            <p>• Job shared on LinkedIn</p>
                                            <p>• Company rating updated</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

// Review Form Component
const ReviewForm = ({ onSubmit, onCancel, companies }) => {
    const [formData, setFormData] = useState({
        companyId: '',
        rating: 5,
        title: '',
        pros: '',
        cons: '',
        overallExperience: '',
        workLifeBalance: 5,
        salaryBenefits: 5,
        careerGrowth: 5,
        management: 5,
        culture: 5,
        recommend: true,
        anonymous: false
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="company">Company</Label>
                <Select value={formData.companyId} onValueChange={(value) => setFormData(prev => ({ ...prev, companyId: value }))}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                        {companies.map(company => (
                            <SelectItem key={company._id} value={company._id}>
                                {company.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label>Overall Rating</Label>
                <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map(star => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                            className="text-2xl"
                        >
                            <Star 
                                className={`w-6 h-6 ${
                                    star <= formData.rating 
                                        ? 'text-yellow-500 fill-current' 
                                        : 'text-gray-300'
                                }`} 
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <Label htmlFor="title">Review Title</Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Summarize your experience"
                    required
                />
            </div>

            <div>
                <Label htmlFor="pros">Pros</Label>
                <Textarea
                    id="pros"
                    value={formData.pros}
                    onChange={(e) => setFormData(prev => ({ ...prev, pros: e.target.value }))}
                    placeholder="What did you like about working here?"
                    rows={3}
                />
            </div>

            <div>
                <Label htmlFor="cons">Cons</Label>
                <Textarea
                    id="cons"
                    value={formData.cons}
                    onChange={(e) => setFormData(prev => ({ ...prev, cons: e.target.value }))}
                    placeholder="What could be improved?"
                    rows={3}
                />
            </div>

            <div>
                <Label htmlFor="overallExperience">Overall Experience</Label>
                <Textarea
                    id="overallExperience"
                    value={formData.overallExperience}
                    onChange={(e) => setFormData(prev => ({ ...prev, overallExperience: e.target.value }))}
                    placeholder="Share your overall experience..."
                    rows={4}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Work-Life Balance</Label>
                    <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, workLifeBalance: star }))}
                            >
                                <Star 
                                    className={`w-4 h-4 ${
                                        star <= formData.workLifeBalance 
                                            ? 'text-yellow-500 fill-current' 
                                            : 'text-gray-300'
                                    }`} 
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <Label>Salary & Benefits</Label>
                    <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, salaryBenefits: star }))}
                            >
                                <Star 
                                    className={`w-4 h-4 ${
                                        star <= formData.salaryBenefits 
                                            ? 'text-yellow-500 fill-current' 
                                            : 'text-gray-300'
                                    }`} 
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="recommend"
                    checked={formData.recommend}
                    onChange={(e) => setFormData(prev => ({ ...prev, recommend: e.target.checked }))}
                />
                <Label htmlFor="recommend">I would recommend this company</Label>
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="anonymous"
                    checked={formData.anonymous}
                    onChange={(e) => setFormData(prev => ({ ...prev, anonymous: e.target.checked }))}
                />
                <Label htmlFor="anonymous">Submit anonymously</Label>
            </div>

            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Review
                </Button>
            </div>
        </form>
    );
};

// Review Card Component
const ReviewCard = ({ review, onLike, onReport }) => {
    const [showFullReview, setShowFullReview] = useState(false);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString();
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${
                    i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                }`}
            />
        ));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg">{review.title}</CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {review.companyName} • {formatDate(review.createdAt)}
                            </p>
                        </div>
                        <div className="flex items-center space-x-1">
                            {renderStars(review.rating)}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {review.pros && (
                            <div>
                                <h4 className="font-semibold text-green-600 mb-1">Pros</h4>
                                <p className="text-sm">{review.pros}</p>
                            </div>
                        )}

                        {review.cons && (
                            <div>
                                <h4 className="font-semibold text-red-600 mb-1">Cons</h4>
                                <p className="text-sm">{review.cons}</p>
                            </div>
                        )}

                        <div>
                            <h4 className="font-semibold mb-1">Overall Experience</h4>
                            <p className="text-sm">
                                {showFullReview || review.overallExperience.length <= 200
                                    ? review.overallExperience
                                    : `${review.overallExperience.substring(0, 200)}...`
                                }
                            </p>
                            {review.overallExperience.length > 200 && (
                                <button
                                    onClick={() => setShowFullReview(!showFullReview)}
                                    className="text-blue-600 text-sm hover:underline"
                                >
                                    {showFullReview ? 'Show less' : 'Read more'}
                                </button>
                            )}
                        </div>

                        <div className="flex justify-between items-center pt-2">
                            <div className="flex space-x-2">
                                <Button size="sm" variant="outline" onClick={() => onLike(review._id)}>
                                    <ThumbsUp className="w-4 h-4 mr-1" />
                                    {review.likes || 0}
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => onReport(review._id, 'inappropriate')}>
                                    <Flag className="w-4 h-4 mr-1" />
                                    Report
                                </Button>
                            </div>
                            <div className="text-xs text-gray-500">
                                {review.anonymous ? 'Anonymous' : review.authorName}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

// Share Job Form Component
const ShareJobForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        jobId: '',
        platform: 'linkedin',
        message: 'Check out this job opportunity!',
        includeJobDetails: true
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData.jobId, formData.platform);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="jobId">Job ID</Label>
                <Input
                    id="jobId"
                    value={formData.jobId}
                    onChange={(e) => setFormData(prev => ({ ...prev, jobId: e.target.value }))}
                    placeholder="Enter job ID"
                    required
                />
            </div>

            <div>
                <Label htmlFor="platform">Platform</Label>
                <Select value={formData.platform} onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    rows={3}
                />
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="includeJobDetails"
                    checked={formData.includeJobDetails}
                    onChange={(e) => setFormData(prev => ({ ...prev, includeJobDetails: e.target.checked }))}
                />
                <Label htmlFor="includeJobDetails">Include job details</Label>
            </div>

            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Job
                </Button>
            </div>
        </form>
    );
};

// Shared Job Card Component
const SharedJobCard = ({ sharedJob }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg">{sharedJob.jobTitle}</CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {sharedJob.companyName}
                            </p>
                        </div>
                        <Badge variant="outline">{sharedJob.platform}</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <p className="text-sm">{sharedJob.message}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>Shared on {formatDate(sharedJob.createdAt)}</span>
                            <span>{sharedJob.shares || 0} shares</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default SocialFeatures;
