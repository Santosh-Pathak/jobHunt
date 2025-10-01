import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { testimonials } from '@/data/staticData';

const Testimonials = () => {
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
                    What Our Users Say
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Join thousands of professionals who have found their dream jobs through JobHunt.
                </p>
            </motion.div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {testimonials.map((testimonial) => (
                    <motion.div
                        key={testimonial.id}
                        className="bg-gradient-to-br from-[#00040A] to-[#001636] border border-gray-700 rounded-xl p-6 hover:border-purple-500 transition-all duration-300 relative"
                        variants={itemVariants}
                        whileHover={{ 
                            scale: 1.02, 
                            y: -5,
                            transition: { type: "spring", stiffness: 300 }
                        }}
                    >
                        {/* Quote Icon */}
                        <div className="absolute top-4 right-4 text-purple-400 opacity-20">
                            <Quote className="h-8 w-8" />
                        </div>

                        {/* Rating */}
                        <div className="flex items-center mb-4">
                            {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                        </div>

                        {/* Testimonial Content */}
                        <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                            "{testimonial.content}"
                        </p>

                        {/* User Info */}
                        <div className="flex items-center">
                            <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="w-12 h-12 rounded-full object-cover mr-4"
                            />
                            <div>
                                <h4 className="text-white font-semibold">
                                    {testimonial.name}
                                </h4>
                                <p className="text-gray-400 text-sm">
                                    {testimonial.role} at {testimonial.company}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Call to Action */}
            <motion.div
                className="text-center mt-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
            >
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8 max-w-4xl mx-auto">
                    <h3 className="text-2xl font-bold text-white mb-4">
                        Ready to Start Your Journey?
                    </h3>
                    <p className="text-gray-400 mb-6">
                        Join our community of successful job seekers and find your next opportunity today.
                    </p>
                    <motion.button
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Get Started Now
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default Testimonials;
