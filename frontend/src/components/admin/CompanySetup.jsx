import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion'; // Import motion
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import apiClient from '@/utils/axiosConfig';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import useGetCompanyById from '@/hooks/useGetCompanyById';
import Footer from '../shared/Footer';
import { useTheme } from '../../contexts/ThemeContext';

const CompanySetup = () => {
    const params = useParams();
    const { isLoading } = useGetCompanyById(params.id);
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null,
    });
    const { singleCompany } = useSelector((store) => store.company);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { isDark } = useTheme();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            setLoading(true);
            const res = await apiClient.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/companies");
            }
        } catch (error) {

            toast.error(error.response.data.message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (singleCompany) {
            setInput({
                name: singleCompany.name || "",
                description: singleCompany.description || "",
                website: singleCompany.website || "",
                location: singleCompany.location || "",
                file: singleCompany.file || null,
            });
        }
    }, [singleCompany]);

    // Show loading state while company data is being fetched
    if (isLoading || !singleCompany) {
        return (
            <motion.div
                className={`min-h-screen flex items-center justify-center transition-all duration-300 ${
                    isDark ? 'bg-background' : 'bg-white'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center">
                    <Loader2 className={`h-8 w-8 animate-spin mx-auto mb-4 ${
                        isDark ? 'text-primary' : 'text-blue-600'
                    }`} />
                    <p className={`${isDark ? 'text-muted-foreground' : 'text-gray-600'}`}>
                        Loading company data...
                    </p>
                    <p className={`text-sm mt-2 ${isDark ? 'text-muted-foreground/70' : 'text-gray-500'}`}>
                        Company ID: {params.id}
                    </p>
                    {isLoading && (
                        <p className={`text-xs mt-1 ${isDark ? 'text-muted-foreground/50' : 'text-gray-400'}`}>
                            Fetching data...
                        </p>
                    )}
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className={`min-h-screen transition-all duration-300 ${
                isDark ? 'bg-background' : 'bg-white'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
        >
            <Navbar />
            <div className={`max-w-xl mx-auto my-10 p-5 rounded-lg shadow-lg transition-all duration-300 ${
                isDark ? 'bg-card border border-border' : 'bg-gray-50'
            }`}>
                <form onSubmit={submitHandler}>
                    <div className="flex items-center gap-5 p-4">
                        <Button
                            onClick={() => navigate("/admin/companies")}
                            variant="outline"
                            className={`flex items-center gap-2 font-semibold transition duration-200 ${
                                isDark 
                                    ? 'text-muted-foreground hover:bg-accent hover:text-accent-foreground border-border' 
                                    : 'text-gray-500 hover:bg-blue-100'
                            }`}
                        >
                            <ArrowLeft />
                        </Button>
                        <h1 className={`font-bold text-xl ${
                            isDark ? 'text-primary' : 'text-blue-600'
                        }`}>
                            Company Setup
                        </h1>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className={`${isDark ? 'text-foreground' : 'text-gray-700'}`}>
                                Company Name
                            </Label>
                            <Input
                                type="text"
                                name="name"
                                value={input.name}
                                onChange={changeEventHandler}
                                className={`border rounded-md shadow-sm transition duration-200 ${
                                    isDark 
                                        ? 'border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary' 
                                        : 'border-gray-300 focus:border-blue-400'
                                }`}
                            />
                        </div>
                        <div>
                            <Label className={`${isDark ? 'text-foreground' : 'text-gray-700'}`}>
                                Description
                            </Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                className={`border rounded-md shadow-sm transition duration-200 ${
                                    isDark 
                                        ? 'border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary' 
                                        : 'border-gray-300 focus:border-blue-400'
                                }`}
                            />
                        </div>
                        <div>
                            <Label className={`${isDark ? 'text-foreground' : 'text-gray-700'}`}>
                                Website
                            </Label>
                            <Input
                                type="text"
                                name="website"
                                value={input.website}
                                onChange={changeEventHandler}
                                className={`border rounded-md shadow-sm transition duration-200 ${
                                    isDark 
                                        ? 'border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary' 
                                        : 'border-gray-300 focus:border-blue-400'
                                }`}
                            />
                        </div>
                        <div>
                            <Label className={`${isDark ? 'text-foreground' : 'text-gray-700'}`}>
                                Location
                            </Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                className={`border rounded-md shadow-sm transition duration-200 ${
                                    isDark 
                                        ? 'border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary' 
                                        : 'border-gray-300 focus:border-blue-400'
                                }`}
                            />
                        </div>
                        <div>
                            <Label className={`${isDark ? 'text-foreground' : 'text-gray-700'}`}>
                                Logo
                            </Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={changeFileHandler}
                                className={`border rounded-md shadow-sm transition duration-200 ${
                                    isDark 
                                        ? 'border-border bg-background text-foreground' 
                                        : 'border-gray-300'
                                }`}
                            />
                        </div>
                    </div>
                    {
                        loading ? (
                            <Button className={`w-full my-4 transition duration-200 ${
                                isDark 
                                    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                                    : 'bg-blue-500 text-white'
                            }`} disabled>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                            </Button>
                        ) : (
                            <Button type="submit" className={`w-full my-4 transition duration-200 ${
                                isDark 
                                    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}>
                                Update
                            </Button>
                        )
                    }
                </form>
            </div>
            <Footer />
        </motion.div>
    );
};

export default CompanySetup;
