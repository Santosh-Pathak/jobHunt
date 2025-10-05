import React, { useEffect } from 'react';
import { Button } from './ui/button';
import { BookmarkPlus, ArrowUpRight, MapPin, Clock, Users, Building2, Star, ExternalLink } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setsavedJobs } from '@/redux/authSlice';
import { toast } from 'sonner';
import { USER_API_END_POINT } from '@/utils/constant';
import { Card } from '@/components/ui/card';
import { useTheme } from '../contexts/ThemeContext';
import apiClient from '@/utils/axiosConfig';

const Job = ({ job }) => {
    const { savedJobs } = useSelector(store => store.auth);
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    };

    const handleSaveForLater = async (jobId) => {
        try {
            const response = await apiClient.post(`${USER_API_END_POINT}/savedjob`, { jobId });
            if (response) {
                dispatch(setsavedJobs(response.data.savedJobs));
                toast.success(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error saving job');
        }
    };

    const isSaved = savedJobs?.some(savedJob => savedJob._id.toString() === job?._id.toString());
    const daysAgo = daysAgoFunction(job?.createdAt);
    const salaryText = job?.salary?.min ? `${job.salary.min} - ${job.salary.max}` : job?.salary || 'Not specified';
    const locationText = job?.location?.city || job?.location || 'Location not specified';

    return (
        <motion.div
            className="group"
            whileHover={{ y: -4 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 20, 
                duration: 0.6 
            }}
        >
            <Card className={`relative overflow-hidden transition-all duration-300 ${
                isDark 
                    ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 hover:border-blue-500/50' 
                    : 'bg-white/80 border-gray-200 hover:bg-white hover:border-blue-300'
            } backdrop-blur-sm shadow-lg hover:shadow-2xl`}>
                
                {/* Gradient overlay for hover effect */}
                <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative p-6">
                    {/* Header Section */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4 flex-1">
                            {/* Company Logo */}
                            <div className="relative">
                                <Avatar className="h-14 w-14 ring-2 ring-blue-500/20">
                                    <AvatarImage 
                                        src={job?.company?.logo} 
                                        alt={job?.company?.name} 
                                        className="object-cover"
                                    />
                                    <AvatarFallback className={`text-lg font-bold ${
                                        isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {job?.company?.name?.charAt(0) || 'C'}
                                    </AvatarFallback>
                                </Avatar>
                                {/* Online indicator */}
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>

                            {/* Job Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className={`text-xl font-bold mb-1 group-hover:text-blue-600 transition-colors duration-200 ${
                                    isDark ? 'text-white' : 'text-gray-900'
                                }`}>
                                    {job?.title}
                                </h3>
                                <div className="flex items-center space-x-2 mb-2">
                                    <Building2 className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <p className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {job?.company?.name}
                                    </p>
                                </div>
                                
                                {/* Location and Time */}
                                <div className="flex items-center space-x-4 text-sm">
                                    <div className="flex items-center space-x-1">
                                        <MapPin className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                            {locationText}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Clock className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                            {daysAgo === 0 ? 'Today' : `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleSaveForLater(job._id)}
                                className={`h-10 w-10 rounded-full transition-all duration-200 ${
                                    isSaved 
                                        ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' 
                                        : isDark 
                                            ? 'bg-gray-700/50 text-gray-400 hover:bg-blue-500/20 hover:text-blue-400' 
                                            : 'bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600'
                                }`}
                            >
                                <BookmarkPlus className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
                            </Button>
                        </motion.div>
                    </div>

                    {/* Job Details */}
                    <div className="mb-6">
                        {/* Salary and Position */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <Badge className={`px-3 py-1 text-sm font-medium ${
                                    isDark 
                                        ? 'bg-blue-600/20 text-blue-300 border-blue-500/30' 
                                        : 'bg-blue-100 text-blue-700 border-blue-200'
                                }`}>
                                    ₹ {salaryText} LPA
                                </Badge>
                                {job?.position && (
                                    <Badge variant="outline" className={`px-3 py-1 text-sm ${
                                        isDark 
                                            ? 'border-gray-600 text-gray-300' 
                                            : 'border-gray-300 text-gray-600'
                                    }`}>
                                        <Users className="h-3 w-3 mr-1" />
                                        {job.position} Positions
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Job Description Preview */}
                        {job?.description && (
                            <p className={`text-sm leading-relaxed mb-4 line-clamp-2 ${
                                isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                                {job.description.length > 150 
                                    ? `${job.description.substring(0, 150)}...` 
                                    : job.description
                                }
                            </p>
                        )}

                        {/* Skills/Tags */}
                        {job?.requirements && job.requirements.length > 0 && (
                            <div className="mb-4">
                                <div className="flex flex-wrap gap-2">
                                    {job.requirements.slice(0, 3).map((skill, index) => (
                                        <Badge 
                                            key={index}
                                            variant="secondary" 
                                            className={`text-xs px-2 py-1 ${
                                                isDark 
                                                    ? 'bg-gray-700/50 text-gray-300' 
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}
                                        >
                                            {skill}
                                        </Badge>
                                    ))}
                                    {job.requirements.length > 3 && (
                                        <Badge 
                                            variant="secondary" 
                                            className={`text-xs px-2 py-1 ${
                                                isDark 
                                                    ? 'bg-gray-700/50 text-gray-300' 
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}
                                        >
                                            +{job.requirements.length - 3} more
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
                        <div className="flex items-center space-x-3">
                            {isSaved ? (
                                <Button 
                                    disabled
                                    className="bg-green-500/20 text-green-500 border border-green-500/30 cursor-not-allowed"
                                >
                                    <Star className="h-4 w-4 mr-2 fill-current" />
                                    Saved
                                </Button>
                            ) : (
                                <Button 
                                    onClick={() => handleSaveForLater(job._id)}
                                    className={`transition-all duration-200 ${
                                        isDark 
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                                >
                                    <BookmarkPlus className="h-4 w-4 mr-2" />
                                    Save Job
                                </Button>
                            )}
                        </div>

                        <Button
                            onClick={() => navigate(`/description/${job?._id}`)}
                            className={`group/btn transition-all duration-200 ${
                                isDark 
                                    ? 'bg-transparent border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400' 
                                    : 'bg-transparent border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400'
                            }`}
                            variant="outline"
                        >
                            View Details
                            <ExternalLink className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-200" />
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

export default Job;
