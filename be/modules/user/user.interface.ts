import { Document } from 'mongoose';

export interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
    avatar: string;
    phoneNumber: string;
    address: string;
    role: string;
    _doc?: object;
}

export interface IDecodeRF {
    id: string;
    iat: number;
    exp: number;
}

export interface IDecodeToken {
    message: string;
    iat: number;
    exp: number;
    aud: string;
    iss: string;
    sub: string;
}
