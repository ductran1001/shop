import { Dispatch } from 'redux';
import { axiosClient } from '@/lib/axiosClient';
import { getUser } from '@/redux/slice/authSlice';

export const getUserApi = async (dispatch: Dispatch) => {
    try {
        const response = await axiosClient.get('/api/user/me');
        dispatch(getUser(response.data.contents));
        return response;
    } catch (error) {
        window.localStorage.clear();
    }
};
