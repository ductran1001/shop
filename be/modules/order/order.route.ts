import express from 'express';
import passport from 'passport';
import * as controller from './order.controller';
import { getUserFromReq } from '../../middlewares/getUserFromReq';

const router = express.Router();

router.post('/', passport.authenticate('jwt', { session: false }), controller.createCrl);

router.get('/', passport.authenticate('jwt', { session: false }), controller.getAllCtrl);

router.get('/by-user', passport.authenticate('jwt', { session: false }), getUserFromReq, controller.getAllByUserCtrl);

router.get(
    '/by-user/:id',
    passport.authenticate('jwt', { session: false }),
    getUserFromReq,
    controller.getAllByUserIdCtrl
);

router.get('/:id', passport.authenticate('jwt', { session: false }), controller.getOneByIdCtrl);

router.patch('/delete-all', passport.authenticate('jwt', { session: false }), getUserFromReq, controller.destroyCtrl);

router.delete(
    '/delete-one/:id',
    passport.authenticate('jwt', { session: false }),
    getUserFromReq,
    controller.destroyOneCtrl
);

router.delete('/delete-by-userId/:id', passport.authenticate('jwt', { session: false }), controller.destroyByUserId);

router.patch('/update', passport.authenticate('jwt', { session: false }), controller.updateCtrl);

export default router;
