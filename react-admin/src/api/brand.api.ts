import { axiosClient } from 'libraries/axiosClient';

const urlBrand = '/api/brand';

export interface IFormBrand {
    title: string;
}

export const getListBrands = async (PAGE?: number, LIMIT?: number) =>
    await axiosClient.get(`${urlBrand}?page=${PAGE}&limit=${LIMIT}`);

export const getListBrandsTrash = async (PAGE: number, LIMIT: number, softDelete: boolean) =>
    await axiosClient.get(`${urlBrand}?page=${PAGE}&limit=${LIMIT}&softDelete=${softDelete}`);

export const getBrandById = async (id: string) => await axiosClient.get(`${urlBrand}/${id}`);

export const destroyBrand = async (id: string) => await axiosClient.delete(`${urlBrand}/${id}`);

export const updateBrand = async (id: string, data: IFormBrand) => axiosClient.patch(`${urlBrand}/${id}`, data);

export const createBrand = async (data: IFormBrand) => axiosClient.post(`${urlBrand}`, data);

export const deleteMultiBrand = async (id: string[]) => axiosClient.patch(`${urlBrand}-delete-multi`, { id });

export const restoreMultiBrand = async (id: string[]) => axiosClient.patch(`${urlBrand}-restore-multi`, { id });

export const deleteMultiTrashBrand = async (id: string[]) =>
    axiosClient.patch(`${urlBrand}-delete-multi-trash`, { id });
