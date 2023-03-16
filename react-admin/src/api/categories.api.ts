import { axiosClient } from 'libraries/axiosClient';

const urlCategory = '/api/category';

export interface IFormCategory {
    name: string;
    position: number;
    description: string;
    active: boolean;
    image: string;
    photos: string[];
}

export const getListCategories = async (PAGE?: number, LIMIT?: number, softDelete?: boolean) =>
    await axiosClient.get(`${urlCategory}?page=${PAGE}&limit=${LIMIT}&softDelete=${softDelete}&sort=-position`);

export const getListCategoriesTrash = async (PAGE: number, LIMIT: number, softDelete: boolean) =>
    await axiosClient.get(`${urlCategory}?page=${PAGE}&limit=${LIMIT}&softDelete=${softDelete}&sort=-position`);

export const getCategoryById = async (id: string) => await axiosClient.get(`${urlCategory}/${id}`);

export const destroyCategory = async (id: string) => await axiosClient.delete(`${urlCategory}/${id}`);

export const updateCategory = async (id: string, data: IFormCategory) =>
    axiosClient.patch(`${urlCategory}/${id}`, data);

export const createCategory = async (data: IFormCategory) => axiosClient.post(`${urlCategory}`, data);

export const deleteMultiCategory = async (id: string[]) => axiosClient.patch(`${urlCategory}-delete-multi`, { id });

export const restoreMultiCategory = async (id: string[]) => axiosClient.patch(`${urlCategory}-restore-multi`, { id });

export const deleteMultiTrashCategory = async (id: string[]) =>
    axiosClient.patch(`${urlCategory}-delete-multi-trash`, { id });
