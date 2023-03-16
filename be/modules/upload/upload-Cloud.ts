import express, { Request, Response } from 'express';
import { uploadCloud } from '../../config/cloudy';

const router = express.Router();

router.post('/:collectionName', uploadCloud.array('images', 10), function (req: Request, res: Response, next) {
    if (req.files?.length === 0) return res.status(500).json({ status: 'fail', message: 'file is required' });

    const result = (req.files as any).map((file: any) => file.path);

    res.json({ status: 'success', results: result });
});

export default router;
