/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { ISlider } from '@/types';
import * as page from '@/components/v2';

const imgRight1 = 'https://cf.shopee.vn/file/vn-50009109-95c1aa2e13c5d9a48ec4f117a508520c_xhdpi';
const imgRight2 = 'https://cf.shopee.vn/file/vn-50009109-6f1919a0537b41d7450a1a4380dcbaae_xhdpi';

interface IProps {
    sliders: ISlider[];
}
export const SlideSection = ({ sliders }: IProps) => {
    return (
        <div className="md:block hidden bg-white capitalize pb-2 shadow-md mt-[130px]">
            <div className="px-10 py-6 mx-auto max-w-7xl">
                <div className="flex flex-col gap-6">
                    <div className="flex gap-2.5">
                        <div className="w-2/3 slider">
                            <page.SliderComponent sliders={sliders} />
                        </div>
                        <div className="flex flex-col w-1/3 gap-2">
                            <div>
                                <img src={imgRight1} alt="" />
                            </div>
                            <div>
                                <img src={imgRight2} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
