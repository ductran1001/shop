import React from 'react';

type Props = {};

export const Loading = (props: Props) => {
    return (
        <div className="flex items-center justify-center  space-x-2 animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
    );
};
