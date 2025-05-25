
import React, { useState } from 'react';
import { X, Palette, Monitor } from 'lucide-react';

interface SettingsAppProps {
  onClose: () => void;
  onWallpaperChange: (wallpaper: string) => void;
  currentWallpaper: string;
}

const wallpapers = [
  { id: 'default', name: 'Default Gradient', url: 'gradient' },
  { id: 'nature1', name: 'Mountain Lake', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&h=1080&fit=crop' },
  { id: 'nature2', name: 'Forest Path', url: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=1920&h=1080&fit=crop' },
  { id: 'nature3', name: 'Ocean View', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&h=1080&fit=crop' },
  { id: 'nature4', name: 'Mountain Range', url: 'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=1920&h=1080&fit=crop' },
  { id: 'nature5', name: 'Starry Night', url: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=1920&h=1080&fit=crop' },
];

const SettingsApp: React.FC<SettingsAppProps> = ({ onClose, onWallpaperChange, currentWallpaper }) => {
  const [activeTab, setActiveTab] = useState('wallpaper');

  return (
    <div className="h-full bg-white/95 backdrop-blur-sm flex flex-col">
      <div className="flex-1 overflow-hidden">
        <div className="p-6 h-full">
          <div className="flex gap-6 h-full">
            {/* Sidebar */}
            <div className="w-48 bg-gray-50 rounded-lg p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('wallpaper')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'wallpaper' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <Palette className="w-4 h-4" />
                  Wallpaper
                </button>
                <button
                  onClick={() => setActiveTab('display')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'display' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                  Display
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1">
              {activeTab === 'wallpaper' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Choose Wallpaper</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {wallpapers.map((wallpaper) => (
                      <div
                        key={wallpaper.id}
                        onClick={() => onWallpaperChange(wallpaper.url)}
                        className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                          currentWallpaper === wallpaper.url ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="aspect-video">
                          {wallpaper.url === 'gradient' ? (
                            <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900" />
                          ) : (
                            <img
                              src={wallpaper.url}
                              alt={wallpaper.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                          {wallpaper.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'display' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Display Settings</h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium mb-2">Resolution</h3>
                      <p className="text-gray-600">1920 x 1080 (Recommended)</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium mb-2">Scale</h3>
                      <p className="text-gray-600">100% (Default)</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsApp;
