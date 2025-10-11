import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Users } from 'lucide-react';
import { featuredCompanies } from '@/data/staticData';
import { useTheme } from '../contexts/ThemeContext';

const FeaturedCompanies = () => {
    const { isDark } = useTheme();
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto my-20 px-4">
            <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h2 className={`text-4xl font-bold mb-4 ${
                    isDark 
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400' 
                        : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'
                }`}>
                    Featured Companies
                </h2>
                <p className={`text-lg max-w-2xl mx-auto ${
                    isDark ? 'text-muted-foreground' : 'text-gray-600'
                }`}>
                    Discover opportunities with top companies that are actively hiring talented professionals like you.
                </p>
            </motion.div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {featuredCompanies.map((company) => (
                    <motion.div
                        key={company.id}
                        className={`rounded-xl p-6 transition-all duration-300 ${
                            isDark 
                                ? 'bg-gradient-to-br from-card to-card/80 border border-border hover:border-primary' 
                                : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-blue-300'
                        }`}
                        variants={itemVariants}
                        whileHover={{ 
                            scale: 1.05, 
                            y: -5,
                            transition: { type: "spring", stiffness: 300 }
                        }}
                    >
                        <div className="flex items-center mb-4">
                            <img
                                src={company.logo}
                                alt={company.name}
                                className="w-12 h-12 rounded-lg object-cover mr-4"
                            />
                            <div>
                                <h3 className={`text-xl font-semibold ${
                                    isDark ? 'text-foreground' : 'text-gray-900'
                                }`}>
                                    {company.name}
                                </h3>
                                <div className={`flex items-center text-sm ${
                                    isDark ? 'text-muted-foreground' : 'text-gray-600'
                                }`}>
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {company.location?.city || company.location || 'Location not specified'}
                                </div>
                            </div>
                        </div>

                        <p className={`mb-4 text-sm ${
                            isDark ? 'text-muted-foreground' : 'text-gray-600'
                        }`}>
                            {company.description}
                        </p>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Star className={`h-4 w-4 mr-1 ${
                                    isDark ? 'text-yellow-400' : 'text-yellow-500'
                                }`} />
                                <span className={`font-medium ${
                                    isDark ? 'text-foreground' : 'text-gray-900'
                                }`}>
                                    {company.rating}
                                </span>
                            </div>
                            
                            <div className={`flex items-center ${
                                isDark ? 'text-primary' : 'text-blue-600'
                            }`}>
                                <Users className="h-4 w-4 mr-1" />
                                <span className="text-sm font-medium">
                                    {company.jobsCount} Jobs
                                </span>
                            </div>
                        </div>

                        <motion.button
                            className={`w-full mt-4 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                                isDark 
                                    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            View Jobs
                        </motion.button>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                className="text-center mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <motion.button
                    className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                        isDark 
                            ? 'bg-transparent border border-primary text-primary hover:bg-primary hover:text-primary-foreground' 
                            : 'bg-transparent border border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    View All Companies
                </motion.button>
            </motion.div>
        </div>
    );
};

export default FeaturedCompanies;
