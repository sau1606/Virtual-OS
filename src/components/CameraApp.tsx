
import React, { useRef, useState, useCallback } from 'react';
import { Camera, Square, RotateCcw, Download } from 'lucide-react';

interface CameraAppProps {
  onClose: () => void;
  onPhotoTaken: (photoData: string) => void;
}

const CameraApp: React.FC<CameraAppProps> = ({ onClose, onPhotoTaken }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
        setStream(mediaStream);
        setIsStreaming(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setError('Unable to access camera. Please check permissions and ensure you\'re using HTTPS.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsStreaming(false);
    }
  }, [stream]);

  const takePicture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const photoData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedPhoto(photoData);
        onPhotoTaken(photoData);
        
        // Save to localStorage photos with proper structure
        const photos = JSON.parse(localStorage.getItem('desktop-photos') || '[]');
        const newPhoto = {
          id: Date.now().toString(),
          data: photoData,
          timestamp: new Date().toISOString(),
          name: `Photo_${new Date().toISOString().slice(0, 19).replace(/[T:]/g, '_')}.jpg`
        };
        photos.push(newPhoto);
        localStorage.setItem('desktop-photos', JSON.stringify(photos));
        
        // Trigger storage event for real-time updates
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'desktop-photos',
          newValue: JSON.stringify(photos)
        }));
      }
    }
  }, [onPhotoTaken]);

  const downloadPhoto = useCallback(() => {
    if (capturedPhoto) {
      const link = document.createElement('a');
      link.download = `photo_${Date.now()}.jpg`;
      link.href = capturedPhoto;
      link.click();
    }
  }, [capturedPhoto]);

  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="h-full bg-black flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        {error && (
          <div className="text-center">
            <Camera className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={startCamera}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!isStreaming && !capturedPhoto && !error && (
          <div className="text-center">
            <Camera className="w-16 h-16 text-white/60 mx-auto mb-4" />
            <p className="text-white/80 mb-4">Click to start camera</p>
            <button
              onClick={startCamera}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Camera
            </button>
          </div>
        )}

        {isStreaming && (
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="rounded-lg max-w-full max-h-full"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
              <button
                onClick={takePicture}
                className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Square className="w-8 h-8 text-gray-800" />
              </button>
              <button
                onClick={stopCamera}
                className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
              >
                <RotateCcw className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        )}

        {capturedPhoto && (
          <div className="relative">
            <img
              src={capturedPhoto}
              alt="Captured"
              className="rounded-lg max-w-full max-h-full"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
              <button
                onClick={downloadPhoto}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={() => {
                  setCapturedPhoto(null);
                  startCamera();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Take Another
              </button>
            </div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraApp;
