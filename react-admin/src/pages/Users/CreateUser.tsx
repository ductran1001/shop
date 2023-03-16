import React from 'react';
import { IError } from 'interfaces';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Layouts from 'components/Layouts';
import * as Utils from 'utils';
import * as Apis from 'api';

export const CreateUser = () => {
    const [avatar, setAvatar] = React.useState<string>('/avatar_default.png');
    const navigate = useNavigate();
    const [loadingUpload, setLoadingUpload] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty, isValid },
    } = useForm<Apis.IFormUserCreate>({
        resolver: yupResolver(Utils.createUserSchema),
        mode: 'onChange',
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
    //             setAvatar(data.data.publicUrl[0]);
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

                data.secure_url && setAvatar(data.secure_url);
            } catch (error) {
                setLoadingUpload(false);

                const mgs = ((error as AxiosError).response?.data as IError)?.message ?? 'Something went wrong!';
                toast.error(mgs);
            }
        }
    };

    const mutationCreate = useMutation({ mutationFn: (body: Apis.IFormUserCreate) => Apis.createUser(body) });

    const onSubmit = async (data: Apis.IFormUserCreate) => {
        const newData = { ...data, avatar: avatar };
        mutationCreate.mutate(newData, {
            onSuccess: () => {
                toast.success('Create Success');
                navigate('/users');
            },
            onError(error) {
                const mgs = ((error as AxiosError).response?.data as IError).message ?? 'Something went wrong!';
                toast.error(mgs);
            },
        });
    };

    return (
        <div className="flex flex-col h-full gap-10 px-4 pt-12">
            {mutationCreate.isLoading || loadingUpload ? <Layouts.Loading /> : null}
            <Layouts.Breadcrumb page="users" sub="create" />

            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col w-full px-4 py-16 mb-12 bg-white rounded-md shadow-md sm:px-6 md:px-8 lg:px-10">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="w-full px-4 py-8 mx-auto space-y-6 border lg:w-3/5 sm:px-6 md:px-8 lg:px-10">
                            <div className="flex items-center">
                                <label className="w-1/4 text-sm text-gray-600">Avatar</label>
                                <div className="flex flex-1 gap-4">
                                    <div className="relative flex">
                                        <img
                                            src={avatar}
                                            alt=""
                                            className="w-20 h-20 p-2 border border-gray-500 rounded-full"
                                        />
                                        <label className="absolute bottom-0 flex items-center p-2 -mr-3 text-white bg-black rounded-full cursor-pointer -right-3 opacity-60">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
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

                            <div>
                                <div className="flex items-center">
                                    <label className="w-1/4 text-sm text-gray-600">E-Mail Address:</label>
                                    <input
                                        {...register('email')}
                                        className="flex-1 pl-4"
                                        type="email"
                                        name="email"
                                        placeholder="your@mail.com"
                                    />
                                </div>
                                <div className="flex items-end justify-end w-full">
                                    {errors?.email && (
                                        <p className="w-3/4 mt-2 text-sm italic text-red-600 capitalize">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>
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
                            <div>
                                <div className="flex items-center">
                                    <label className="w-1/4 text-sm text-gray-600">Password</label>
                                    <input
                                        {...register('password')}
                                        className="flex-1 pl-4"
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="flex items-end justify-end w-full">
                                    {errors?.password && (
                                        <p className="w-3/4 mt-2 text-sm italic text-red-600 capitalize">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center">
                                    <label className="w-1/4 text-sm text-gray-600">Confirm Password</label>
                                    <input
                                        {...register('confirm')}
                                        className="flex-1 pl-4"
                                        type="password"
                                        name="confirm"
                                        placeholder="Confirm Password"
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="flex items-end justify-end w-full">
                                    {errors?.confirm && (
                                        <p className="w-3/4 mt-2 text-sm italic text-red-600 capitalize">
                                            {errors.confirm.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-end justify-end w-full">
                                <button
                                    disabled={!isDirty || !isValid}
                                    className="flex items-center justify-center w-3/4 py-2 text-base text-white bg-blue-600 rounded hover:bg-blue-700"
                                >
                                    <span className="uppercase">Submit</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
