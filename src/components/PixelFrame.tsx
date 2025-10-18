"use client";

import React from 'react';

interface PixelFrameProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
  inset?: boolean;
}

export const PixelFrame: React.FC<PixelFrameProps> = ({ 
  children, 
  className = '', 
  padding = 'p-1', 
  inset = false 
}) => {
  const borderClasses = inset ? 'pixel-border-inset' : 'pixel-border-outset';
  
  return (
    <div className={`${borderClasses} ${className}`}>
      <div className={`w-full h-full ${padding} bg-neutral-800`}>
        {children}
      </div>
    </div>
  );
};
