import { axiosClient } from 'libraries/axiosClient';
import { Dispatch } from 'redux';
import { getUser } from 'redux/slice/authSlice';

const urlAuth = '/api/auth';

export interface IAuth {
    email: string;
    password: string;
    fullName?: string;
}

export const getUserApi = async (dispatch: Dispatch) => {
    try {
        const response = await axiosClient.get('/api/user/me');
        dispatch(getUser(response.data.contents));
        return response;
    } catch (error) {
        window.localStorage.clear();
        console.log(error);
    }
};

export const loginUser = async (data: IAuth) => axiosClient.post(`${urlAuth}/login`, data);
export const registerUser = async (data: IAuth) => axiosClient.post(`${urlAuth}/register`, data);
