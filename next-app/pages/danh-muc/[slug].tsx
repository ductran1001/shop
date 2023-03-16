import React from 'react';
import { GetStaticProps } from 'next';
import { axiosClient } from '@/lib/axiosClient';
import { ICategory, IOrder, IProduct, IProductsFilter } from '@/types';
import * as page from '@/components/v2';
import { useRouter } from 'next/router';

interface ICategoryPage {
    categories: ICategory[];
    category: ICategory;
    productsResponse: IProductsFilter;
    queryGetProductByCatId: string;
}

const CategoryPage = ({ categories, category, productsResponse, queryGetProductByCatId }: ICategoryPage) => {
    const Limit = 30;
    const [order, setOrder] = React.useState<IOrder[]>([]);
    const [statePage, setStatePage] = React.useState(1);
    const [products, setProducts] = React.useState(productsResponse);
    const categoryId = queryGetProductByCatId?.split('=')[1];
    const [sort, setSort] = React.useState('asc');
    const [price, setPrice] = React.useState({
        min: 1,
        max: 999999999999,
    });

    const callQueryPrice = `&price[lte]=${price.max}&price[gte]=${price.min}`;

    let productQuery = `${queryGetProductByCatId}&sort=${sort}${callQueryPrice}&limit=${Limit}&page=${statePage}`;

    React.useEffect(() => {
        const getProductSort = async () => {
            try {
                const response = await axiosClient.get(productQuery);
                setProducts(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        categoryId && getProductSort();
    }, [sort, productQuery, categoryId]);

    const router = useRouter();
    const slug = router.query?.slug;
    const pageTitle = category?.name ? `Danh Mục | ${category.name}` : 'Danh Mục';
    return (
        <page.Layout pageTitle={pageTitle} order={order} setOrder={setOrder}>
            <page.SlideCategory category={category as ICategory} />
            <section className="section-category">
                <div className="capitalize pb-2 max-w-7xl mx-auto md:px-10 px-1.5 pt-6">
                    <div className="flex md:flex-row flex-col gap-2.5">
                        <page.SidebarCategory
                            price={price}
                            setPrice={setPrice}
                            categories={categories}
                            slug={slug as string}
                        />
                        <page.MainCategory
                            setStatePage={setStatePage}
                            statePage={statePage}
                            sort={sort}
                            setSort={setSort}
                            products={products}
                        />
                    </div>
                </div>
            </section>
        </page.Layout>
    );
};

export default CategoryPage;

export async function getStaticPaths() {
    // Call an external API endpoint to get posts

    const getDataProducts = await axiosClient.get('/api/product');
    const data = getDataProducts.data.results ?? [];

    // Get the paths we want to prerender based on posts
    // In production environments, prerender all pages
    // (slower builds, but faster initial page load)
    const paths = data?.map((product: IProduct) => ({
        params: { slug: product.category._id },
    }));

    // { fallback: false } means other routes should 404
    return { paths, fallback: true };
}

export const getStaticProps: GetStaticProps = async (context) => {
    const slugCategory = context.params?.slug;
    const queryAllCategory = '/api/category?softDelete=false&sort=-position&active=true';
    const queryGetCategoryBySlug = `/api/category-by-slug/${slugCategory}`;

    try {
        const getDataCategories = (await axiosClient.get(queryAllCategory)) ?? [];
        const categories = getDataCategories.data.results;

        const getDataCategory = (await axiosClient.get(queryGetCategoryBySlug)) ?? [];
        const category = getDataCategory.data.results;

        const queryGetProductByCatId = `/api/product?category=${category._id}`;
        const getDataProductByCategoryId = (await axiosClient(`/api/product?category=${category._id}`)) ?? [];
        const productsResponse = getDataProductByCategoryId.data ?? [];

        return {
            props: {
                categories,
                category,
                productsResponse,
                queryGetProductByCatId,
            }, // will be passed to the page component as props
        };
    } catch (error) {
        return {
            props: {}, // will be passed to the page component as props
        };
    }
};
