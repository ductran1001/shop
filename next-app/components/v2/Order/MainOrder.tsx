/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { IOrder } from '@/types';
import numeral from 'numeral';
import toast from 'react-hot-toast';
import { axiosClient } from '@/lib/axiosClient';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface IProps {
    order: IOrder[];
    setOrder: any;
}
const Buttons = [
    { name: 'Giỏ Hàng Của Tôi', status: 'waiting' },
    { name: 'Đặt Hàng', status: 'confirm' },
    { name: 'Vận Chuyển', status: 'delivery' },
    { name: 'Hoàn Thành', status: 'complete' },
];
export const MainOrder = ({ order, setOrder }: IProps) => {
    const router = useRouter();
    const { user } = useSelector((state: RootState) => state.auth);
    const [navActive, setNavActive] = React.useState('waiting');
    const [checked, setChecked] = React.useState<string[]>([]);
    const active = 'text-primary';
    const data = order[0]?.orderDetails?.filter((orderItem) => orderItem.status === navActive);

    const getOrder = async () => {
        const queryOrder = '/api/order/by-user';
        try {
            const getDataOrders = await axiosClient.get(queryOrder);
            const orders = getDataOrders.status === 200 && getDataOrders.data?.results;

            setOrder(() => {
                const newData = [orders];
                return newData;
            });
        } catch (error) {
            console.log(error);
        }
    };
    const deleteAll = async (checked: string[]) => {
        const queryOrderDeleteAll = '/api/order/delete-all';
        try {
            const response = await axiosClient.patch(queryOrderDeleteAll, {
                arrId: checked,
                user: user,
            });
            response.status === 200 && router.push('/');
        } catch (error) {
            toast.error('some thing went wrong');
        }
    };

    const removeItem = async (id: string) => {
        const queryOrderDeleteOne = `/api/order/delete-one/${id}`;
        try {
            const response = await axiosClient.delete(queryOrderDeleteOne);
            if (response.status === 200) {
                getOrder();
                toast.success('Xóa thành công');
            }
        } catch (error) {
            toast.error('some thing went wrong');
        }
    };

    const handleCheckbox = (id: string) => {
        checked.includes(id) ? setChecked(checked.filter((data) => data !== id)) : setChecked([...checked, id]);
    };
    const handleCheckboxAll = (arrayId: string[], event: React.ChangeEvent<HTMLInputElement>) => {
        event?.target.checked ? setChecked(arrayId) : setChecked([]);
    };

    const clickOrder = async (checked: string[]) => {
        const queryOrder = `/api/order/update`;

        if (checked.length === 0) {
            toast.error('Vui lòng chọn sản phẩm để đặt hàng');
        } else if (
            user?.phoneNumber === '' ||
            user?.fullName  === '' ||
            user?.address === '' ||
            !user?.phoneNumber ||
            !user?.fullName ||
            !user?.address 
        ) {
            router.push('/tai-khoan');
        } else {
            try {
                const response = await axiosClient.patch(queryOrder, {
                    arrId: checked,
                    status: 'confirm',
                    user: user,
                });
                if (response.status === 200) {
                    getOrder();
                    setChecked([]);
                    setNavActive('confirm');
                }
            } catch (error) {
                toast.error('some thing went wrong');
            }
        }
    };
    return (
        <div className="w-full bg-white shadow-md md:w-5/6">
            <div className="md:px-6 px-1.5 pb-4">
                <div className="flex justify-center border-b border-gray-300 status-order my-4  py-2.5 md:gap-6 gap-2.5">
                    {Buttons.map((item, index) => (
                        <button
                            onClick={() => setNavActive(item.status)}
                            key={index}
                            className={`${
                                navActive === item.status ? active : ''
                            }  text-[15px] border-r border-gray-300 pr-4`}
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
            </div>

            {data?.length > 0 ? (
                <>
                    {navActive === 'waiting' && (
                        <div
                            onClick={() => deleteAll(checked)}
                            className="text-center cursor-pointer uppercase px-4 py-2.5 bg-primary text-white text-sm"
                        >
                            Clear All
                        </div>
                    )}
                    <div className="flex flex-col pb-8 order-item">
                        {data?.map((item, index) => (
                            <div
                                key={index}
                                className="border-t border-gray-300 relative flex md:flex-row flex-col items-center justify-between p-2.5 md:px-8 md:gap-8 gap-4"
                            >
                                {navActive === 'waiting' && (
                                    <div
                                        onClick={() => removeItem(item._id)}
                                        className="px-3 cursor-pointer py-1.5 mt-2 mr-2 text-sm rounded-full absolute bg-red-500 right-0 top-0 text-white"
                                    >
                                        x
                                    </div>
                                )}

                                <div className="flex gap-4 py-2">
                                    {navActive === 'waiting' && (
                                        <div className="m-auto">
                                            <input
                                                id="checkbox"
                                                type="checkbox"
                                                onChange={() => handleCheckbox(item._id)}
                                                checked={checked.includes(item._id)}
                                                className="w-4 h-4"
                                            />
                                        </div>
                                    )}

                                    <Link
                                        href={`/san-pham/${item.slug}`}
                                        className="md:w-24 w-[140px] flex items-center justify-center p-2.5 border border-gray-300"
                                    >
                                        <img src={item.image} alt="" />
                                    </Link>
                                    <div className="flex flex-col flex-1 gap-1.5">
                                        <Link
                                            href={`/san-pham/${item.slug}`}
                                            className="title-order-product hover:text-primary"
                                        >
                                            {item?.name}
                                        </Link>
                                        <span className="text-sm text-gray-400">Phân loại hàng: {item?.color}</span>
                                        <span className="text-sm">X{item?.quantity}</span>

                                        <span className="block text-sm text-gray-400 line-through md:hidden">
                                            <GetPriceDiscount
                                                price={item?.price as number}
                                                promotion={item?.promotion as number}
                                            />
                                        </span>
                                        <span className="block text-base md:hidden text-primary">
                                            ₫{numeral(item?.price).format()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-col items-center hidden gap-2 ml-4 md:flex md:ml-0 md:flex-row">
                                    <span className="text-sm text-gray-400 line-through">
                                        <GetPriceDiscount
                                            price={item?.price as number}
                                            promotion={item?.promotion as number}
                                        />
                                    </span>
                                    <span className="text-base text-primary">₫{numeral(item?.price).format()}</span>
                                </div>
                            </div>
                        ))}

                        {navActive === 'waiting' && (
                            <div className="p-2.5 px-8 border-t border-gray-300 gap-4 flex items-center pt-6">
                                <input
                                    type="checkbox"
                                    id="checkbox-all"
                                    className="w-4 h-4"
                                    checked={data?.length === checked.length && data?.length > 0}
                                    onChange={(event) => handleCheckboxAll([...data?.map((data) => data._id)], event)}
                                />
                                <div
                                    onClick={() => clickOrder(checked)}
                                    className="text-center text-sm cursor-pointer flex-1 text-white  uppercase px-4 py-2.5 bg-primary"
                                >
                                    Đặt Hàng
                                </div>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="w-32 m-auto">
                    <img
                        src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/9bdd8040b334d31946f49e36beaf32db.png"
                        alt=""
                    />
                </div>
            )}
        </div>
    );
};
const GetPriceDiscount = ({ price, promotion }: { price: number; promotion: number }) => {
    const priceDiscount = numeral(price - (price / 100) * promotion).format('0,0');

    return <span>₫{priceDiscount}</span>;
};
