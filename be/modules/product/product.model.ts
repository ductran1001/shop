import { Schema, model } from 'mongoose';
import { IProduct } from './product.interface';

const ProductSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', require: true },
        category: { type: Schema.Types.ObjectId, ref: 'Category', require: true },
        imageURL: { type: Array, default: [] },
        active: { type: Boolean, default: true },
        softDelete: { type: Boolean, default: false },
        price: { type: Number, require: true },
        // brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
        // color: [{ type: Schema.Types.ObjectId, ref: 'Color', required: true }],
        // price: { type: Number, require: true },
        // promotion: { type: Number, default: 0 },
        // quantity: { type: Number, require: true },
        variant: { type: Array, required: true },
    },
    { timestamps: true }
);

export default model<IProduct>('Product', ProductSchema);
