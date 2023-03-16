import React from 'react';
import { IError, IProduct, ICategory } from 'interfaces';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import numeral from 'numeral';
import * as Layouts from 'components/Layouts';
import * as Apis from 'api';

interface IProps {
    status: string;
    results: IProduct[];
    count: number;
    totalPages: number;
}

export const ListProduct = () => {
    const navigation = useNavigate();
    const queryClient = useQueryClient();
    const [checked, setChecked] = React.useState<string[]>([]);
    const [categories, setCategories] = React.useState<Array<ICategory>>([]);
    const [linkSearch, setLinkSearch] = React.useState({
        sort: 'asc',
        categoryLink: 'default',
    });

    const { search } = useLocation();
    const getCatUrl = search?.split('&')[1]?.replace('category=', '');

    const getSortUrl = search?.split('&')[2]?.replace('sort=', '');

    React.useEffect(() => {
        getCatUrl
            ? setLinkSearch((prevState) => ({ ...prevState, categoryLink: getCatUrl }))
            : setLinkSearch((prevState) => ({ ...prevState, categoryLink: 'default' }));

        getSortUrl
            ? setLinkSearch((prevState) => ({ ...prevState, sort: getSortUrl }))
            : setLinkSearch((prevState) => ({ ...prevState, sort: 'asc' }));
    }, [getCatUrl, getSortUrl]);

    const getPageUrl = search?.split('&')[0] || '?page=1';

    const PAGE = Number(getPageUrl.split('=')[1]) || 1;
    const LIMIT = 10;

    const softDelete = Boolean(useLocation().pathname.includes('/trash'));

    const handleDelete = async (id: string) => {
        mutationDelete.mutate(id, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: [
                        softDelete ? 'products-trash' : 'products',
                        'type',
                        'category',
                        PAGE,
                        linkSearch.sort,
                        linkSearch.categoryLink,
                    ],
                    exact: true,
                });
                toast.success('Delete Success');
                axios.get('https://shop-next-sooty.vercel.app/api/revalidate-home?secret=secret');
            },
            onError(error) {
                const mgs = ((error as AxiosError).response?.data as IError).message ?? 'Something went wrong!';
                toast.error(mgs);
            },
        });
    };

    const handleCheckbox = (id: string) => {
        checked.includes(id) ? setChecked(checked.filter((data) => data !== id)) : setChecked([...checked, id]);
    };

    const handleCheckboxAll = (arrayId: string[], event: React.ChangeEvent<HTMLInputElement>) => {
        event?.target.checked ? setChecked(arrayId) : setChecked([]);
    };

    const handleDeleteMulti = async (item: string[]) => {
        if (item.length > 0) {
            mutationDeleteMulti.mutate(item, {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: [
                            softDelete ? 'products-trash' : 'products',
                            'type',
                            'category',
                            PAGE,
                            linkSearch.sort,
                            linkSearch.categoryLink,
                        ],
                        exact: true,
                    });
                    toast.success('Delete Success');
                    setChecked([]);
                    axios.get('https://shop-next-sooty.vercel.app/api/revalidate-home?secret=secret');
                },
                onError(error) {
                    const mgs = ((error as AxiosError).response?.data as IError).message ?? 'Something went wrong!';
                    toast.error(mgs);
                },
            });
        }
    };

    const handleDeleteMultiTrash = async (item: string[]) => {
        if (item.length > 0) {
            mutationDeleteMultiTrash.mutate(item, {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: [
                            softDelete ? 'products-trash' : 'products',
                            'type',
                            'category',
                            PAGE,
                            linkSearch.sort,
                            linkSearch.categoryLink,
                        ],
                        exact: true,
                    });
                    toast.success('Delete Trash Success');
                    setChecked([]);
                    axios.get('https://shop-next-sooty.vercel.app/api/revalidate-home?secret=secret');
                },
                onError(error) {
                    const mgs = ((error as AxiosError).response?.data as IError).message ?? 'Something went wrong!';
                    toast.error(mgs);
                },
            });
        }
    };

    const handleRestoreMulti = async (item: string[]) => {
        if (item.length > 0) {
            mutationRestoreMulti.mutate(item, {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: [
                            softDelete ? 'products-trash' : 'products',
                            'type',
                            'category',
                            PAGE,
                            linkSearch.sort,
                            linkSearch.categoryLink,
                        ],
                        exact: true,
                    });
                    toast.success('Restore Success');
                    setChecked([]);
                    axios.get('https://shop-next-sooty.vercel.app/api/revalidate-home?secret=secret');
                },
                onError(error) {
                    const mgs = ((error as AxiosError).response?.data as IError).message ?? 'Something went wrong!';
                    toast.error(mgs);
                },
            });
        }
    };

    const handleSortCat = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        event.preventDefault();
        const category_id = event.target.value;
        setLinkSearch((prevState) => ({ ...prevState, categoryLink: category_id }));

        const link = `?page=${PAGE}&category=${category_id}&sort=${linkSearch.sort}`;
        navigation(link);
    };

    const handleSortType = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        event.preventDefault();
        const type = event.target.value;

        setLinkSearch((prevState) => ({ ...prevState, sort: type }));

        const link = `?page=${PAGE}&category=${linkSearch.categoryLink}&sort=${type}`;

        navigation(link);
    };

    const query = useQuery({
        queryKey: [
            softDelete ? 'products-trash' : 'products',
            'type',
            'category',
            PAGE,
            linkSearch.sort,
            linkSearch.categoryLink,
        ],
        queryFn: () =>
            softDelete
                ? Apis.getListProductsTrash(
                      PAGE as number,
                      LIMIT,
                      true,
                      linkSearch.categoryLink !== 'default' ? linkSearch.categoryLink : undefined,
                      linkSearch.sort
                  )
                : Apis.getListProducts(
                      PAGE as number,
                      LIMIT,
                      linkSearch.categoryLink !== 'default' ? linkSearch.categoryLink : undefined,
                      linkSearch.sort
                  ),
        keepPreviousData: true,
        retry: 0,
    });

    const queryCategories = useQuery({
        queryKey: ['categories'],
        queryFn: () => Apis.getListCategories(undefined, undefined, false),
        onSuccess: (data) => setCategories(data.data.results),
    });

    const mutationDelete = useMutation({ mutationFn: (id: string) => Apis.destroyProduct(id) });

    const mutationDeleteMulti = useMutation({ mutationFn: (id: string[]) => Apis.deleteMultiProduct(id) });

    const mutationRestoreMulti = useMutation({ mutationFn: (id: string[]) => Apis.restoreMultiProduct(id) });

    const mutationDeleteMultiTrash = useMutation({ mutationFn: (id: string[]) => Apis.deleteMultiTrashProduct(id) });

    const response = query.data?.data as IProps;

    if (query.error) return Layouts.Error((query.error as AxiosError).message);

    const isLoad =
        query.isLoading ||
        queryCategories.isLoading ||
        mutationDelete.isLoading ||
        mutationDeleteMulti.isLoading ||
        mutationRestoreMulti.isLoading ||
        mutationDeleteMultiTrash.isLoading;

    return (
        <div className="flex flex-col h-full gap-8 px-4 pt-12">
            {isLoad ? <Layouts.Loading /> : null}

            <Layouts.Breadcrumb page="products" />

            <div className="pb-8">
                <div className="flex items-center gap-12">
                    <div className="flex items-center gap-2">
                        <Link to="/products/create" className="flex items-center w-12 h-12">
                            <div className="m-auto">
                                <img src="/icon/plus.png" className="w-10 h-10" alt="" />
                            </div>
                        </Link>
                        <div className="flex items-center justify-center w-40 text-red-500 border border-gray-200">
                            {softDelete ? (
                                <button
                                    onClick={() => handleDeleteMultiTrash(checked)}
                                    type="button"
                                    className="py-3 uppercase"
                                >
                                    Delete Trash
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleDeleteMulti(checked)}
                                    type="button"
                                    className="py-3 uppercase"
                                >
                                    Delete Multiple
                                </button>
                            )}
                        </div>
                        <div className="flex items-center justify-center w-40 text-blue-500 border border-gray-200">
                            {softDelete ? (
                                <button onClick={() => handleRestoreMulti(checked)} className="py-3 uppercase">
                                    restore items
                                </button>
                            ) : (
                                <Link to="/products/trash" className="py-3 uppercase">
                                    trash items
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex items-center ">
                            <select
                                value={linkSearch.sort}
                                onChange={(event) => handleSortType(event)}
                                className="px-4 py-3 text-sm text-gray-600 border-gray-300 rounded shadow-sm w-44 focus:ring-primary focus:border-primary focus:outline-none"
                            >
                                <option value="asc">Default sorting</option>
                                <option value="price">Price low-high</option>
                                <option value="-price">Price high-low</option>
                                <option value="desc">Latest product</option>
                            </select>
                        </div>

                        <div className="flex items-center">
                            {queryCategories.error ? (
                                <div className="text-red-500">
                                    An error has occurred:
                                    {(queryCategories.error as AxiosError).message}
                                </div>
                            ) : (
                                categories.length > 0 && (
                                    <select
                                        value={linkSearch.categoryLink}
                                        name="category"
                                        className="px-4 py-3 text-sm text-gray-600 border-gray-300 rounded shadow-sm w-44 focus:ring-primary focus:border-primary focus:outline-none"
                                        onChange={(event) => handleSortCat(event)}
                                    >
                                        <option value="default">Sorting Category</option>

                                        {categories.map((category, index) => (
                                            <option value={category._id} key={index}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                )
                            )}
                        </div>
                    </div>
                </div>

                <div className="w-full my-8 overflow-x-auto">
                    <table className="w-full text-left text-gray-500 bg-white shadow-md sm:rounded-lg">
                        <thead className="text-sm text-gray-700 uppercase bg-slate-300">
                            <tr>
                                <th scope="col" className="p-4">
                                    <div className="flex items-center">
                                        <input
                                            onChange={(event) =>
                                                handleCheckboxAll(
                                                    [...response?.results.map((product) => product._id)],
                                                    event
                                                )
                                            }
                                            className="pl-10"
                                            checked={
                                                response?.results.length === checked.length &&
                                                response?.results.length > 0
                                            }
                                            type="checkbox"
                                            id="checkbox-all"
                                        />
                                        <label htmlFor="checkbox-all" className="sr-only">
                                            checkbox
                                        </label>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Category
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Price
                                </th>

                                <th scope="col" className="px-6 py-4">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {response &&
                                response.results.map((pro, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="w-4 p-4">
                                            <div className="flex items-center">
                                                <input
                                                    id="checkbox"
                                                    type="checkbox"
                                                    checked={checked.includes(pro._id)}
                                                    onChange={() => handleCheckbox(pro._id)}
                                                />
                                                <label htmlFor="checkbox" className="sr-only">
                                                    checkbox
                                                </label>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 capitalize max-w-[250px]">
                                            <div className="flex items-center w-full gap-2">
                                                <div className="h-40 w-[150px]">
                                                    <img
                                                        src={pro.imageURL[0]}
                                                        alt=""
                                                        className="w-full h-full rounded-lg"
                                                    />
                                                </div>
                                                <div className="flex-1">{pro.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 capitalize max-w-[150px] truncate">
                                            {pro?.category?.name}
                                        </td>
                                        <td className="px-6 py-4 capitalize max-w-[150px] truncate">
                                            {numeral(pro.variant[0].price).format('0,0')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div
                                                    className={`
                                                ${pro.active ? 'bg-green-500' : 'bg-red-500'} 
                                                h-2.5 w-2.5 rounded-full mr-2 `}
                                                />
                                                {pro.active ? 'Active' : 'Inactive'}
                                            </div>
                                        </td>

                                        <td className="gap-2 px-6 py-4">
                                            <div className="flex items-center mb-2">
                                                <Link
                                                    to={`/products/update/${pro._id}`}
                                                    className="mr-2 font-medium text-blue-600 hover:underline"
                                                >
                                                    <div>
                                                        <img src="/icon/edit-color.png" className="w-6 h-6" alt="" />
                                                    </div>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(pro._id)}
                                                    className="font-medium text-red-600 hover:underline"
                                                >
                                                    <div>
                                                        <img src="/icon/delete.png" className="w-6 h-6" alt="" />
                                                    </div>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>

                    {response && response.totalPages > 0 ? (
                        <Layouts.Paginator
                            navigator={navigation}
                            totalPages={response.totalPages as number}
                            currentPage={PAGE}
                        />
                    ) : null}
                </div>
            </div>
        </div>
    );
};
