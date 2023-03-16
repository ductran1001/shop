import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../modules/user/user.model';
import { IDecodeToken } from '../modules/user/user.interface';

export const getUserFromReq = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bearerToken = req.get('Authorization')?.replace('Bearer ', '');
        const payload = bearerToken && (jwt.decode(bearerToken as string, { json: true }) as IDecodeToken);

        const user = payload && (await UserModel.findById(payload.sub).select('-password'));

        if (!user) return res.status(404).json({ message: 'Invalid credentials' });

        req.user = user;

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: (error as Error).message });
    }
};
