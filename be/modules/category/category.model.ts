import { Schema, model } from 'mongoose';
import { ICategory } from './category.interface';

const CategorySchema = new Schema(
    {
        name: { type: String, required: true, minLength: 3, trim: true },
        slug: { type: String, required: true, minLength: 3, unique: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        active: { type: Boolean, default: true },
        photos: { type: [String], required: true },
        position: { type: Number, default: 1 },
        softDelete: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default model<ICategory>('Category', CategorySchema);
