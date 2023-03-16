import { IError, IOrder } from 'interfaces';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Layouts from 'components/Layouts';
import * as Apis from 'api';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

interface IProps {
    status: string;
    results: IOrder[];
    totalPages: number;
    count: number;
}
export const ListOrder = () => {
    const queryClient = useQueryClient();
    const navigation = useNavigate();

    const queryString = useLocation().search || '?page=1';
    const PAGE = Number(queryString.split('=')[1]);
    const LIMIT = 10;

    const handleDelete = async (id: string) => {
        mutationDelete.mutate(id, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ['orders', PAGE],
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

    const mutationDelete = useMutation({ mutationFn: (id: string) => Apis.destroyOrder(id) });

    const query = useQuery({
        queryKey: ['orders', PAGE],
        queryFn: () => Apis.getListOrders(PAGE as number, LIMIT),
        keepPreviousData: true,
        retry: 0,
    });

    const response = query.data?.data as IProps;

    if (query.error) return Layouts.Error((query.error as AxiosError).message);
    const isLoad = query.isLoading || mutationDelete.isLoading;

    return (
        <div className="flex flex-col h-full gap-8 px-4 pt-12">
            {isLoad ? <Layouts.Loading /> : null}

            <Layouts.Breadcrumb page="orders" />
            <div className="pb-8">
                <div className="w-full my-8 overflow-x-auto">
                    <table className="w-full text-left text-gray-500 bg-white shadow-md sm:rounded-lg">
                        <thead className="text-sm text-gray-700 uppercase bg-slate-300">
                            <tr>
                                <th scope="col" className="px-6 py-4">
                                    #
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Customer Name
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Phone Number
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Customer Email
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Address
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {response &&
                                response.results.map((order, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="gap-2 px-6 py-4">{(index += 1)}</td>

                                        <td className="px-6 py-4 capitalize">{order.user?.fullName}</td>
                                        <td className="px-6 py-4 capitalize">{order.user?.phoneNumber}</td>
                                        <td className="px-6 py-4">{order.user?.email}</td>
                                        <td className="px-6 py-4 capitalize ">{order.user?.address}</td>
                                        {/* <td
                                            className={`px-6 py-4 uppercase ${
                                                order. === 'complete'
                                                    ? 'text-green-500'
                                                    : order.status === 'waiting'
                                                    ? 'text-red-500'
                                                    : 'text-yellow-500'
                                            }`}
                                        >
                                            {order.status}
                                        </td> */}

                                        <td className="gap-2 px-6 py-4">
                                            <div className="flex items-center mb-2">
                                                <Link
                                                    to={`/orders/update/${order.user?._id}`}
                                                    className="mr-2 font-medium text-blue-600 hover:underline"
                                                >
                                                    <div>
                                                        <img src="/icon/edit-color.png" className="w-6 h-6" alt="" />
                                                    </div>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(order.user?._id as string)}
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
