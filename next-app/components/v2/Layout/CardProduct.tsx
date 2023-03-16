/* eslint-disable @next/next/no-img-element */
import { ToSlug } from '@/lib/toSlug';
import Link from 'next/link';
import numeral from 'numeral';
import React from 'react';

interface IProps {
    title: string;
    slug?: string;
    img: string;
    discount: number | string;
    sold: number | string;
    price: number | string;
    cssHover?: boolean;
}

export const CardProduct: React.FC<IProps> = (props) => {
    const styles = props.cssHover ? '' : 'hover:border-[#ee4d2d]';
    return (
        <Link
            href={`/san-pham/${props.slug}`}
            className={`${styles} flex flex-col gap-2 bg-white shadow-md hover:-mt-1 hover:border`}
        >
            <div className="relative">
                <img src={props.img} alt="" />
                <div className="flex py-0.5 px-0.5 justify-center gap-0.5 items-center flex-col absolute bg-[#FFD839] top-0 right-0 text-white">
                    <span className="text-xs text-red-500 font-semibold mt-1">{numeral(props.discount).format()}%</span>
                    <span className="text-sm uppercase">giảm</span>
                </div>
            </div>
            <span className="title-product text-[12px] px-1.5 text-gray-900 mb-2.5">{props.title}</span>
            <div className="flex justify-between items-center px-1.5 py-2.5">
                <div className="text-base flex justify-center items-center text-[#ee4d2d]">
                    <span className="text-[10px] underline">₫</span>
                    <span>{props.price}</span>
                </div>
                <span className="text-xs text-gray-500">đã bán {props.sold}k</span>
            </div>
        </Link>
    );
};
