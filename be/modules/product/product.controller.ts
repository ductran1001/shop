import { Request, Response } from 'express';
import ProductModel from './product.model';
import slugify from 'slugify';

import { queryBuilder } from '../../config/queryBuilder';

interface IVariant {
    price: number;
    promotion: number;
    quantity: number;
    color: string;
}

export const createCrl = async (req: Request, res: Response) => {
    try {
        if (req.body?.variant?.length === 0)
            return res.status(500).json({ status: 'fail', message: 'input property is missing' });
        const check = req.body.variant.every((v: IVariant) => {
            if ((!v.price && !v.promotion && !v.quantity && !v.color) || v.color === '') {
                return false;
            } else if (v.quantity < 0 || v.price < 0) {
                return false;
            } else {
                return true;
            }
        });

        if (!check) return res.status(500).json({ status: 'fail', message: 'input property is invalid' });

        res.status(201).json({
            status: 'success',
            results: await ProductModel.create({
                ...req.body,
                price: req.body?.variant[0]?.price,
                slug: slugify(req.body.name),
            }),
        });
    } catch (error: any) {
        if (error.code === 11000) return res.status(409).json({ status: 'fail', message: 'document already exists' });

        return res.status(500).json({ status: 'fail', message: error });
    }
};

//Test Case
// ...?price=50000 or ?price=5000&promotion=10&....
//  ...?price[gte]=50000 or ?price[gte]=5000&promotion[gte]=10&....
// ...?sort=fieldName ->ascending order 12345
// ...?sort=-fieldName ->descending order 54321 ,
// ....?fields=name,durations,price
// ....?limit=10&page=2

export const getAllCtrl = async (req: Request, res: Response) => {
    try {
        let query = queryBuilder(req, res, ProductModel);

        // 2) Sorting
        if (req.query.sort && req.query.sort !== 'asc' && req.query.sort !== 'desc') {
            const sortBy = (req.query.sort as string).split(',').join(' ');
            query = query.sort(sortBy);
        } else if (req.query.sort === 'asc') {
            query = query.sort('createdAt');
        } else if (req.query.sort === 'desc') {
            query = query.sort('-createdAt');
        }

        //3) Field Limiting
        // Select pattern  .select("firstParam secondParam"), it will only show the selected field, add minus sign for excluding (include everything except the given params)
        if (req.query.fields) {
            const fields = (req.query.fields as string).split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        // 4) Pagination
        // page=2&limit=10, 1-10 page 1, 11-20 page 2, 21-30 page 3
        const page = Number(req.query.page) * 1 || 1;
        const limit = Number(req.query.limit) * 1 || 100;
        const skip = (page - 1) * limit;

        req.query.category ? (query = query.find({ category: req.query.category })) : (query = query.find({}));

        req.query.softDelete ? (query = query.find({ softDelete: req.query.softDelete })) : (query = query.find({}));

        const total = await query.clone().count();

        const doc = await query
            .skip(skip)
            .limit(limit)
            .populate([
                { path: 'category', select: 'slug name description' },
                { path: 'user', select: 'fullName role avatar email' },
            ]);

        res.status(200).json({
            status: 'success',
            count: doc.length,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            results: doc,
        });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const getSearchCtrl = async (req: Request, res: Response) => {
    try {
        const doc = await ProductModel.find({ name: { $regex: req.query.q, $options: 'i' } }).populate([
            { path: 'category', select: 'slug name description' },
            { path: 'user', select: 'fullName role avatar email' },
        ]);

        if (!doc) return res.status(404).json({ status: 'fail', message: 'NotFound' });

        return res.status(200).json({ status: 'success', results: doc });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const getOneByIdCtrl = async (req: Request, res: Response) => {
    try {
        const doc = await ProductModel.findById(req.params.id);

        if (!doc) return res.status(404).json({ status: 'fail', message: 'NotFound' });

        return res.status(200).json({ status: 'success', results: doc });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const getOneBySlugCtrl = async (req: Request, res: Response) => {
    try {
        const doc = await ProductModel.findOne({ slug: req.params.slug }).populate([
            { path: 'category', select: 'slug name description active' },
            { path: 'user', select: 'fullName role email phoneNumber' },
        ]);
        if (!doc) return res.status(404).json({ status: 'fail', message: 'NotFound' });

        const data = await ProductModel.find({ category: doc.category }).populate([
            { path: 'category', select: 'slug name description active' },
            { path: 'user', select: 'fullName role email phoneNumber' },
        ]);

        const related = data.filter((item) => item._id.toString() !== doc._id.toString());

        return res.status(200).json({ status: 'success', results: doc, related });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const getProductByCategoryId = async (req: Request, res: Response) => {
    try {
        const doc = await ProductModel.find({ category: req.params.id }).populate([
            { path: 'category', select: 'slug name description active' },
            { path: 'user', select: 'fullName role email phoneNumber' },
        ]);
        if (!doc) return res.status(404).json({ status: 'fail', message: 'NotFound' });

        return res.status(200).json({ status: 'success', results: doc });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const destroyCtrl = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const doc = await ProductModel.findByIdAndDelete(id);

        if (!doc) return res.status(404).json({ status: 'fail', message: 'NotFound' });

        return res.status(200).json({ status: 'success', results: doc });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const updateCtrl = async (req: Request, res: Response) => {
    try {
        if (req.body?.variant?.length === 0)
            return res.status(500).json({ status: 'fail', message: 'input property is missing' });
        const check = req.body.variant.every((v: IVariant) => {
            if ((!v.price && !v.promotion && !v.quantity && !v.color) || v.color === '') {
                return false;
            } else if (v.quantity < 0 || v.price < 0) {
                return false;
            } else {
                return true;
            }
        });

        if (!check) return res.status(500).json({ status: 'fail', message: 'input property is invalid' });

        const data = req.body.name
            ? { ...req.body, price: req.body?.variant[0]?.price, slug: slugify(req.body.name) }
            : { ...req.body, price: req.body?.variant[0]?.price };

        const findDoc = await ProductModel.findById(req.params.id);

        if (!findDoc) return res.status(404).json({ status: 'fail', message: 'NotFound' });

        const doc = await ProductModel.findOneAndUpdate({ _id: req.params.id }, { $set: data }, { new: true });
        res.json({ status: 'success', results: doc });
    } catch (error: any) {
        if (error.code === 11000) return res.status(409).json({ status: 'fail', message: 'document already exists' });

        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const deleteMultiCtrl = async (req: Request, res: Response) => {
    try {
        const arr = req.body.id;
        for (let index = 0; index < arr.length; index++) {
            await ProductModel.findOneAndUpdate(
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
            await ProductModel.findOneAndUpdate(
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
            await ProductModel.findOneAndDelete({ _id: arr[index] });
        }

        res.json({ status: 'success' });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const groupCategoryCtrl = async (req: Request, res: Response) => {
    try {
        res.send(
            await ProductModel.aggregate([
                {
                    $match: { active: true },
                },
                {
                    $lookup: {
                        from: 'users',
                        let: { user_id: '$user' },
                        pipeline: [
                            { $match: { $expr: { $eq: ['$_id', '$$user_id'] } } },
                            { $project: { fullName: 1, _id: 1, email: 1, avatar: 1 } },
                        ],
                        as: 'user',
                    },
                },
                { $unwind: '$user' },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category',
                        foreignField: '_id',
                        as: 'category',
                    },
                },
                { $unwind: '$category' },
                { $sort: { createdAt: -1 } },
                {
                    $group: {
                        _id: '$category._id',
                        count: { $sum: 1 },
                        name: { $first: '$category.name' },
                        products: { $push: '$$ROOT' },
                    },
                },
                { $sort: { _id: 1 } },
                {
                    $project: {
                        products: '$products',
                        count: 1,
                        name: 1,
                    },
                },
            ])
        );
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};
