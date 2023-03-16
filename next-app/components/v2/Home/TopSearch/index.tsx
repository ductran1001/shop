/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { ToSlug } from '@/lib/toSlug';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const img1 = 'https://cf.shopee.vn/file/63d7bef820b88a57b5ae4713eb2d20d7';
const img2 = 'https://cf.shopee.vn/file/ee2b1da4a8393468cfdbae245f39f62c';
const img3 = 'https://cf.shopee.vn/file/94550b9f76bda3ed9a663ba245f82bc3';
const img4 = 'https://cf.shopee.vn/file/c5cdd578f01c71fc403a84ed78526149';
const img5 = 'https://cf.shopee.vn/file/ea3c6a73cbd32bddb8323c14b837b4de';
const img6 = 'https://cf.shopee.vn/file/6431a52274771497ff3cea935d2812b9';
const img7 = 'https://cf.shopee.vn/file/96ebd654d5f96234c688dffdc5702a71';
const img8 = 'https://cf.shopee.vn/file/6a4009578f33ab71905b149b280a8a52';
const img9 = 'https://cf.shopee.vn/file/14366e79819e771b109bbef1d8e72450';
const img10 = 'https://cf.shopee.vn/file/6d1416daa515aaf1a3c1b6c5fc47e07b';
const img11 = 'https://cf.shopee.vn/file/c302abe3c6a17063d1271f46ce542210';
const img12 = 'https://cf.shopee.vn/file/f661850cd92416d796df93ffbfd824d4';

const urlTop = 'https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/06720e49514cbd94b7552496b4de454a.png';

export const TopSearch = () => {
    return (
        <div className="section-topSearch">
            <div className="capitalize pb-2 max-w-7xl mx-auto px-10 pt-6">
                <div className="bg-white flex flex-col shadow-md">
                    <div className="header-topSearch flex justify-between px-5 border-b border-[#F2F2F2] py-4">
                        <span className="text-base text-[#ee4d2d] font-medium uppercase">tìm kiếm hàng đầu</span>
                        <a
                            href="#"
                            className="text-sm font-medium flex justify-between items-center gap-1.5 text-[#ee4d2d]"
                        >
                            <span>xem tất cả</span>
                            <span className="text-xs">{`>`}</span>
                        </a>
                    </div>

                    <Slide slidesToScroll={4} slidesToShow={6}>
                        <Item text="áo thun local brand" src={img1} sold={60} />
                        <Item text="son kem lì" src={img2} sold={97} />
                        <Item text="balo thời trang" src={img3} sold={99} />
                        <Item text="túi sách nữ" src={img4} sold={61} />
                        <Item text="bút mực gel" src={img5} sold={91} />
                        <Item text="quần ống rộng nữ" src={img6} sold={111} />
                        <Item text="cuộn len" src={img7} sold={141} />
                        <Item text="kính cường lực kingkong" src={img8} sold={77} />
                        <Item text="kem nền trang điểm" src={img9} sold={98} />
                        <Item text="ốp lưng iphone" src={img10} sold={229} />
                        <Item text="áo thun polo nam ngắn tay" src={img11} sold={62} />
                        <Item text="quần âu nam" src={img12} sold={60} />
                    </Slide>
                </div>
            </div>
        </div>
    );
};

const Item = ({ text, src, sold }: { text: string; src: string; sold: number }) => (
    <a href={`/${ToSlug(text)}`} className="flex flex-col py-2 my-2 gap-2.5 px-2">
        <div className="relative">
            <img src={src} alt="" className="" />
            <img src={urlTop} alt="" className="absolute w-6 h-8 top-0" />
            <span className="absolute bottom-0 opacity-95 py-0.5 font-medium bg-[#BDBDBD] left-3 text-sm right-3 text-white text-center">
                bán {sold}k+ / tháng
            </span>
        </div>
        <span className="top-search-title px-3 text-sm">{text}</span>
    </a>
);
