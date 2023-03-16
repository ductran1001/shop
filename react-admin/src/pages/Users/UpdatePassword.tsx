import { IError } from 'interfaces';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Layouts from 'components/Layouts';
import * as Utils from 'utils';
import * as Apis from 'api';

export const UpdatePassword = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty, isValid },
    } = useForm<Apis.IFormUserUpdate>({
        resolver: yupResolver(Utils.updateUserPasswordSchema),
        mode: 'onChange',
        resetOptions: {
            keepDirtyValues: true, // user-interacted input will be retained
        },
    });

    const onSubmit = async (data: Apis.IFormUserUpdate) => {
        const dataRequest = {
            password: data.password,
            newPass: data.newPass,
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

    return (
        <div className="flex flex-col gap-10 h-full pt-12 px-4">
            {mutationUpdate.isLoading ? <Layouts.Loading /> : null}

            <Layouts.Breadcrumb page="users" sub="update" />
            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col mb-12 bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-16 rounded-md w-full">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="lg:w-3/5 w-full border py-8 px-4 sm:px-6 md:px-8 lg:px-10 mx-auto space-y-6">
                            <div>
                                <div className="flex items-center">
                                    <label className="w-1/4 text-sm text-gray-600">Old Password</label>
                                    <input
                                        {...register('password')}
                                        className="pl-4 flex-1"
                                        type="password"
                                        name="password"
                                        placeholder="Old Password"
                                        autoComplete="off"
                                    />
                                </div>

                                <div className="flex items-end justify-end w-full">
                                    {errors?.password && (
                                        <p className="mt-2 text-sm italic w-3/4 text-red-600 capitalize">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center">
                                    <label className="w-1/4 text-sm text-gray-600">New Password</label>
                                    <input
                                        {...register('newPass')}
                                        className="pl-4 flex-1"
                                        type="password"
                                        name="newPass"
                                        placeholder="New Password"
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="flex items-end justify-end w-full">
                                    {errors?.newPass && (
                                        <p className="mt-2 text-sm italic w-3/4 text-red-600 capitalize">
                                            {errors.newPass.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center">
                                    <label className="w-1/4 text-sm text-gray-600">Confirm Password</label>
                                    <input
                                        {...register('confirm')}
                                        className="pl-4 flex-1"
                                        type="password"
                                        name="confirm"
                                        placeholder="Confirm Password"
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="flex items-end justify-end w-full">
                                    {errors?.confirm && (
                                        <p className="mt-2 text-sm italic w-3/4 text-red-600 capitalize">
                                            {errors.confirm.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-end justify-end w-full">
                                <button
                                    disabled={!isDirty || !isValid}
                                    type="submit"
                                    className="w-3/4 flex items-center justify-center text-white text-base bg-blue-600 hover:bg-blue-700 rounded py-2"
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
