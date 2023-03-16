import { AxiosError } from 'axios';
import { IError } from 'interfaces';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Layouts from 'components/Layouts';
import * as Utils from 'utils';
import * as Apis from 'api';

export const Register = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty, isValid },
    } = useForm<Apis.IAuth>({
        resolver: yupResolver(Utils.registerSchema),
        mode: 'onChange',
        defaultValues: Utils.initialStateRegisterForm,
        resetOptions: {
            keepDirtyValues: true, // user-interacted input will be retained
        },
    });

    const onSubmit = async (data: Apis.IAuth) => {
        mutationRegister.mutate(data, {
            onSuccess: () => {
                navigate('/login');
            },
            onError(error) {
                const mgs = ((error as AxiosError).response?.data as IError).message ?? 'Something went wrong!';
                toast.error(mgs);
            },
        });
    };

    const mutationRegister = useMutation({ mutationFn: (body: Apis.IAuth) => Apis.registerUser(body) });

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {mutationRegister.isLoading ? <Layouts.Loading /> : null}

            <div className="flex flex-col w-full max-w-md px-4 py-8 bg-white rounded-md shadow-md sm:px-6 md:px-8 lg:px-10">
                <div className="self-center text-xl font-medium text-gray-800 uppercase sm:text-2xl">
                    Register An Account
                </div>
                <div className="mt-10">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col mb-6">
                            <label htmlFor="fullName" className="mb-1 text-xs tracking-wide text-gray-600 sm:text-sm">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute top-0 left-0 inline-flex items-center justify-center w-10 h-full text-gray-400">
                                    <img src="/icon/userLogin.png" alt="" className="w-6 h-6" />
                                </div>
                                <input
                                    {...register('fullName')}
                                    className="pl-10"
                                    type="text"
                                    name="fullName"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="flex w-full">
                                {errors?.fullName && (
                                    <p className="w-full mt-2 text-sm italic text-red-600 capitalize">
                                        {errors.fullName.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col mb-6">
                            <label htmlFor="email" className="mb-1 text-xs tracking-wide text-gray-600 sm:text-sm">
                                E-Mail Address:
                            </label>
                            <div className="relative">
                                <div className="absolute top-0 left-0 inline-flex items-center justify-center w-10 h-full text-gray-400">
                                    <img src="/icon/Email.png" alt="" className="w-6 h-6" />
                                </div>
                                <input
                                    {...register('email')}
                                    className="pl-10"
                                    type="email"
                                    name="email"
                                    placeholder="your@mail.com"
                                />
                            </div>
                            <div className="flex w-full">
                                {errors?.email && (
                                    <p className="w-full mt-2 text-sm italic text-red-600 capitalize">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col mb-6">
                            <label htmlFor="password" className="mb-1 text-xs tracking-wide text-gray-600 sm:text-sm">
                                Password:
                            </label>
                            <div className="relative">
                                <div className="absolute top-0 left-0 inline-flex items-center justify-center w-10 h-full text-gray-400">
                                    <img src="/icon/Password.png" className="w-6 h-6" alt="" />
                                </div>
                                <input
                                    {...register('password')}
                                    className="pl-10"
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    autoComplete="off"
                                />
                            </div>
                            <div className="flex w-full">
                                {errors?.password && (
                                    <p className="w-full mt-2 text-sm italic text-red-600 capitalize">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex w-full">
                            <button
                                disabled={!isDirty || !isValid}
                                type="submit"
                                className="flex items-center justify-center w-full py-2 text-sm text-white transition duration-150 ease-in bg-blue-600 rounded focus:outline-none sm:text-base hover:bg-blue-700"
                            >
                                <span className="mr-2 uppercase">Register</span>
                            </button>
                        </div>
                    </form>
                </div>
                <div className="flex items-center justify-center mt-6">
                    <Link
                        to="/login"
                        className="inline-flex items-center text-sm font-bold text-center text-blue-500 hover:text-blue-700"
                    >
                        <span className="ml-2">Already have an account? Log in</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};
