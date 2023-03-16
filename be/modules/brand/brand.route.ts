import express from 'express';
import * as controller from './brand.controller';
import { validator } from '../../utils/validator';
import { brandSchema } from './brand.schema';
import passport from 'passport';
const router = express.Router();

router.post('/', passport.authenticate('jwt', { session: false }), validator(brandSchema), controller.createCrl);

router.get('/', controller.getAllCtrl);

router.get('/:id', controller.getOneByIdCtrl);

router.delete('/:id', passport.authenticate('jwt', { session: false }), controller.destroyCtrl);

router.patch('/:id', passport.authenticate('jwt', { session: false }), controller.updateCtrl);

export default router;
