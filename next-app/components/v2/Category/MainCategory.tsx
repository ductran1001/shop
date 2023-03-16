/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { FaAngleDown, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { IProduct, IProductsFilter } from '@/types';
import numeral from 'numeral';
import * as page from '@/components/v2';

interface IMainCategory {
    products: IProductsFilter;
    sort: string;
    statePage: number;
    setSort: React.Dispatch<React.SetStateAction<string>>;
    setStatePage: React.Dispatch<React.SetStateAction<number>>;
}

export const MainCategory = ({ products, statePage, sort, setStatePage, setSort }: IMainCategory) => {
    return (
        <div className="md:w-5/6 w-full">
            <div className="flex flex-col gap-4">
                <div className="top-mainCategory flex md:flex-row flex-col md:justify-between md:items-center bg-[#EDEDED]">
                    <div className="flex gap-2 items-center text-sm px-4 py-4">
                        <span className="md:block hidden px-4 py-2 capitalize text-gray-900">sắp xếp theo</span>
                        <button
                            className={`px-4 py-2 capitalize md:w-auto w-1/3 ${
                                sort === 'asc' ? 'bg-[#ee4d2d] text-white' : 'text-gray-900 bg-white'
                            }`}
                            onClick={() => setSort('asc')}
                        >
                            mặc định
                        </button>
                        <button
                            className={`px-4 py-2 capitalize md:w-auto w-1/3 ${
                                sort === 'desc' ? 'bg-[#ee4d2d] text-white' : 'text-gray-900 bg-white'
                            }`}
                            onClick={() => setSort('desc')}
                        >
                            mới nhất
                        </button>
                        <div className="relative group cursor-pointer md:w-auto w-1/3">
                            <div className="flex justify-between items-center md:w-48 w-full px-4 py-2 capitalize text-gray-900 bg-white">
                                {sort === 'price' || sort === '-price' ? null : <span>giá</span>}
                                {sort === 'price' && <span>giá: thấp đến cao</span>}
                                {sort === '-price' && <span>giá: cao đến thấp</span>}
                                <FaAngleDown className="text-gray-500" />
                            </div>
                            <div className="absolute z-10 group-hover:flex hidden right-0 left-0">
                                <div className="bg-white py-4 flex flex-col w-full gap-4 mt-[2px]">
                                    <button
                                        onClick={() => setSort('price')}
                                        className="capitalize ml-4 text-left hover:text-[#ee4d2d]"
                                    >
                                        giá: thấp đến cao
                                    </button>
                                    <button
                                        onClick={() => setSort('-price')}
                                        className="capitalize ml-4 text-left hover:text-[#ee4d2d]"
                                    >
                                        giá: cao đến thấp
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex md:justify-between justify-end md:pb-0 pb-3 items-center gap-2 pr-4">
                        <div className="flex justify-center text-sm items-center">
                            <span className="text-[#ee4d2d]">{products?.currentPage}</span>
                            <span>/{products?.totalPages}</span>
                        </div>

                        <div className="flex justify-center text-sm items-center">
                            <button
                                onClick={() => {
                                    products?.currentPage > 1 && setStatePage(statePage - 1);
                                }}
                                className={`px-4 py-2.5 ${
                                    statePage === 1
                                        ? 'bg-[#F9F9F9] text-gray-300 cursor-not-allowed'
                                        : 'bg-white text-gray-500'
                                }`}
                            >
                                <FaAngleLeft />
                            </button>
                            <button
                                onClick={() => {
                                    products?.totalPages > statePage && setStatePage(statePage + 1);
                                }}
                                className={`px-4 py-2.5 ${
                                    statePage === products?.totalPages
                                        ? 'bg-[#F9F9F9] text-gray-300 cursor-not-allowed'
                                        : 'bg-white text-gray-500'
                                }`}
                            >
                                <FaAngleRight />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mainCategory">
                    <div className="grid md:grid-cols-5 grid-cols-2 mt-1 px-[2px] gap-2.5">
                        {products?.results?.map((item, index) => (
                            <page.CardProduct
                                key={index}
                                title={item.name}
                                slug={item.slug}
                                img={item.imageURL[0]}
                                discount={item.variant[0].promotion}
                                sold={item.sold}
                                price={numeral(item.variant[0].price).format('0,0')}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
