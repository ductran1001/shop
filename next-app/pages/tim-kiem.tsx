import React from 'react';
import { GetServerSideProps } from 'next';
import { axiosClient } from '@/lib/axiosClient';
import { ICategory, IOrder, IProduct } from '@/types';
import * as page from '@/components/v2';

interface IProps {
    dataProductsSearch: IProduct[];
}

const SearchPage = ({ dataProductsSearch }: IProps) => {
    const pageTitle = 'Tìm Kiếm';
    const [order, setOrder] = React.useState<IOrder[]>([]);

    return (
        <page.Layout pageTitle={pageTitle} order={order} setOrder={setOrder}>
            <section className="section-category">
                <div className="capitalize pb-2 max-w-7xl mx-auto md:px-10 px-1.5 pt-6">
                    <div className="flex md:flex-row flex-col gap-2.5">
                        <page.Search products={dataProductsSearch} />
                    </div>
                </div>
            </section>
        </page.Layout>
    );
};

export default SearchPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const getAllProductSearch = await axiosClient.get(`/api/product/search?q=${context.query?.q}`);
        const dataProductsSearch = getAllProductSearch.data.results;
        // Pass post data to the page via props
        return { props: { dataProductsSearch } };
    } catch (error) {
        return { props: {} };
    }
};
