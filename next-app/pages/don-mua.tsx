import React from 'react';
import * as page from '@/components/v2';
import { IOrder } from '@/types';

const OrderPage = () => {
    const [order, setOrder] = React.useState<IOrder[]>([]);
    return (
        <page.Layout order={order} setOrder={setOrder}>
            <page.Order order={order} setOrder={setOrder} />
        </page.Layout>
    );
};

export default OrderPage;
