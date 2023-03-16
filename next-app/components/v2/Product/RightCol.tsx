/* eslint-disable @next/next/no-img-element */
import React from 'react';
import numeral from 'numeral';
import { FaCartPlus, FaCheck, FaStar, FaTruck } from 'react-icons/fa';
import { IOrder, IProduct } from '@/types';
import * as page from '@/components/v2';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { toast } from 'react-hot-toast';
import { axiosClient } from '@/lib/axiosClient';
import { useRouter } from 'next/router';

type Props = {
    product: IProduct;
    setOrder: any;
};

export const RightCol = ({ product, setOrder }: Props) => {
    const router = useRouter();
    const { user } = useSelector((state: RootState) => state.auth);
    const [quantity, setQuantity] = React.useState(1);
    const [activeTab, setActiveTab] = React.useState(0);
    const [typeModal, setTypeModal] = React.useState('');
    const [showModal, setShowModal] = React.useState(false);

    const addCartApi = async () => {
        const orderDetails = {
            productId: product?._id,
            name: product?.name,
            slug: product?.slug,
            image: product?.imageURL[0],
            price: product?.variant[activeTab].price,
            promotion: product?.variant[activeTab].promotion,
            color: product?.variant[activeTab].color,
            quantity: quantity,
        };
        const data = { user, orderDetails };
        try {
            const response = await axiosClient.post('/api/order', data);
            response.status === 201 && toast.success('Thêm vào giỏ hàng thành công');
        } catch (error) {
            console.log(error);
            toast.error('some thing went wrong!');
        }
    };

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

    const handleBuy = () => {
        if (!user) {
            setShowModal(true);
            setTypeModal('login');
        } else {
            addCartApi();
            getOrder();
            router.push('/don-mua');
        }
    };
    const handleAddCart = () => {
        if (!user) {
            setShowModal(true);
            setTypeModal('login');
        } else {
            addCartApi();
            getOrder();
        }
    };
    const handleSelectColor = (quantity: number, index: number) => {
        quantity > 0 && setActiveTab(index);
    };

    return (
        <div className="md:w-[60%] w-full flex flex-col p-[15px]">
            {showModal ? (
                <page.Modal typeModal={typeModal} setTypeModal={setTypeModal} onClick={() => setShowModal(false)} />
            ) : null}

            {product && (
                <>
                    <h1 className="title-product-detail">{product.name}</h1>
                    <div className="flex items-center gap-4 mt-3 text-base">
                        <div className="flex items-center gap-2 pr-2.5 border-r border-gray-300">
                            <span className="border-b border-primary text-primary">5.0</span>
                            <div className="flex">
                                <FaStar className="text-primary" />
                                <FaStar className="text-primary" />
                                <FaStar className="text-primary" />
                                <FaStar className="text-primary" />
                                <FaStar className="text-primary" />
                            </div>
                        </div>
                        <div className="flex gap-2 items-center pr-2.5 border-r border-gray-300">
                            <span className="border-b border-gray-900">8</span>
                            <span className="text-[#767676] text-sm">đánh giá</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="border-b border-gray-900">{product.sold}</span>
                            <span className="text-[#767676] text-sm">đã bán</span>
                        </div>
                    </div>
                    <div className="flex items-center p-4 gap-4 bg-[#FAFAFA] mt-3">
                        {(product.variant[activeTab].promotion as number) > 0 && (
                            <div className="flex items-center">
                                <span className="text-xs -mt-0.5">₫</span>
                                <span className="line-through text-base text-[#929292]">
                                    {numeral(product.variant[activeTab].price).format('0,0')}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center">
                            <span className="text-xs text-primary -mt-1.5">₫</span>
                            <span className="text-3xl text-primary">
                                <GetPriceDiscount
                                    price={product.variant[activeTab].price as number}
                                    promotion={product.variant[activeTab].promotion as number}
                                />
                            </span>
                        </div>
                        {(product.variant[activeTab].promotion as number) > 0 && (
                            <div className="bg-primary text-white text-sm px-0.5">
                                <span>{numeral(product.variant[activeTab].promotion).format()}% GIẢM</span>
                            </div>
                        )}
                    </div>

                    <div className="flex mt-3">
                        <div className="w-[110px]">
                            <span className="text-[#757575] text-sm">vận chuyển</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaTruck className="text-[#7FE6D6]" />
                            <span className="text-sm">Miễn phí vận chuyển</span>
                        </div>
                    </div>
                    <div className="flex items-center mt-3">
                        <div className="w-[110px]">
                            <span className="text-[#757575] text-sm">màu sắc</span>
                        </div>
                        <div className="flex flex-wrap items-center flex-1 gap-2 text-sm">
                            {product?.variant?.map((c, index) => {
                                const disabled = Number(c.quantity) === 0;
                                const cssDisabled = 'cursor-not-allowed text-gray-400 ';
                                const cssHover = 'hover:text-primary hover:border-primary';
                                const cssActive = 'text-primary border-primary';
                                const cssBtn = 'px-4 py-2.5 border border-gray-200 relative';
                                return (
                                    <button
                                        onClick={() => handleSelectColor(c.quantity as number, index)}
                                        key={index}
                                        className={`${disabled ? cssDisabled : cssHover} ${cssBtn} ${
                                            activeTab === index ? cssActive : ''
                                        }`}
                                    >
                                        {activeTab === index && (
                                            <div className="absolute bottom-0 right-0 flex justify-center w-3 p-0.5 h-3 bg-primary items-center">
                                                <FaCheck className="text-white" />
                                            </div>
                                        )}
                                        <span>{c.color}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center mt-3">
                        <div className="w-[110px]">
                            <span className="text-[#757575] text-sm">Số Lượng</span>
                        </div>
                        <div className="flex flex-wrap items-center flex-1 gap-2 text-sm">
                            <div className="flex items-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (quantity > 1) {
                                            setQuantity((prev) => prev - 1);
                                        }
                                    }}
                                    className="px-4 py-0.5 text-center text-lg border border-gray-200 border-r-0"
                                >
                                    -
                                </button>
                                <input
                                    disabled
                                    className="w-16 px-4 py-1 text-center bg-white border border-gray-200 focus:outline"
                                    value={quantity}
                                    min={quantity}
                                    type="number"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (quantity < Number(product?.variant[activeTab]?.quantity)) {
                                            setQuantity((prev) => prev + 1);
                                        }
                                    }}
                                    className="px-4 py-0.5 text-center text-lg border border-gray-200 border-l-0"
                                >
                                    +
                                </button>
                            </div>
                            <div className="text-[#757575] text-sm flex items-center gap-2">
                                <span>{product?.variant[activeTab]?.quantity}</span>
                                <span>sản phẩm có sẵn</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-5">
                        <button
                            onClick={() => handleAddCart()}
                            className="flex gap-2 items-center px-4 border border-primary py-2.5 bg-[#FFEEE8] text-primary"
                        >
                            <FaCartPlus />
                            <span>Thêm Vào Giỏ Hàng</span>
                        </button>
                        <button onClick={() => handleBuy()} className="px-4 py-2.5 bg-primary text-white">
                            Mua ngay
                        </button>
                    </div>
                </>
            )}

            <Service />
        </div>
    );
};

const GetPriceDiscount = ({ price, promotion }: { price: number; promotion: number }) => {
    const priceDiscount = numeral(price - (price / 100) * promotion).format('0,0');

    return <span>{priceDiscount}</span>;
};

const services = [
    {
        name: '7 ngày miễn phí trả hàng',
        img: 'https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/6c502a2641457578b0d5f5153b53dd5d.png',
    },
    {
        name: 'Hàng chính hãng 100%',
        img: 'https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/511aca04cc3ba9234ab0e4fcf20768a2.png',
    },
    {
        name: 'Miễn phí vận chuyển',
        img: 'https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/16ead7e0a68c3cff9f32910e4be08122.png',
    },
];

const Service = () => {
    return (
        <div className="flex items-center gap-8 py-4 mt-5 border-t border-gray-200">
            {services.map((service, index) => (
                <div key={index} className="flex items-center gap-1 text-sm">
                    <img className="w-5 h-5" src={service.img} alt="" />
                    <span>{service.name}</span>
                </div>
            ))}
        </div>
    );
};
