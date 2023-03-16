import userRouter from '../modules/user/user.route';
import authRouter from '../modules/auth/auth.route';
import uploadRouter from '../modules/upload/upload.route';
import uploadCloud from '../modules/upload/upload-Cloud';
import categoryRouter from '../modules/category/category.route';
import sliderRouter from '../modules/slider/slider.route';
import productRouter from '../modules/product/product.route';
import colorRouter from '../modules/color/color.route';
import brandRouter from '../modules/brand/brand.route';
import orderRouter from '../modules/order/order.route';

const routes = {
    userRouter,
    authRouter,
    uploadRouter,
    uploadCloud,
    categoryRouter,
    sliderRouter,
    productRouter,
    colorRouter,
    brandRouter,
    orderRouter,
};

export default routes;
