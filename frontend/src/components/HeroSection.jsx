import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Search, ArrowRight, Users, Building2, Briefcase, TrendingUp, MapPin, Clock, Star, Sparkles } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { statistics } from '@/data/staticData';
import { useTheme } from '../contexts/ThemeContext';

const HeroSection = () => {
    const [query, setQuery] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isDark } = useTheme();

    const searchJobHandler = (e) => {
        e.preventDefault();
        if (!query.trim()) {
            toast.error('Please enter a search term');
            return;
        }
        dispatch(setSearchedQuery(query));
        navigate('/jobs');
    };

    const handleNavigation = () => {
        toast.success('Please Login into Recruiter Account');
        navigate('/signup');
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    const floatingVariants = {
        animate: {
            y: [-10, 10, -10],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.section 
            className={`relative overflow-hidden pt-24 pb-20 min-h-screen ${
                isDark 
                    ? 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-emerald-900/20' 
                    : 'bg-gradient-to-br from-white via-blue-50/50 to-emerald-50/50'
            }`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Gradient Orbs */}
                <motion.div 
                    className={`absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 blur-3xl ${
                        isDark ? 'bg-blue-500' : 'bg-blue-400'
                    }`}
                    variants={floatingVariants}
                    animate="animate"
                />
                <motion.div 
                    className={`absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-15 blur-3xl ${
                        isDark ? 'bg-emerald-500' : 'bg-emerald-400'
                    }`}
                    variants={floatingVariants}
                    animate="animate"
                    style={{ animationDelay: '2s' }}
                />
                
                {/* Grid Pattern */}
                <div className={`absolute inset-0 opacity-5 ${
                    isDark ? 'bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]' : 'bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000000" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]'
                }`} />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Content */}
                <div className="text-center mb-16">
                    {/* Badge */}
                    <motion.div 
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
                        style={{
                            background: isDark 
                                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))'
                                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(16, 185, 129, 0.05))'
                        }}
                        variants={itemVariants}
                    >
                        <Sparkles className={`h-4 w-4 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} />
                        <span className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                            #1 Job Search Platform
                        </span>
                    </motion.div>

                    {/* Main Heading */}
            <motion.h1
                        className={`text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 tracking-tight ${
                            isDark 
                                ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400' 
                                : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600'
                        }`}
                        variants={itemVariants}
                    >
                        Find Your Dream Job
                        <br />
                        <span className="text-4xl sm:text-5xl lg:text-6xl">With JobHunt</span>
            </motion.h1>

                    {/* Subtitle */}
            <motion.p
                        className={`text-xl lg:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed ${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
                        variants={itemVariants}
            >
                        Connect with top employers and discover opportunities that match your skills and aspirations. 
                        <span className={`font-semibold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                            Your next career move starts here.
                        </span>
            </motion.p>

                    {/* CTA Buttons */}
                    <motion.div 
                        className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
                        variants={itemVariants}
                    >
                <Button
                    size="lg"
                            onClick={() => navigate('/jobs')}
                            className={`px-8 py-4 text-lg font-medium transition-all duration-200 ${
                                isDark 
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                            } shadow-lg hover:shadow-xl hover:scale-105`}
                        >
                            <Search className="mr-2 h-5 w-5" />
                    Find Jobs
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                        
                <Button
                            onClick={handleNavigation}
                    size="lg"
                    variant="outline"
                            className={`px-8 py-4 text-lg font-medium transition-all duration-200 ${
                                isDark 
                                    ? 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-500'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400'
                            } hover:scale-105`}
                        >
                            <Briefcase className="mr-2 h-5 w-5" />
                    Post a Job
                </Button>
                    </motion.div>

                    {/* Search Bar */}
            <motion.div
                        className="max-w-2xl mx-auto mb-16"
                        variants={itemVariants}
                    >
                        <Card className={`transition-all duration-300 ${
                            isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
                        } backdrop-blur-sm shadow-xl`}>
                            <CardContent className="p-6">
                                <form onSubmit={searchJobHandler} className="flex gap-4">
                                    <div className="relative flex-1">
                                        <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                                            isDark ? 'text-gray-400' : 'text-gray-500'
                                        }`} />
                <Input
                    type="text"
                                            value={query}
                                            placeholder="Search by job title, skills, or company..."
                                            onChange={(e) => setQuery(e.target.value)}
                                            className={`pl-12 pr-4 py-4 text-lg rounded-xl border-2 transition-all duration-200 ${
                                                isDark
                                                    ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                                                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-400'
                                            }`}
                                        />
                                    </div>
                <Button
                                        type="submit"
                                        className={`px-8 py-4 text-lg font-medium transition-all duration-200 ${
                                            isDark 
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                                                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                                        } shadow-lg hover:shadow-xl`}
                                    >
                    Search
                </Button>
                                </form>
                                
                                {/* Quick Search Tags */}
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Popular:
                                    </span>
                                    {['Frontend Developer', 'Data Scientist', 'Product Manager', 'Remote Jobs'].map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="outline"
                                            className={`cursor-pointer transition-all duration-200 ${
                                                isDark
                                                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700/50'
                                                    : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                                            }`}
                                            onClick={() => {
                                                setQuery(tag);
                                                dispatch(setSearchedQuery(tag));
                                                navigate('/jobs');
                                            }}
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                    </div>
                            </CardContent>
                        </Card>
                </motion.div>
                </div>

                {/* Statistics */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-6"
                    variants={containerVariants}
                >
                    {[
                        { icon: Briefcase, value: statistics.totalJobs.toLocaleString() + '+', label: 'Active Jobs', color: 'from-blue-500 to-purple-600' },
                        { icon: Building2, value: statistics.totalCompanies.toLocaleString() + '+', label: 'Companies', color: 'from-green-500 to-blue-600' },
                        { icon: Users, value: statistics.totalUsers.toLocaleString() + '+', label: 'Job Seekers', color: 'from-purple-500 to-pink-600' },
                        { icon: TrendingUp, value: statistics.successRate + '%', label: 'Success Rate', color: 'from-orange-500 to-red-600' }
                    ].map((stat, index) => (
                <motion.div
                            key={stat.label}
                            variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                        >
                            <Card className={`text-center p-6 transition-all duration-300 ${
                                isDark 
                                    ? 'bg-gray-800/50 border-gray-700 hover:border-blue-500/50' 
                                    : 'bg-white/80 border-gray-200 hover:border-blue-300'
                            } backdrop-blur-sm shadow-lg hover:shadow-xl`}>
                                <CardContent className="p-0">
                                    <div className={`bg-gradient-to-r ${stat.color} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                                        <stat.icon className="h-8 w-8 text-white" />
                                    </div>
                                    <div className={`text-3xl font-bold mb-2 ${
                                        isDark ? 'text-blue-400' : 'text-blue-600'
                                    }`}>
                                        {stat.value}
                                    </div>
                                    <div className={`text-sm font-medium ${
                                        isDark ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                        {stat.label}
                    </div>
                                </CardContent>
                            </Card>
                </motion.div>
                    ))}
            </motion.div>
        </div>
        </motion.section>
    );
};

export default HeroSection;