import React from 'react';
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { sampleJobs } from '@/data/staticData';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LatestJobs = () => {
    const { allJobs } = useSelector((store) => store.job);
    const { isDark } = useTheme();
    const navigate = useNavigate();

    // Ensure allJobs is an array
    const jobsList = Array.isArray(allJobs) ? allJobs : [];

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { 
                staggerChildren: 0.1,
                delayChildren: 0.2
            },
        },
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
        },
    };

    return (
        <motion.section 
            className={`py-20 px-4 ${isDark ? 'bg-gray-900/30' : 'bg-gray-50/50'}`}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
        >
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div 
                    className="text-center mb-16"
                    variants={itemVariants}
                >
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                        style={{
                            background: isDark 
                                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))'
                                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(16, 185, 129, 0.05))'
                        }}
                    >
                        <Sparkles className={`h-4 w-4 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} />
                        <span className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                            Fresh Opportunities
                        </span>
                    </motion.div>
                    
                    <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
                        isDark 
                            ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400'
                            : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600'
                    }`}>
                        Latest & Top Job Openings
                    </h2>
                    
                    <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        Discover the most recent job opportunities from top companies and startups
                    </p>
                </motion.div>

                {/* Job Cards Grid */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
                    variants={containerVariants}
                >
                    {jobsList.length === 0 ? (
                        <>
                            {sampleJobs.slice(0, 6).map((job) => (
                                <motion.div
                                    key={job._id}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <LatestJobCards job={job} />
                                </motion.div>
                            ))}
                            <motion.div
                                className="col-span-full text-center py-8"
                                variants={itemVariants}
                            >
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Showing sample jobs. Sign up to see real opportunities!
                                </p>
                            </motion.div>
                        </>
                    ) : (
                        jobsList.slice(0, 6).map((job) => (
                            <motion.div
                                key={job._id}
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <LatestJobCards job={job} />
                            </motion.div>
                        ))
                    )}
                </motion.div>

                {/* View All Jobs Button */}
                <motion.div 
                    className="text-center"
                    variants={itemVariants}
                >
                    <Button
                        onClick={() => navigate('/jobs')}
                        className={`px-8 py-4 text-lg font-medium transition-all duration-200 ${
                            isDark 
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                        } shadow-lg hover:shadow-xl hover:scale-105`}
                    >
                        View All Jobs
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default LatestJobs;