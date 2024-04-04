import { createSlice } from '@reduxjs/toolkit';

const filterSlice = createSlice({
    name: 'filters',
    initialState: {
        search: '',
        searchGroup: ''
    },
    reducers: {
        searchFilterChange: (state, action) => {
            state.search = action.payload;
        },
        searchGroupChange: (state, action) => {
            state.searchGroup = action.payload;
        },
    },
});

export default filterSlice;
