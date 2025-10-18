
import React from 'react';
import { PIXEL_BORDER_CLASSES, PIXEL_BORDER_INSET_CLASSES } from '../lib/utils';

interface PixelFrameProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
  inset?: boolean;
}

export const PixelFrame: React.FC<PixelFrameProps> = ({ children, className = '', padding = 'p-1', inset = false }) => {
  const borderClasses = inset ? PIXEL_BORDER_INSET_CLASSES : PIXEL_BORDER_CLASSES;
  return (
    <div className={`${borderClasses} ${className}`}>
      <div className={`w-full h-full ${padding} bg-neutral-800`}>
        {children}
      </div>
    </div>
  );
};
