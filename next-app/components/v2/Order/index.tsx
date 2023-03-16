import React from 'react';
import * as page from '@/components/v2';
import { IOrder } from '@/types';

interface IProps {
    order: IOrder[];
    setOrder: any;
}
export const Order = ({ order, setOrder }: IProps) => {
    return (
        <div className="capitalize pb-2 md:mt-[130px] mt-[70px]">
            <div className="md:px-10 px-1.5  py-6 mx-auto max-w-7xl">
                <div className="flex md:flex-row flex-col gap-6">
                    <page.SidebarAcc />
                    <page.MainOrder order={order} setOrder={setOrder} />
                </div>
            </div>
        </div>
    );
};
