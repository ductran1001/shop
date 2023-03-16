import { axiosClient } from 'libraries/axiosClient';

const urlOrder = '/api/order';

export const getListOrders = async (PAGE?: number, LIMIT?: number) =>
    await axiosClient.get(`${urlOrder}?page=${PAGE}&limit=${LIMIT}`);

export const getOrderById = async (id: string) => await axiosClient.get(`${urlOrder}/by-user/${id}`);

export const destroyOrder = async (id: string) => await axiosClient.delete(`${urlOrder}/delete-by-userId/${id}`);

export const updateOrder = async (body: object) => axiosClient.patch(`${urlOrder}/update`, { ...body });
