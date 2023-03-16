import React from 'react';
import axios, { AxiosError } from 'axios';
import { ICategory, IError } from 'interfaces';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { nanoid } from 'nanoid';
import * as Layouts from 'components/Layouts';
import * as Utils from 'utils';
import * as Apis from 'api';
// import axios from 'axios';

interface IVariant {
    id?: string;
    color: string;
    price: number | string;
    promotion: number | string;
    quantity: number | string;
}

const defaultVariants = {
    color: '',
    price: 1,
    promotion: 0,
    quantity: 1,
};

export const CreateProduct = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);
    const [product, setProduct] = React.useState<Apis.IFormProduct>(Utils.initialStateProductForm);
    const [variantState, setVariant] = React.useState<IVariant>(defaultVariants);

    const [categories, setCategories] = React.useState<Array<ICategory>>([]);

    const [errCategory, setErrCategory] = React.useState(false);
    const [errImg, setErrImg] = React.useState(false);
    const [errVariant, setErrVariant] = React.useState(false);
    const [modeEditVariant, setModeEditVariant] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<Apis.IFormProduct>({
        resolver: yupResolver(Utils.productSchema),
        mode: 'onChange',
        defaultValues: product,
        values: product,
        resetOptions: {
            keepDirtyValues: true, // user-interacted input will be retained
        },
    });

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setVariant((prevState: any) => ({ ...prevState, [event.target.name]: event.target.value }));
    };

    const handleSelectChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setProduct((prevState) => ({ ...prevState, [event.target.name]: event.target.value }));
    };

    const handleSetAvatar = (link: string) => {
        setProduct((prevState) => ({
            ...prevState,
            imageURL: [...prevState.imageURL.filter((photo) => photo !== link)],
        }));
        setProduct((prevState) => ({ ...prevState, imageURL: [link, ...prevState.imageURL] }));
    };

    const uploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>, imgEdit?: string) => {
        const { files } = event.target;
        if (files) {
            const formData = new FormData();
            for (let i = 0; i < (files as FileList).length; i++) {
                formData.append('images', (files as FileList)[i]);
            }
            mutationUpload.mutate(formData, {
                onSuccess: (data) => {
                    const newItems = imgEdit
                        ? product.imageURL.map((item) => (item === imgEdit ? data.data.results[0] : item))
                        : [];
                    imgEdit
                        ? setProduct((prev) => ({ ...prev, imageURL: newItems }))
                        : setProduct((prev) => ({ ...prev, imageURL: [...prev.imageURL, ...data.data.results] }));
                    toast.success('Upload Success');
                },
                onError(error) {
                    const mgs = ((error as AxiosError).response?.data as IError).message ?? 'Something went wrong!';
                    toast.error(mgs);
                },
            });
        }
    };

    const handleDelete = (url: string) => {
        const arr = product.imageURL;
        const newArr = arr.filter((item) => item !== url);
        setProduct((prev) => ({ ...prev, imageURL: newArr }));
    };

    const mutationCreate = useMutation({ mutationFn: (body: Apis.IFormProduct) => Apis.createProduct(body) });
    const mutationUpload = useMutation({ mutationFn: (body: FormData) => Apis.upload('products', body) });

    const onSubmit = async (data: Apis.IFormProduct) => {
        data.category === '' || data.category === 'DEFAULT' ? setErrCategory(true) : setErrCategory(false);
        data.imageURL.length === 0 ? setErrImg(true) : setErrImg(false);
        data.variant.length === 0 ? setErrVariant(true) : setErrVariant(false);

        const newData = {
            ...data,
            user: user?._id,
        } as Apis.IFormProduct;
        const isOk =
            data.category !== '' &&
            data.category !== 'DEFAULT' &&
            data.imageURL.length !== 0 &&
            data.variant.length !== 0;
        if (isOk) {
            mutationCreate.mutate(newData, {
                onSuccess: () => {
                    toast.success('Create Success');
                    navigate('/products');
                    axios.get('https://shop-next-sooty.vercel.app/api/revalidate-home?secret=secret');
                },
                onError(error) {
                    const mgs = ((error as AxiosError).response?.data as IError).message ?? 'Something went wrong!';
                    toast.error(mgs);
                },
            });
        }
    };

    const queryCategories = useQuery({
        queryKey: ['categories'],
        queryFn: () => Apis.getListCategories(undefined, undefined, false),
        onSuccess: (data) => setCategories(data.data.results),
    });

    const handleAddProperty = () => {
        const arr: any = [];
        variantState.id = nanoid();
        arr.push(variantState);
        setVariant(defaultVariants);

        setProduct((prevState) => ({ ...prevState, variant: [...prevState.variant, ...arr] }));
    };

    const editVariant = (id: string) => {
        const item = product.variant.filter((variant) => variant.id === id);
        setVariant(item[0]);
        setModeEditVariant(true);
    };

    const updateVariant = () => {
        const arr: any = [];
        arr.push(variantState);

        setProduct((prevState: any) => ({
            ...prevState,
            variant: [...prevState.variant.map((item: any) => (item.id === arr[0]?.id ? arr[0] : item))],
        }));

        setVariant(defaultVariants);
        setModeEditVariant(false);
    };

    const deleteVariant = (id: string) => {
        const newVariant = product.variant.filter((item: any) => item.id !== id);
        setProduct((prevState: any) => ({
            ...prevState,
            variant: [...newVariant],
        }));
    };
    const isLoad = queryCategories.isLoading || mutationCreate.isLoading || mutationUpload.isLoading;
    return (
        <div className="flex flex-col h-full gap-10 px-4 pt-12">
            {isLoad ? <Layouts.Loading /> : null}

            <Layouts.Breadcrumb sub="create" page="products" />
            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col w-full px-4 pt-8 pb-16 mb-12 bg-white rounded-md shadow-md sm:px-6 md:px-8 lg:px-10">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex w-full gap-12 px-6 py-8 mx-auto border">
                            <div className="w-3/5 space-y-6 ">
                                <div className="flex flex-col">
                                    <div className="flex items-center">
                                        <label className="w-1/4 text-sm font-medium text-gray-900 uppercase">
                                            name
                                        </label>
                                        <input
                                            {...register('name')}
                                            className="flex-1 pl-4"
                                            type="text"
                                            name="name"
                                            placeholder="Product Name"
                                        />
                                    </div>
                                    {errors?.name && <ErrMess message={errors.name.message as string} />}
                                </div>

                                <div className="flex flex-col">
                                    <div className="flex items-center">
                                        <label className="w-1/4 text-sm font-medium text-gray-900 uppercase">
                                            description
                                        </label>
                                        <textarea
                                            {...register('description')}
                                            className="flex-1 pl-4"
                                            name="description"
                                            placeholder="Product Description"
                                            rows={5}
                                        />
                                    </div>
                                    {errors?.description && <ErrMess message={errors.description.message as string} />}
                                </div>

                                <div className="flex flex-col">
                                    <div className="flex items-center">
                                        <label className="w-1/4 text-sm font-medium text-gray-900 uppercase">
                                            category
                                        </label>

                                        {queryCategories.error ? (
                                            <div className="text-red-500">
                                                An error has occurred:
                                                {(queryCategories.error as AxiosError).message}
                                            </div>
                                        ) : (
                                            categories.length > 0 && (
                                                <select
                                                    defaultValue={product.category ?? ''}
                                                    name="category"
                                                    className="pl-4 flex-1 focus:outline-none bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                                                    onChange={(event) => handleSelectChange(event)}
                                                >
                                                    <option value="DEFAULT">Choose a category</option>
                                                    {categories.map((category, index) => (
                                                        <option value={category._id} key={index}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            )
                                        )}
                                    </div>

                                    {errCategory && <ErrMess message="Category is required" />}
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center">
                                        <label className="w-1/4 text-sm font-medium text-gray-900 uppercase">
                                            Images
                                        </label>

                                        <label className="flex flex-col items-center justify-center flex-1 pt-5 pb-6 border border-gray-400 rounded-lg cursor-pointer">
                                            <img src="/icon/UpLoadImageIcon.png" className="w-16 h-16" alt="" />

                                            <p className="mb-2 text-xs text-gray-500 md:text-base">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="hidden text-sm text-gray-500 md:block dark:text-gray-400">
                                                SVG, PNG, JPG or GIF (MAX. 800x400px)
                                            </p>
                                            <input
                                                onChange={(event) => uploadPhoto(event)}
                                                id="dropzone-file"
                                                accept="image/*"
                                                type="file"
                                                multiple
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                    {errImg && <ErrMess message="Images is required" />}
                                </div>
                                <div className="flex items-center justify-end">
                                    <div className="grid w-3/4 grid-cols-2 gap-4 lg:grid-cols-3">
                                        {product.imageURL.length > 0 &&
                                            product.imageURL.map((img, index) => (
                                                <div key={index} className="relative h-40">
                                                    <div className="absolute top-0 right-0 flex gap-1 mt-2">
                                                        <label
                                                            onClick={() => handleSetAvatar(img)}
                                                            className="p-1.5 text-white bg-black rounded-full cursor-pointer opacity-80"
                                                        >
                                                            <Layouts.StarIcon />
                                                        </label>

                                                        <label className="p-1.5 text-white bg-black rounded-full cursor-pointer opacity-80">
                                                            <Layouts.EditIcon />
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                onChange={(event) => uploadPhoto(event, img)}
                                                            />
                                                        </label>
                                                        <label
                                                            onClick={() => handleDelete(img)}
                                                            className="p-1.5 text-white bg-black rounded-full cursor-pointer opacity-80"
                                                        >
                                                            <Layouts.CloseIcon />
                                                        </label>
                                                    </div>

                                                    <img className="w-full h-full rounded-lg" src={img} alt="" />
                                                </div>
                                            ))}
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <label className="w-1/4 text-sm font-medium text-gray-900 uppercase">Active</label>
                                    <div className="flex flex-1 gap-4 font-normal text-gray-900">
                                        <div
                                            onClick={() => setProduct((prev) => ({ ...prev, active: true }))}
                                            className="flex gap-2 cursor-pointer"
                                        >
                                            <label className="flex items-center w-6 h-6 border border-gray-400">
                                                {product.active && <img src="/icon/CheckIcon.png" alt="" />}
                                            </label>
                                            <div>Active</div>
                                        </div>
                                        <div
                                            onClick={() => setProduct((prev) => ({ ...prev, active: false }))}
                                            className="flex gap-2 cursor-pointer"
                                        >
                                            <label className="flex items-center w-6 h-6 border border-gray-400">
                                                {!product.active && <img src="/icon/x-icon.png" alt="" />}
                                            </label>
                                            <div>Inactive</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-end justify-end w-full">
                                    <button
                                        disabled={!isValid}
                                        type="submit"
                                        className="flex items-center justify-center w-3/4 py-2 text-base text-white bg-blue-600 rounded hover:bg-blue-700"
                                    >
                                        <span className="uppercase">submit</span>
                                    </button>
                                </div>
                            </div>
                            <div className="w-2/5 pl-8 border-l border-gray-300">
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex gap-2">
                                            <label className="w-32 text-sm font-medium text-gray-900 uppercase">
                                                price
                                            </label>
                                            <input
                                                min={variantState.price}
                                                name="price"
                                                value={variantState.price}
                                                onChange={(event) => handleInputChange(event)}
                                                className="flex-1 pl-4"
                                                placeholder="Product Price"
                                                type="number"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <label className="w-32 text-sm font-medium text-gray-900 uppercase">
                                                color
                                            </label>
                                            <input
                                                name="color"
                                                value={variantState.color}
                                                onChange={(event) => handleInputChange(event)}
                                                className="flex-1 pl-4"
                                                placeholder="Product color"
                                                type="text"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <label className="w-32 text-sm font-medium text-gray-900 uppercase">
                                                promotion
                                            </label>
                                            <input
                                                min={variantState.promotion}
                                                name="promotion"
                                                value={variantState.promotion}
                                                onChange={(event) => handleInputChange(event)}
                                                className="flex-1 pl-4"
                                                placeholder="Product promotion"
                                                type="number"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <label className="w-32 text-sm font-medium text-gray-900 uppercase">
                                                quantity
                                            </label>
                                            <input
                                                min={variantState.quantity}
                                                value={variantState.quantity}
                                                name="quantity"
                                                onChange={(event) => handleInputChange(event)}
                                                className="flex-1 pl-4"
                                                placeholder="Product quantity"
                                                type="number"
                                            />
                                        </div>

                                        {errVariant && (
                                            <ErrMess message="Variant is required ! Click add property to create variant" />
                                        )}

                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <span className="w-32 text-sm font-medium text-gray-900 uppercase">
                                                    Property
                                                </span>
                                                {modeEditVariant && (
                                                    <span
                                                        onClick={() => updateVariant()}
                                                        className="cursor-pointer px-2.5 text-sm py-1.5 bg-yellow-300 text-white"
                                                    >
                                                        Update
                                                    </span>
                                                )}
                                            </div>

                                            {product.variant.map((variant, index) => (
                                                <div
                                                    key={index}
                                                    className="px-2 py-1.5 bg-red-200 flex gap-2 flex-1 text-sm"
                                                >
                                                    <div className="flex flex-col flex-1">
                                                        <span>
                                                            Price:
                                                            {variant.price === '' ? 'null' : variant.price}
                                                        </span>
                                                        <span>
                                                            Color: {variant.color === '' ? 'null' : variant.color}
                                                        </span>
                                                        <span>
                                                            Promotion:
                                                            {variant.promotion === '' ? 'null' : variant.promotion}
                                                        </span>
                                                        <span>
                                                            Quantity:
                                                            {variant.quantity === '' ? 'null' : variant.quantity}
                                                        </span>
                                                        <span className="hidden">id : {variant.id}</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <span
                                                            className="cursor-pointer"
                                                            onClick={() => editVariant(variant.id as string)}
                                                        >
                                                            <img
                                                                src="/icon/edit-color.png"
                                                                className="w-4 h-5"
                                                                alt=""
                                                            />
                                                        </span>
                                                        <span
                                                            className="cursor-pointer"
                                                            onClick={() => deleteVariant(variant.id as string)}
                                                        >
                                                            <img src="/icon/delete.png" className="w-5 h-5" alt="" />
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col flex-1 gap-4">
                                        <button
                                            onClick={() => handleAddProperty()}
                                            className="flex items-center justify-center gap-0.5 px-4 py-2.5 bg-teal-400 text-white"
                                            type="button"
                                        >
                                            <span className="text-2xl">+</span>
                                            <span>Add Property</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const ErrMess = ({ message }: { message: string }) => (
    <div className="flex items-end justify-end w-full">
        <p className="w-full mt-2 text-sm italic text-red-600 capitalize sm:w-3/4">{message}</p>
    </div>
);
