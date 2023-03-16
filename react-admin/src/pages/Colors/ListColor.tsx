import { IColor, IError } from 'interfaces';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Layouts from 'components/Layouts';
import * as Apis from 'api';

interface IProps {
    status: string;
    contents: IColor[];
    results: number;
    pages: number;
}

export const ListColor = () => {
    const queryClient = useQueryClient();
    const queryString = useLocation().search || '?page=1';
    const PAGE = Number(queryString.split('=')[1]);
    const LIMIT = 10;
    const softDelete = Boolean(useLocation().pathname.includes('/trash'));
    const navigation = useNavigate();

    const handleDelete = async (id: string) => {
        mutationDelete.mutate(id, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: [softDelete ? 'colors-trash' : 'colors', PAGE],
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

    const mutationDelete = useMutation({ mutationFn: (id: string) => Apis.destroyColor(id) });

    const query = useQuery({
        queryKey: [softDelete ? 'colors-trash' : 'colors', PAGE],
        queryFn: () =>
            softDelete
                ? Apis.getListColorsTrash(PAGE as number, LIMIT, true)
                : Apis.getListColors(PAGE as number, LIMIT),
        keepPreviousData: true,
        retry: 0,
    });
    const response = query.data?.data as IProps;

    if (query.error) return Layouts.Error((query.error as AxiosError).message);
    const isLoad = query.isLoading || mutationDelete.isLoading;

    return (
        <div className="flex flex-col h-full gap-8 px-4 pt-12">
            {isLoad ? <Layouts.Loading /> : null}

            <Layouts.Breadcrumb page="colors" />
            <div className="pb-8">
                <div className="flex gap-2">
                    <Link to="/colors/create" className="flex items-center w-12 h-12">
                        <div className="m-auto">
                            <img src="/icon/plus.png" className="w-10 h-10" alt="" />
                        </div>
                    </Link>
                </div>

                <div className="max-w-2xl mx-auto my-8 overflow-x-auto">
                    <table className="w-full text-left text-gray-500 bg-white shadow-md sm:rounded-lg">
                        <thead className="text-sm text-gray-700 uppercase bg-slate-300">
                            <tr>
                                <th scope="col" className="px-6 py-4">
                                    #
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Color
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {response &&
                                response.contents?.map((color, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="gap-2 px-6 py-4">{(index += 1)}</td>
                                        <td className="px-6 py-4 capitalize max-w-[180px] truncate">{color.title}</td>
                                        <td className="px-6 py-4 capitalize max-w-[180px] text-center">
                                            <div
                                                className="w-8 h-8 border"
                                                style={{ backgroundColor: color.code }}
                                            ></div>
                                        </td>
                                        <td className="gap-2 px-6 py-4">
                                            <div className="flex items-center mb-2">
                                                <Link
                                                    to={`/colors/update/${color._id}`}
                                                    className="mr-2 font-medium text-blue-600 hover:underline"
                                                >
                                                    <div>
                                                        <img src="/icon/edit-color.png" className="w-6 h-6" alt="" />
                                                    </div>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(color._id)}
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
                    {response && (
                        <Layouts.Paginator
                            navigator={navigation}
                            totalPages={response.pages as number}
                            currentPage={PAGE}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
