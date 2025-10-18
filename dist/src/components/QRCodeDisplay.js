"use client";
import { useEffect, useRef } from "react";
import QRCode from "qrcode";
export function QRCodeDisplay({ url, size = 128 }) {
    const canvasRef = useRef(null);
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
    return (<div className="flex flex-col items-center">
      <canvas ref={canvasRef}/>
      <p className="text-xs text-gray-400 mt-2 text-center max-w-32 break-all">
        {url}
      </p>
    </div>);
}
//# sourceMappingURL=QRCodeDisplay.js.map