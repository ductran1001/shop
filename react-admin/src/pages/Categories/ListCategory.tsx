import React from 'react';
import { ICategory, IError } from 'interfaces';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as component from 'components/Layouts';
import * as Apis from 'api';

interface IProps {
    status: string;
    results: ICategory[];
    count: number;
    totalPages: number;
}
export const ListCategory = () => {
    const queryClient = useQueryClient();
    const [checked, setChecked] = React.useState<string[]>([]);
    const queryString = useLocation().search || '?page=1';
    const PAGE = Number(queryString.split('=')[1]);
    const LIMIT = 10;
    const softDelete = Boolean(useLocation().pathname.includes('/trash'));

    const navigation = useNavigate();

    const handleDelete = async (id: string) => {
        mutationDelete.mutate(id, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: [softDelete ? 'categories-trash' : 'categories', PAGE],
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
                        queryKey: [softDelete ? 'categories-trash' : 'categories', PAGE],
                        exact: true,
                    });
                    toast.success('Delete Success');
                    setChecked([]);
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
                        queryKey: [softDelete ? 'categories-trash' : 'categories', PAGE],
                        exact: true,
                    });
                    toast.success('Delete Trash Success');
                    setChecked([]);
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
                        queryKey: [softDelete ? 'categories-trash' : 'categories', PAGE],
                        exact: true,
                    });
                    toast.success('Restore Success');
                    setChecked([]);
                },
                onError(error) {
                    const mgs = ((error as AxiosError).response?.data as IError).message ?? 'Something went wrong!';
                    toast.error(mgs);
                },
            });
        }
    };

    const mutationDelete = useMutation({ mutationFn: (id: string) => Apis.destroyCategory(id) });

    const mutationDeleteMulti = useMutation({ mutationFn: (id: string[]) => Apis.deleteMultiCategory(id) });

    const mutationRestoreMulti = useMutation({ mutationFn: (id: string[]) => Apis.restoreMultiCategory(id) });

    const mutationDeleteMultiTrash = useMutation({ mutationFn: (id: string[]) => Apis.deleteMultiTrashCategory(id) });

    const query = useQuery({
        queryKey: [softDelete ? 'categories-trash' : 'categories', PAGE],
        queryFn: () =>
            softDelete
                ? Apis.getListCategoriesTrash(PAGE as number, LIMIT, true)
                : Apis.getListCategories(PAGE as number, LIMIT, false),
        keepPreviousData: true,
        retry: 0,
    });
    const response = query.data?.data as IProps;

    if (query.error) return component.Error((query.error as AxiosError).message);
    const isLoad =
        query.isLoading ||
        mutationDelete.isLoading ||
        mutationDeleteMulti.isLoading ||
        mutationRestoreMulti.isLoading ||
        mutationDeleteMultiTrash.isLoading;

    return (
        <div className="flex flex-col h-full gap-8 px-4 pt-12">
            {isLoad ? <component.Loading /> : null}

            <component.Breadcrumb page="categories" />
            <div className="pb-8">
                <div className="flex items-center gap-2">
                    <Link to="/categories/create" className="flex items-center w-12 h-12">
                        <div className="m-auto">
                            <img src="/icon/plus.png" className="w-10 h-10" alt="" />
                        </div>
                    </Link>
                    <div className="flex items-center justify-center w-40 h-16 text-red-500 border border-gray-200">
                        {softDelete ? (
                            <button onClick={() => handleDeleteMultiTrash(checked)} type="button" className="uppercase">
                                Delete Trash
                            </button>
                        ) : (
                            <button onClick={() => handleDeleteMulti(checked)} type="button" className="uppercase">
                                Delete Multiple
                            </button>
                        )}
                    </div>
                    <div className="flex items-center justify-center w-40 h-16 text-blue-500 border border-gray-200">
                        {softDelete ? (
                            <button onClick={() => handleRestoreMulti(checked)} className="uppercase">
                                restore items
                            </button>
                        ) : (
                            <Link to="/categories/trash" className="uppercase">
                                trash items
                            </Link>
                        )}
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
                                                handleCheckboxAll([...response?.results.map((cate) => cate._id)], event)
                                            }
                                            className="pl-10"
                                            checked={
                                                response?.results.length === checked.length &&
                                                response?.results.length > 0
                                            }
                                            type="checkbox"
                                            id="checkbox-all"
                                        />
                                        <label htmlFor="checkbox-all-search" className="sr-only">
                                            checkbox
                                        </label>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    position
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Description
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
                                response.results.map((category, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="w-4 p-4">
                                            <div className="flex items-center">
                                                <input
                                                    id="checkbox"
                                                    type="checkbox"
                                                    checked={checked.includes(category._id)}
                                                    onChange={() => handleCheckbox(category._id)}
                                                />
                                                <label htmlFor="checkbox" className="sr-only">
                                                    checkbox
                                                </label>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 capitalize">
                                            <div className="flex items-center w-full gap-2">
                                                <div className="h-24 w-[100px]">
                                                    <img
                                                        src={category.image}
                                                        alt=""
                                                        className="w-full h-full rounded-lg"
                                                    />
                                                </div>
                                                <div className="flex-1">{category.name}</div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 capitalize max-w-[180px] truncate">
                                            {category.position}
                                        </td>
                                        <td className="px-6 py-4 capitalize max-w-[180px] truncate">
                                            {category.description}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div
                                                    className={`
                                                ${category.active ? 'bg-green-500' : 'bg-red-500'} 
                                                h-2.5 w-2.5 rounded-full mr-2 `}
                                                />
                                                {category.active ? 'Active' : 'Inactive'}
                                            </div>
                                        </td>
                                        <td className="gap-2 px-6 py-4">
                                            <div className="flex items-center mb-2">
                                                <Link
                                                    to={`/categories/update/${category._id}`}
                                                    className="mr-2 font-medium text-blue-600 hover:underline"
                                                >
                                                    <div>
                                                        <img src="/icon/edit-color.png" className="w-6 h-6" alt="" />
                                                    </div>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(category._id)}
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
                        <component.Paginator
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
