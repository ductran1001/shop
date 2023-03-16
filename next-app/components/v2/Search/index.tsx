/* eslint-disable @next/next/no-img-element */
import React from 'react';
import * as page from '@/components/v2';
import { IProduct } from '@/types';
import numeral from 'numeral';

interface IProps {
    products: IProduct[];
}

export const Search = ({ products }: IProps) => {
    const [slice, setSlice] = React.useState(30);
    return (
        <div className="section-suggest">
            <div className="capitalize pb-2 max-w-7xl mx-auto md:px-10 px-1.5 md:pt-6 pt-2.5">
                <div className="flex flex-col bg-white shadow-md">
                    <div className="header-suggest items-center flex justify-center px-5 border-b-4 border-[#ee4d2d] py-4">
                        <span className="md:text-base text-sm text-[#ee4d2d] font-medium uppercase">gợi ý hôm nay</span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 my-6 gap-2.5">
                    {products?.slice(0, slice).map((item, index) => (
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

                {slice < products?.length && (
                    <button
                        onClick={() => setSlice((prev) => prev + 30)}
                        className="py-2.5 px-4 md:w-1/3 w-full capitalize hover:shadow-md hover:bg-[#F0F0F0] text-gray-600 text-sm bg-white block mx-auto mb-6"
                    >
                        xem thêm
                    </button>
                )}
            </div>
        </div>
    );
};
