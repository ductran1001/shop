import React from 'react';
import * as page from '@/components/v2';

export const Account = () => {
    return (
        <div className="capitalize pb-2 md:mt-[130px] mt-[70px]">
            <div className="max-w-7xl mx-auto md:px-10 px-1.5 py-6">
                <div className="flex md:flex-row flex-col gap-6">
                    <page.SidebarAcc />
                    <page.MainAcc />
                </div>
            </div>
        </div>
    );
};
