import { Schema, model } from 'mongoose';
import { IOrder } from './order.interface';

const OrderSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', require: true },
        orderDetails: [
            {
                productId: { type: Schema.Types.ObjectId, ref: 'Product' },
                name: { type: String },
                slug: { type: String },
                status: { type: String, default: 'waiting' },
                image: { type: String },
                price: { type: Number },
                quantity: { type: Number },
                promotion: { type: Number },
                color: { type: String },
            },
        ],
    },
    { timestamps: true }
);

export default model<IOrder>('Order', OrderSchema);
