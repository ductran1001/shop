/* eslint-disable @next/next/no-img-element */
import { IProduct } from '@/types';
import React from 'react';

type Props = {
    product: IProduct;
};

export const LeftCol = ({ product }: Props) => {
    const [activeImg, setActiveImg] = React.useState(0);
    return (
        <div className="flex flex-col md:w-[40%] w-full p-[15px]">
            <div className="mb-4">
                <img src={product?.imageURL[activeImg]} alt="" />
            </div>
            <div className="grid grid-cols-5 gap-1.5">
                {product?.imageURL?.map((image, index) => (
                    <div
                        onClick={() => setActiveImg(index)}
                        key={index}
                        className={`${activeImg === index ? 'border border-primary' : ''} cursor-pointer`}
                    >
                        <img src={image} alt="" />
                    </div>
                ))}
            </div>
        </div>
    );
};
