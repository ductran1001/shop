import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { IError } from 'interfaces';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Layouts from 'components/Layouts';
import * as Utils from 'utils';
import * as Apis from 'api';

export const CreateColor = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm<Apis.IFormColor>({
        resolver: yupResolver(Utils.createColorSchema),
        mode: 'onChange',
    });

    const onSubmit = async (data: Apis.IFormColor) => {
        mutationCreate.mutate(data, {
            onSuccess: () => {
                toast.success('Create Success');
                reset();
            },
            onError(error) {
                const mgs = ((error as AxiosError).response?.data as IError).message ?? 'Something went wrong!';
                toast.error(mgs);
            },
        });
    };
    const mutationCreate = useMutation({ mutationFn: (body: Apis.IFormColor) => Apis.createColor(body) });

    return (
        <div className="flex flex-col gap-10 h-full pt-12 px-4">
            {mutationCreate.isLoading ? <Layouts.Loading /> : null}
            <Layouts.Breadcrumb page="colors" sub="create" />
            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col mb-12 bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-16 rounded-md w-full">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="lg:w-3/5 w-full border py-8 px-4 sm:px-6 md:px-8 lg:px-10 mx-auto space-y-6">
                            <div>
                                <div className="flex md:flex-row md:items-center flex-col gap-2">
                                    <label className="md:w-1/4 w-full uppercase text-sm font-medium text-gray-900">
                                        Title
                                    </label>
                                    <input
                                        {...register('title')}
                                        className="pl-4 flex-1"
                                        placeholder="Title"
                                        name="title"
                                        type="text"
                                    />
                                </div>
                                <div className="flex items-end justify-end w-full">
                                    {errors?.title && (
                                        <p className="mt-2 text-sm italic md:w-3/4 w-full text-red-600 capitalize">
                                            {errors.title.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <div className="flex md:flex-row md:items-center flex-col gap-2">
                                    <label className="md:w-1/4 w-full uppercase text-sm font-medium text-gray-900">
                                        Code
                                    </label>
                                    <input {...register('code')} className="h-10 flex-1" name="code" type="color" />
                                </div>
                                <div className="flex items-end justify-end w-full">
                                    {errors?.code && (
                                        <p className="mt-2 text-sm italic md:w-3/4 w-full text-red-600 capitalize">
                                            {errors.code.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-end justify-end w-full">
                                <button
                                    disabled={!isValid}
                                    type="submit"
                                    className="w-3/4 flex items-center justify-center text-white text-base bg-blue-600 hover:bg-blue-700 rounded py-2"
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
