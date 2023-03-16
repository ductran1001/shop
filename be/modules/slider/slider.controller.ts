import { Request, Response } from 'express';
import SliderModel from './slider.model';
import { queryBuilder } from '../../config/queryBuilder';

export const createCrl = async (req: Request, res: Response) => {
    try {
        const { photos } = req.body;
        const doc = [];
        for (let index = 0; index < photos.length; index++) {
            const link = photos[index];
            doc.push(await SliderModel.create({ photo: link }));
        }

        res.json({ status: 'success', results: doc });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const getAllCtrl = async (req: Request, res: Response) => {
    try {
        let query = queryBuilder(req, res, SliderModel);

        const page = Number(req.query.page) * 1 || 1;
        const limit = Number(req.query.limit) * 1 || 100;
        const skip = (page - 1) * limit;
        const total = await query.clone().count();

        const doc = await query.skip(skip).limit(limit);

        res.status(200).json({
            status: 'success',
            count: doc.length,
            totalPages: Math.ceil(total / limit),
            results: doc,
        });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const getOneByIdCtrl = async (req: Request, res: Response) => {
    try {
        const doc = await SliderModel.findById(req.params.id);

        if (!doc) return res.status(404).json({ status: 'fail', message: 'NotFound' });

        return res.status(200).json({ status: 'success', results: doc });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const destroyCtrl = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const doc = await SliderModel.findByIdAndDelete(id);

        if (!doc) return res.status(404).json({ status: 'fail', message: 'NotFound' });

        return res.status(200).json({ status: 'success', results: doc });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const updateCtrl = async (req: Request, res: Response) => {
    try {
        const findDoc = await SliderModel.findById(req.params.id);

        if (!findDoc) return res.status(404).json({ status: 'fail', message: 'NotFound' });

        const doc = await SliderModel.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: { photo: req.body.photo },
            },
            { new: true }
        );
        res.json({ status: 'success', results: doc });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};
