import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    Filter, 
    MapPin, 
    DollarSign, 
    Clock, 
    Users, 
    Building2, 
    Star,
    X,
    History,
    TrendingUp,
    Zap,
    RefreshCw,
    Download,
    Share2,
    Bookmark,
    Eye,
    ArrowUpRight,
    EyeOff
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import Pagination from './ui/pagination';
import { useTheme } from '../contexts/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery, setFilters } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import useEnhancedSearch from '@/hooks/useEnhancedSearch';

const EnhancedJobSearch = () => {
    const { isDark } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    
    const [showFilters, setShowFilters] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [sortBy, setSortBy] = useState('relevance');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [pageSize, setPageSize] = useState(20);
    
    // Enhanced search hook
    const {
        query,
        filters,
        results,
        loading,
        error,
        totalResults,
        hasMore,
        searchHistory,
        suggestions,
        search,
        loadMore,
        clearSearch,
        clearCache,
        getSearchStats,
        setQuery,
        setFilters
    } = useEnhancedSearch();

    const jobTypes = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'];
    const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];
    const companySizes = ['Startup (1-10)', 'Small (11-50)', 'Medium (51-200)', 'Large (200+)'];

    const handleSearch = (searchQuery, searchFilters = {}) => {
        const combinedFilters = { ...filters, ...searchFilters };
        search(searchQuery, combinedFilters);
        dispatch(setSearchedQuery(searchQuery));
        dispatch(setFilters(combinedFilters));
        setShowSuggestions(false);
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        if (query) {
            search(query, newFilters);
        }
    };

    const handleClearFilters = () => {
        setFilters({});
        if (query) {
            search(query, {});
        }
    };

    // Pagination handlers
    const handlePageChange = (page) => {
        search(query, filters, page);
    };

    const handlePageSizeChange = (newPageSize) => {
        setPageSize(newPageSize);
        search(query, filters, 1); // Reset to first page
    };

    // Calculate pagination info
    const totalPages = Math.ceil(totalResults / pageSize);
    const currentPage = Math.floor(results.length / pageSize) + 1;

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion);
        handleSearch(suggestion, filters);
        setShowSuggestions(false);
    };

    const handleHistoryClick = (historyItem) => {
        setQuery(historyItem);
        handleSearch(historyItem, filters);
        setShowHistory(false);
    };

    const handleSaveSearch = () => {
        if (!query.trim()) {
            toast.error('Please enter a search query');
            return;
        }

        // Save search to user's saved searches
        toast.success('Search saved successfully');
    };

    const handleExportResults = () => {
        if (results.length === 0) {
            toast.error('No results to export');
            return;
        }

        const csvContent = [
            ['Title', 'Company', 'Location', 'Salary', 'Type', 'Posted'],
            ...results.map(job => [
                job.title,
                job.company?.name || 'N/A',
                job.location?.city || 'N/A',
                job.salary ? `${job.salary.min}-${job.salary.max}` : 'N/A',
                job.jobType || 'N/A',
                new Date(job.createdAt).toLocaleDateString()
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `job-search-results-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
        
        toast.success('Results exported successfully');
    };

    const renderSearchSuggestions = () => (
        <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 z-50 bg-background border border-border rounded-lg shadow-lg mt-1"
                >
                    <div className="p-2">
                        <div className="text-xs text-muted-foreground mb-2 px-2">Suggestions</div>
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="w-full text-left px-2 py-2 hover:bg-muted rounded-md text-sm"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    const renderSearchHistory = () => (
        <AnimatePresence>
            {showHistory && searchHistory.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 z-50 bg-background border border-border rounded-lg shadow-lg mt-1"
                >
                    <div className="p-2">
                        <div className="text-xs text-muted-foreground mb-2 px-2">Recent Searches</div>
                        {searchHistory.map((historyItem, index) => (
                            <button
                                key={index}
                                onClick={() => handleHistoryClick(historyItem)}
                                className="w-full text-left px-2 py-2 hover:bg-muted rounded-md text-sm flex items-center"
                            >
                                <History className="w-4 h-4 mr-2 text-muted-foreground" />
                                {historyItem}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    const renderFilters = () => (
        <AnimatePresence>
            {showFilters && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                >
                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center">
                                    <Filter className="w-5 h-5 mr-2" />
                                    Advanced Filters
                                </span>
                                <Button variant="outline" size="sm" onClick={handleClearFilters}>
                                    Clear All
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Location Filter */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder="City, State"
                                            value={filters.location || ''}
                                            onChange={(e) => handleFilterChange('location', e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                {/* Job Type Filter */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Job Type</label>
                                    <Select
                                        value={filters.jobType || ''}
                                        onValueChange={(value) => handleFilterChange('jobType', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select job type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {jobTypes.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Experience Level Filter */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Experience Level</label>
                                    <Select
                                        value={filters.experienceLevel || ''}
                                        onValueChange={(value) => handleFilterChange('experienceLevel', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select experience level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {experienceLevels.map((level) => (
                                                <SelectItem key={level} value={level}>
                                                    {level}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Salary Range Filter */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Salary Range: ${filters.salaryMin || 0} - ${filters.salaryMax || 200000}
                                    </label>
                                    <div className="space-y-2">
                                        <Slider
                                            value={[filters.salaryMin || 0, filters.salaryMax || 200000]}
                                            onValueChange={([min, max]) => {
                                                handleFilterChange('salaryMin', min);
                                                handleFilterChange('salaryMax', max);
                                            }}
                                            min={0}
                                            max={200000}
                                            step={5000}
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>$0</span>
                                            <span>$200k+</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Company Size Filter */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Company Size</label>
                                    <Select
                                        value={filters.companySize || ''}
                                        onValueChange={(value) => handleFilterChange('companySize', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select company size" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {companySizes.map((size) => (
                                                <SelectItem key={size} value={size}>
                                                    {size}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Remote Work Filter */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Work Arrangement</label>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="remote"
                                                checked={filters.remote || false}
                                                onCheckedChange={(checked) => handleFilterChange('remote', checked)}
                                            />
                                            <label htmlFor="remote" className="text-sm">Remote</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="hybrid"
                                                checked={filters.hybrid || false}
                                                onCheckedChange={(checked) => handleFilterChange('hybrid', checked)}
                                            />
                                            <label htmlFor="hybrid" className="text-sm">Hybrid</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    );

    const renderSearchStats = () => {
        const stats = getSearchStats();
        return (
            <Dialog open={showStats} onOpenChange={setShowStats}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Search Statistics</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-muted rounded-lg">
                                <div className="text-2xl font-bold">{stats.totalSearches}</div>
                                <div className="text-sm text-muted-foreground">Total Searches</div>
                            </div>
                            <div className="text-center p-4 bg-muted rounded-lg">
                                <div className="text-2xl font-bold">{stats.cacheSize}</div>
                                <div className="text-sm text-muted-foreground">Cached Results</div>
                            </div>
                            <div className="text-center p-4 bg-muted rounded-lg">
                                <div className="text-2xl font-bold">{stats.totalResults}</div>
                                <div className="text-sm text-muted-foreground">Total Results</div>
                            </div>
                            <div className="text-center p-4 bg-muted rounded-lg">
                                <div className="text-2xl font-bold">{results.length}</div>
                                <div className="text-sm text-muted-foreground">Current Results</div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm">
                                <strong>Current Query:</strong> {stats.currentQuery || 'None'}
                            </div>
                            <div className="text-sm">
                                <strong>Active Filters:</strong> {Object.keys(stats.currentFilters).length}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-6">
            {/* Search Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground mb-2">Enhanced Job Search</h1>
                <p className="text-muted-foreground">
                    Find your dream job with advanced search capabilities and real-time suggestions
                </p>
            </div>

            {/* Search Bar */}
            <Card className="mb-6">
                <CardContent className="p-6">
                    <div className="relative">
                        <div className="flex items-center space-x-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search for jobs, companies, or skills..."
                                    value={query}
                                    onChange={(e) => {
                                        setQuery(e.target.value);
                                        setShowSuggestions(true);
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearch(query, filters);
                                        }
                                    }}
                                    className="pl-10 pr-10"
                                />
                                {query && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearSearch}
                                        className="absolute right-2 top-2 h-8 w-8 p-0"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                            <Button onClick={() => handleSearch(query, filters)} disabled={loading}>
                                {loading ? (
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Search className="w-4 h-4 mr-2" />
                                )}
                                Search
                            </Button>
                        </div>

                        {/* Search Suggestions */}
                        {renderSearchSuggestions()}

                        {/* Search History */}
                        {renderSearchHistory()}
                    </div>

                    {/* Search Actions */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                {showFilters ? 'Hide' : 'Show'} Filters
                            </Button>
                            
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowHistory(!showHistory)}
                            >
                                <History className="w-4 h-4 mr-2" />
                                History
                            </Button>
                            
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowStats(true)}
                            >
                                <TrendingUp className="w-4 h-4 mr-2" />
                                Stats
                            </Button>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSaveSearch}
                                disabled={!query.trim()}
                            >
                                <Bookmark className="w-4 h-4 mr-2" />
                                Save Search
                            </Button>
                            
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleExportResults}
                                disabled={results.length === 0}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </Button>
                            
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearCache}
                            >
                                <Zap className="w-4 h-4 mr-2" />
                                Clear Cache
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Filters */}
            {renderFilters()}

            {/* Results */}
            {error && (
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="text-center text-red-600">
                            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                            <p>{error}</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {results.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>
                                Search Results ({totalResults.toLocaleString()})
                            </span>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                >
                                    <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                >
                                    <EyeOff className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4`}>
                            {results.map((job, index) => (
                                <Card key={job._id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="space-y-3">
                                            <div>
                                                <h3 className="font-semibold text-lg">{job.title}</h3>
                                                <p className="text-muted-foreground">{job.company?.name}</p>
                                            </div>
                                            
                                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                <div className="flex items-center">
                                                    <MapPin className="w-4 h-4 mr-1" />
                                                    {job.location?.city}
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    {job.jobType}
                                                </div>
                                            </div>
                                            
                                            {job.salary && (
                                                <div className="flex items-center text-sm">
                                                    <DollarSign className="w-4 h-4 mr-1" />
                                                    ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                                                </div>
                                            )}
                                            
                                            <div className="flex items-center justify-between">
                                                <Badge variant="secondary">{job.category}</Badge>
                                                <Button 
                                                    size="sm" 
                                                    onClick={() => navigate(`/description/${job._id}`)}
                                                    className="group/btn relative overflow-hidden bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white border-0 rounded-lg px-4 py-2 font-medium transition-all duration-300 shadow-md hover:shadow-indigo-500/25"
                                                >
                                                    <span className="relative z-10 flex items-center">
                                                        Learn More
                                                        <ArrowUpRight className="ml-1 h-3 w-3 group-hover/btn:rotate-12 group-hover/btn:scale-110 transition-transform duration-300" />
                                                    </span>
                                                    {/* Pulse effect */}
                                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 transform -skew-x-12 translate-x-full group-hover/btn:translate-x-0"></div>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalResults > 0 && (
                            <div className="mt-6">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    totalItems={totalResults}
                                    itemsPerPage={pageSize}
                                    onPageChange={handlePageChange}
                                    onPageSizeChange={handlePageSizeChange}
                                    itemLabel="jobs"
                                    theme={isDark ? 'dark' : 'light'}
                                    pageSizeOptions={[10, 20, 50, 100]}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Search Stats Dialog */}
            {renderSearchStats()}
        </div>
    );
};

export default EnhancedJobSearch;
