import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';
import { jobCategories } from '@/data/staticData';
import { useTheme } from '../contexts/ThemeContext';
import { 
    Code, 
    Server, 
    BarChart3, 
    Palette, 
    Rocket, 
    Smartphone, 
    Settings, 
    Sparkles, 
    ClipboardList, 
    Shield,
    ArrowRight,
    TrendingUp,
    Users,
    Star,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isDark } = useTheme();
    
    // State for carousel
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Icon mapping
    const iconMap = {
        "Frontend Developer": Code,
        "Backend Developer": Server,
        "Data Science": BarChart3,
        "Graphic Designer": Palette,
        "Full Stack Developer": Rocket,
        "Mobile Developer": Smartphone,
        "DevOps Engineer": Settings,
        "UI/UX Designer": Sparkles,
        "Product Manager": ClipboardList,
        "Cybersecurity": Shield
    };

    // Handle search
    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/jobs");
    };

    // Auto-play
    useEffect(() => {
        if (!isAutoPlaying) return;
        
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => 
                prevIndex === jobCategories.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000);

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    // Navigation
    const goToNext = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === jobCategories.length - 1 ? 0 : prevIndex + 1
        );
    };

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? jobCategories.length - 1 : prevIndex - 1
        );
    };

    // Get visible cards (3 left + 1 center + 3 right)
    const getVisibleCards = () => {
        const visibleCards = [];
        const totalCards = jobCategories.length;
        
        for (let i = -3; i <= 3; i++) {
            let cardIndex = currentIndex + i;
            
            // Handle wrapping
            if (cardIndex < 0) {
                cardIndex = totalCards + cardIndex;
            } else if (cardIndex >= totalCards) {
                cardIndex = cardIndex - totalCards;
            }
            
            visibleCards.push({
                ...jobCategories[cardIndex],
                originalIndex: cardIndex,
                displayIndex: i
            });
        }
        
        return visibleCards;
    };

    return (
        <motion.section 
            className={`py-20 px-4 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50/50'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div 
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                        style={{
                            background: isDark 
                                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))'
                                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(16, 185, 129, 0.05))'
                        }}
                    >
                        <Star className={`h-4 w-4 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} />
                        <span className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                            Explore Opportunities
                        </span>
                    </motion.div>
                    
                    <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
                        isDark 
                            ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400'
                            : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600'
                    }`}>
                        Popular Job Categories
                    </h2>
                    
                    <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        Discover exciting career opportunities across various industries and find your perfect match
                    </p>
                </motion.div>

                {/* Carousel */}
                <motion.div 
                    className="mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <div className="relative">
                        {/* Auto-play Control */}
                        <div className="flex justify-center mb-6">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                                className={`transition-all duration-200 ${
                                    isAutoPlaying
                                        ? isDark
                                            ? 'border-green-500 text-green-400 hover:bg-green-500/10'
                                            : 'border-green-600 text-green-600 hover:bg-green-50'
                                        : isDark
                                            ? 'border-gray-600 text-gray-400 hover:bg-gray-700/50'
                                            : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {isAutoPlaying ? '⏸️ Pause' : '▶️ Play'} Auto-scroll
                            </Button>
                        </div>

                        {/* Cards Container */}
                        <div className="relative h-96 flex items-center justify-center overflow-hidden">
                            <div className="flex items-center justify-center gap-4">
                                {getVisibleCards().map((card, index) => {
                                    const IconComponent = iconMap[card.name] || Code;
                                    const isPopular = card.count > 1000;
                                    const isCenter = card.displayIndex === 0;
                                    const distance = Math.abs(card.displayIndex);
                                    
                                    // Calculate scale and opacity based on distance from center
                                    const scale = isCenter ? 1.0 : Math.max(0.6, 1 - (distance * 0.15));
                                    const opacity = isCenter ? 1.0 : Math.max(0.3, 1 - (distance * 0.2));
                                    
                                    return (
                                        <motion.div
                                            key={`${card.id}-${currentIndex}`}
                                            className="cursor-pointer"
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ 
                                                scale: scale,
                                                opacity: opacity,
                                                y: isCenter ? -10 : 0
                                            }}
                                            transition={{ 
                                                type: "spring", 
                                                stiffness: 300, 
                                                damping: 30,
                                                duration: 0.6
                                            }}
                                            whileHover={{ 
                                                scale: scale + 0.05,
                                                y: isCenter ? -15 : -5
                                            }}
                                            onClick={() => searchJobHandler(card.name)}
                                        >
                                            <Card 
                                                className={`group transition-all duration-300 overflow-hidden w-64 h-80 ${
                                                    isCenter
                                                        ? isDark 
                                                            ? 'bg-gradient-to-br from-blue-800/60 to-purple-800/60 border-blue-500/50 shadow-2xl' 
                                                            : 'bg-gradient-to-br from-blue-100/80 to-purple-100/80 border-blue-400/50 shadow-2xl'
                                                        : isDark 
                                                            ? 'bg-gray-800/50 border-gray-700 shadow-lg' 
                                                            : 'bg-white/80 border-gray-200 shadow-lg'
                                                } backdrop-blur-sm`}
                                            >
                                                <CardContent className="p-6 h-full flex flex-col">
                                                    {/* Gradient overlay */}
                                                    <div className={`absolute inset-0 ${
                                                        isCenter 
                                                            ? 'bg-gradient-to-br from-blue-500/10 to-emerald-500/10 opacity-100' 
                                                            : 'bg-gradient-to-br from-blue-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100'
                                                    } transition-opacity duration-300`} />
                                                    
                                                    <div className="relative flex flex-col h-full">
                                                        {/* Icon and Badge */}
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className={`p-3 rounded-xl transition-all duration-300 ${
                                                                isCenter
                                                                    ? isDark 
                                                                        ? 'bg-blue-500/30 text-blue-300' 
                                                                        : 'bg-blue-200 text-blue-700'
                                                                    : isDark 
                                                                        ? 'bg-blue-600/20 text-blue-400' 
                                                                        : 'bg-blue-100 text-blue-600'
                                                            }`}>
                                                                <IconComponent className={`transition-all duration-300 ${
                                                                    isCenter ? 'h-7 w-7' : 'h-6 w-6'
                                                                }`} />
                                                            </div>
                                                            
                                                            {isPopular && (
                                                                <Badge className={`px-2 py-1 text-xs font-medium transition-all duration-300 ${
                                                                    isCenter
                                                                        ? isDark 
                                                                            ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400/50'
                                                                            : 'bg-emerald-200 text-emerald-800 border-emerald-300'
                                                                        : isDark 
                                                                            ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30'
                                                                            : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                                                }`}>
                                                                    <TrendingUp className="h-3 w-3 mr-1" />
                                                                    Popular
                                                                </Badge>
                                                            )}
                                                        </div>

                                                        {/* Category Info */}
                                                        <div className="mb-6 flex-1 flex flex-col justify-center">
                                                            <h3 className={`font-bold mb-3 group-hover:text-blue-600 transition-all duration-300 line-clamp-2 ${
                                                                isCenter 
                                                                    ? 'text-xl' 
                                                                    : 'text-lg'
                                                            } ${
                                                                isDark ? 'text-white' : 'text-gray-900'
                                                            }`}>
                                                                {card.name}
                                                            </h3>
                                                            <p className={`leading-relaxed line-clamp-3 transition-all duration-300 ${
                                                                isCenter 
                                                                    ? 'text-base' 
                                                                    : 'text-sm'
                                                            } ${
                                                                isDark ? 'text-gray-300' : 'text-gray-600'
                                                            }`}>
                                                                {card.description}
                                                            </p>
                                                        </div>

                                                        {/* Job Count and CTA */}
                                                        <div className="flex items-center justify-between mt-auto">
                                                            <div className={`flex items-center gap-2 transition-all duration-300 ${
                                                                isCenter 
                                                                    ? 'text-base' 
                                                                    : 'text-sm'
                                                            } ${
                                                                isDark ? 'text-gray-200' : 'text-gray-700'
                                                            }`}>
                                                                <Users className={`transition-all duration-300 ${
                                                                    isCenter ? 'h-5 w-5' : 'h-4 w-4'
                                                                }`} />
                                                                <span className="font-medium">
                                                                    {card.count.toLocaleString()}+ Jobs
                                                                </span>
                                                            </div>
                                                            
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className={`group-hover:bg-blue-500/10 group-hover:text-blue-600 transition-all duration-300 ${
                                                                    isCenter
                                                                        ? 'scale-110'
                                                                        : 'scale-100'
                                                                } ${
                                                                    isDark 
                                                                        ? 'text-gray-300 hover:text-blue-400' 
                                                                        : 'text-gray-500 hover:text-blue-600'
                                                                }`}
                                                            >
                                                                <ArrowRight className={`transition-all duration-300 ${
                                                                    isCenter ? 'h-5 w-5' : 'h-4 w-4'
                                                                } group-hover:translate-x-1`} />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Manual Navigation */}
                        <div className="flex justify-center items-center gap-4 mt-8">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={goToPrevious}
                                className={`transition-all duration-200 ${
                                    isDark 
                                        ? 'border-gray-600 text-gray-400 hover:bg-gray-700/50 hover:text-white' 
                                        : 'border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                            
                            {/* Dots Indicator */}
                            <div className="flex gap-2">
                                {jobCategories.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                            index === currentIndex
                                                ? isDark 
                                                    ? 'bg-blue-400 scale-125' 
                                                    : 'bg-blue-600 scale-125'
                                                : isDark 
                                                    ? 'bg-gray-600 hover:bg-gray-500' 
                                                    : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    />
                                ))}
                            </div>
                            
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={goToNext}
                                className={`transition-all duration-200 ${
                                    isDark 
                                        ? 'border-gray-600 text-gray-400 hover:bg-gray-700/50 hover:text-white' 
                                        : 'border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* View All Categories Button */}
                <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <Button
                        onClick={() => navigate('/jobs')}
                        className={`px-8 py-4 text-lg font-medium transition-all duration-200 ${
                            isDark 
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                        } shadow-lg hover:shadow-xl hover:scale-105`}
                    >
                        View All Categories
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default CategoryCarousel;