import express from 'express';
import * as controller from './product.controller';
import { validator } from '../../utils/validator';
import { productSchema } from './product.schema';
import passport from 'passport';
const router = express.Router();

router.post(
    '/product',
    passport.authenticate('jwt', { session: false }),
    validator(productSchema),
    controller.createCrl
);

router.get('/product', controller.getAllCtrl);

router.get('/product/search', controller.getSearchCtrl);

router.get('/product/:id', controller.getOneByIdCtrl);

router.get('/product-get-by-slug/:slug', controller.getOneBySlugCtrl);

router.get('/product-get-by-catId/:id', controller.getProductByCategoryId);

router.delete('/product/:id', passport.authenticate('jwt', { session: false }), controller.destroyCtrl);

router.patch('/product-delete-multi', passport.authenticate('jwt', { session: false }), controller.deleteMultiCtrl);

router.patch('/product-restore-multi', passport.authenticate('jwt', { session: false }), controller.restoreMultiCtrl);

router.patch(
    '/product-delete-multi-trash',
    passport.authenticate('jwt', { session: false }),
    controller.deleteMultiTrashCtrl
);

router.patch(
    '/product/:id',
    passport.authenticate('jwt', { session: false }),
    validator(productSchema),
    controller.updateCtrl
);

router.get('/product-group-category', controller.groupCategoryCtrl);

export default router;
