import React, { useState } from 'react';
import { motion } from 'framer-motion'; // Import motion
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/utils/axiosConfig';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setSingleCompany } from '@/redux/companySlice';
import Footer from '../shared/Footer';
import { useTheme } from '../../contexts/ThemeContext';

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState('');
    const dispatch = useDispatch();
    const { isDark } = useTheme();

    const registerNewCompany = async () => {
        try {
            const res = await apiClient.post(
                `${COMPANY_API_END_POINT}/register`,
                { companyName }
            );
            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            }
        } catch (error) {

            toast.error("Failed to create company. Please try again.");
        }
    };

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
            <div className="max-w-4xl mx-auto my-10 p-5">
                <div className="my-10">
                    <h1 className={`font-bold text-2xl ${
                        isDark ? 'text-primary' : 'text-blue-600'
                    }`}>
                        Your Company Name
                    </h1>
                    <p className={`${isDark ? 'text-muted-foreground' : 'text-gray-500'}`}>
                        What would you like to give your company name? You can change this later.
                    </p>
                </div>

                <Label className={`${isDark ? 'text-foreground' : 'text-gray-700'}`}>
                    Company Name
                </Label>
                <Input
                    type="text"
                    className={`my-2 border rounded-md shadow-sm transition duration-200 ${
                        isDark 
                            ? 'border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary' 
                            : 'border-gray-300 focus:border-blue-400'
                    }`}
                    placeholder="JobHunt, Microsoft etc."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                />
                <div className="flex items-center gap-2 my-10">
                    <Button
                        variant="outline"
                        onClick={() => navigate("/admin/companies")}
                        className={`transition duration-200 ${
                            isDark 
                                ? 'border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground' 
                                : 'hover:bg-blue-100'
                        }`}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={registerNewCompany}
                        className={`transition duration-200 ${
                            isDark 
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                    >
                        Continue
                    </Button>
                </div>
            </div>
            <Footer />
        </motion.div>
    );
};

export default CompanyCreate;
