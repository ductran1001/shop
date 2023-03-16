import React from 'react';
import { GetStaticProps } from 'next';
import { axiosClient } from '@/lib/axiosClient';
import { ICategory, ISlider, IProduct, IOrder } from '@/types';
import * as page from '@/components/v2';

interface IHomePage {
    categories: ICategory[];
    sliders: ISlider[];
    products: IProduct[];
}

const HomePage = ({ categories, sliders, products }: IHomePage) => {
    const [order, setOrder] = React.useState<IOrder[]>([]);

    return (
        <page.Layout order={order} setOrder={setOrder}>
            <page.SlideSection sliders={sliders} />
            <page.Category categories={categories} />
            <page.Banner />
            {/* <page.TopSearch /> */}
            <page.Suggest products={products} />
        </page.Layout>
    );
};

export default HomePage;

export const getStaticProps: GetStaticProps = async (context) => {
    const queryCategory = '/api/category?softDelete=false&sort=-position&active=true';
    const querySlider = '/api/slider';
    const queryProduct = '/api/product?softDelete=false&active=true';
    try {
        const getDataProducts = await axiosClient.get(queryProduct);
        const products = getDataProducts.data.results;

        const getDataCategories = (await axiosClient.get(queryCategory)) ?? [];
        const categories = getDataCategories.data.results;

        const getDataSliders = (await axiosClient.get(querySlider)) ?? [];
        const sliders = getDataSliders.data.results;

        return {
            props: {
                categories,
                sliders,
                products,
            }, // will be passed to the page component as props
        };
    } catch (error) {
        return {
            props: {}, // will be passed to the page component as props
        };
    }
};
