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
import Pagination from './ui/pagination';

const Jobs = () => {
    const { allJobs, searchedQuery, filters, pagination, loading } = useSelector(store => store.job);
    const { isDark } = useTheme();
    const dispatch = useDispatch();
    
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [sortBy, setSortBy] = useState('relevance'); // 'relevance', 'date', 'salary'
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);
    
    // Use pagination hook
    useGetAllJobs(currentPage, 12);

    // Popular search suggestions
    const suggestions = [
        'Frontend Developer', 'React Developer', 'Full Stack Engineer',
        'Python Developer', 'Data Scientist', 'Product Manager',
        'UI/UX Designer', 'DevOps Engineer', 'Backend Developer',
        'Machine Learning Engineer', 'Remote Jobs', 'Startup Jobs'
    ];

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Reset to first page when search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchedQuery]);

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
        <div className="min-h-screen transition-all duration-300 bg-background">
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
                        <h1 className="text-4xl font-bold mb-4 text-foreground">
                            Find Your Dream Job
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Discover amazing opportunities from top companies
                        </p>
                    </div>

                    {/* Enhanced Search Bar */}
                    <div className="max-w-4xl mx-auto mb-6">
                        <Card className="transition-all duration-300 bg-card/80 border-border backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="relative search-container">
                                    <div className="flex items-center space-x-2">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
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
                                                className="pl-12 pr-12 py-4 text-lg rounded-xl border-2 transition-all duration-200 bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-primary"
                                            />
                                            {searchQuery && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={clearSearch}
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                        <Button 
                                            onClick={() => handleSearch(searchQuery)}
                                            className="px-6 py-4 text-lg font-medium transition-all duration-200 bg-primary hover:bg-primary/90 text-primary-foreground"
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
                                            className="absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-xl z-50 bg-card/95 border-border backdrop-blur-sm"
                                        >
                                            {/* Search History */}
                                            {searchHistory.length > 0 && (
                                                <div className="p-4 border-b border-border/50">
                                                    <h4 className="text-sm font-medium mb-2 text-foreground">Recent Searches</h4>
                                                    <div className="space-y-1">
                                                        {searchHistory.map((item, index) => (
                                                            <button
                                                                key={index}
                                                                onClick={() => handleSuggestionClick(item)}
                                                                className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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
                                                <h4 className="text-sm font-medium mb-2 text-foreground">Popular Searches</h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {suggestions.slice(0, 8).map((suggestion, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => handleSuggestionClick(suggestion)}
                                                            className="text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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
                                        className="cursor-pointer transition-all duration-200 border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                                        onClick={() => handleSuggestionClick('Remote Jobs')}
                                    >
                                        <MapPin className="h-3 w-3 mr-1" />
                                        Remote
                                    </Badge>
                                    <Badge 
                                        variant="outline" 
                                        className="cursor-pointer transition-all duration-200 border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                                        onClick={() => handleSuggestionClick('Frontend Developer')}
                                    >
                                        <Briefcase className="h-3 w-3 mr-1" />
                                        Frontend
                                    </Badge>
                                    <Badge 
                                        variant="outline" 
                                        className="cursor-pointer transition-all duration-200 border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                                        onClick={() => handleSuggestionClick('Full Stack Engineer')}
                                    >
                                        <Users className="h-3 w-3 mr-1" />
                                        Full Stack
                                    </Badge>
                                    <Badge 
                                        variant="outline" 
                                        className="cursor-pointer transition-all duration-200 border-border text-foreground hover:bg-accent hover:text-accent-foreground"
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
                        <div className="text-sm text-muted-foreground">
                            <span className="font-semibold text-primary">{pagination.total}</span> jobs found
                            {searchedQuery && (
                                <span> for "<span className="font-medium">{searchedQuery}</span>"</span>
                            )}
                        </div>
                        
                        {/* View Controls */}
                        <div className="flex items-center space-x-4">
                            {/* Sort Dropdown */}
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-40 bg-background border-border text-foreground">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="relevance">Most Relevant</SelectItem>
                                    <SelectItem value="date">Most Recent</SelectItem>
                                    <SelectItem value="salary">Highest Salary</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* View Mode Toggle */}
                            <div className="flex rounded-lg p-1 bg-muted">
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                    className="px-3 text-muted-foreground hover:text-foreground"
                                >
                                    <Grid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                    className="px-3 text-muted-foreground hover:text-foreground"
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
                            className="w-full py-3 rounded-xl font-medium transition-all duration-200 bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground border-2"
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
                        {loading ? (
                            <div className="flex items-center justify-center py-16">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            </div>
                        ) : allJobs.length > 0 ? (
                            <>
                                <div className={`space-y-6 ${
                                    viewMode === 'grid' ? 'grid grid-cols-1 xl:grid-cols-2 gap-6' : ''
                                }`}>
                                    {allJobs.map((job, index) => (
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
                                
                                {/* Pagination */}
                                {pagination.pages > 1 && (
                                    <div className="mt-12">
                                        <Pagination
                                            currentPage={pagination.current}
                                            totalPages={pagination.pages}
                                            totalItems={pagination.total}
                                            itemsPerPage={pagination.limit}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <motion.div
                                className="text-center py-16"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 bg-muted">
                                    <Search className="h-10 w-10 text-muted-foreground" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2 text-foreground">
                                    No jobs found
                                </h3>
                                <p className="text-lg text-muted-foreground">
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
