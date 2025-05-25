
import React, { useState, useEffect } from 'react';
import { Image, Trash2, Download, ZoomIn } from 'lucide-react';

interface Photo {
  id: string;
  data: string;
  timestamp: string;
  name: string;
}

interface PhotosAppProps {
  onClose: () => void;
}

const PhotosApp: React.FC<PhotosAppProps> = ({ onClose }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    const loadPhotos = () => {
      const storedPhotos = JSON.parse(localStorage.getItem('desktop-photos') || '[]');
      setPhotos(storedPhotos);
    };

    loadPhotos();
    
    // Listen for storage changes to update photos in real-time
    const handleStorageChange = () => loadPhotos();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const deletePhoto = (photoId: string) => {
    const updatedPhotos = photos.filter(photo => photo.id !== photoId);
    setPhotos(updatedPhotos);
    localStorage.setItem('desktop-photos', JSON.stringify(updatedPhotos));
    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto(null);
    }
  };

  const downloadPhoto = (photo: Photo) => {
    const link = document.createElement('a');
    link.download = photo.name;
    link.href = photo.data;
    link.click();
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (selectedPhoto) {
    return (
      <div className="h-full bg-black flex flex-col">
        <div className="flex items-center justify-between p-4 bg-gray-900">
          <button
            onClick={() => setSelectedPhoto(null)}
            className="text-white hover:text-gray-300 transition-colors"
          >
            ← Back to Gallery
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => downloadPhoto(selectedPhoto)}
              className="p-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={() => deletePhoto(selectedPhoto.id)}
              className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <img
            src={selectedPhoto.data}
            alt={selectedPhoto.name}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
        <div className="p-4 bg-gray-900 text-white">
          <p className="font-medium">{selectedPhoto.name}</p>
          <p className="text-gray-400 text-sm">{formatDate(selectedPhoto.timestamp)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white/95 backdrop-blur-sm flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800">Photos</h1>
        <p className="text-gray-600">{photos.length} photos</p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {photos.length === 0 ? (
          <div className="text-center py-12">
            <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No photos yet</p>
            <p className="text-gray-400">Take some photos with the Camera app!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative group cursor-pointer"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={photo.data}
                    alt={photo.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-lg flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePhoto(photo.id);
                    }}
                    className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-600 truncate">{photo.name}</p>
                <p className="text-xs text-gray-400">{formatDate(photo.timestamp)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotosApp;
