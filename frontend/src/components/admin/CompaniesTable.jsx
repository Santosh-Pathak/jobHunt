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

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector((store) => store.company);
    const [filterCompany, setFilterCompany] = useState(companies);
    const navigate = useNavigate();

    useEffect(() => {
        const filteredCompany = companies.length >= 0 && companies.filter((company) => {
            if (!searchCompanyByText) return true;
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
        });
        setFilterCompany(filteredCompany);
    }, [companies, searchCompanyByText]);

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
        <div className="bg-white rounded-lg shadow-md p-5 transition-all duration-300">
            <Table>
                <TableCaption>A list of your recent registered companies</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Logo</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterCompany?.map((company) => (
                            <motion.tr
                                key={ company._id }
                                className="hover:bg-blue-50"
                                initial={ { opacity: 0, y: -10 } }
                                animate={ { opacity: 1, y: 0 } }
                                exit={ { opacity: 0, y: -10 } }
                                transition={ { duration: 0.2 } }
                            >
                                <TableCell>
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage src={ company.logo } alt={ company.name } />
                                    </Avatar>
                                </TableCell>
                                <TableCell>{ company.name }</TableCell>
                                <TableCell>{ company.createdAt.split("T")[0] }</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={ () => navigate(`/admin/companies/${company._id}`) }
                                            className="p-2 text-blue-600 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-all duration-200"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={ () => navigate(`/admin/companies/${company._id}/edit`) }
                                            className="p-2 text-blue-600 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-all duration-200"
                                            title="Edit Company"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={ () => handleDeleteCompany(company._id) }
                                            className="p-2 text-red-600 hover:text-red-500 hover:bg-red-50 rounded-md transition-all duration-200"
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
        </div>
    );
};

export default CompaniesTable;
