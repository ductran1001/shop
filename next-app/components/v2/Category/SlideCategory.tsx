import React from 'react';
import { ICategory } from '@/types';
import * as page from '@/components/v2';

interface IProps {
    category: ICategory;
}
export const SlideCategory = ({ category }: IProps) => {
    return (
        <div className="bg-white capitalize pb-2 shadow-md md:mt-[130px] mt-[77px]">
            <div className="max-w-7xl mx-auto md:px-10 px-1.5 md:py-6 py-4">
                <div className="flex flex-col gap-6">
                    <div className="flex gap-2.5">
                        <div className="w-full slider">
                            <page.MySlider sliders={category?.photos} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
