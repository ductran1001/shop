import { axiosClient } from 'libraries/axiosClient';

const urlColor = '/api/color';

export interface IFormColor {
    title: string;
    code: string;
}

export const getListColors = async (PAGE?: number, LIMIT?: number) =>
    await axiosClient.get(`${urlColor}?page=${PAGE}&limit=${LIMIT}`);

export const getListColorsTrash = async (PAGE: number, LIMIT: number, softDelete: boolean) =>
    await axiosClient.get(`${urlColor}?page=${PAGE}&limit=${LIMIT}&softDelete=${softDelete}`);

export const getColorById = async (id: string) => await axiosClient.get(`${urlColor}/${id}`);

export const destroyColor = async (id: string) => await axiosClient.delete(`${urlColor}/${id}`);

export const updateColor = async (id: string, data: IFormColor) => axiosClient.patch(`${urlColor}/${id}`, data);

export const createColor = async (data: IFormColor) => axiosClient.post(`${urlColor}`, data);

export const deleteMultiColor = async (id: string[]) => axiosClient.patch(`${urlColor}-delete-multi`, { id });

export const restoreMultiColor = async (id: string[]) => axiosClient.patch(`${urlColor}-restore-multi`, { id });

export const deleteMultiTrashColor = async (id: string[]) =>
    axiosClient.patch(`${urlColor}-delete-multi-trash`, { id });
