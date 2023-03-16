import React from 'react';
import { AxiosError } from 'axios';
import { IError, IOrder, IOrderDetails, IUser } from 'interfaces';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Layouts from 'components/Layouts';
import * as Apis from 'api';
import numeral from 'numeral';

export const UpdateOrder = () => {
    const { id } = useParams();
    const [statusState, setStatusState] = React.useState('confirm');
    const [statusSubmit, setStatusSubmit] = React.useState('delivery');
    const [order, setOrder] = React.useState<IOrder | null>(null);
    const queryClient = useQueryClient();

    const mutationUpdate = useMutation({
        mutationFn: (body: object) => Apis.updateOrder(body),
    });
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, user: IUser) => {
        event.preventDefault();
        const getStatus = statusState === 'confirm' ? 'confirm' : 'delivery';
        const arrId = order?.orderDetails
            ?.filter((d: IOrderDetails) => d.status === getStatus)
            .map((d: IOrderDetails) => d._id);
        const newData = { status: statusSubmit, arrId, user };

        mutationUpdate.mutate(newData, {
            onSuccess: () => {
                toast.success('Update Success');
                setStatusState(statusSubmit);
                queryClient.invalidateQueries({
                    queryKey: ['order', id],
                    exact: true,
                });
            },
            onError(error) {
                const mgs = ((error as AxiosError).response?.data as IError).message ?? 'Something went wrong!';
                toast.error(mgs);
            },
        });
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        event.preventDefault();
        setStatusSubmit(event.target.value);
    };

    const queryOrder = useQuery({
        queryKey: ['order', id],
        queryFn: () => Apis.getOrderById(id as string),
        enabled: id !== undefined,
        onSuccess: (data) => setOrder((prevState: any) => ({ ...prevState, ...data.data.results })),
    });

    let initialValue = 0;
    let sum = order?.orderDetails.reduce(function (total: any, currentValue: any) {
        const price = Math.round(currentValue.price - (currentValue.price / 100) * currentValue.promotion);
        const getSum = price * currentValue.quantity;
        return total + getSum;
    }, initialValue);

    if (queryOrder.error) return Layouts.Error((queryOrder.error as AxiosError).message);
    return (
        <div className="flex flex-col h-full gap-10 px-4 pt-12">
            {queryOrder.isLoading || mutationUpdate.isLoading ? <Layouts.Loading /> : null}
            <Layouts.Breadcrumb page="orders" sub="update" />

            <div className="flex justify-center gap-4">
                <span
                    onClick={() => setStatusState('confirm')}
                    className={`uppercase border-r border-gray-200 px-4 py-2.5 cursor-pointer ${
                        statusState === 'confirm' ? 'text-blue-500' : ''
                    }`}
                >
                    Oder
                </span>
                <span
                    onClick={() => setStatusState('delivery')}
                    className={`uppercase border-r border-gray-200 px-4 py-2.5 cursor-pointer ${
                        statusState === 'delivery' ? 'text-blue-500' : ''
                    }`}
                >
                    Delivery
                </span>
                <span
                    onClick={() => setStatusState('complete')}
                    className={`uppercase border-r border-gray-200 px-4 py-2.5 cursor-pointer ${
                        statusState === 'complete' ? 'text-blue-500' : ''
                    }`}
                >
                    Complete
                </span>
            </div>
            {order && (
                <div className="flex flex-col items-center justify-center">
                    <div className="flex flex-col w-full px-4 py-12 mb-12 bg-white rounded-md shadow-md md:flex-row sm:px-6 md:px-8 lg:px-10">
                        <div className="flex flex-col justify-between w-full">
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                <table className="w-full text-left text-gray-500">
                                    <tbody>
                                        {order.orderDetails
                                            ?.filter((d: IOrderDetails) => d.status === statusState)
                                            ?.map((item: IOrderDetails, i: number) => (
                                                <tr key={i} className="bg-white border-b hover:bg-gray-50">
                                                    <td className="px-6 py-4 capitalize max-w-[250px]">
                                                        <div className="flex items-center w-full gap-2">
                                                            <div className="w-[150px]">
                                                                <img
                                                                    src={item.image}
                                                                    alt=""
                                                                    className="w-full h-full rounded-lg"
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-4">
                                                            <span className="text-wrap">Name:{item.name}</span>
                                                            <span>Quantity:{item.quantity}</span>
                                                            <span>Price:{numeral(item.price).format('0,0')}</span>
                                                            <span>Promotion:{item.promotion}</span>
                                                            <span>
                                                                Total:
                                                                {numeral(
                                                                    item.price - (item.price / 100) * item.promotion
                                                                ).format('0,0')}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                            {statusState !== 'complete' && (
                                <div className="flex flex-col justify-between gap-4 py-4 mt-2 lg:flex-row">
                                    {order.orderDetails?.filter((d: IOrderDetails) => d.status === statusState).length >
                                    0 ? (
                                        <>
                                            <div className="border py-2.5 pb-8 px-4">
                                                <div className="px-1 py-4">Customer Name : {order.user?.fullName}</div>
                                                <div className="px-1 py-4">
                                                    Phone Number : {order.user?.phoneNumber}
                                                </div>
                                                <div className="px-1 py-4">Customer Email : {order.user?.email}</div>
                                                <div className="px-1 py-4">Address : {order.user?.address}</div>
                                                <form
                                                    onSubmit={(event) => handleSubmit(event, order.user)}
                                                    className="flex gap-4"
                                                >
                                                    <select
                                                        onChange={(event) => handleChange(event)}
                                                        value={statusSubmit}
                                                        className="px-4 py-3 text-sm text-gray-600 uppercase border border-gray-300 rounded shadow-sm w-44 focus:outline-none"
                                                    >
                                                        <option value="delivery">delivery</option>
                                                        <option value="complete">complete</option>
                                                    </select>
                                                    <div className="w-44">
                                                        <button className="w-full px-4 py-2.5 bg-green-500 text-white uppercase hover:opacity-75">
                                                            Update
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>

                                            <div className="text-lg font-semibold text-red-500 uppercase">
                                                SUM: {numeral(sum).format('0,0')} VND
                                            </div>
                                        </>
                                    ) : (
                                        <span className="m-auto text-sm text-center text-red-500 uppercase">Empty</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
