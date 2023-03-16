import { Request, Response } from 'express';
import CategoryModel from './category.model';
import { queryBuilder } from '../../config/queryBuilder';
import { ToSlug } from '../../helper/slug';

export const create = async (req: Request, res: Response) => {
    try {
        res.status(201).json({
            status: 'success',
            results: await CategoryModel.create({ ...req.body, slug: ToSlug(req.body.name) }),
        });
    } catch (error: any) {
        if (error.code === 11000) return res.status(409).json({ status: 'fail', message: 'document already exists' });

        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const findAll = async (req: Request, res: Response) => {
    try {
        let query = queryBuilder(req, res, CategoryModel);

        const page = Number(req.query.page) * 1 || 1;
        const limit = Number(req.query.limit) * 1 || 100;
        const skip = (page - 1) * limit;

        if (req.query.sort && req.query.sort !== 'asc' && req.query.sort !== 'desc') {
            const sortBy = (req.query.sort as string).split(',').join(' ');
            query = query.sort(sortBy);
        } else if (req.query.sort === 'asc') {
            query = query.sort('createdAt');
        } else if (req.query.sort === 'desc') {
            query = query.sort('-createdAt');
        }

        req.query.softDelete ? (query = query.find({ softDelete: req.query.softDelete })) : (query = query.find({}));
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

export const findByCategoryId = async (req: Request, res: Response) => {
    try {
        res.json({ status: 'success', results: await CategoryModel.findById(req.params.id) });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const findByCategorySlug = async (req: Request, res: Response) => {
    try {
        res.json({ status: 'success', results: await CategoryModel.findOne({ slug: req.params.slug }) });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const findByIdAndDelete = async (req: Request, res: Response) => {
    try {
        const doc = await CategoryModel.findByIdAndDelete(req.params.id);

        if (!doc) return res.status(404).json({ status: 'fail', message: 'NotFound' });

        res.json({ status: 'success', results: await doc });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const findOneAndUpdate = async (req: Request, res: Response) => {
    try {
        const data = req.body.name ? { ...req.body, slug: ToSlug(req.body.name) } : { ...req.body };
        const findDoc = await CategoryModel.findById(req.params.id);

        if (!findDoc) return res.status(404).json({ status: 'fail', message: 'NotFound' });

        const doc = await CategoryModel.findOneAndUpdate({ _id: req.params.id }, { $set: data }, { new: true });
        res.json({ status: 'success', results: doc });
    } catch (error: any) {
        if (error.code === 11000) return res.status(409).json({ status: 'fail', message: 'document already exists' });
        console.log(error);
        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const deleteMultiCtrl = async (req: Request, res: Response) => {
    try {
        const arr = req.body.id;
        for (let index = 0; index < arr.length; index++) {
            await CategoryModel.findOneAndUpdate(
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
            await CategoryModel.findOneAndUpdate(
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
            await CategoryModel.findOneAndDelete({ _id: arr[index] });
        }

        res.json({ status: 'success' });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};
