import React from 'react';
import { AxiosError } from 'axios';
import { IError } from 'interfaces';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { IFormCategory, getCategoryById } from 'api/categories.api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Utils from 'utils';
import * as component from 'components/Layouts';
import * as Apis from 'api';

export const UpdateCategory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = React.useState<Apis.IFormCategory>(Utils.initialStateCategoryForm);
    const [errImg, setErrImg] = React.useState('');
    const [errImages, setErrImages] = React.useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<IFormCategory>({
        resolver: yupResolver(Utils.createCategorySchema),
        mode: 'onChange',
        defaultValues: category,
        values: category,
        resetOptions: {
            keepDirtyValues: true, // user-interacted input will be retained
        },
    });
    const uploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const formData = new FormData();

            for (let index = 0; index < files.length; index++) {
                formData.append('images', files[index]);
            }

            mutationUpload.mutate(formData, {
                onSuccess: (data) => {
                    setCategory((prev) => ({
                        ...prev,
                        photos: [...prev.photos, ...data.data.results],
                    }));

                    toast.success('Upload Success');
                },
                onError(error) {
                    const mgs = ((error as AxiosError).response?.data as IError).message ?? 'Something went wrong!';
                    toast.error(mgs);
                },
            });
        }
    };

    const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const formData = new FormData();
            formData.append('images', files[0]);
            mutationUpload.mutate(formData, {
                onSuccess: (data) => {
                    setCategory((prev) => ({ ...prev, image: data.data.results[0] }));
                    toast.success('Upload Success');
                },
                onError(error) {
                    const mgs = ((error as AxiosError).response?.data as IError).message ?? 'Something went wrong!';
                    toast.error(mgs);
                },
            });
        }
    };
    const handleDeleteAvatar = () => setCategory((prev) => ({ ...prev, image: '' }));

    const handleDeletePhoto = (url: string) => {
        setCategory((prev) => ({ ...prev, photos: prev.photos.filter((photo) => photo !== url) }));
    };

    const mutationUpdate = useMutation({
        mutationFn: (body: IFormCategory) => Apis.updateCategory(id as string, body),
    });
    const mutationUpload = useMutation({ mutationFn: (body: FormData) => Apis.upload('category', body) });

    const onSubmit = async (data: IFormCategory) => {
        if (data.image === '') setErrImg('Images is required');
        if (data.photos.length === 0) setErrImages('Images is required');
        else {
            mutationUpdate.mutate(data, {
                onSuccess: () => {
                    toast.success('Update Success');
                    navigate('/categories');
                },
                onError(error) {
                    const mgs = ((error as AxiosError).response?.data as IError).message ?? 'Something went wrong!';
                    toast.error(mgs);
                },
            });
        }
    };

    const queryCategory = useQuery({
        queryKey: ['category', id],
        queryFn: () => getCategoryById(id as string),
        enabled: id !== undefined,
        onSuccess: (data) => {
            setCategory((prevState) => ({ ...prevState, ...data.data.results }));
        },
    });

    if (queryCategory.error) return component.Error((queryCategory.error as AxiosError).message);

    return (
        <div className="flex flex-col h-full gap-10 px-4 pt-12">
            {queryCategory.isLoading || mutationUpdate.isLoading || mutationUpload.isLoading ? (
                <component.Loading />
            ) : null}
            <component.Breadcrumb page="categories" sub="update" />

            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col w-full px-4 py-16 mb-12 bg-white rounded-md shadow-md sm:px-6 md:px-8 lg:px-10">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col w-full gap-2 px-4 py-8 mx-auto space-y-6 border sm:px-6 md:px-8 lg:px-10">
                            <div className="flex w-full gap-6">
                                <div className="flex flex-col w-1/2 gap-4">
                                    <div>
                                        <div className="flex flex-col gap-2 md:flex-row md:items-center">
                                            <LabelItem text="Category Name" />
                                            <input
                                                {...register('name')}
                                                className="flex-1 pl-4"
                                                placeholder="Category Name"
                                                name="name"
                                                type="text"
                                            />
                                        </div>
                                        {errors?.name && <ErrMessage err={errors.name.message as string} />}
                                    </div>

                                    <div>
                                        <div className="flex flex-col gap-2 md:flex-row md:items-center">
                                            <LabelItem text="Position" />
                                            <input
                                                {...register('position')}
                                                className="flex-1 pl-4"
                                                placeholder="Position"
                                                name="position"
                                                type="number"
                                            />
                                        </div>
                                        {errors?.position && <ErrMessage err={errors.position.message as string} />}
                                    </div>

                                    <div>
                                        <div className="flex flex-col gap-2 md:flex-row md:items-center">
                                            <LabelItem text="Description" />
                                            <textarea
                                                {...register('description')}
                                                className="flex-1 pl-4"
                                                placeholder="Description"
                                                name="description"
                                                rows={5}
                                            />
                                        </div>
                                        {errors?.description && (
                                            <ErrMessage err={errors.description.message as string} />
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex flex-col gap-2 md:flex-row md:items-center">
                                            <LabelItem text="Avatar" />
                                            <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center">
                                                <label className="flex flex-col items-center justify-center flex-1 w-full gap-2 pt-5 pb-6 border border-gray-400 rounded-lg cursor-pointer">
                                                    <img src="/icon/UpLoadImageIcon.png" className="w-12 h-12" alt="" />
                                                    <input
                                                        accept="image/*"
                                                        onChange={(event) => uploadAvatar(event)}
                                                        type="file"
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        </div>

                                        {errImg && <ErrMessage err={errImg as string} />}

                                        {category.image ? (
                                            <div className="flex mx-auto my-6 w-32 h-32 justify-center items-center">
                                                <div className="relative">
                                                    <div className="absolute right-0 flex gap-2">
                                                        <label className="p-1 text-white bg-black rounded-full cursor-pointer opacity-80">
                                                            <component.EditIcon />
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={(event) => uploadPhoto(event)}
                                                            />
                                                        </label>

                                                        <label
                                                            onClick={() => handleDeleteAvatar()}
                                                            className="p-1 text-white bg-black rounded-full cursor-pointer opacity-80"
                                                        >
                                                            <component.CloseIcon />
                                                        </label>
                                                    </div>

                                                    <img src={category.image} alt="" />
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>

                                    <div>
                                        <div className="flex flex-col gap-2 md:flex-row md:items-center">
                                            <LabelItem text="Active" />
                                            <div className="flex flex-1 gap-4 font-normal text-gray-900">
                                                <div
                                                    onClick={() => setCategory((prev) => ({ ...prev, active: true }))}
                                                    className="flex gap-2 cursor-pointer"
                                                >
                                                    <label className="flex items-center w-6 h-6 border border-gray-400">
                                                        {category.active && <img src="/icon/CheckIcon.png" alt="" />}
                                                    </label>
                                                    <div>Active</div>
                                                </div>
                                                <div
                                                    onClick={() => setCategory((prev) => ({ ...prev, active: false }))}
                                                    className="flex gap-2 cursor-pointer"
                                                >
                                                    <label className="flex items-center w-6 h-6 border border-gray-400">
                                                        {!category.active && <img src="/icon/x-icon.png" alt="" />}
                                                    </label>
                                                    <div>Inactive</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col w-1/2 gap-4 px-6 border-l border-gray-200">
                                    <div className="w-20 h-20 mx-auto">
                                        <img src="/icon/Sliders.png" alt="" />
                                    </div>
                                    <div>
                                        <div className="flex flex-col gap-2 md:flex-row md:items-center">
                                            <label className="flex flex-col items-center justify-center flex-1 w-full gap-2 pt-5 pb-6 border border-gray-400 rounded-lg cursor-pointer">
                                                <img src="/icon/UpLoadImageIcon.png" className="w-12 h-12" alt="" />
                                                <p className="mb-2 text-xs text-gray-500 md:text-base">
                                                    <span className="font-semibold">Click to upload</span> or drag and
                                                    drop
                                                </p>
                                                <span className="hidden text-sm text-gray-500 md:block">
                                                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                                                </span>
                                                <input
                                                    accept="image/*"
                                                    onChange={(event) => uploadPhoto(event)}
                                                    type="file"
                                                    multiple
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>

                                        {errImages && <ErrMessage err={errImages as string} />}
                                    </div>

                                    {category.photos.length > 0 ? (
                                        <div className="grid grid-cols-4 gap-2">
                                            {category.photos.map((photo, index) => (
                                                <div key={index} className="relative">
                                                    <div className="absolute right-0 flex gap-2">
                                                        <label className="p-1 text-white bg-black rounded-full cursor-pointer opacity-80">
                                                            <component.EditIcon />
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={(event) => uploadPhoto(event)}
                                                            />
                                                        </label>

                                                        <label
                                                            onClick={() => handleDeletePhoto(photo)}
                                                            className="p-1 text-white bg-black rounded-full cursor-pointer opacity-80"
                                                        >
                                                            <component.CloseIcon />
                                                        </label>
                                                    </div>

                                                    <img src={photo} alt="" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                            <button
                                disabled={!isValid}
                                type="submit"
                                className="flex items-center justify-center w-1/2 py-2 text-base text-white bg-blue-600 rounded hover:bg-blue-700"
                            >
                                <span className="uppercase">Submit</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
const LabelItem = ({ text }: { text: string }) => (
    <label className="w-full text-sm font-medium text-gray-900 uppercase md:w-1/4">{text}</label>
);

const ErrMessage = ({ err }: { err: string }) => (
    <div className="flex items-end justify-end w-full">
        <p className="w-full mt-2 text-sm italic text-red-600 capitalize md:w-3/4">{err}</p>
    </div>
);
