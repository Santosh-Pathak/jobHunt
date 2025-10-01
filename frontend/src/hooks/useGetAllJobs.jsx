import { setAllJobs } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant';
import apiClient from '@/utils/axiosConfig';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector(store => store.job);

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const queryParam = searchedQuery ? `?keyword=${searchedQuery}` : '';
                const response = await apiClient.get(`${JOB_API_END_POINT}/get${queryParam}`);

                if (response?.data?.success) {
                    dispatch(setAllJobs(response.data.jobs));
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };

        // Call the function to fetch jobs
        fetchAllJobs();
    }, [searchedQuery, dispatch]); // Dependency array includes searchedQuery to refetch on change
};

export default useGetAllJobs;
