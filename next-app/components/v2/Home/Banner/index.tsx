/* eslint-disable @next/next/no-img-element */
import React from 'react';

const banner = 'https://cf.shopee.vn/file/sg-50009109-4cace4252c4209cac556b1666a78b7be';

export const Banner = () => {
    return (
        <div className="section-banner">
            <div className="capitalize pb-2 max-w-7xl mx-auto md:px-10 px-1.5 md:pt-6 pt-2.5">
                <div className="flex flex-col bg-white shadow-md">
                    <img src={banner} alt="" className="h-14 lg:h-auto" />
                </div>
            </div>
        </div>
    );
};
