import { Schema, model } from 'mongoose';
import { IColor } from './color.interface';

const ColorSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        code: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

export default model<IColor>('Color', ColorSchema);
