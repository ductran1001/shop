import React from 'react';
import * as page from '@/components/v2';
import { GetStaticProps } from 'next';
import { axiosClient } from '@/lib/axiosClient';
import { IProduct, IOrder } from '@/types';

interface IProductDetailPage {
    product: IProduct;
    related: IProduct[];
}

const ProductDetailPage = ({ product, related }: IProductDetailPage) => {
    const [order, setOrder] = React.useState<IOrder[]>([]);

    const pageTitle = product?.name ? `Sản Phẩm | ${product.name}` : 'Sản Phẩm';

    return (
        <page.Layout pageTitle={pageTitle} order={order} setOrder={setOrder}>
            <page.Breadcrumb product={product} />
            <section className="section-product-detail">
                <div className="capitalize pb-2 max-w-7xl mx-auto md:px-10 px-1.5 pt-2.5">
                    <div className="flex md:flex-row flex-col gap-2.5 bg-white shadow-md">
                        <page.LeftCol product={product} />
                        <page.RightCol product={product} setOrder={setOrder} />
                    </div>

                    <page.SectionDetail product={product} />
                    <page.SectionRating />
                    <page.RelatedProduct related={related} />
                </div>
            </section>
        </page.Layout>
    );
};

export default ProductDetailPage;

export async function getStaticPaths() {
    // Call an external API endpoint to get posts

    const getDataProducts = (await axiosClient.get('/api/product')) ?? [];
    const data = getDataProducts.data.results;

    // Get the paths we want to prerender based on posts
    // In production environments, prerender all pages
    // (slower builds, but faster initial page load)
    const paths = data.map((product: IProduct) => ({
        params: { slug: product.slug },
    }));

    // { fallback: false } means other routes should 404
    return { paths, fallback: true };
}

export const getStaticProps: GetStaticProps = async (context) => {
    const slug = context.params?.slug;
    const queryGetProductBySlug = `/api/product-get-by-slug/${slug}`;

    try {
        // params contains the post `id`.
        // If the route is like /posts/1, then params.id is 1

        const getDataProducts = (await axiosClient(queryGetProductBySlug)) ?? [];
        const product = getDataProducts.data.results;
        const related = getDataProducts.data.related;

        // Pass post data to the page via props
        return { props: { product, related } };
    } catch (error) {
        return { props: {} };
    }
};
