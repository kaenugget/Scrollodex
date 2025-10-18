"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface QRCodeDisplayProps {
  url: string;
  size?: number;
}

export function QRCodeDisplay({ url, size = 128 }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: size,
        margin: 2,
        color: {
          dark: '#10b981', // emerald-500
          light: '#ffffff',
        },
      }).catch((error) => {
        console.error('Error generating QR code:', error);
      });
    }
  }, [url, size]);

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} />
      <p className="text-xs text-gray-400 mt-2 text-center max-w-32 break-all">
        {url}
      </p>
    </div>
  );
}
