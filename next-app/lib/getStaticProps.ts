import { GetStaticProps } from 'next';
import { axiosClient } from './axiosClient';


export const getStaticProps: GetStaticProps = async (context) => {
    try {
        const getAllCategory = (await axiosClient.get('/api/category')) ?? [];
        const dataCategories = getAllCategory.data.contents;

        const getAllSliders = (await axiosClient.get('/api/slider')) ?? [];
        const dataSliders = getAllSliders.data.contents;

        // const getAllProducts = await axiosClient.get('/api/product');
        // const dataProducts = getAllProducts.data.products;

        const getAllProductsGroupCategory = (await axiosClient.get('/api/product-group-category')) ?? [];
        const dataProductsGroupCategory = getAllProductsGroupCategory.data;
        return {
            props: {
                dataSliders,
                dataCategories,
                // dataProducts,
                dataProductsGroupCategory,
            }, // will be passed to the page component as props
        };
    } catch (error) {
        return {
            props: {}, // will be passed to the page component as props
        };
    }
};
