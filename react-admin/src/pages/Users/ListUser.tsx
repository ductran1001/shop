import { AxiosError } from 'axios';
import { IError, IUser } from 'interfaces';
import { Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Layouts from 'components/Layouts';
import * as Apis from 'api';

interface IProps {
    status: string;
    contents: IUser[];
    results: number;
}
const TheadTable = [{ name: 'Name' }, { name: 'Position' }, { name: 'Status' }, { name: 'Action' }];

export const ListUser = () => {
    const queryClient = useQueryClient();
    const queryString = useLocation().search || '?page=1';
    const PAGE = Number(queryString.split('=')[1]);
    const LIMIT = 10;

    const handleDelete = async (id: string) => {
        mutationDelete.mutate(id, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ['users', PAGE],
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

    const mutationDelete = useMutation({ mutationFn: (id: string) => Apis.destroyUser(id) });

    const query = useQuery({
        queryKey: ['users', PAGE],
        queryFn: () => Apis.getListUsers(PAGE as number, LIMIT),
        keepPreviousData: true,
        retry: 0,
    });
    const response = query.data?.data as IProps;

    if (query.error) return Layouts.Error((query.error as AxiosError).message);
    return (
        <div className="flex flex-col h-full gap-8 px-4 pt-12">
            {query.isLoading || mutationDelete.isLoading ? <Layouts.Loading /> : null}

            <Layouts.Breadcrumb page="users" />

            <div className="pb-8">
                <Link to="/users/create" className="flex items-center w-12 h-12">
                    <div className="m-auto">
                        <img src="/icon/plus.png" className="w-10 h-10" alt="" />
                    </div>
                </Link>

                <div className="w-full my-8 overflow-x-auto">
                    <table className="w-full text-left text-gray-500 bg-white shadow-md sm:rounded-lg">
                        <thead className="text-sm text-gray-700 uppercase bg-slate-300">
                            <tr>
                                <th scope="col" className="p-4">
                                    <div className="flex items-center">
                                        <input className="pl-10" id="checkbox-all-search" type="checkbox" />
                                        <label htmlFor="checkbox-all-search" className="sr-only">
                                            checkbox
                                        </label>
                                    </div>
                                </th>
                                {TheadTable.map((item, index) => (
                                    <th key={index} scope="col" className="px-6 py-4">
                                        {item.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {response &&
                                response.contents.map((user, index) => (
                                    <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                        <td className="w-4 p-4">
                                            <div className="flex items-center">
                                                <input id="checkbox-table-search-1" type="checkbox" />
                                                <label htmlFor="checkbox-table-search-1" className="sr-only">
                                                    checkbox
                                                </label>
                                            </div>
                                        </td>
                                        <th
                                            scope="row"
                                            className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap"
                                        >
                                            <img
                                                className="w-10 h-10 rounded-full"
                                                src={user.avatar}
                                                alt={user.fullName}
                                            />
                                            <div className="pl-3">
                                                <div className="text-base font-semibold">{user.fullName}</div>
                                                <div className="font-normal text-gray-500">{user.email}</div>
                                            </div>
                                        </th>
                                        <td className="px-6 py-4 capitalize">
                                            <div className="flex items-center">{user.role}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2" /> Active
                                            </div>
                                        </td>

                                        <td className="gap-2 px-6 py-4">
                                            <div className="flex items-center mb-2">
                                                <Link
                                                    to={`/users/update/${user._id}`}
                                                    className="mr-2 font-medium text-blue-600 hover:underline"
                                                >
                                                    <div>
                                                        <img src="/icon/edit-color.png" className="w-6 h-6" alt="" />
                                                    </div>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(user._id)}
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
                    {/* {response && (
                        <Layouts.Paginator
                            totalPages={response.totalPages as number}
                            currentPage={response.currentPage as number}
                        />
                    )} */}
                </div>
            </div>
        </div>
    );
};
