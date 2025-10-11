import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import apiClient from '@/utils/axiosConfig';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2, Briefcase, FileText, DollarSign, MapPin, Users, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '../shared/Footer';
import { useTheme } from '../../contexts/ThemeContext';

const PostJob = () => {
    const [input, setInput] = useState({
        title: '',
        description: '',
        requirements: '',
        salary: '',
        location: '',
        jobType: '',
        experience: '',
        position: 0,
        companyId: '',
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { theme } = useTheme();

    const { companies } = useSelector((store) => store.company);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find((company) => company.name.toLowerCase() === value);
        if (selectedCompany) {
            setInput({ ...input, companyId: selectedCompany._id });
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!input.title || !input.description || !input.requirements || !input.salary || 
            !input.location || !input.jobType || !input.experience || !input.position || !input.companyId) {
            toast.error('Please fill in all required fields');
            return;
        }
        
        // Validate salary is a positive number
        if (isNaN(input.salary) || Number(input.salary) <= 0) {
            toast.error('Please enter a valid salary amount');
            return;
        }
        
        // Validate position is a positive number
        if (isNaN(input.position) || Number(input.position) <= 0) {
            toast.error('Please enter a valid number of positions');
            return;
        }
        
        try {
            setLoading(true);
            console.log('Submitting job data:', input); // Debug log
            const res = await apiClient.post(`${JOB_API_END_POINT}/post`, input);
            if (res.data.success) {
                toast.success(res.data.message);
                // Reset form
                setInput({
                    title: '',
                    description: '',
                    requirements: '',
                    salary: '',
                    location: '',
                    jobType: '',
                    experience: '',
                    position: 0,
                    companyId: '',
                });
                navigate('/admin/jobs');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen transition-all duration-300 ${
            theme === 'dark' 
                ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900' 
                : 'bg-gradient-to-br from-white via-blue-50 to-emerald-50'
        }`}>
            <Navbar />
            <motion.div
                className="flex items-center justify-center w-full my-5 pt-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Card className={`p-8 max-w-4xl w-full shadow-xl ${
                    theme === 'dark' 
                        ? 'bg-slate-800/90 border-slate-700 backdrop-blur-sm' 
                        : 'bg-white/90 border-slate-200 backdrop-blur-sm'
                }`}>
                    <CardHeader className="text-center mb-6">
                        <CardTitle className={`flex items-center justify-center space-x-2 text-2xl ${
                            theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
                        }`}>
                            <Briefcase className="h-6 w-6 text-emerald-600" />
                            <span>Create New Job Posting</span>
                        </CardTitle>
                        <p className={`text-sm mt-2 ${
                            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                            Fill in the details below to post a new job opportunity
                        </p>
                    </CardHeader>
                    
                    <CardContent>
                        <form onSubmit={submitHandler} className="space-y-6">
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.7 }}
                            >
                                <div className="space-y-2">
                                    <Label className={`flex items-center space-x-2 text-sm font-medium ${
                                        theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                                    }`}>
                                        <Briefcase className="h-4 w-4 text-emerald-600" />
                                        <span>Job Title</span>
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        name="title"
                                        value={input.title}
                                        onChange={changeEventHandler}
                                        placeholder="e.g., Senior Software Engineer"
                                        className={`transition-all duration-200 ${
                                            theme === 'dark' 
                                                ? 'bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400 focus:ring-emerald-500 focus:border-emerald-500' 
                                                : 'bg-white border-slate-300 text-slate-800 placeholder-slate-500 focus:ring-emerald-500 focus:border-emerald-500'
                                        }`}
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label className={`flex items-center space-x-2 text-sm font-medium ${
                                        theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                                    }`}>
                                        <FileText className="h-4 w-4 text-emerald-600" />
                                        <span>Job Description</span>
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        name="description"
                                        value={input.description}
                                        onChange={changeEventHandler}
                                        placeholder="Brief description of the role"
                                        className={`transition-all duration-200 ${
                                            theme === 'dark' 
                                                ? 'bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400 focus:ring-emerald-500 focus:border-emerald-500' 
                                                : 'bg-white border-slate-300 text-slate-800 placeholder-slate-500 focus:ring-emerald-500 focus:border-emerald-500'
                                        }`}
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label className={`flex items-center space-x-2 text-sm font-medium ${
                                        theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                                    }`}>
                                        <Users className="h-4 w-4 text-emerald-600" />
                                        <span>Requirements</span>
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        name="requirements"
                                        value={input.requirements}
                                        onChange={changeEventHandler}
                                        placeholder="Skills and qualifications required"
                                        className={`transition-all duration-200 ${
                                            theme === 'dark' 
                                                ? 'bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400 focus:ring-emerald-500 focus:border-emerald-500' 
                                                : 'bg-white border-slate-300 text-slate-800 placeholder-slate-500 focus:ring-emerald-500 focus:border-emerald-500'
                                        }`}
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label className={`flex items-center space-x-2 text-sm font-medium ${
                                        theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                                    }`}>
                                        <DollarSign className="h-4 w-4 text-emerald-600" />
                                        <span>Salary (LPA)</span>
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="number"
                                        name="salary"
                                        value={input.salary}
                                        onChange={changeEventHandler}
                                        placeholder="e.g., 800000"
                                        className={`transition-all duration-200 ${
                                            theme === 'dark' 
                                                ? 'bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400 focus:ring-emerald-500 focus:border-emerald-500' 
                                                : 'bg-white border-slate-300 text-slate-800 placeholder-slate-500 focus:ring-emerald-500 focus:border-emerald-500'
                                        }`}
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label className={`flex items-center space-x-2 text-sm font-medium ${
                                        theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                                    }`}>
                                        <MapPin className="h-4 w-4 text-emerald-600" />
                                        <span>Location</span>
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        name="location"
                                        value={input.location}
                                        onChange={changeEventHandler}
                                        placeholder="e.g., Mumbai, Maharashtra"
                                        className={`transition-all duration-200 ${
                                            theme === 'dark' 
                                                ? 'bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400 focus:ring-emerald-500 focus:border-emerald-500' 
                                                : 'bg-white border-slate-300 text-slate-800 placeholder-slate-500 focus:ring-emerald-500 focus:border-emerald-500'
                                        }`}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className={`flex items-center space-x-2 text-sm font-medium ${
                                        theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                                    }`}>
                                        <Calendar className="h-4 w-4 text-emerald-600" />
                                        <span>Job Type</span>
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select 
                                        value={input.jobType} 
                                        onValueChange={(value) => setInput({ ...input, jobType: value })}
                                    >
                                        <SelectTrigger className={`transition-all duration-200 ${
                                            theme === 'dark' 
                                                ? 'bg-slate-700/50 border-slate-600 text-slate-100 focus:ring-emerald-500 focus:border-emerald-500' 
                                                : 'bg-white border-slate-300 text-slate-800 focus:ring-emerald-500 focus:border-emerald-500'
                                        }`}>
                                            <SelectValue placeholder="Select Job Type" />
                                        </SelectTrigger>
                                        <SelectContent className={theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'}>
                                            <SelectGroup>
                                                <SelectItem value="Full-time" className={theme === 'dark' ? 'text-slate-100 hover:bg-slate-600' : 'text-slate-800 hover:bg-slate-100'}>Full-time</SelectItem>
                                                <SelectItem value="Part-time" className={theme === 'dark' ? 'text-slate-100 hover:bg-slate-600' : 'text-slate-800 hover:bg-slate-100'}>Part-time</SelectItem>
                                                <SelectItem value="Internship" className={theme === 'dark' ? 'text-slate-100 hover:bg-slate-600' : 'text-slate-800 hover:bg-slate-100'}>Internship</SelectItem>
                                                <SelectItem value="Contract" className={theme === 'dark' ? 'text-slate-100 hover:bg-slate-600' : 'text-slate-800 hover:bg-slate-100'}>Contract</SelectItem>
                                                <SelectItem value="Freelance" className={theme === 'dark' ? 'text-slate-100 hover:bg-slate-600' : 'text-slate-800 hover:bg-slate-100'}>Freelance</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label className={`flex items-center space-x-2 text-sm font-medium ${
                                        theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                                    }`}>
                                        <Users className="h-4 w-4 text-emerald-600" />
                                        <span>Experience Level</span>
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select 
                                        value={input.experience} 
                                        onValueChange={(value) => setInput({ ...input, experience: value })}
                                    >
                                        <SelectTrigger className={`transition-all duration-200 ${
                                            theme === 'dark' 
                                                ? 'bg-slate-700/50 border-slate-600 text-slate-100 focus:ring-emerald-500 focus:border-emerald-500' 
                                                : 'bg-white border-slate-300 text-slate-800 focus:ring-emerald-500 focus:border-emerald-500'
                                        }`}>
                                            <SelectValue placeholder="Select Experience Level" />
                                        </SelectTrigger>
                                        <SelectContent className={theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'}>
                                            <SelectGroup>
                                                <SelectItem value="0" className={theme === 'dark' ? 'text-slate-100 hover:bg-slate-600' : 'text-slate-800 hover:bg-slate-100'}>0-1 Years (Entry Level)</SelectItem>
                                                <SelectItem value="1" className={theme === 'dark' ? 'text-slate-100 hover:bg-slate-600' : 'text-slate-800 hover:bg-slate-100'}>1-2 Years</SelectItem>
                                                <SelectItem value="2" className={theme === 'dark' ? 'text-slate-100 hover:bg-slate-600' : 'text-slate-800 hover:bg-slate-100'}>2-3 Years</SelectItem>
                                                <SelectItem value="3" className={theme === 'dark' ? 'text-slate-100 hover:bg-slate-600' : 'text-slate-800 hover:bg-slate-100'}>3-5 Years</SelectItem>
                                                <SelectItem value="5" className={theme === 'dark' ? 'text-slate-100 hover:bg-slate-600' : 'text-slate-800 hover:bg-slate-100'}>5-7 Years</SelectItem>
                                                <SelectItem value="7" className={theme === 'dark' ? 'text-slate-100 hover:bg-slate-600' : 'text-slate-800 hover:bg-slate-100'}>7-10 Years</SelectItem>
                                                <SelectItem value="10" className={theme === 'dark' ? 'text-slate-100 hover:bg-slate-600' : 'text-slate-800 hover:bg-slate-100'}>10+ Years (Senior Level)</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label className={`flex items-center space-x-2 text-sm font-medium ${
                                        theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                                    }`}>
                                        <Users className="h-4 w-4 text-emerald-600" />
                                        <span>Number of Positions</span>
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="number"
                                        name="position"
                                        value={input.position}
                                        onChange={changeEventHandler}
                                        min="1"
                                        max="100"
                                        placeholder="Enter number of positions"
                                        className={`transition-all duration-200 ${
                                            theme === 'dark' 
                                                ? 'bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400 focus:ring-emerald-500 focus:border-emerald-500' 
                                                : 'bg-white border-slate-300 text-slate-800 placeholder-slate-500 focus:ring-emerald-500 focus:border-emerald-500'
                                        }`}
                                    />
                                </div>
                                
                                {companies.length > 0 && (
                                    <div className="space-y-2">
                                        <Label className={`flex items-center space-x-2 text-sm font-medium ${
                                            theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                                        }`}>
                                            <Briefcase className="h-4 w-4 text-emerald-600" />
                                            <span>Company</span>
                                            <span className="text-red-500">*</span>
                                        </Label>
                                        <Select onValueChange={selectChangeHandler}>
                                            <SelectTrigger className={`transition-all duration-200 ${
                                                theme === 'dark' 
                                                    ? 'bg-slate-700/50 border-slate-600 text-slate-100 focus:ring-emerald-500 focus:border-emerald-500' 
                                                    : 'bg-white border-slate-300 text-slate-800 focus:ring-emerald-500 focus:border-emerald-500'
                                            }`}>
                                                <SelectValue placeholder="Select a Company" />
                                            </SelectTrigger>
                                            <SelectContent className={theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'}>
                                                <SelectGroup>
                                                    {companies.map((company) => (
                                                        <SelectItem 
                                                            key={company._id} 
                                                            value={company.name.toLowerCase()}
                                                            className={theme === 'dark' ? 'text-slate-100 hover:bg-slate-600' : 'text-slate-800 hover:bg-slate-100'}
                                                        >
                                                            {company.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </motion.div>
                            
                            <div className="mt-8 space-y-4">
                                {loading ? (
                                    <Button 
                                        disabled 
                                        className={`w-full py-3 text-white font-medium transition-all duration-200 ${
                                            theme === 'dark' 
                                                ? 'bg-emerald-600 hover:bg-emerald-700' 
                                                : 'bg-emerald-600 hover:bg-emerald-700'
                                        }`}
                                    >
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                                        Creating Job Post...
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        className={`w-full py-3 text-white font-medium transition-all duration-200 ${
                                            theme === 'dark' 
                                                ? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500' 
                                                : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'
                                        }`}
                                    >
                                        <Briefcase className="mr-2 h-4 w-4" />
                                        Post New Job
                                    </Button>
                                )}
                                
                                {companies.length === 0 && (
                                    <div className={`p-4 rounded-lg border ${
                                        theme === 'dark' 
                                            ? 'bg-red-900/20 border-red-800 text-red-300' 
                                            : 'bg-red-50 border-red-200 text-red-700'
                                    }`}>
                                        <p className="text-sm font-medium text-center">
                                            ⚠️ Please register a company first, before posting jobs.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
            <Footer />
        </div>
    );
};

export default PostJob;
