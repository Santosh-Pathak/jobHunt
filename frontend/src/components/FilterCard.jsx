import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery, setFilters } from '@/redux/jobSlice';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { MapPin, Briefcase, DollarSign, Filter, X } from 'lucide-react';

const filterData = [
    {
        filterType: "Location",
        icon: MapPin,
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai", "Chennai", "Kolkata", "Ahmedabad", "Remote", "Hybrid"],
    },
    {
        filterType: "Job Type",
        icon: Briefcase,
        array: ["Full-time", "Part-time", "Internship", "Contract", "Freelance"],
    },
    {
        filterType: "Experience",
        icon: Briefcase,
        array: ["Entry Level (0-2 years)", "Mid Level (2-5 years)", "Senior Level (5+ years)", "Executive Level"]
    },
    {
        filterType: "Salary Range",
        icon: DollarSign,
        array: ["0-3 LPA", "3-6 LPA", "6-10 LPA", "10-15 LPA", "15+ LPA"]
    },
];

const FilterCard = () => {
    const { isDark } = useTheme();
    const dispatch = useDispatch();
    const { allJobs } = useSelector(store => store.job);
    
    const [selectedFilters, setSelectedFilters] = useState({
        Location: [],
        "Job Type": [],
        Experience: [],
        "Salary Range": []
    });

    // Handle selection of filters, toggle on and off
    const handleFilterChange = (filterType, value) => {
        setSelectedFilters((prevFilters) => {
            const currentSelections = prevFilters[filterType] || [];

            // If the value is already selected, remove it; otherwise, add it
            const newSelections = currentSelections.includes(value)
                ? currentSelections.filter((item) => item !== value)
                : [...currentSelections, value];

            return {
                ...prevFilters,
                [filterType]: newSelections,
            };
        });
    };

    // Clear all filters
    const clearAllFilters = () => {
        setSelectedFilters({
            Location: [],
            "Job Type": [],
            Experience: [],
            "Salary Range": []
        });
        dispatch(setSearchedQuery(''));
        dispatch(setFilters({}));
    };

    // Apply filters to jobs
    useEffect(() => {
        if (allJobs && allJobs.length > 0) {
            const filters = {};
            Object.entries(selectedFilters).forEach(([key, values]) => {
                if (values.length > 0) {
                    filters[key.toLowerCase().replace(' ', '_')] = values;
                }
            });
            dispatch(setFilters(filters));
        }
    }, [selectedFilters, allJobs, dispatch]);

    const totalSelectedFilters = Object.values(selectedFilters).flat().length;

    return (
        <motion.div
            className={`w-full ${isDark ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-2xl shadow-xl p-6 sticky top-24`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-600/20' : 'bg-blue-100'}`}>
                        <Filter className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Filters
                    </h2>
                </div>
                {totalSelectedFilters > 0 && (
                    <button
                        onClick={clearAllFilters}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                            isDark 
                                ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30' 
                                : 'bg-red-100 text-red-600 hover:bg-red-200'
                        }`}
                    >
                        <X className="h-4 w-4" />
                        <span>Clear All</span>
                    </button>
                )}
            </div>

            {/* Filter Count Badge */}
            {totalSelectedFilters > 0 && (
                <div className={`mb-4 px-3 py-2 rounded-lg ${isDark ? 'bg-blue-600/20' : 'bg-blue-100'} border ${isDark ? 'border-blue-500/30' : 'border-blue-200'}`}>
                    <span className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                        {totalSelectedFilters} filter{totalSelectedFilters !== 1 ? 's' : ''} applied
                    </span>
                </div>
            )}

            {/* Filter Sections */}
            <div className="space-y-6">
                {filterData.map((data, index) => {
                    const IconComponent = data.icon;
                    const selectedCount = selectedFilters[data.filterType]?.length || 0;
                    
                    return (
                        <motion.div
                            key={index}
                            className="space-y-3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {/* Filter Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <IconComponent className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                                    <h3 className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                                        {data.filterType}
                                    </h3>
                                </div>
                                {selectedCount > 0 && (
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        isDark ? 'bg-blue-600/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {selectedCount}
                                    </span>
                                )}
                            </div>

                            {/* Filter Options */}
                            <div className="space-y-2">
                                {data.array.map((item, idx) => {
                                    const itemId = `id${index}-${idx}`;
                                    const isChecked = selectedFilters[data.filterType]?.includes(item) || false;

                                    return (
                                        <motion.div
                                            key={itemId}
                                            className="flex items-center space-x-3 group cursor-pointer"
                                            whileHover={{ x: 2 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    id={itemId}
                                                    checked={isChecked}
                                                    onChange={() => handleFilterChange(data.filterType, item)}
                                                    className={`sr-only`}
                                                />
                                                <label
                                                    htmlFor={itemId}
                                                    className={`flex items-center justify-center w-5 h-5 rounded-md border-2 transition-all duration-200 cursor-pointer ${
                                                        isChecked
                                                            ? `${isDark ? 'bg-blue-600 border-blue-600' : 'bg-blue-600 border-blue-600'}`
                                                            : `${isDark ? 'border-gray-600 hover:border-blue-500' : 'border-gray-300 hover:border-blue-500'}`
                                                    }`}
                                                >
                                                    {isChecked && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </motion.div>
                                                    )}
                                                </label>
                                            </div>
                                            <label
                                                htmlFor={itemId}
                                                className={`flex-1 cursor-pointer transition-colors duration-200 ${
                                                    isChecked
                                                        ? `${isDark ? 'text-blue-300' : 'text-blue-700'} font-medium`
                                                        : `${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
                                                }`}
                                            >
                                                {item}
                                            </label>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default FilterCard;
