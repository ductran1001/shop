import { Request, Response } from 'express';
import { IDecodeRF, IUser } from '../user/user.interface';
import UserModel from '../user/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtSettings } from '../../config/constant';

export async function registerCtrl(req: Request, res: Response) {
    try {
        const { fullName, email, password } = req.body;

        const passwordHash = await bcrypt.hash(password, 12);

        await UserModel.create({ fullName, email, password: passwordHash });

        res.status(201).json({ status: 'success' });
    } catch (error: any) {
        if (error.code === 11000) return res.status(409).json({ status: 'fail', message: 'document already exists' });

        return res.status(500).json({ status: 'fail', message: error });
    }
}

export async function registerHomeCtrl(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        const passwordHash = await bcrypt.hash(password, 12);

        await UserModel.create({ email, password: passwordHash });

        res.status(201).json({ status: 'success' });
    } catch (error: any) {
        if (error.code === 11000) return res.status(409).json({ status: 'fail', message: 'document already exists' });

        return res.status(500).json({ status: 'fail', message: error });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const doc = await UserModel.findOne({ email: req.body.email });

        if (!doc) return res.status(401).json({ status: 'fail', message: 'Invalid Email Or Password' });

        const isMatch = bcrypt.compareSync(req.body.password, doc.password);

        if (!isMatch) return res.status(401).json({ status: 'fail', message: 'Invalid Email Or Password' });

        const { password, ...rest } = doc._doc as IUser;

        const id = doc._id.toString();

        const token = createToken(id);

        const refreshToken = createRfToken(id);

        const contents = { user: rest, token, refreshToken };

        return res.status(200).json({ status: 'success', contents });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};
export const refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(401).json({ status: 'fail', message: 'Not authorized. No token' });

    try {
        const decode = jwt.verify(refreshToken, jwtSettings.SECRET) as IDecodeRF;

        // console.log(decode);
        const { id } = decode;

        const user = await UserModel.findById(id).select('-password');

        if (!user) return res.status(404).json({ status: 'fail', message: 'Invalid credentials' });

        const token = createToken(user._id.toString());

        res.json({ token });
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};

const createToken = (id: string) => {
    const payload = { message: 'payload' };

    const secret = jwtSettings.SECRET;

    // ACCESS TOKEN
    const token = jwt.sign(payload, secret, {
        expiresIn: 24 * 60 * 60, //24 * 60 * 60, // expires in 24 hours (24 x 60 x 60)
        audience: jwtSettings.AUDIENCE,
        issuer: jwtSettings.ISSUER,
        subject: id, // Thường dùng để kiểm tra JWT lần sau
        algorithm: 'HS512',
    });

    return token;
};

const createRfToken = (id: string) => {
    const secret = jwtSettings.SECRET;

    const refreshToken = jwt.sign({ id }, secret, { expiresIn: '365d' });

    return refreshToken;
};
