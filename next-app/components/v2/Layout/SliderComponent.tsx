/* eslint-disable @next/next/no-img-element */
import 'react-slideshow-image/dist/styles.css';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { Slide } from 'react-slideshow-image';
import { ISlider } from '@/types';

interface IProps {
    sliders: ISlider[];
}
const properties = {
    prevArrow: (
        <button className="w-[30px] flex items-center justify-center py-2.5 border-0 bg-black opacity-20 hover:opacity-30">
            <FaAngleLeft className="w-6 h-6" fill="#fff" />
        </button>
    ),
    nextArrow: (
        <button className="w-[30px] flex items-center justify-center py-2.5 border-0 bg-black opacity-20 hover:opacity-30">
            <FaAngleRight className="w-6 h-6" fill="#fff" />
        </button>
    ),
};

export const SliderComponent = ({ sliders }: IProps) => {
    return (
        <Slide indicators={true} {...properties}>
            {sliders?.map((url, index) => (
                <img key={index} className="h-full" src={url.photo} alt="" />
            ))}
        </Slide>
    );
};
