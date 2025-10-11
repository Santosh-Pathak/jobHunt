import  { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Delete, Edit2, Eye, Users } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import apiClient from '@/utils/axiosConfig'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { setAllJobs } from '@/redux/jobSlice'
import { useTheme } from '../../contexts/ThemeContext'
import Pagination from '../ui/pagination'
import usePagination from '../../hooks/usePagination'

const AdminJobsTable = () => {
    const dispatch = useDispatch()
    const { allAdminJobs, searchJobByText } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const navigate = useNavigate();
    const { isDark } = useTheme();

    // Use pagination hook
    const {
        currentData: currentJobs,
        currentPage,
        totalPages,
        totalItems,
        pageSize,
        handlePageChange,
        handlePageSizeChange,
        resetPagination
    } = usePagination(filterJobs, 10);

    const handleViewJob = (job) => {
        navigate(`/description/${job._id}`);
    };

    const handleDeleteJob = async (jobId) => {
        try {
            if (!jobId) {
                toast.error('Job ID is missing');
                return;
            }
            const response = await apiClient.post(`${JOB_API_END_POINT}/delete`, { jobId });

            // Update Redux state
            dispatch(setAllJobs(response.data.remainingJobs));

            // Trigger re-filtering
            setFilterJobs(response.data.remainingJobs);

            toast.success(response.data.message);
        } catch (error) {
            console.error('Error deleting job:', error);
            toast.error(error.response?.data?.message || 'Error deleting the job');
        }
    };


    useEffect(() => {
        const filtered = allAdminJobs.filter((job) => {
            if (!searchJobByText) return true;
            return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
                job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase());
        });
        setFilterJobs(filtered);
        resetPagination(); // Reset to first page when search changes
    }, [allAdminJobs, searchJobByText, resetPagination]);


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="overflow-x-auto"
        >
            <Table className={`border rounded-xl min-w-full ${
                isDark ? 'border-border' : 'border-blue-300'
            }`}>
                <TableCaption className={`text-center ${
                    isDark ? 'text-muted-foreground' : 'text-gray-600'
                }`}>
                    A list of your recently posted jobs
                </TableCaption>
                <TableHeader>
                    <TableRow className={`${isDark ? 'border-border' : 'border-gray-200'}`}>
                        <TableHead className={`py-4 px-6 ${isDark ? 'text-foreground' : 'text-gray-900'}`}>Company Name</TableHead>
                        <TableHead className={`py-4 px-6 ${isDark ? 'text-foreground' : 'text-gray-900'}`}>Role</TableHead>
                        <TableHead className={`py-4 px-6 ${isDark ? 'text-foreground' : 'text-gray-900'}`}>Date</TableHead>
                        <TableHead className={`py-4 px-6 text-right ${isDark ? 'text-foreground' : 'text-gray-900'}`}>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentJobs?.map((job) => (
                        <motion.tr
                            key={job._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className={`transition-all duration-200 ${
                                isDark 
                                    ? 'hover:bg-accent/50 border-border' 
                                    : 'hover:bg-blue-100 border-gray-200'
                            }`}
                        >
                            <TableCell className={`py-4 px-6 whitespace-nowrap ${
                                isDark ? 'text-foreground' : 'text-gray-900'
                            }`}>
                                {job?.company?.name}
                            </TableCell>
                            <TableCell className={`py-4 px-6 whitespace-nowrap ${
                                isDark ? 'text-foreground' : 'text-gray-900'
                            }`}>
                                {job?.title}
                            </TableCell>
                            <TableCell className={`py-4 px-6 whitespace-nowrap ${
                                isDark ? 'text-muted-foreground' : 'text-gray-600'
                            }`}>
                                {job?.createdAt.split("T")[0]}
                            </TableCell>
                            <TableCell className="py-4 px-6 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => handleViewJob(job)}
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
                                        onClick={() => navigate(`/admin/jobs/${job._id}/update`)}
                                        className={`p-2 rounded-md transition-all duration-200 ${
                                            isDark 
                                                ? 'text-primary hover:text-primary/80 hover:bg-primary/10' 
                                                : 'text-blue-600 hover:text-blue-500 hover:bg-blue-50'
                                        }`}
                                        title="Edit Job"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                                        className={`p-2 rounded-md transition-all duration-200 ${
                                            isDark 
                                                ? 'text-primary hover:text-primary/80 hover:bg-primary/10' 
                                                : 'text-blue-600 hover:text-blue-500 hover:bg-blue-50'
                                        }`}
                                        title="View Applicants"
                                    >
                                        <Users className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteJob(job?._id)}
                                        className={`p-2 rounded-md transition-all duration-200 ${
                                            isDark 
                                                ? 'text-destructive hover:text-destructive/80 hover:bg-destructive/10' 
                                                : 'text-red-600 hover:text-red-500 hover:bg-red-50'
                                        }`}
                                        title="Delete Job"
                                    >
                                        <Delete className="w-4 h-4" />
                                    </button>
                                </div>
                            </TableCell>
                        </motion.tr>
                    ))}
                </TableBody>
            </Table>
            
            {/* Pagination */}
            {totalItems > 0 && (
                <div className="mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        itemsPerPage={pageSize}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                        itemLabel="jobs"
                        theme={isDark ? 'dark' : 'light'}
                        pageSizeOptions={[5, 10, 20, 50]}
                    />
                </div>
            )}
        </motion.div>
    );
}

export default AdminJobsTable;
