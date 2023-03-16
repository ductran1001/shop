import express from 'express';
import * as controller from './user.controller';
import { getUserFromReq } from '../../middlewares/getUserFromReq';
import { validator } from '../../utils/validator';
import { userSchema } from './user.schema';

const router = express.Router();

router.get('/', controller.getAllCtrl);
router.post('/', validator(userSchema), controller.createCrl);
router.get('/me', getUserFromReq, controller.getOneCtrl);
router.get('/:id', controller.getOneByIdCtrl);
router.delete('/:id', controller.destroyCtrl);
router.patch('/:id', controller.updateCtrl);

router.get('/authentication', (req, res, next) => {
    res.send('OK');
});
export default router;
