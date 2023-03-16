/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React from 'react';
import { ICategory } from '@/types';

interface IProps {
    categories: ICategory[];
}

export const Category = ({ categories }: IProps) => {
    return (
        <div className="mt-[70px] section-category md:mt-0">
            <div className="px-1.5 pt-6 pb-2 mx-auto capitalize md:px-10 max-w-7xl">
                <div className="flex flex-col bg-white shadow-md">
                    <div className="flex flex-wrap items-center">
                        {categories?.map((category, index) => (
                            <Item key={index} category={category} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Item = ({ category }: { category: ICategory }) => (
    <Link
        href={`/danh-muc/${category.slug}`}
        className="text-sm flex min-h-[110px] gap-1.5 flex-col justify-center items-center text-center lg:w-[10%] w-[25%] border-r border-b hover:shadow-md border-[#F2F2F2]"
    >
        <div className="w-12 h-12 pt-2 mb-2">
            <img src={category.image} alt="" />
        </div>
        <span className="cate-text flex-1 leading-8 w-full mb-2.5">{category.name}</span>
    </Link>
);
