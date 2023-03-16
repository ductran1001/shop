/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { FaUserAlt, FaList } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export const SidebarAcc = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const { pathname } = useRouter();
    return (
        <div className="flex flex-col md:w-1/6 w-full">
            <div className="flex items-center gap-2 py-2 border-b border-gray-300">
                <div className="w-16 h-16 p-4 border border-gray-300 rounded-full">
                    <FaUserAlt className="w-full h-full text-gray-300" />
                </div>
                <div className="flex-1 text-sm">
                    <span className="font-semibold">{user?.fullName}</span>
                </div>
            </div>
            <div className="flex flex-col gap-4 py-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <FaUserAlt className="text-[#0D4EB2] w-5 h-4 opacity-70" />
                        <Link
                            href="/tai-khoan"
                            className={`flex-1 text-sm hover:text-primary ${
                                pathname === '/tai-khoan' ? 'text-primary' : ''
                            }`}
                        >
                            tài khoản của tôi
                        </Link>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <FaList className="text-[#0D4EB2] w-5 h-4 opacity-70" />
                    <Link
                        href="/don-mua"
                        className={`flex-1 text-sm hover:text-primary ${pathname === '/don-mua' ? 'text-primary' : ''}`}
                    >
                        đơn mua
                    </Link>
                </div>
            </div>
        </div>
    );
};
