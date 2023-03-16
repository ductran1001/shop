import { Request, Response } from 'express';
import { IUser } from './user.interface';
import UserModel from './user.model';
import bcrypt from 'bcrypt';
import { queryBuilder } from '../../config/queryBuilder';

export const createCrl = async (req: Request, res: Response) => {
    try {
        const { fullName, email, password, avatar, address, phoneNumber } = req.body;

        const passwordHash = await bcrypt.hash(password, 12);

        await UserModel.create({ fullName, avatar, address, phoneNumber, email, password: passwordHash });

        res.status(201).json({ status: 'success' });
    } catch (error: any) {
        if (error.code === 11000) return res.status(409).json({ status: 'fail', message: 'document is already' });

        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const getAllCtrl = async (req: Request, res: Response) => {
    try {
        let query = queryBuilder(req, res, UserModel);

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

export const getOneCtrl = async (req: Request, res: Response) => {
    try {
        const doc = req.user as IUser;

        if (!doc) return res.status(404).json({ status: 'fail', message: 'User NotFound' });

        return res.status(200).json({ status: 'success', contents: doc });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const getOneByIdCtrl = async (req: Request, res: Response) => {
    try {
        const doc = await UserModel.findById(req.params.id).select('-password');

        if (!doc) return res.status(404).json({ status: 'fail', message: 'User NotFound' });

        return res.status(200).json({ status: 'success', contents: doc });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const destroyCtrl = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const doc = await UserModel.findByIdAndDelete(id);

        if (!doc) return res.status(404).json({ status: 'fail', message: 'User NotFound' });

        return res.status(200).json({ status: 'success', contents: doc });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};

export const updateCtrl = async (req: Request, res: Response) => {
    try {
        const { avatar, password, newPass, fullName, phoneNumber, address } = req.body;

        const findDoc = await UserModel.findById(req.params.id);

        if (!findDoc) return res.status(404).json({ status: 'fail', message: 'NotFound' });

        if (fullName || avatar || phoneNumber || address) {
            const doc = await UserModel.findOneAndUpdate(
                { _id: req.params.id },
                {
                    $set: {
                        fullName: fullName,
                        phoneNumber: phoneNumber,
                        address: address,
                        avatar: avatar,
                    },
                },
                { new: true }
            ).select('-password');
            return res.json({ status: 'success', contents: doc });
        }

        if (password && newPass) {
            if (newPass.length < 6)
                return res
                    .status(400)
                    .json({ status: 'fail', message: 'New Password must be at least 6 characters long' });

            const isCorrect = await bcrypt.compare(password, (findDoc as IUser).password);

            if (!isCorrect) return res.status(400).json({ status: 'fail', message: 'Wrong Credentials!.' });

            const passwordHash = await bcrypt.hash(newPass, 12);

            const userUpdate = await UserModel.findOneAndUpdate(
                { _id: req.params.id },
                {
                    $set: { password: passwordHash },
                },
                { new: true }
            ).select('-password');

            return res.json({ status: 'success', contents: userUpdate });
        } else {
            return res.status(400).json({ status: 'fail', message: 'Update Password Failed!' });
        }
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};
