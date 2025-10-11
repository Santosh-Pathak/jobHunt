import { setAllJobs, setPagination, setLoading } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant';
import apiClient from '@/utils/axiosConfig';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useGetAllJobs = (page = 1, limit = 12) => {
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector(store => store.job);

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                dispatch(setLoading(true));
                
                // Build query parameters
                const params = new URLSearchParams();
                if (searchedQuery) params.append('keyword', searchedQuery);
                params.append('page', page.toString());
                params.append('limit', limit.toString());
                
                const queryString = params.toString();
                const url = `${JOB_API_END_POINT}/get${queryString ? `?${queryString}` : ''}`;
                
                const response = await apiClient.get(url);

                if (response?.data?.success) {
                    dispatch(setAllJobs(response.data.jobs));
                    if (response.data.pagination) {
                        dispatch(setPagination(response.data.pagination));
                    }
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                dispatch(setLoading(false));
            }
        };

        // Call the function to fetch jobs
        fetchAllJobs();
    }, [searchedQuery, page, limit, dispatch]); // Added page and limit to dependencies
};

export default useGetAllJobs;
