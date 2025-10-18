"use client";
import React from 'react';
export const PixelFrame = ({ children, className = '', padding = 'p-1', inset = false }) => {
    const borderClasses = inset ? 'pixel-border-inset' : 'pixel-border-outset';
    return (<div className={`${borderClasses} ${className}`}>
      <div className={`w-full h-full ${padding} bg-white border border-gray-200`}>
        {children}
      </div>
    </div>);
};
//# sourceMappingURL=PixelFrame.js.map