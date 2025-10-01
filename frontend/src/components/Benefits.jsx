import React from 'react';
import { motion } from 'framer-motion';
import { benefits } from '@/data/staticData';

const Benefits = () => {
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
                className="text-center mb-16"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Why Choose JobHunt?
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    We provide the tools and resources you need to succeed in your job search journey.
                </p>
            </motion.div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {benefits.map((benefit, index) => (
                    <motion.div
                        key={index}
                        className="bg-gradient-to-br from-[#00040A] to-[#001636] border border-gray-700 rounded-xl p-8 hover:border-purple-500 transition-all duration-300 text-center"
                        variants={itemVariants}
                        whileHover={{ 
                            scale: 1.05, 
                            y: -5,
                            transition: { type: "spring", stiffness: 300 }
                        }}
                    >
                        <div className="text-6xl mb-6">
                            {benefit.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-4">
                            {benefit.title}
                        </h3>
                        <p className="text-gray-400 leading-relaxed">
                            {benefit.description}
                        </p>
                    </motion.div>
                ))}
            </motion.div>

            {/* Additional Info Section */}
            <motion.div
                className="mt-20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-12 text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
            >
                <h3 className="text-3xl font-bold text-white mb-6">
                    Join the Future of Job Hunting
                </h3>
                <p className="text-gray-400 text-lg mb-8 max-w-3xl mx-auto">
                    Our platform combines cutting-edge technology with human expertise to deliver 
                    personalized job recommendations, streamline applications, and accelerate your career growth.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-blue-400 mb-2">95%</div>
                        <p className="text-gray-400">Success Rate</p>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-purple-400 mb-2">24h</div>
                        <p className="text-gray-400">Average Response Time</p>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-green-400 mb-2">50K+</div>
                        <p className="text-gray-400">Happy Users</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Benefits;
