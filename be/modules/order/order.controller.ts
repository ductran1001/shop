import { Request, Response } from 'express';
import OrderModel from './order.model';
import { queryBuilder } from '../../config/queryBuilder';
import { IUser } from '../user/user.interface';

export const createCrl = async (req: Request, res: Response) => {
    try {
        const { user, orderDetails } = req.body;
        const findOrder = await OrderModel.findOne({ user: req.body.user._id });

        if (findOrder) {
            const exitsOrder: any = findOrder.orderDetails.find(
                (e) => e.productId.toString() === orderDetails.productId.toString()
            );

            if (exitsOrder) {
                if (exitsOrder.color === orderDetails.color) {
                    const sum = exitsOrder.quantity + orderDetails.quantity;
                    const newData = { ...orderDetails, quantity: sum };
                    await OrderModel.findOneAndUpdate(
                        { user: req.body.user._id },
                        {
                            $pull: {
                                orderDetails: { _id: exitsOrder._id },
                            },
                        },
                        { new: true }
                    );
                    const response = await OrderModel.findOneAndUpdate(
                        { user: req.body.user._id },
                        {
                            $push: {
                                orderDetails: newData,
                            },
                        },
                        { new: true }
                    );
                    return res.status(201).json({ status: 'success', results: response });
                } else {
                    const response = await OrderModel.findOneAndUpdate(
                        { user: req.body.user._id },
                        {
                            $push: {
                                orderDetails,
                            },
                        },
                        { new: true }
                    );
                    return res.status(201).json({ status: 'success', results: response });
                }
            } else {
                const response = await OrderModel.findOneAndUpdate(
                    { user: req.body.user._id },
                    {
                        $push: {
                            orderDetails,
                        },
                    },
                    { new: true }
                );
                return res.status(201).json({ status: 'success', results: response });
            }
        } else {
            const doc = await OrderModel.create({
                user,
                orderDetails,
            });
            res.status(201).json({ status: 'success', results: doc });
        }
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const getAllCtrl = async (req: Request, res: Response) => {
    try {
        let query = queryBuilder(req, res, OrderModel);

        const page = Number(req.query.page) * 1 || 1;
        const limit = Number(req.query.limit) * 1 || 100;
        const skip = (page - 1) * limit;

        const total = await query.clone().count();

        const doc = await query.skip(skip).limit(limit).populate({ path: 'user', select: '-password' });

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

export const getAllByUserCtrl = async (req: Request, res: Response) => {
    try {
        const user = req.user as IUser;
        if (!user) return res.status(404).json({ status: 'fail', message: 'User NotFound' });

        const doc = await OrderModel.findOne({ user: user._id });

        if (!doc) return res.status(200).json({ status: 'success', results: [] });

        if (doc.orderDetails.length === 0) {
            await OrderModel.findOneAndDelete({ user: user._id });
            res.status(200).json({ status: 'success', results: [] });
        } else {
            res.json({ status: 'success', results: doc });
        }
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const getAllByUserIdCtrl = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (!id) return res.status(404).json({ status: 'fail', message: 'NotFound' });

        const doc = await OrderModel.findOne({ user: id }).populate({ path: 'user', select: '-password' });

        if (!doc) return res.status(200).json({ status: 'success', results: [] });

        if (doc.orderDetails.length === 0) {
            await OrderModel.findOneAndDelete({ user: id });
            res.status(200).json({ status: 'success', results: [] });
        } else {
            res.json({ status: 'success', results: doc });
        }
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const getOneByIdCtrl = async (req: Request, res: Response) => {
    try {
        const user = req.user as IUser;
        if (!user) return res.status(404).json({ status: 'fail', message: 'User NotFound' });

        const doc = await OrderModel.findOne({ user: user._id });

        if (!doc) return res.status(404).json({ status: 'fail', message: 'NotFound' });

        res.json({ status: 'success', results: doc });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const destroyCtrl = async (req: Request, res: Response) => {
    try {
        const { arrId } = req.body;
        const findOrder = await OrderModel.findOne({ user: req.body.user._id });

        if (findOrder) {
            const response = await OrderModel.findOneAndUpdate(
                { user: req.body.user._id },
                {
                    $pull: {
                        orderDetails: { _id: arrId },
                    },
                },
                { new: true }
            );

            res.json({ status: 'success', results: response });
        } else {
            res.json({ status: 'success', results: [] });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const destroyOneCtrl = async (req: Request, res: Response) => {
    try {
        const user = req.user as IUser;

        if (!user) return res.status(404).json({ status: 'fail', message: 'User NotFound' });

        const findOrder = await OrderModel.findOne({ user: user._id });

        if (!findOrder) return res.status(404).json({ status: 'fail', message: 'NotFound' });

        const exitsOrder: any = findOrder.orderDetails.find((e: any) => e._id.toString() === req.params.id);

        if (exitsOrder) {
            const newData = await OrderModel.findOneAndUpdate(
                { user: user._id },
                {
                    $pull: {
                        orderDetails: { _id: exitsOrder._id },
                    },
                },
                { new: true }
            );
            res.status(200).json({ status: 'success', results: newData });
        } else {
            res.status(500).json({ status: 'fail', message: 'some thing went wrong' });
        }
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const destroyByUserId = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        if (!id) return res.status(404).json({ status: 'fail', message: 'User NotFound' });

        const findOrder = await OrderModel.findOneAndDelete({ user: id });

        res.status(200).json({ status: 'success', results: findOrder });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const updateCtrl = async (req: Request, res: Response) => {
    try {
        const { arrId, status } = req.body;
        const findOrder = await OrderModel.findOne({ user: req.body.user._id });

        if (findOrder) {
            let data: any = [];
            for (let index = 0; index < arrId.length; index++) {
                const element = arrId[index];

                findOrder.orderDetails.map((item: any) => {
                    if (item._id.toString() === element) {
                        const newData = { ...item._doc };
                        const rest = { ...newData, status: status };
                        return data.push(rest);
                    }
                });
            }

            await OrderModel.findOneAndUpdate(
                { user: req.body.user._id },
                {
                    $pull: {
                        orderDetails: { _id: arrId },
                    },
                },
                { new: true }
            );
            const response = await OrderModel.findOneAndUpdate(
                { user: req.body.user._id },
                {
                    $push: {
                        orderDetails: data,
                    },
                },
                { new: true }
            );
            res.json({ status: 'success', results: response });
        } else {
            res.json({ status: 'success', results: [] });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 'fail', message: error });
    }
};
