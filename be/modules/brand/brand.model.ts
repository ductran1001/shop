import { Schema, model } from 'mongoose';
import { IBrand } from './brand.interface';

const BrandSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

export default model<IBrand>('Brand', BrandSchema);
