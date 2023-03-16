import React from 'react';
import * as page from '@/components/v2';
import { IOrder } from '@/types';

const AccountPage = () => {
    const [order, setOrder] = React.useState<IOrder[]>([]);

    return (
        <page.Layout order={order} setOrder={setOrder}>
            <page.Account />
        </page.Layout>
    );
};

export default AccountPage;
