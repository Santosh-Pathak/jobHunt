import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        user: null,
        savedJobs: null
    },
    reducers: {
        // actions
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setsavedJobs: (state, action) => {
            state.savedJobs = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.savedJobs = null;
            state.loading = false;
        }
    }
});
export const { setLoading, setUser, setsavedJobs, logout } = authSlice.actions;
export default authSlice.reducer;