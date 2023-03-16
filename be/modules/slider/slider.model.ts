import { Schema, model } from 'mongoose';
import { ISlider } from './slider.interface';

const SliderSchema = new Schema(
    {
        photo: { type: String, required: true },
    },
    { timestamps: true }
);

export default model<ISlider>('Slider', SliderSchema);
