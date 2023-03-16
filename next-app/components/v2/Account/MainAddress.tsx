import React from 'react';

export const MainAddress = () => {
    return (
        <div className="w-5/6 bg-white shadow-md">
            <div className="px-8 py-4">
                <div className="flex items-center justify-between border-b border-gray-300">
                    <span className="my-2 text-lg">Địa chỉ của tôi</span>
                </div>
            </div>
            <div className="flex pb-4 pt-2.5 px-8 gap-4">
                <div className="w-[60%]">
                    <form className="flex flex-col gap-8 px-4 pb-6">
                        <div className="flex items-center gap-2.5">
                            <label className="text-sm text-gray-600 w-28">họ và tên</label>
                            <input
                                className="flex-1 border border-gray-300 focus:outline-none py-2 px-2.5 text-gray-800"
                                type="text"
                            />
                        </div>
                        <div className="flex items-center gap-2.5">
                            <label className="text-sm text-gray-600 w-28">số điện thoại</label>
                            <input
                                className="flex-1 border border-gray-300 focus:outline-none py-2 px-2.5 text-gray-800"
                                type="text"
                            />
                        </div>
                        <div className="flex items-center gap-2.5">
                            <label className="text-sm text-gray-600 w-28">Tỉnh/ Thành phố</label>
                            <input
                                className="flex-1 border border-gray-300 focus:outline-none py-2 px-2.5 text-gray-800"
                                type="text"
                            />
                        </div>
                        <div className="flex items-center gap-2.5">
                            <label className="text-sm text-gray-600 w-28">địa chỉ cụ thể</label>
                            <input
                                className="flex-1 border border-gray-300 focus:outline-none py-2 px-2.5 text-gray-800"
                                type="text"
                            />
                        </div>

                        <button className="px-2.5 py-2 bg-primary text-white text-center ml-[122px]">Lưu</button>
                    </form>
                </div>
                <div className="w-[40%] border-l border-gray-300">
                    <div className="flex flex-col items-center gap-4 px-4 mx-auto">
                        <div className="flex flex-col gap-1.5 border border-primary px-4 py-2">
                            <div className="flex items-baseline gap-2">
                                <span className="pr-2 text-sm text-gray-800 border-r border-gray-200">Trần Đức</span>
                                <span className="text-sm text-gray-600">(+84) 702457732</span>
                            </div>
                            <span className="text-sm text-gray-600">411 nguyen phuoc nguyen</span>
                            <span className="text-sm text-gray-600">Phường An Khê, Quận Thanh Khê, Đà Nẵng</span>
                            <span className="py-1 text-sm cursor-pointer text-primary">mặc định</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
