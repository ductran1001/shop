import express from 'express';
import * as controller from './color.controller';
import { validator } from '../../utils/validator';
import { colorSchema } from './color.schema';
import passport from 'passport';
const router = express.Router();

router.post('/', passport.authenticate('jwt', { session: false }), validator(colorSchema), controller.createCrl);

router.get('/', controller.getAllCtrl);

router.get('/:id', controller.getOneByIdCtrl);

router.delete('/:id', passport.authenticate('jwt', { session: false }), controller.destroyCtrl);

router.patch('/:id', passport.authenticate('jwt', { session: false }), validator(colorSchema), controller.updateCtrl);

export default router;
