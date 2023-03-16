import { createSlice } from '@reduxjs/toolkit';

export interface IUser {
    _id: string;
    fullName: string;
    email: string;
    password?: string;
    avatar: string;
    address: string;
    role: string;
    phoneNumber: string;
    createdAt: string;
    updatedAt: string;
}

export interface IAuth {
    user?: IUser | null;
}

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
