import { IProduct } from '@/types';
import React from 'react';

type Props = {
    product: IProduct;
};
const MIN_TEXTAREA_HEIGHT = 32;
export const SectionDetail = ({ product }: Props) => {
    const textareaRef = React.useRef<any>(null);
    const [value, setValue] = React.useState(product?.description);
    React.useEffect(() => {
        // Reset height - important to shrink on delete
        textareaRef.current.style.height = 'inherit';
        // Set height
        textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, MIN_TEXTAREA_HEIGHT)}px`;
    }, [value]);
    return (
        <div className="flex flex-col gap-2.5 bg-white shadow-md mt-4">
            <div className="p-6">
                <h1 className="bg-[#FFFBF8] p-4 text-primary w-full text-lg">MÔ TẢ SẢN PHẨM</h1>
                <div className="flex flex-col p-4 text-sm gap-4">
                    <textarea
                        ref={textareaRef}
                        style={{
                            minHeight: MIN_TEXTAREA_HEIGHT,
                            resize: 'none',
                        }}
                        disabled
                        className="overflow-hidden focus:outline-none bg-white"
                        defaultValue={value}
                    />
                </div>
            </div>
        </div>
    );
};
