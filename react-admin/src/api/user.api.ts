import { axiosClient } from 'libraries/axiosClient';

const urlUser = '/api/user';

export interface IFormUserCreate {
    fullName: string;
    email: string;
    avatar: string;
    address: string;
    phoneNumber: string;
    password: string;
    confirm: string;
}

export interface IFormUserUpdate {
    fullName: string;
    email: string;
    avatar: string;
    address: string;
    phoneNumber: string;
    password: string;
    newPass: string;
    confirm: string;
}

export const getListUsers = async (PAGE?: number, LIMIT?: number) =>
    await axiosClient.get(`${urlUser}?page=${PAGE}&limit=${LIMIT}`);

export const getUserById = async (id: string) => await axiosClient.get(`${urlUser}/${id}`);

export const destroyUser = async (id: string) => await axiosClient.delete(`${urlUser}/${id}`);

export const updateUser = async (id: string, data: IFormUserUpdate) => axiosClient.patch(`${urlUser}/${id}`, data);

export const createUser = async (data: IFormUserCreate) => axiosClient.post(`${urlUser}`, data);
