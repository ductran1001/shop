import React from 'react';
import { FaUserAlt } from 'react-icons/fa';

export const MainChangePass = () => {
    return (
        <div className="w-5/6 bg-white shadow-md">
            <div className="px-8 py-4">
                <div className="flex flex-col border-b border-gray-300">
                    <span className="text-lg">Đổi Mật Khẩu</span>
                    <span className="my-2 text-sm">
                        Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
                    </span>
                </div>
            </div>
            <div className="flex pb-4 pt-2.5 px-8 gap-4">
                <div className="w-[70%] mx-auto">
                    <form className="flex flex-col gap-8 px-4 pb-6">
                        <div className="flex items-center gap-2.5">
                            <label className="text-sm text-gray-600 w-36">Mật Khẩu Hiện Tại</label>
                            <input
                                className="flex-1 border border-gray-300 focus:outline-none py-2 px-2.5 text-gray-800"
                                type="text"
                            />
                        </div>
                        <div className="flex items-center gap-2.5">
                            <label className="text-sm text-gray-600 w-36">Mật Khẩu Mới</label>
                            <input
                                className="flex-1 border border-gray-300 focus:outline-none py-2 px-2.5 text-gray-800"
                                type="text"
                            />
                        </div>
                        <div className="flex items-center gap-2.5">
                            <label className="text-sm text-gray-600 w-36">Xác Nhận Mật Khẩu</label>
                            <input
                                className="flex-1 border border-gray-300 focus:outline-none py-2 px-2.5 text-gray-800"
                                type="text"
                            />
                        </div>
                        <button className="px-2.5 py-2 bg-primary text-white text-center ml-[154px]">Xác nhận</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
