import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash';
import apiClient from '@/utils/axiosConfig';
import { JOB_API_END_POINT } from '@/utils/constant';

const useEnhancedSearch = (initialQuery = '', initialFilters = {}) => {
    const [query, setQuery] = useState(initialQuery);
    const [filters, setFilters] = useState(initialFilters);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalResults, setTotalResults] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [cache, setCache] = useState(new Map());
    
    const abortControllerRef = useRef(null);
    const searchTimeoutRef = useRef(null);

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce(async (searchQuery, searchFilters, page = 1) => {
            if (!searchQuery.trim() && Object.keys(searchFilters).length === 0) {
                setResults([]);
                setTotalResults(0);
                setHasMore(false);
                return;
            }

            // Create cache key
            const cacheKey = `${searchQuery}-${JSON.stringify(searchFilters)}-${page}`;
            
            // Check cache first
            if (cache.has(cacheKey)) {
                const cachedData = cache.get(cacheKey);
                setResults(cachedData.results);
                setTotalResults(cachedData.totalResults);
                setHasMore(cachedData.hasMore);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            // Cancel previous request
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            // Create new abort controller
            abortControllerRef.current = new AbortController();

            try {
                const params = {
                    q: searchQuery,
                    page,
                    limit: 20,
                    ...searchFilters
                };

                const response = await apiClient.get(`${JOB_API_END_POINT}/search`, {
                    params,
                    signal: abortControllerRef.current.signal
                });

                if (response.data.success) {
                    const { jobs, total, hasMore: moreResults } = response.data;
                    
                    // Cache the results
                    setCache(prev => {
                        const newCache = new Map(prev);
                        newCache.set(cacheKey, {
                            results: jobs,
                            totalResults: total,
                            hasMore: moreResults,
                            timestamp: Date.now()
                        });
                        
                        // Limit cache size to 100 entries
                        if (newCache.size > 100) {
                            const firstKey = newCache.keys().next().value;
                            newCache.delete(firstKey);
                        }
                        
                        return newCache;
                    });

                    if (page === 1) {
                        setResults(jobs);
                    } else {
                        setResults(prev => [...prev, ...jobs]);
                    }
                    
                    setTotalResults(total);
                    setHasMore(moreResults);
                    setCurrentPage(page);

                    // Add to search history
                    if (searchQuery.trim()) {
                        setSearchHistory(prev => {
                            const newHistory = [searchQuery, ...prev.filter(item => item !== searchQuery)];
                            return newHistory.slice(0, 10); // Keep only last 10 searches
                        });
                    }
                } else {
                    setError(response.data.message || 'Search failed');
                }
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Search error:', error);
                    setError('Failed to search jobs');
                }
            } finally {
                setLoading(false);
            }
        }, 300), // 300ms debounce
        [cache]
    );

    // Search function
    const search = useCallback((searchQuery, searchFilters = {}, page = 1) => {
        setQuery(searchQuery);
        setFilters(searchFilters);
        debouncedSearch(searchQuery, searchFilters, page);
    }, [debouncedSearch]);

    // Load more results
    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            search(query, filters, currentPage + 1);
        }
    }, [search, query, filters, currentPage, loading, hasMore]);

    // Get search suggestions
    const getSuggestions = useCallback(
        debounce(async (searchQuery) => {
            if (!searchQuery.trim() || searchQuery.length < 2) {
                setSuggestions([]);
                return;
            }

            try {
                const response = await apiClient.get(`${JOB_API_END_POINT}/suggestions`, {
                    params: { q: searchQuery }
                });

                if (response.data.success) {
                    setSuggestions(response.data.suggestions || []);
                }
            } catch (error) {
                console.error('Suggestions error:', error);
            }
        }, 200),
        []
    );

    // Clear search
    const clearSearch = useCallback(() => {
        setQuery('');
        setFilters({});
        setResults([]);
        setTotalResults(0);
        setHasMore(false);
        setCurrentPage(1);
        setError(null);
        setSuggestions([]);
        
        // Cancel any pending requests
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
    }, []);

    // Clear cache
    const clearCache = useCallback(() => {
        setCache(new Map());
    }, []);

    // Get cached results
    const getCachedResults = useCallback((searchQuery, searchFilters, page = 1) => {
        const cacheKey = `${searchQuery}-${JSON.stringify(searchFilters)}-${page}`;
        return cache.get(cacheKey);
    }, [cache]);

    // Check if results are cached
    const isCached = useCallback((searchQuery, searchFilters, page = 1) => {
        const cacheKey = `${searchQuery}-${JSON.stringify(searchFilters)}-${page}`;
        return cache.has(cacheKey);
    }, [cache]);

    // Get search statistics
    const getSearchStats = useCallback(() => {
        return {
            totalSearches: searchHistory.length,
            cacheSize: cache.size,
            totalResults: totalResults,
            currentQuery: query,
            currentFilters: filters
        };
    }, [searchHistory.length, cache.size, totalResults, query, filters]);

    // Auto-suggestions effect
    useEffect(() => {
        if (query.length >= 2) {
            getSuggestions(query);
        } else {
            setSuggestions([]);
        }
    }, [query, getSuggestions]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    // Clear old cache entries (older than 1 hour)
    useEffect(() => {
        const interval = setInterval(() => {
            setCache(prev => {
                const newCache = new Map();
                const oneHourAgo = Date.now() - (60 * 60 * 1000);
                
                for (const [key, value] of prev) {
                    if (value.timestamp > oneHourAgo) {
                        newCache.set(key, value);
                    }
                }
                
                return newCache;
            });
        }, 5 * 60 * 1000); // Check every 5 minutes

        return () => clearInterval(interval);
    }, []);

    return {
        // State
        query,
        filters,
        results,
        loading,
        error,
        totalResults,
        currentPage,
        hasMore,
        searchHistory,
        suggestions,
        
        // Actions
        search,
        loadMore,
        clearSearch,
        clearCache,
        getCachedResults,
        isCached,
        getSearchStats,
        
        // Setters
        setQuery,
        setFilters,
        setResults
    };
};

export default useEnhancedSearch;
