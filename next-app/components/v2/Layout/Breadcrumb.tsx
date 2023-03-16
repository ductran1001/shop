import { IProduct } from '@/types';
import Link from 'next/link';
import React from 'react';
import { FaAngleRight } from 'react-icons/fa';

type Props = {
    product: IProduct;
};

export const Breadcrumb = ({ product }: Props) => {
    return (
        <div className="capitalize pb-2 md:mt-[105px] mt-[77px]">
            <div className="max-w-7xl mx-auto md:px-10 px-1.5 pt-6">
                <div className="flex flex-col gap-6">
                    <div className="w-full flex flex-wrap gap-1 text-sm">
                        <div className="flex items-center gap-1">
                            <Link href="/" className="text-gray-900">
                                Trang chủ
                            </Link>
                            <div className="text-gray-600">
                                <FaAngleRight />
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Link href={`/danh-muc/${product?.category?.slug}`} className="text-gray-900">
                                {product?.category?.name}
                            </Link>
                            <div className="text-gray-600">
                                <FaAngleRight />
                            </div>
                        </div>
                        <div className="inline-block md:max-w-[75%] max-w-[60%]">
                            <span className="text-gray-600 truncate block">{product?.name}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
