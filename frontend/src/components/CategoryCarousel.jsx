import React from 'react';
import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';
import { jobCategories } from '@/data/staticData';

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Handle the search query and navigation
    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    };

    // Animation variants for carousel items
    const itemVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
    };

    return (
        <div className="w-full max-w-6xl mx-auto my-20 px-4">
            <motion.h2
                className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                Popular Job Categories
            </motion.h2>
            
            <Carousel className="w-full">
                <CarouselContent>
                    {
                        jobCategories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                className="p-4"
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                            >
                                <CarouselItem className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                                    <motion.div
                                        className="bg-gradient-to-br from-[#00040A] to-[#001636] border border-gray-700 rounded-xl p-6 hover:border-purple-500 transition-all duration-300 cursor-pointer"
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        onClick={() => searchJobHandler(category.name)}
                                    >
                                        <div className="text-center">
                                            <div className="text-4xl mb-3">{category.icon}</div>
                                            <h3 className="text-lg font-semibold text-white mb-2">
                                                {category.name}
                                            </h3>
                                            <p className="text-gray-400 text-sm mb-3">
                                                {category.description}
                                            </p>
                                            <div className="text-purple-400 font-medium">
                                                {category.count}+ Jobs
                                            </div>
                                        </div>
                                    </motion.div>
                                </CarouselItem>
                            </motion.div>
                        ))
                    }
                </CarouselContent>

                {/* Previous and Next buttons */}
                <CarouselPrevious className="text-blue-400 hover:text-purple-400 border-blue-400 hover:border-purple-400" />
                <CarouselNext className="text-blue-400 hover:text-purple-400 border-blue-400 hover:border-purple-400" />
            </Carousel>
        </div>
    );
};

export default CategoryCarousel;
