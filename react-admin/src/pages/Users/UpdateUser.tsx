import React from 'react';
import { IError } from 'interfaces';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { AxiosError } from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Layouts from 'components/Layouts';
import * as Utils from 'utils';
import * as Apis from 'api';

export const UpdateUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = React.useState<Apis.IFormUserUpdate>(Utils.initialStateUpdateUserForm);
    const [loadingUpload, setLoadingUpload] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<Apis.IFormUserUpdate>({
        resolver: yupResolver(Utils.updateUserInfoSchema),
        mode: 'onChange',
        defaultValues: user,
        values: user,
        resetOptions: {
            keepDirtyValues: true, // user-interacted input will be retained
        },
    });

    // const uploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const { files } = event.target;
    //     const selectedFiles = files as FileList;
    //     const formData = new FormData();
    //     formData.append('file', selectedFiles?.[0]);

    //     mutationUpLoad.mutate(formData, {
    //         onSuccess: (data) => {
    //             setUser((prevState) => ({ ...prevState, avatar: data.data.publicUrl[0] }));
    //         },
    //         onError(error) {
    //             const mgs = ((error as AxiosError).response?.data as IError).message ?? 'Something went wrong!';
    //             toast.error(mgs);
    //         },
    //     });
    // };
    const uploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        if (files) {
            try {
                setLoadingUpload(true);

                const formData = new FormData();
                formData.append('file', files[0]);
                formData.append('upload_preset', 'ecommer');
                formData.append('cloud_name', 'djdosyhxm');

                const res = await fetch('https://api.cloudinary.com/v1_1/djdosyhxm/upload', {
                    method: 'POST',
                    body: formData,
                });
                const data = await res.json();
                setLoadingUpload(false);
                data.secure_url && setUser((prevState) => ({ ...prevState, avatar: data.secure_url }));
            } catch (error) {
                setLoadingUpload(false);

                const mgs = ((error as AxiosError).response?.data as IError)?.message ?? 'Something went wrong!';
                toast.error(mgs);
            }
        }
    };

    const onSubmit = async (data: Apis.IFormUserUpdate) => {
        const dataRequest = {
            fullName: data.fullName,
            avatar: data.avatar,
            address: data.address,
            phoneNumber: data.phoneNumber,
        };

        mutationUpdate.mutate(dataRequest as Apis.IFormUserUpdate, {
            onSuccess: () => {
                toast.success('Update Success');
                navigate('/users');
            },
            onError(error) {
                const mgs = ((error as AxiosError).response?.data as IError).message ?? 'Something went wrong!';
                toast.error(mgs);
            },
        });
    };

    const mutationUpdate = useMutation({
        mutationFn: (body: Apis.IFormUserUpdate) => Apis.updateUser(id as string, body),
    });

    const queryUser = useQuery({
        queryKey: ['user', id],
        queryFn: () => Apis.getUserById(id as string),
        enabled: id !== undefined,
        onSuccess: (data) => {
            setUser((prevState) => ({ ...prevState, ...data.data.contents }));
        },
    });

    if (queryUser.error) return Layouts.Error((queryUser.error as AxiosError).message);
    return (
        <div className="flex flex-col h-full gap-10 px-4 pt-12">
            {queryUser.isLoading || mutationUpdate.isLoading || loadingUpload ? <Layouts.Loading /> : null}

            <Layouts.Breadcrumb page="users" sub="update" />
            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col w-full px-4 py-16 mb-12 bg-white rounded-md shadow-md sm:px-6 md:px-8 lg:px-10">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="w-full px-4 py-8 mx-auto space-y-6 border lg:w-3/5 sm:px-6 md:px-8 lg:px-10">
                            <div className="flex items-center">
                                <label className="w-1/4 text-sm text-gray-600">Avatar</label>
                                <div className="flex flex-1 gap-4">
                                    <div className="relative flex">
                                        <img
                                            src={user.avatar}
                                            alt=""
                                            className="w-20 h-20 p-2 border border-gray-500 rounded-full"
                                        />
                                        <label className="absolute bottom-0 flex items-center p-2 -mr-3 text-white bg-black rounded-full cursor-pointer -right-3 opacity-60">
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(event) => uploadPhoto(event)}
                                            />
                                            <img src="/icon/UpLoadImageIcon.png" className="w-8 h-8" alt="" />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center">
                                    <label className="w-1/4 text-sm text-gray-600">FullName</label>
                                    <input
                                        {...register('fullName')}
                                        className="flex-1 pl-4"
                                        type="text"
                                        name="fullName"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="flex items-end justify-end w-full">
                                    {errors?.fullName && (
                                        <p className="w-3/4 mt-2 text-sm italic text-red-600 capitalize">
                                            {errors.fullName.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center">
                                <label className="w-1/4 text-sm text-gray-600">E-Mail Address:</label>
                                <input
                                    className="flex-1 pl-4 bg-gray-100"
                                    type="email"
                                    value={user.email}
                                    readOnly
                                    name="email"
                                    placeholder="your@mail.com"
                                />
                            </div>

                            <div>
                                <div className="flex items-center">
                                    <label className="w-1/4 text-sm text-gray-600">Phone Number</label>
                                    <input
                                        {...register('phoneNumber')}
                                        className="flex-1 pl-4"
                                        type="text"
                                        name="phoneNumber"
                                        placeholder="Your phone number"
                                    />
                                </div>
                                <div className="flex items-end justify-end w-full">
                                    {errors?.phoneNumber && (
                                        <p className="w-3/4 mt-2 text-sm italic text-red-600 capitalize">
                                            {errors.phoneNumber.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center">
                                    <label className="w-1/4 text-sm text-gray-600">Address</label>
                                    <input
                                        {...register('address')}
                                        className="flex-1 pl-4"
                                        type="text"
                                        name="address"
                                        placeholder="Your Address"
                                    />
                                </div>
                                <div className="flex items-end justify-end w-full">
                                    {errors?.address && (
                                        <p className="w-3/4 mt-2 text-sm italic text-red-600 capitalize">
                                            {errors.address.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex w-full">
                                <div className="w-1/4"></div>
                                <Link
                                    to={`/users/updatePassword/${id}`}
                                    className="text-blue-500 underline cursor-pointer"
                                >
                                    Change Password
                                </Link>
                            </div>
                            <div className="flex items-end justify-end w-full">
                                <button
                                    disabled={!isValid}
                                    type="submit"
                                    className="flex items-center justify-center w-3/4 py-2 text-base text-white bg-blue-600 rounded hover:bg-blue-700"
                                >
                                    <span className="uppercase">Update</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
