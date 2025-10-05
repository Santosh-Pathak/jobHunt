import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { Search, Filter, Grid, List, SortAsc, SortDesc, X, MapPin, Briefcase, DollarSign, Clock, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { setSearchedQuery, setFilters } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';

const Jobs = () => {
    useGetAllJobs(); // Fetch all jobs
    const { allJobs, searchedQuery, filters } = useSelector(store => store.job);
    const { isDark } = useTheme();
    const dispatch = useDispatch();
    
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [sortBy, setSortBy] = useState('relevance'); // 'relevance', 'date', 'salary'
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);

    // Popular search suggestions
    const suggestions = [
        'Frontend Developer', 'React Developer', 'Full Stack Engineer',
        'Python Developer', 'Data Scientist', 'Product Manager',
        'UI/UX Designer', 'DevOps Engineer', 'Backend Developer',
        'Machine Learning Engineer', 'Remote Jobs', 'Startup Jobs'
    ];

    // Enhanced search and filtering logic
    useEffect(() => {
        let filtered = [...allJobs];

        // Apply search query filter
        if (searchedQuery || searchQuery) {
            const query = (searchedQuery || searchQuery).toLowerCase();
            const queryWords = query.split(" ").filter(word => word.length > 0);
            
            filtered = filtered.filter(job => {
                const searchFields = [
                    job.title,
                    job.description,
                    job.requirements?.join(" "),
                    job.location?.city || job.location,
                    job.company?.name,
                    job.skills?.join(" "),
                    job.industry
                ].filter(Boolean);
                
                return queryWords.some(word =>
                    searchFields.some(field => 
                        field.toLowerCase().includes(word)
                    )
                );
            });
        }

        // Apply advanced filters
        if (filters) {
            Object.entries(filters).forEach(([key, values]) => {
                if (values && values.length > 0) {
                    filtered = filtered.filter(job => {
                        switch (key) {
                            case 'location':
                                return values.some(location => 
                                    (job.location?.city || job.location || '').toLowerCase().includes(location.toLowerCase())
                                );
                            case 'job_type':
                                return values.some(type => 
                                    job.jobType?.toLowerCase().includes(type.toLowerCase())
                                );
                            case 'experience':
                                return values.some(exp => 
                                    job.experienceLevel?.toLowerCase().includes(exp.toLowerCase())
                                );
                            case 'salary_range':
                                return values.some(range => {
                                    const salary = job.salary?.min || job.salary || 0;
                                    if (range.includes('0-3')) return salary >= 0 && salary <= 3;
                                    if (range.includes('3-6')) return salary >= 3 && salary <= 6;
                                    if (range.includes('6-10')) return salary >= 6 && salary <= 10;
                                    if (range.includes('10-15')) return salary >= 10 && salary <= 15;
                                    if (range.includes('15+')) return salary >= 15;
                                    return true;
                                });
                            default:
                                return true;
                        }
                    });
                }
            });
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'salary':
                    const salaryA = a.salary?.min || a.salary || 0;
                    const salaryB = b.salary?.min || b.salary || 0;
                    return salaryB - salaryA;
                case 'relevance':
                default:
                    return 0; // Keep original order for relevance
            }
        });

            setFilteredJobs(filtered);
    }, [allJobs, searchedQuery, searchQuery, filters, sortBy]);

    // Handle search
    const handleSearch = (query) => {
        dispatch(setSearchedQuery(query));
        setSearchQuery(query);
        setShowSuggestions(false);
        
        // Add to search history
        if (query && !searchHistory.includes(query)) {
            setSearchHistory(prev => [query, ...prev.slice(0, 4)]);
        }
    };

    // Clear search
    const clearSearch = () => {
        dispatch(setSearchedQuery(''));
        setSearchQuery('');
        setShowSuggestions(false);
    };

    // Handle suggestion click
    const handleSuggestionClick = (suggestion) => {
        handleSearch(suggestion);
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showSuggestions && !event.target.closest('.search-container')) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSuggestions]);

    return (
        <div className={`min-h-screen transition-all duration-300 ${
            isDark 
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
                : 'bg-gradient-to-br from-blue-50 via-white to-emerald-50'
        }`}>
            <Navbar />
            
            {/* Main Container */}
            <div className="max-w-7xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                
                {/* Header Section */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="text-center mb-8">
                        <h1 className={`text-4xl font-bold mb-4 ${
                            isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                            Find Your Dream Job
                        </h1>
                        <p className={`text-lg ${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                            Discover amazing opportunities from top companies
                        </p>
                    </div>

                    {/* Enhanced Search Bar */}
                    <div className="max-w-4xl mx-auto mb-6">
                        <Card className={`transition-all duration-300 ${
                            isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
                        } backdrop-blur-sm`}>
                            <CardContent className="p-6">
                                <div className="relative search-container">
                                    <div className="flex items-center space-x-2">
                                        <div className="relative flex-1">
                                            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                            }`} />
                                            <Input
                                                type="text"
                                                placeholder="Search jobs, companies, skills, or locations..."
                                                value={searchQuery}
                                                onChange={(e) => {
                                                    setSearchQuery(e.target.value);
                                                    setShowSuggestions(true);
                                                }}
                                                onFocus={() => setShowSuggestions(true)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleSearch(searchQuery);
                                                    }
                                                }}
                                                className={`pl-12 pr-12 py-4 text-lg rounded-xl border-2 transition-all duration-200 ${
                                                    isDark 
                                                        ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                                                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-400'
                                                }`}
                                            />
                                            {searchQuery && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={clearSearch}
                                                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 ${
                                                        isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                                                    }`}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                        <Button 
                                            onClick={() => handleSearch(searchQuery)}
                                            className={`px-6 py-4 text-lg font-medium transition-all duration-200 ${
                                                isDark 
                                                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                            }`}
                                        >
                                            Search
                                        </Button>
                                    </div>

                                    {/* Search Suggestions */}
                                    {showSuggestions && (searchQuery || suggestions.length > 0) && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className={`absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-xl z-50 ${
                                                isDark 
                                                    ? 'bg-gray-800/95 border-gray-700' 
                                                    : 'bg-white/95 border-gray-200'
                                            } backdrop-blur-sm`}
                                        >
                                            {/* Search History */}
                                            {searchHistory.length > 0 && (
                                                <div className="p-4 border-b border-gray-200/50">
                                                    <h4 className={`text-sm font-medium mb-2 ${
                                                        isDark ? 'text-gray-300' : 'text-gray-600'
                                                    }`}>Recent Searches</h4>
                                                    <div className="space-y-1">
                                                        {searchHistory.map((item, index) => (
                                                            <button
                                                                key={index}
                                                                onClick={() => handleSuggestionClick(item)}
                                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                                                                    isDark 
                                                                        ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white' 
                                                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                                                }`}
                                                            >
                                                                <Clock className="inline h-4 w-4 mr-2" />
                                                                {item}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Popular Suggestions */}
                                            <div className="p-4">
                                                <h4 className={`text-sm font-medium mb-2 ${
                                                    isDark ? 'text-gray-300' : 'text-gray-600'
                                                }`}>Popular Searches</h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {suggestions.slice(0, 8).map((suggestion, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => handleSuggestionClick(suggestion)}
                                                            className={`text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                                                                isDark 
                                                                    ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white' 
                                                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                                            }`}
                                                        >
                                                            {suggestion}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Quick Filter Pills */}
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <Badge 
                                        variant="outline" 
                                        className={`cursor-pointer transition-all duration-200 ${
                                            isDark 
                                                ? 'border-gray-600 text-gray-300 hover:bg-gray-700/50' 
                                                : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                                        }`}
                                        onClick={() => handleSuggestionClick('Remote Jobs')}
                                    >
                                        <MapPin className="h-3 w-3 mr-1" />
                                        Remote
                                    </Badge>
                                    <Badge 
                                        variant="outline" 
                                        className={`cursor-pointer transition-all duration-200 ${
                                            isDark 
                                                ? 'border-gray-600 text-gray-300 hover:bg-gray-700/50' 
                                                : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                                        }`}
                                        onClick={() => handleSuggestionClick('Frontend Developer')}
                                    >
                                        <Briefcase className="h-3 w-3 mr-1" />
                                        Frontend
                                    </Badge>
                                    <Badge 
                                        variant="outline" 
                                        className={`cursor-pointer transition-all duration-200 ${
                                            isDark 
                                                ? 'border-gray-600 text-gray-300 hover:bg-gray-700/50' 
                                                : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                                        }`}
                                        onClick={() => handleSuggestionClick('Full Stack Engineer')}
                                    >
                                        <Users className="h-3 w-3 mr-1" />
                                        Full Stack
                                    </Badge>
                                    <Badge 
                                        variant="outline" 
                                        className={`cursor-pointer transition-all duration-200 ${
                                            isDark 
                                                ? 'border-gray-600 text-gray-300 hover:bg-gray-700/50' 
                                                : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                                        }`}
                                        onClick={() => handleSuggestionClick('Data Scientist')}
                                    >
                                        <DollarSign className="h-3 w-3 mr-1" />
                                        Data Science
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Results Summary */}
                    <div className="flex items-center justify-between mb-6">
                        <div className={`text-sm ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            <span className="font-semibold text-blue-600">{filteredJobs.length}</span> jobs found
                            {searchedQuery && (
                                <span> for "<span className="font-medium">{searchedQuery}</span>"</span>
                            )}
                        </div>
                        
                        {/* View Controls */}
                        <div className="flex items-center space-x-4">
                            {/* Sort Dropdown */}
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className={`w-40 ${
                                    isDark 
                                        ? 'bg-gray-800/50 border-gray-600 text-white' 
                                        : 'bg-white border-gray-200 text-gray-900'
                                }`}>
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="relevance">Most Relevant</SelectItem>
                                    <SelectItem value="date">Most Recent</SelectItem>
                                    <SelectItem value="salary">Highest Salary</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* View Mode Toggle */}
                            <div className={`flex rounded-lg p-1 ${
                                isDark ? 'bg-gray-800/50' : 'bg-gray-100'
                            }`}>
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                    className={`px-3 ${
                                        viewMode === 'grid' 
                                            ? 'bg-blue-600 text-white' 
                                            : isDark 
                                                ? 'text-gray-400 hover:text-white' 
                                                : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <Grid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                    className={`px-3 ${
                                        viewMode === 'list' 
                                            ? 'bg-blue-600 text-white' 
                                            : isDark 
                                                ? 'text-gray-400 hover:text-white' 
                                                : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden">
                        <Button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
                                isDark 
                                    ? 'bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50' 
                                    : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'
                            } border-2`}
                        >
                            <Filter className="h-5 w-5 mr-2" />
                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                        </Button>
                    </div>

                    {/* Filter Sidebar */}
                    <motion.div
                        className={`lg:col-span-1 ${
                            showFilters ? 'block' : 'hidden lg:block'
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <FilterCard />
                    </motion.div>

                    {/* Job List Section */}
                        <motion.div
                        className="lg:col-span-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        {filteredJobs.length > 0 ? (
                            <div className={`space-y-6 ${
                                viewMode === 'grid' ? 'grid grid-cols-1 xl:grid-cols-2 gap-6' : ''
                            }`}>
                                {filteredJobs.map((job, index) => (
                                    <motion.div
                                        key={job?._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ 
                                            duration: 0.4, 
                                            delay: index * 0.1 
                                        }}
                                    >
                                        <Job job={job} />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                className="text-center py-16"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
                                    isDark ? 'bg-gray-800/50' : 'bg-gray-100'
                                }`}>
                                    <Search className={`h-10 w-10 ${
                                        isDark ? 'text-gray-400' : 'text-gray-500'
                                    }`} />
                                </div>
                                <h3 className={`text-2xl font-bold mb-2 ${
                                    isDark ? 'text-white' : 'text-gray-900'
                                }`}>
                                    No jobs found
                                </h3>
                                <p className={`text-lg ${
                                    isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    Try adjusting your search criteria or filters
                                </p>
                            </motion.div>
                        )}
                        </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Jobs;
