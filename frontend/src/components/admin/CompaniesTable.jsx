import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Edit2, Eye, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/utils/axiosConfig';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useTheme } from '../../contexts/ThemeContext';
import CompanyDetailsModal from './CompanyDetailsModal';

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector((store) => store.company);
    const [filterCompany, setFilterCompany] = useState(companies);
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const filteredCompany = companies.length >= 0 && companies.filter((company) => {
            if (!searchCompanyByText) return true;
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
        });
        setFilterCompany(filteredCompany);
    }, [companies, searchCompanyByText]);

    const handleViewCompany = (company) => {
        setSelectedCompany(company);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCompany(null);
    };

    const handleDeleteCompany = async (companyId) => {
        try {
            if (!companyId) {
                toast.error('Company ID is missing');
                return;
            }
            
            const response = await apiClient.delete(`/api/v1/admin/companies/${companyId}`);
            
            // Update local state
            setFilterCompany(prev => prev.filter(company => company._id !== companyId));
            
            toast.success(response.data.message || 'Company deleted successfully');
        } catch (error) {
            console.error('Error deleting company:', error);
            toast.error(error.response?.data?.message || 'Error deleting the company');
        }
    };

    return (
        <div className={`rounded-lg shadow-md p-5 transition-all duration-300 ${
            isDark ? 'bg-card border border-border' : 'bg-white'
        }`}>
            <Table>
                <TableCaption className={`${isDark ? 'text-muted-foreground' : 'text-gray-600'}`}>
                    A list of your recent registered companies
                </TableCaption>
                <TableHeader>
                    <TableRow className={`${isDark ? 'border-border' : 'border-gray-200'}`}>
                        <TableHead className={`${isDark ? 'text-foreground' : 'text-gray-900'}`}>Logo</TableHead>
                        <TableHead className={`${isDark ? 'text-foreground' : 'text-gray-900'}`}>Name</TableHead>
                        <TableHead className={`${isDark ? 'text-foreground' : 'text-gray-900'}`}>Date</TableHead>
                        <TableHead className={`text-right ${isDark ? 'text-foreground' : 'text-gray-900'}`}>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterCompany?.map((company) => (
                            <motion.tr
                                key={company._id}
                                className={`transition-all duration-200 ${
                                    isDark 
                                        ? 'hover:bg-accent/50 border-border' 
                                        : 'hover:bg-blue-50 border-gray-200'
                                }`}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <TableCell>
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage src={company.logo} alt={company.name} />
                                    </Avatar>
                                </TableCell>
                                <TableCell className={`${isDark ? 'text-foreground' : 'text-gray-900'}`}>
                                    {company.name}
                                </TableCell>
                                <TableCell className={`${isDark ? 'text-muted-foreground' : 'text-gray-600'}`}>
                                    {company.createdAt.split("T")[0]}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleViewCompany(company)}
                                            className={`p-2 rounded-md transition-all duration-200 ${
                                                isDark 
                                                    ? 'text-primary hover:text-primary/80 hover:bg-primary/10' 
                                                    : 'text-blue-600 hover:text-blue-500 hover:bg-blue-50'
                                            }`}
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => navigate(`/admin/companies/${company._id}/edit`)}
                                            className={`p-2 rounded-md transition-all duration-200 ${
                                                isDark 
                                                    ? 'text-primary hover:text-primary/80 hover:bg-primary/10' 
                                                    : 'text-blue-600 hover:text-blue-500 hover:bg-blue-50'
                                            }`}
                                            title="Edit Company"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCompany(company._id)}
                                            className={`p-2 rounded-md transition-all duration-200 ${
                                                isDark 
                                                    ? 'text-destructive hover:text-destructive/80 hover:bg-destructive/10' 
                                                    : 'text-red-600 hover:text-red-500 hover:bg-red-50'
                                            }`}
                                            title="Delete Company"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </TableCell>
                            </motion.tr>
                        ))
                    }
                </TableBody>
            </Table>
            
            {/* Company Details Modal */}
            <CompanyDetailsModal
                company={selectedCompany}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default CompaniesTable;
