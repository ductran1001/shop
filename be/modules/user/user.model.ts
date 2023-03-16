import { Schema, model } from 'mongoose';
import { IUser } from './user.interface';

const UserSchema = new Schema(
    {
        fullName: { type: String, minLength: 6, trim: true },
        email: { type: String, required: true, trim: true, unique: true },
        password: { type: String, required: true, minLength: 6 },
        avatar: { type: String, default: '/avatar_default.png' },
        role: { type: String, default: 'user' }, //  or admin
        phoneNumber: String,
        address: String,
    },
    { timestamps: true }
);

export default model<IUser>('User', UserSchema);
