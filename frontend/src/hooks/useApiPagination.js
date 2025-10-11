import { useState, useCallback, useEffect } from 'react';
import apiClient from '@/utils/axiosConfig';

/**
 * Custom hook for API-based pagination
 * @param {string} endpoint - API endpoint
 * @param {Object} initialParams - Initial query parameters
 * @param {number} initialPageSize - Initial page size
 * @param {number} initialPage - Initial page number
 * @returns {Object} API pagination state and handlers
 */
const useApiPagination = (endpoint, initialParams = {}, initialPageSize = 20, initialPage = 1) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [params, setParams] = useState(initialParams);

    // Fetch data from API
    const fetchData = useCallback(async (page = currentPage, size = pageSize, searchParams = params) => {
        setLoading(true);
        setError(null);

        try {
            const queryParams = {
                page: page.toString(),
                limit: size.toString(),
                ...searchParams
            };

            const response = await apiClient.get(endpoint, { params: queryParams });
            
            if (response.data.success) {
                setData(response.data.data || response.data.jobs || response.data.users || response.data.companies || response.data.applications || []);
                setTotalItems(response.data.pagination?.total || response.data.total || 0);
                setTotalPages(response.data.pagination?.pages || Math.ceil((response.data.pagination?.total || response.data.total || 0) / size));
                setCurrentPage(page);
                setPageSize(size);
            } else {
                setError(response.data.message || 'Failed to fetch data');
            }
        } catch (err) {
            console.error('API pagination error:', err);
            setError(err.response?.data?.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    }, [endpoint, currentPage, pageSize, params]);

    // Handlers
    const handlePageChange = useCallback((page) => {
        if (page >= 1 && page <= totalPages) {
            fetchData(page, pageSize, params);
        }
    }, [fetchData, pageSize, params, totalPages]);

    const handlePageSizeChange = useCallback((newPageSize) => {
        fetchData(1, newPageSize, params);
    }, [fetchData, params]);

    const handleSearch = useCallback((searchParams) => {
        const newParams = { ...params, ...searchParams };
        setParams(newParams);
        fetchData(1, pageSize, newParams);
    }, [fetchData, pageSize, params]);

    const refresh = useCallback(() => {
        fetchData(currentPage, pageSize, params);
    }, [fetchData, currentPage, pageSize, params]);

    const reset = useCallback(() => {
        setParams(initialParams);
        fetchData(initialPage, initialPageSize, initialParams);
    }, [fetchData, initialParams, initialPage, initialPageSize]);

    // Initial fetch
    useEffect(() => {
        fetchData(initialPage, initialPageSize, initialParams);
    }, []); // Only run on mount

    // Pagination info
    const paginationInfo = {
        currentPage,
        totalPages,
        totalItems,
        pageSize,
        startIndex: (currentPage - 1) * pageSize + 1,
        endIndex: Math.min(currentPage * pageSize, totalItems),
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
        hasPagination: totalPages > 1
    };

    return {
        // Data
        data,
        loading,
        error,
        
        // Pagination info
        ...paginationInfo,
        
        // Handlers
        handlePageChange,
        handlePageSizeChange,
        handleSearch,
        refresh,
        reset,
        
        // Setters
        setParams,
        setData
    };
};

export default useApiPagination;
