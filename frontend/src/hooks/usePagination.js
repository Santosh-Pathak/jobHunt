import { useState, useMemo, useCallback } from 'react';

/**
 * Custom hook for handling pagination logic
 * @param {Array} data - The data array to paginate
 * @param {number} initialPageSize - Initial number of items per page
 * @param {number} initialPage - Initial page number (default: 1)
 * @returns {Object} Pagination state and handlers
 */
const usePagination = (data = [], initialPageSize = 10, initialPage = 1) => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);

    // Calculate pagination values
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentData = data.slice(startIndex, endIndex);

    // Check if pagination is needed
    const hasPagination = totalItems > pageSize;

    // Handlers
    const handlePageChange = useCallback((page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    }, [totalPages]);

    const handlePageSizeChange = useCallback((newPageSize) => {
        setPageSize(newPageSize);
        setCurrentPage(1); // Reset to first page
    }, []);

    const goToFirstPage = useCallback(() => {
        setCurrentPage(1);
    }, []);

    const goToLastPage = useCallback(() => {
        setCurrentPage(totalPages);
    }, [totalPages]);

    const goToNextPage = useCallback(() => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    }, [currentPage, totalPages]);

    const goToPreviousPage = useCallback(() => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }, [currentPage]);

    // Reset pagination when data changes
    const resetPagination = useCallback(() => {
        setCurrentPage(1);
    }, []);

    // Pagination info
    const paginationInfo = useMemo(() => ({
        currentPage,
        totalPages,
        totalItems,
        pageSize,
        startIndex: startIndex + 1, // 1-based index for display
        endIndex: Math.min(endIndex, totalItems),
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
        hasPagination
    }), [currentPage, totalPages, totalItems, pageSize, startIndex, endIndex, hasPagination]);

    return {
        // Current data
        currentData,
        
        // Pagination info
        ...paginationInfo,
        
        // Handlers
        handlePageChange,
        handlePageSizeChange,
        goToFirstPage,
        goToLastPage,
        goToNextPage,
        goToPreviousPage,
        resetPagination,
        
        // Setters (for external control)
        setCurrentPage,
        setPageSize
    };
};

export default usePagination;
