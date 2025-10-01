import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Users } from 'lucide-react';
import { featuredCompanies } from '@/data/staticData';

const FeaturedCompanies = () => {
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
                <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Featured Companies
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
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
                        className="bg-gradient-to-br from-[#00040A] to-[#001636] border border-gray-700 rounded-xl p-6 hover:border-purple-500 transition-all duration-300"
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
                                <h3 className="text-xl font-semibold text-white">
                                    {company.name}
                                </h3>
                                <div className="flex items-center text-gray-400 text-sm">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {company.location?.city || company.location || 'Location not specified'}
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-300 mb-4 text-sm">
                            {company.description}
                        </p>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                <span className="text-white font-medium">
                                    {company.rating}
                                </span>
                            </div>
                            
                            <div className="flex items-center text-purple-400">
                                <Users className="h-4 w-4 mr-1" />
                                <span className="text-sm font-medium">
                                    {company.jobsCount} Jobs
                                </span>
                            </div>
                        </div>

                        <motion.button
                            className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
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
                    className="bg-transparent border border-purple-500 text-purple-400 px-8 py-3 rounded-full font-medium hover:bg-purple-500 hover:text-white transition-all duration-300"
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
