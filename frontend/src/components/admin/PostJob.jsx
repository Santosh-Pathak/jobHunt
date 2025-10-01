import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import apiClient from '@/utils/axiosConfig';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '../shared/Footer';

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


        <div className="bg-white min-h-screen ">
            <Navbar />
            <motion.div
                className="flex items-center justify-center w-full my-5 pt-10"

                initial={ { opacity: 0, y: -20 } }
                animate={ { opacity: 1, y: 0 } }
                transition={ { duration: 0.6 } }
            >
                <form
                    onSubmit={ submitHandler }
                    className="p-8 max-w-4xl w-full bg-white border border-blue-300 shadow-lg rounded-md"
                >
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        initial={ { opacity: 0 } }
                        animate={ { opacity: 1 } }
                        transition={ { duration: 0.7 } }
                    >
                        <div>
                            <Label>
                                Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                name="title"
                                value={ input.title }
                                onChange={ changeEventHandler }
                                className="my-1 border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <Label>
                                Description <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                name="description"
                                value={ input.description }
                                onChange={ changeEventHandler }
                                className="my-1 border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <Label>
                                Requirements <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                name="requirements"
                                value={ input.requirements }
                                onChange={ changeEventHandler }
                                className="my-1 border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <Label>
                                Salary LPA <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="number"
                                name="salary"
                                value={ input.salary }
                                onChange={ changeEventHandler }
                                className="my-1 border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <Label>
                                Location <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                name="location"
                                value={ input.location }
                                onChange={ changeEventHandler }
                                className="my-1 border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <Label>
                                Job Type <span className="text-red-500">*</span>
                            </Label>
                            <Select 
                                value={input.jobType} 
                                onValueChange={(value) => setInput({ ...input, jobType: value })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Job Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="Full-time">Full-time</SelectItem>
                                        <SelectItem value="Part-time">Part-time</SelectItem>
                                        <SelectItem value="Internship">Internship</SelectItem>
                                        <SelectItem value="Contract">Contract</SelectItem>
                                        <SelectItem value="Freelance">Freelance</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>
                                Experience Level (Years) <span className="text-red-500">*</span>
                            </Label>
                            <Select 
                                value={input.experience} 
                                onValueChange={(value) => setInput({ ...input, experience: value })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Experience Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="0">0-1 Years (Entry Level)</SelectItem>
                                        <SelectItem value="1">1-2 Years</SelectItem>
                                        <SelectItem value="2">2-3 Years</SelectItem>
                                        <SelectItem value="3">3-5 Years</SelectItem>
                                        <SelectItem value="5">5-7 Years</SelectItem>
                                        <SelectItem value="7">7-10 Years</SelectItem>
                                        <SelectItem value="10">10+ Years (Senior Level)</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>
                                No of Positions <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="number"
                                name="position"
                                value={ input.position }
                                onChange={ changeEventHandler }
                                min="1"
                                max="100"
                                placeholder="Enter number of positions"
                                className="my-1 border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        { companies.length > 0 && (
                            <div>
                                <Label>
                                    Company <span className="text-red-500">*</span>
                                </Label>
                                <Select onValueChange={ selectChangeHandler }>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a Company" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            { companies.map((company) => (
                                                <SelectItem key={ company._id } value={ company.name.toLowerCase() }>
                                                    { company.name }
                                                </SelectItem>
                                            )) }
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        ) }
                    </motion.div>
                    { loading ? (
                        <Button className="w-full my-4 bg-blue-500 text-white">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            className="w-full my-4 bg-blue-500 hover:bg-blue-600 text-white transition duration-300"
                        >
                            Post New Job
                        </Button>
                    ) }
                    { companies.length === 0 && (
                        <p className="text-xs text-red-600 font-bold text-center my-3">
                            *Please register a company first, before posting jobs.
                        </p>
                    ) }
                </form>
            </motion.div>
            <Footer />
        </div>
    );
};

export default PostJob;
