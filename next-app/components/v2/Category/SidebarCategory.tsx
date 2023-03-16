import { ICategory } from '@/types';
import Link from 'next/link';
import React from 'react';
import { FaAngleDown, FaFilter, FaList, FaPlay } from 'react-icons/fa';

interface IProps {
    categories: ICategory[];
    slug: string;
    price: {
        min: number;
        max: number;
    };
    setPrice: React.Dispatch<
        React.SetStateAction<{
            min: number;
            max: number;
        }>
    >;
}

const activeClass = 'text-[#ee4d2d] font-bold';

export const SidebarCategory = ({ categories, slug, setPrice, price }: IProps) => {
    const [slice, setSlice] = React.useState(3);
    const [statePrice, setStatePrice] = React.useState<{ min: number | string; max: number | string }>({
        min: 1,
        max: 999999999999,
    });
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStatePrice((prevState) => ({ ...prevState, [event.target.name]: event.target.value }));
    };
    const handleSubmitPrice = () => {
        statePrice.min === '' && setStatePrice((prevState) => ({ ...prevState, min: 1 }));
        statePrice.max === '' && setStatePrice((prevState) => ({ ...prevState, max: 999999999999 }));
        setPrice({
            min: statePrice.min as number,
            max: statePrice.max as number,
        });
    };
    return (
        <div className="capitalize flex flex-col md:w-1/6 w-full gap-4">
            <div className="all-category">
                <div className="flex items-center py-3 px-1 gap-2 border-b border-gray-300">
                    <FaList className="text-xs" />
                    <h1 className="text-base font-bold">tất cả danh mục</h1>
                </div>

                <div className="flex flex-col gap-3 text-sm mt-2 ml-1.5">
                    {categories?.slice(0, slice)?.map((category: ICategory) => (
                        <Link
                            key={category._id}
                            href={`/danh-muc/${category.slug}`}
                            className={`flex items-center gap-1 ${category.slug === slug ? activeClass : ''}`}
                        >
                            <FaPlay className="text-[8px]" />
                            <span>{category.name}</span>
                        </Link>
                    ))}

                    <button
                        onClick={() => {
                            categories?.length > slice ? setSlice(categories?.length) : setSlice(3);
                        }}
                        className="capitalize flex items-center gap-1"
                    >
                        {categories?.length > slice ? <span>thêm</span> : <span>thu gọn</span>}
                        <FaAngleDown className="text-[12px] text-gray-500" />
                    </button>
                </div>
            </div>
            <div className="all-filter">
                <div className="flex items-center py-3 px-1 gap-2 border-b border-gray-300">
                    <FaFilter className="text-xs" />
                    <h1 className="text-base font-bold">bộ lọc tìm kiếm</h1>
                </div>

                <div className="flex flex-col gap-3 my-2 text-sm ml-1.5 pb-4">
                    <h3 className="text-sm ">khoảng giá</h3>

                    <div className="flex gap-2">
                        <input
                            name="min"
                            type="number"
                            min={price.min}
                            max={price.max}
                            onChange={(event) => handleChange(event)}
                            placeholder="đ TỪ"
                            className="w-1/2 pl-1.5 pr-1 py-2 placeholder:text-xs focus:outline-none border border-gray-300 text-gray-900"
                        />
                        <input
                            name="max"
                            type="number"
                            min={price.min}
                            max={price.max}
                            onChange={(event) => handleChange(event)}
                            placeholder="đ ĐẾN"
                            className="w-1/2 pl-1.5 pr-1 py-2 placeholder:text-xs focus:outline-none border border-gray-300 text-gray-900"
                        />
                    </div>

                    <button
                        onClick={() => handleSubmitPrice()}
                        className="py-2 px-1.5 bg-[#ee4d2d] text-white uppercase"
                    >
                        <span>áp dụng</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
