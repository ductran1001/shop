import { createSlice } from '@reduxjs/toolkit';
import { IAuth } from 'interfaces';

const initialState: IAuth = {
    user: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        getUser: (state, action) => {
            state.user = action.payload;
        },
        logoutUser: (state, action) => {
            state.user = action.payload.user;
        },
        updateUser: (state, action) => {
            // state.user = action.payload;

            return {
                ...state,
                user: action.payload,
            };
        },
    },
});

// Action creators are generated for each case reducer function
export const { getUser, logoutUser, updateUser } = authSlice.actions;

export default authSlice.reducer;
