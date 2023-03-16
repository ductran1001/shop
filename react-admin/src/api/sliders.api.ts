import { axiosClient } from 'libraries/axiosClient';

const urlSlider = '/api/slider';

export interface IFormSlider {
    _id: string;
    photo: string;
}

export const getListSliders = async (PAGE?: number, LIMIT?: number) =>
    await axiosClient.get(`${urlSlider}?page=${PAGE}&limit=${LIMIT}`);

export const getSliderById = async (id: string) => await axiosClient.get(`${urlSlider}/${id}`);

export const destroySlider = async (id: string) => await axiosClient.delete(`${urlSlider}/${id}`);

export const updateSlider = async (data: string[]) => axiosClient.patch(`${urlSlider}/${data[1]}`, { photo: data[0] });

export const createSlider = async (data: string[]) => axiosClient.post(`${urlSlider}`, { photos: data });
