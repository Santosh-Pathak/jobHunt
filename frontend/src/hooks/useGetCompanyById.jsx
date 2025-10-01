import { setSingleCompany } from '@/redux/companySlice'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import apiClient from '@/utils/axiosConfig'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

const useGetCompanyById = (companyId) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        const fetchSingleCompany = async () => {
            try {
                if (!companyId) {
                    console.log('No company ID provided');
                    return;
                }
                
                setIsLoading(true);
                console.log('Fetching company with ID:', companyId);
                
                // Set a timeout to prevent infinite loading
                const timeoutId = setTimeout(() => {
                    console.log('Request timeout - setting company to null');
                    dispatch(setSingleCompany(null));
                    setIsLoading(false);
                }, 10000); // 10 second timeout
                
                const res = await apiClient.get(`${COMPANY_API_END_POINT}/get/${companyId}`);
                clearTimeout(timeoutId);

                if (res.data.success) {
                    console.log('Company data received:', res.data.company);
                    dispatch(setSingleCompany(res.data.company));
                } else {
                    console.log('API response not successful:', res.data);
                    dispatch(setSingleCompany(null));
                }
            } catch (error) {
                console.error('Error fetching company:', error);
                // Set singleCompany to null to show error state
                dispatch(setSingleCompany(null));
            } finally {
                setIsLoading(false);
            }
        }
        
        if (companyId) {
            fetchSingleCompany();
        }
    }, [companyId, dispatch])
    
    return { isLoading };
}

export default useGetCompanyById