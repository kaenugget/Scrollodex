"use client";

import { Button } from "@/components/ui/button";
import { X, Download, Share2 } from "lucide-react";

interface PhotoViewerProps {
  photoUrl: string;
  onClose: () => void;
}

export function PhotoViewer({ photoUrl, onClose }: PhotoViewerProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photoUrl;
    link.download = `moment-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Moment from Scrollodex',
          text: 'Check out this moment!',
          url: photoUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(photoUrl);
        alert('Photo URL copied to clipboard!');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="relative max-w-4xl max-h-full p-4">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Action Buttons */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="bg-black bg-opacity-50 text-white hover:bg-opacity-70"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="bg-black bg-opacity-50 text-white hover:bg-opacity-70"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Photo */}
        <img
          src={photoUrl}
          alt="Moment"
          className="max-w-full max-h-full object-contain rounded-lg"
          onClick={onClose}
        />
      </div>
    </div>
  );
}
