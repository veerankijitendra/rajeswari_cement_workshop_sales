"use client";

import React from 'react';

const Loading: React.FC = () => (
    <div className="flex items-center justify-center flex-col gap-2 h-full text-xl">
        <div
            className="animate-spin mr-4 w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full"
        />
        Loading...
    </div>
);

export default Loading;
