import { Request, Response } from 'express';
import BrandModel from './brand.model';
import { ToSlug } from '../../helper/slug';
import { queryBuilder } from '../../config/queryBuilder';

export const createCrl = async (req: Request, res: Response) => {
    try {
        const { title } = req.body;

        const slug = ToSlug(title);

        const doc = await BrandModel.create({ title, slug });

        res.status(201).json({ status: 'success', contents: doc });
    } catch (error: any) {
        if (error.code === 11000) return res.status(409).json({ status: 'fail', message: 'document already exists' });

        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const getAllCtrl = async (req: Request, res: Response) => {
    try {
        let query = queryBuilder(req, res, BrandModel);

        const page = Number(req.query.page) * 1 || 1;
        const limit = Number(req.query.limit) * 1 || 100;
        const skip = (page - 1) * limit;

        const total = await query.clone().count();

        const doc = await query.skip(skip).limit(limit);

        res.status(200).json({
            status: 'success',
            results: doc.length,
            pages: Math.ceil(total / limit),
            contents: doc,
        });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const getOneByIdCtrl = async (req: Request, res: Response) => {
    try {
        const doc = await BrandModel.findById(req.params.id);

        if (!doc) return res.status(404).json({ status: 'fail', message: 'NotFound' });

        return res.status(200).json({ status: 'success', contents: doc });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const getOneBySlugCtrl = async (req: Request, res: Response) => {
    try {
        const doc = await BrandModel.findOne({ slug: req.params.slug });

        if (!doc) return res.status(404).json({ status: 'fail', message: 'NotFound' });

        return res.status(200).json({ status: 'success', contents: doc });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const destroyCtrl = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const doc = await BrandModel.findByIdAndDelete(id);

        if (!doc) return res.status(404).json({ status: 'fail', message: 'NotFound' });

        return res.status(200).json({ status: 'success', contents: doc });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const updateCtrl = async (req: Request, res: Response) => {
    try {
        const { title } = req.body;

        const slug = ToSlug(title);

        const findDoc = await BrandModel.findById(req.params.id);

        if (!findDoc) return res.status(404).json({ status: 'fail', message: 'NotFound' });

        const doc = await BrandModel.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    title,
                    slug,
                },
            },
            { new: true }
        );
        res.json({ status: 'success', contents: doc });
    } catch (error: any) {
        if (error.code === 11000) return res.status(409).json({ status: 'fail', message: 'document already exists' });

        return res.status(500).json({ message: error.message });
    }
};

export const deleteMultiCtrl = async (req: Request, res: Response) => {
    try {
        const arr = req.body.id;
        for (let index = 0; index < arr.length; index++) {
            await BrandModel.findOneAndUpdate(
                { _id: arr[index] },
                {
                    $set: { softDelete: true },
                },
                { new: true }
            );
        }

        res.json({ status: 'success' });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const restoreMultiCtrl = async (req: Request, res: Response) => {
    try {
        const arr = req.body.id;
        for (let index = 0; index < arr.length; index++) {
            await BrandModel.findOneAndUpdate(
                { _id: arr[index] },
                {
                    $set: { softDelete: false },
                },
                { new: true }
            );
        }

        res.json({ status: 'success' });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const deleteMultiTrashCtrl = async (req: Request, res: Response) => {
    try {
        const arr = req.body.id;
        for (let index = 0; index < arr.length; index++) {
            await BrandModel.findOneAndDelete({ _id: arr[index] });
        }

        res.json({ status: 'success' });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};
