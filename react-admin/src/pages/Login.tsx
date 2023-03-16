import { AxiosError } from 'axios';
import { IError } from 'interfaces';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import * as Layouts from 'components/Layouts';
import * as utils from 'utils';
import * as Apis from 'api';

export const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<Apis.IAuth>({
        resolver: yupResolver(utils.loginSchema),
        mode: 'onChange',
        defaultValues: utils.initialStateLoginForm,
        resetOptions: {
            keepDirtyValues: true, // user-interacted input will be retained
        },
    });

    const onSubmit = async (data: Apis.IAuth) => {
        mutationLogin.mutate(data, {
            onSuccess: async () => {
                const response = await Apis.getUserApi(dispatch);
                if (response?.status === 200) navigate('/dashboard');
            },
            onError(error) {
                const mgs = ((error as AxiosError).response?.data as IError).message ?? 'Something went wrong!';
                toast.error(mgs);
            },
        });
    };

    const mutationLogin = useMutation({ mutationFn: (body: Apis.IAuth) => Apis.loginUser(body) });

    return (
        <div className="flex flex-col items-center justify-center h-full gap-10 px-4 pt-12">
            {mutationLogin.isLoading ? <Layouts.Loading /> : null}

            <div className="flex flex-col w-full max-w-md px-4 py-8 bg-white rounded-md shadow-md sm:px-6 md:px-8 lg:px-10">
                <div className="self-center text-xl font-medium text-gray-800 uppercase sm:text-2xl">
                    Login To Your Account
                </div>
                <div className="mt-10">
                    <form onSubmit={handleSubmit(onSubmit)}>
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
                                disabled={!isValid}
                                type="submit"
                                className="flex items-center justify-center w-full py-2 text-sm text-white transition duration-150 ease-in bg-blue-600 rounded focus:outline-none sm:text-base hover:bg-blue-700"
                            >
                                <span className="mr-2 uppercase">Login</span>
                            </button>
                        </div>
                    </form>
                </div>
                <div className="flex items-center justify-center mt-6">
                    <Link
                        to="/register"
                        className="inline-flex items-center text-sm font-bold text-center text-blue-500 hover:text-blue-700"
                    >
                        <img src="/icon/add-user.png" alt="add-user" className="w-7 h-7" />
                        <span className="ml-2">You don't have an account?</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};
