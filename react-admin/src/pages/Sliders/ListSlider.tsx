import React from 'react';
import { IError } from 'interfaces';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import * as Layouts from 'components/Layouts';
import * as Apis from 'api';

interface IProps {
    status: string;
    results: Apis.IFormSlider[];
    count: number;
    totalPages: number;
}

export const ListSlider = () => {
    const queryClient = useQueryClient();
    const queryString = useLocation().search || '?page=1';
    const PAGE = Number(queryString.split('=')[1]);
    const LIMIT = 10;

    const query = useQuery({
        queryKey: ['sliders', PAGE],
        queryFn: () => Apis.getListSliders(PAGE as number, LIMIT),
        keepPreviousData: true,
        retry: 0,
    });

    const uploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>, idUpdate?: string) => {
        const { files } = event.target;
        const formData = new FormData();
        for (let i = 0; i < (files as FileList).length; i++) {
            formData.append('images', (files as FileList)[i]);
        }
        mutationUpload.mutate(formData, {
            onSuccess: (data) => {
                idUpdate ? putImage(data.data.results, idUpdate) : postImage([...data.data.results]);
            },
            onError(error) {
                const mgs = ((error as AxiosError).response?.data as IError).message ?? 'Something went wrong!';
                toast.error(mgs);
            },
        });
    };

    const handleDelete = async (id: string) => {
        mutationDelete.mutate(id, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ['sliders', PAGE],
                    exact: true,
                });
                toast.success('Delete Success');
            },
            onError(error) {
                const mgs = ((error as AxiosError).response?.data as IError).message ?? 'Something went wrong!';
                toast.error(mgs);
            },
        });
    };

    const postImage = async (data: string[]) => {
        mutationCreate.mutate(data, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ['sliders', PAGE],
                    exact: true,
                });
                toast.success('Create Success');
            },
            onError(error) {
                const mgs = ((error as AxiosError).response?.data as IError).message ?? 'Something went wrong!';
                toast.error(mgs);
            },
        });
    };

    const putImage = async (data: string[], id: string) => {
        const newData = [...data, id];
        mutationUpdate.mutate(newData, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ['sliders', PAGE],
                    exact: true,
                });
                toast.success('Update Success');
            },
            onError(error) {
                const mgs = ((error as AxiosError).response?.data as IError).message ?? 'Something went wrong!';
                toast.error(mgs);
            },
        });
    };

    const mutationCreate = useMutation({ mutationFn: (body: string[]) => Apis.createSlider(body) });
    const mutationUpdate = useMutation({ mutationFn: (body: string[]) => Apis.updateSlider(body) });
    const mutationDelete = useMutation({ mutationFn: (id: string) => Apis.destroySlider(id) });
    const mutationUpload = useMutation({ mutationFn: (body: FormData) => Apis.upload('slider', body) });

    const isLoad =
        query.isLoading ||
        mutationUpload.isLoading ||
        mutationCreate.isLoading ||
        mutationUpdate.isLoading ||
        mutationDelete.isLoading;

    const response = query.data?.data as IProps;

    if (query.error) return Layouts.Error((query.error as AxiosError).message);

    return (
        <div className="flex flex-col h-full gap-8 px-4 pt-12">
            {isLoad ? <Layouts.Loading /> : null}

            <Layouts.Breadcrumb page="sliders" />

            <div className="pb-8">
                <label className="flex items-center justify-center w-12 h-12 cursor-pointer">
                    <input type="file" multiple className="hidden" onChange={(event) => uploadPhoto(event)} />
                    <img src="/icon/plus.png" className="w-10 h-10" alt="" />
                </label>

                <div className="grid grid-cols-1 gap-6 mx-auto my-8 sm:grid-cols-2 md:grid-cols-3">
                    {response &&
                        response.results.map((item, index) => (
                            <div
                                key={index}
                                className="duration-300 shadow-lg max-h-[300px] relative hover:shadow-xl hover:transform hover:scale-105"
                            >
                                <img className="w-full h-full rounded-xl" src={item.photo} alt="" />

                                <div className="absolute top-0 right-0 flex gap-1 mt-2">
                                    <label className="p-2 text-white bg-black rounded-full cursor-pointer opacity-80">
                                        <Layouts.EditIcon />
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={(event) => uploadPhoto(event, item._id)}
                                        />
                                    </label>
                                    <label
                                        onClick={() => handleDelete(item._id)}
                                        className="p-2 text-white bg-black rounded-full cursor-pointer opacity-80"
                                    >
                                        <Layouts.CloseIcon />
                                    </label>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};
