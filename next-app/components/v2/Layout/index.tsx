import React from 'react';
import { useDispatch } from 'react-redux';
import { getUserApi } from '@/apis/auth.api';
import * as page from '@/components/v2';
import Head from 'next/head';
import { axiosClient } from '@/lib/axiosClient';

interface TypeLayout {
    children: React.ReactNode;
    pageTitle?: string;
    order?: any;
    setOrder?: any;
}

const getFromLocalStorage = (key: string) => {
    if (!key || typeof window === 'undefined') {
        return '';
    }
    return localStorage.getItem(key);
};

export const Layout: React.FC<TypeLayout> = ({ children, pageTitle, order, setOrder }) => {
    const dispatch = useDispatch();
    const pageName = pageTitle ? pageTitle : 'Thương mại điện tử';

    React.useEffect(() => {
        let token = getFromLocalStorage('token') as string;
        let refreshToken = getFromLocalStorage('refreshToken') as string;

        const getOrder = async () => {
            const queryOrder = '/api/order/by-user';
            try {
                const getDataOrders = await axiosClient.get(queryOrder);
                const orders = getDataOrders.status === 200 && getDataOrders.data?.results;

                setOrder(() => {
                    const newData = [orders];
                    return newData;
                });
            } catch (error) {
                console.log(error);
            }
        };
        if (token && refreshToken) {
            getUserApi(dispatch);
            getOrder();
        }
        if (!token || !refreshToken) window.localStorage.clear();
    }, [dispatch, setOrder]);

    return (
        <>
            <Head>
                <title>{pageName}</title>
                <meta name="description" content="Generated by Home" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <page.Header order={order} />
            <main className="main">{children}</main>
            <page.Footer />
        </>
    );
};
