/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import { IProduct } from '@/types';
import * as page from '@/components/v2';
import numeral from 'numeral';

type Props = {
    related: IProduct[];
};

export const RelatedProduct = ({ related }: Props) => {
    return (
        <div className="section-related py-8">
            <div className="bg-white flex flex-col shadow-md">
                <div className="header-related flex justify-between px-5 border-b border-[#F2F2F2] py-4">
                    <span className="md:text-base text-sm text-[#ee4d2d] font-medium uppercase">
                        các sản phảm tương tự
                    </span>
                    <a
                        href="#"
                        className="text-sm font-medium flex justify-between items-center gap-1.5 text-[#ee4d2d]"
                    >
                        <span>xem tất cả</span>
                        <span className="text-xs -mt-[1px]">{`>`}</span>
                    </a>
                </div>

                <div className="px-2 py-2.5">
                    {/* <Slide slidesToScroll={4} slidesToShow={6}> */}
                    <div className="grid md:grid-cols-5 grid-cols-2 mt-1 px-[2px] gap-2.5">
                        {related?.slice(0, 20).map((item, index) => (
                            <page.CardProduct
                                key={index}
                                title={item.name}
                                slug={item.slug}
                                img={item.imageURL[0]}
                                discount={item.variant[0].promotion}
                                sold={item.sold}
                                price={numeral(item.variant[0].price).format('0,0')}
                                cssHover={true}
                            />
                        ))}
                    </div>

                    {/* </Slide> */}
                </div>
            </div>
        </div>
    );
};
