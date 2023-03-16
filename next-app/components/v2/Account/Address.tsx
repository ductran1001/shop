import React from 'react';
import * as page from '@/components/v2';

export const Address = () => {
    return (
        <div className="capitalize pb-2 mt-[130px]">
            <div className="max-w-7xl mx-auto px-10 py-6">
                <div className="flex gap-6">
                    <page.SidebarAcc />
                    <page.MainAddress />
                </div>
            </div>
        </div>
    );
};
