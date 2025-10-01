import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, DollarSign, Clock, Users, Building2, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { Checkbox } from '../ui/checkbox';
import { useTheme } from '../../contexts/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery, setFilters } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AdvancedJobSearch = () => {
    const { isDark } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { jobs } = useSelector(store => store.job);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState('');
    const [jobType, setJobType] = useState('');
    const [experienceLevel, setExperienceLevel] = useState('');
    const [salaryRange, setSalaryRange] = useState([0, 200000]);
    const [companySize, setCompanySize] = useState('');
    const [remoteWork, setRemoteWork] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('relevance');

    const jobTypes = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'];
    const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];
    const companySizes = ['Startup (1-10)', 'Small (11-50)', 'Medium (51-200)', 'Large (201-1000)', 'Enterprise (1000+)'];
    const sortOptions = [
        { value: 'relevance', label: 'Most Relevant' },
        { value: 'date', label: 'Most Recent' },
        { value: 'salary', label: 'Highest Salary' },
        { value: 'company', label: 'Company Name' }
    ];

    const handleSearch = () => {
        const filters = {
            query: searchQuery,
            location,
            jobType,
            experienceLevel,
            salaryRange,
            companySize,
            remoteWork,
            sortBy
        };
        
        dispatch(setSearchedQuery(searchQuery));
        dispatch(setFilters(filters));
        navigate('/browse');
    };

    const clearFilters = () => {
        setSearchQuery('');
        setLocation('');
        setJobType('');
        setExperienceLevel('');
        setSalaryRange([0, 200000]);
        setCompanySize('');
        setRemoteWork(false);
        setSortBy('relevance');
    };

    return (
        <motion.div
            className={`p-6 rounded-2xl shadow-lg ${
                isDark 
                    ? 'bg-gray-800 border border-gray-700' 
                    : 'bg-white border border-gray-200'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Main Search Bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                        type="text"
                        placeholder="Job title, keywords, or company"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-12 text-lg"
                    />
                </div>
                <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                        type="text"
                        placeholder="City, state, or remote"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="pl-10 h-12 text-lg"
                    />
                </div>
                <Button 
                    onClick={handleSearch}
                    className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                    Search Jobs
                </Button>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setJobType('Full-time')}
                    className={jobType === 'Full-time' ? 'bg-blue-100 text-blue-700' : ''}
                >
                    Full-time
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setJobType('Part-time')}
                    className={jobType === 'Part-time' ? 'bg-blue-100 text-blue-700' : ''}
                >
                    Part-time
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setJobType('Internship')}
                    className={jobType === 'Internship' ? 'bg-blue-100 text-blue-700' : ''}
                >
                    Internship
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRemoteWork(!remoteWork)}
                    className={remoteWork ? 'bg-blue-100 text-blue-700' : ''}
                >
                    Remote
                </Button>
            </div>

            {/* Advanced Filters Toggle */}
            <div className="flex items-center justify-between mb-4">
                <Button
                    variant="ghost"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2"
                >
                    <Filter className="h-4 w-4" />
                    <span>Advanced Filters</span>
                </Button>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Sort by:</span>
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {sortOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t pt-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Job Type */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Job Type</label>
                            <Select value={jobType} onValueChange={setJobType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select job type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {jobTypes.map(type => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Experience Level */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Experience Level</label>
                            <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select experience" />
                                </SelectTrigger>
                                <SelectContent>
                                    {experienceLevels.map(level => (
                                        <SelectItem key={level} value={level}>
                                            {level}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Company Size */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Company Size</label>
                            <Select value={companySize} onValueChange={setCompanySize}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select company size" />
                                </SelectTrigger>
                                <SelectContent>
                                    {companySizes.map(size => (
                                        <SelectItem key={size} value={size}>
                                            {size}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Salary Range */}
                        <div className="md:col-span-2 lg:col-span-3">
                            <label className="block text-sm font-medium mb-2">
                                Salary Range: ${salaryRange[0].toLocaleString()} - ${salaryRange[1].toLocaleString()}
                            </label>
                            <Slider
                                value={salaryRange}
                                onValueChange={setSalaryRange}
                                max={200000}
                                min={0}
                                step={5000}
                                className="w-full"
                            />
                        </div>

                        {/* Remote Work Checkbox */}
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remote"
                                checked={remoteWork}
                                onCheckedChange={setRemoteWork}
                            />
                            <label htmlFor="remote" className="text-sm font-medium">
                                Remote work available
                            </label>
                        </div>
                    </div>

                    {/* Filter Actions */}
                    <div className="flex justify-end space-x-2 mt-6">
                        <Button variant="outline" onClick={clearFilters}>
                            Clear All
                        </Button>
                        <Button onClick={handleSearch}>
                            Apply Filters
                        </Button>
                    </div>
                </motion.div>
            )}

            {/* Search Suggestions */}
            <div className="mt-6">
                <h4 className="text-sm font-medium mb-3">Popular Searches</h4>
                <div className="flex flex-wrap gap-2">
                    {['Software Engineer', 'Data Scientist', 'Product Manager', 'UX Designer', 'Marketing Manager'].map(suggestion => (
                        <Badge
                            key={suggestion}
                            variant="secondary"
                            className="cursor-pointer hover:bg-blue-100"
                            onClick={() => {
                                setSearchQuery(suggestion);
                                handleSearch();
                            }}
                        >
                            {suggestion}
                        </Badge>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default AdvancedJobSearch;
