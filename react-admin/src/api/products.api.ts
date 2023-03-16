import { axiosClient } from 'libraries/axiosClient';

const urlProduct = '/api/product';

export interface IFormProduct {
    name: string;
    description: string;
    user: string;
    category: string;
    imageURL: string[];
    variant: IVariant[];
    active: boolean;
}

interface IVariant {
    id?: string;
    color: string;
    price: number | string;
    promotion: number | string;
    quantity: number | string;
}

export const getListProducts = async (PAGE: number, LIMIT: number, category: string | undefined, sort: string) => {
    let baseRequest = `${urlProduct}?page=${PAGE}&limit=${LIMIT}&sort=${sort}`;
    if (category) {
        baseRequest = baseRequest + `&category=${category}`;
    }

    return await axiosClient.get(`${baseRequest}`);
};

export const getListProductsTrash = async (
    PAGE: number,
    LIMIT: number,
    softDelete: boolean,
    category: string | undefined,
    sort: string
) => {
    let baseRequest = `${urlProduct}?page=${PAGE}&limit=${LIMIT}&softDelete=${softDelete}&sort=${sort}`;

    if (category) {
        baseRequest = baseRequest + `&category=${category}`;
    }

    return await axiosClient.get(`${baseRequest}`);
};

export const getProductById = async (id: string) => await axiosClient.get(`${urlProduct}/${id}`);

export const destroyProduct = async (id: string) => await axiosClient.delete(`${urlProduct}/${id}`);

export const updateProduct = async (id: string, data: IFormProduct) => axiosClient.patch(`${urlProduct}/${id}`, data);

export const createProduct = async (data: IFormProduct) => axiosClient.post(`${urlProduct}`, data);

export const deleteMultiProduct = async (id: string[]) => axiosClient.patch(`${urlProduct}-delete-multi`, { id });

export const restoreMultiProduct = async (id: string[]) => axiosClient.patch(`${urlProduct}-restore-multi`, { id });

export const deleteMultiTrashProduct = async (id: string[]) =>
    axiosClient.patch(`${urlProduct}-delete-multi-trash`, { id });
