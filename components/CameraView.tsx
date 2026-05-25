import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

interface CameraViewProps {
  onStreamReady?: () => void;
  isActive: boolean;
}

export interface CameraHandle {
  capture: () => string | null;
}

const CameraView = forwardRef<CameraHandle, CameraViewProps>(({ onStreamReady, isActive }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useImperativeHandle(ref, () => ({
    capture: () => {
      if (!videoRef.current) return null;
      
      // Ensure we have dimensions
      const width = videoRef.current.videoWidth;
      const height = videoRef.current.videoHeight;
      
      if (width === 0 || height === 0) return null;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        ctx.drawImage(videoRef.current, 0, 0, width, height);
        return canvas.toDataURL('image/jpeg', 1.0); // Maximum quality for AI analysis
      }
      return null;
    }
  }));

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        // Request Ultra HD resolution (4K) with high frame rate for maximum clarity
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { min: 1280, ideal: 3840, max: 4096 }, 
            height: { min: 720, ideal: 2160, max: 2160 },
            frameRate: { ideal: 60 }
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // onloadedmetadata is crucial to know when video dimensions are ready
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(e => console.error("Play error:", e));
            onStreamReady?.();
          };
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    if (isActive) {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive, onStreamReady]);

  return (
    <div className="absolute inset-0 z-0">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        muted
        autoPlay
      />
    </div>
  );
});

export default CameraView;