import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: "job",
    initialState: {
        allJobs: [],
        allAdminJobs: [],
        singleJob: null,
        searchJobByText: "",
        allAppliedJobs: [],
        searchedQuery: "",
        filters: {},
        pagination: {
            current: 1,
            pages: 1,
            total: 0,
            limit: 12
        },
        loading: false,
    },
    reducers: {
        // actions
        setAllJobs: (state, action) => {
            state.allJobs = action.payload;
        },
        setSingleJob: (state, action) => {
            state.singleJob = action.payload;
        },
        setAllAdminJobs: (state, action) => {
            state.allAdminJobs = action.payload;
        },
        setSearchJobByText: (state, action) => {
            state.searchJobByText = action.payload;
        },
        setAllAppliedJobs: (state, action) => {
            state.allAppliedJobs = action.payload;
        },
        setSearchedQuery: (state, action) => {
            state.searchedQuery = action.payload;
        },
        setFilters: (state, action) => {
            state.filters = action.payload;
        },
        setPagination: (state, action) => {
            state.pagination = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
});
export const {
    setAllJobs,
    setSingleJob,
    setAllAdminJobs,
    setSearchJobByText,
    setAllAppliedJobs,
    setSearchedQuery,
    setFilters,
    setPagination,
    setLoading
} = jobSlice.actions;
export default jobSlice.reducer;