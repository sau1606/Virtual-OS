
import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  FileText, 
  Calculator as CalculatorIcon, 
  File,
  Settings,
  Camera,
  Image,
  Terminal as TerminalIcon
} from 'lucide-react';
import FileExplorer from '../components/FileExplorer';
import NotesApp from '../components/NotesApp';
import Notepad from '../components/Notepad';
import Calculator from '../components/Calculator';
import SettingsApp from '../components/SettingsApp';
import CameraApp from '../components/CameraApp';
import PhotosApp from '../components/PhotosApp';
import TerminalApp from '../components/TerminalApp';
import DesktopIcon from '../components/DesktopIcon';
import Taskbar from '../components/Taskbar';
import WindowContainer from '../components/WindowContainer';
import DesktopContextMenu from '../components/DesktopContextMenu';

interface AppWindow {
  id: string;
  title: string;
  component: React.ReactNode;
  isMinimized: boolean;
  isMaximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

interface IconPosition {
  id: string;
  x: number;
  y: number;
}

const Index = () => {
  const [windows, setWindows] = useState<AppWindow[]>([]);
  const [nextZIndex, setNextZIndex] = useState(1000);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [wallpaper, setWallpaper] = useState<string>('gradient');
  const [iconPositions, setIconPositions] = useState<IconPosition[]>([
    { id: 'fileexplorer', x: 50, y: 50 },
    { id: 'notes', x: 50, y: 170 },
    { id: 'notepad', x: 50, y: 290 },
    { id: 'calculator', x: 50, y: 410 },
    { id: 'terminal', x: 50, y: 530 },
    { id: 'camera', x: 150, y: 50 },
    { id: 'photos', x: 150, y: 170 },
    { id: 'settings', x: 150, y: 290 },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load saved wallpaper and icon positions
  useEffect(() => {
    const savedWallpaper = localStorage.getItem('desktop-wallpaper');
    if (savedWallpaper) {
      setWallpaper(savedWallpaper);
    }

    const savedPositions = localStorage.getItem('desktop-icon-positions');
    if (savedPositions) {
      setIconPositions(JSON.parse(savedPositions));
    }
  }, []);

  const handleWallpaperChange = (newWallpaper: string) => {
    setWallpaper(newWallpaper);
    localStorage.setItem('desktop-wallpaper', newWallpaper);
  };

  const handleIconPositionChange = (iconId: string, x: number, y: number) => {
    const newPositions = iconPositions.map(pos => 
      pos.id === iconId ? { ...pos, x, y } : pos
    );
    setIconPositions(newPositions);
    localStorage.setItem('desktop-icon-positions', JSON.stringify(newPositions));
  };

  const getIconPosition = (iconId: string) => {
    return iconPositions.find(pos => pos.id === iconId) || { x: 50, y: 50 };
  };

  const bringToFront = (id: string) => {
    setWindows(prev => prev.map(win => 
      win.id === id 
        ? { ...win, zIndex: nextZIndex, isMinimized: false }
        : win
    ));
    setNextZIndex(prev => prev + 1);
  };

  const openApp = (appType: 'fileexplorer' | 'notes' | 'notepad' | 'calculator' | 'settings' | 'camera' | 'photos' | 'terminal') => {
    const existingWindow = windows.find(win => win.id === appType);
    if (existingWindow) {
      bringToFront(appType);
      return;
    }

    const onPhotoTaken = (photoData: string) => {
      console.log('Photo taken:', photoData);
    };

    const apps = {
      fileexplorer: {
        title: 'File Explorer',
        component: <FileExplorer onClose={() => closeWindow('fileexplorer')} />,
        width: 800,
        height: 600
      },
      notes: {
        title: 'Notes',
        component: <NotesApp onClose={() => closeWindow('notes')} />,
        width: 400,
        height: 500
      },
      notepad: {
        title: 'Notepad',
        component: <Notepad onClose={() => closeWindow('notepad')} />,
        width: 600,
        height: 400
      },
      calculator: {
        title: 'Calculator',
        component: <Calculator onClose={() => closeWindow('calculator')} />,
        width: 300,
        height: 400
      },
      terminal: {
        title: 'Terminal',
        component: <TerminalApp onClose={() => closeWindow('terminal')} />,
        width: 700,
        height: 500
      },
      settings: {
        title: 'Settings',
        component: <SettingsApp onClose={() => closeWindow('settings')} onWallpaperChange={handleWallpaperChange} currentWallpaper={wallpaper} />,
        width: 800,
        height: 600
      },
      camera: {
        title: 'Camera',
        component: <CameraApp onClose={() => closeWindow('camera')} onPhotoTaken={onPhotoTaken} />,
        width: 700,
        height: 500
      },
      photos: {
        title: 'Photos',
        component: <PhotosApp onClose={() => closeWindow('photos')} />,
        width: 800,
        height: 600
      }
    };

    const app = apps[appType];
    const newWindow: AppWindow = {
      id: appType,
      title: app.title,
      component: app.component,
      isMinimized: false,
      isMaximized: false,
      x: Math.random() * 200 + 100,
      y: Math.random() * 100 + 50,
      width: app.width,
      height: app.height,
      zIndex: nextZIndex
    };

    setWindows(prev => [...prev, newWindow]);
    setNextZIndex(prev => prev + 1);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(win => win.id !== id));
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(win => 
      win.id === id ? { ...win, isMinimized: true } : win
    ));
  };

  const maximizeWindow = (id: string) => {
    setWindows(prev => prev.map(win => 
      win.id === id ? { ...win, isMaximized: !win.isMaximized } : win
    ));
  };

  const updateWindowPosition = (id: string, x: number, y: number) => {
    setWindows(prev => prev.map(win => 
      win.id === id ? { ...win, x, y } : win
    ));
  };

  const updateWindowSize = (id: string, width: number, height: number) => {
    setWindows(prev => prev.map(win => 
      win.id === id ? { ...win, width, height } : win
    ));
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleCreateFolder = () => {
    openApp('fileexplorer');
  };

  const handleCreateFile = () => {
    openApp('notepad');
  };

  const handleDisplaySettings = () => {
    openApp('settings');
  };

  const getBackgroundStyle = () => {
    if (wallpaper === 'gradient') {
      return {
        background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #312e81 100%)'
      };
    }
    return {
      backgroundImage: `url(${wallpaper})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    };
  };

  return (
    <div className="h-screen w-full overflow-hidden relative">
      {/* Desktop Background with Context Menu */}
      <DesktopContextMenu
        onRefresh={handleRefresh}
        onOpenSettings={() => openApp('settings')}
        onCreateFolder={handleCreateFolder}
        onCreateFile={handleCreateFile}
        onDisplaySettings={handleDisplaySettings}
        onWallpaperChange={handleWallpaperChange}
        currentWallpaper={wallpaper}
      >
        <div 
          className="absolute inset-0"
          style={getBackgroundStyle()}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          {wallpaper === 'gradient' && (
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>
          )}
        </div>
      </DesktopContextMenu>

      {/* Desktop Icons */}
      <div className="absolute inset-0 z-10">
        <DesktopIcon
          id="fileexplorer"
          icon={<Folder className="w-12 h-12" />}
          label="File Explorer"
          onClick={() => openApp('fileexplorer')}
          position={getIconPosition('fileexplorer')}
          onPositionChange={(x, y) => handleIconPositionChange('fileexplorer', x, y)}
        />
        <DesktopIcon
          id="notes"
          icon={<File className="w-12 h-12" />}
          label="Notes"
          onClick={() => openApp('notes')}
          position={getIconPosition('notes')}
          onPositionChange={(x, y) => handleIconPositionChange('notes', x, y)}
        />
        <DesktopIcon
          id="notepad"
          icon={<FileText className="w-12 h-12" />}
          label="Notepad"
          onClick={() => openApp('notepad')}
          position={getIconPosition('notepad')}
          onPositionChange={(x, y) => handleIconPositionChange('notepad', x, y)}
        />
        <DesktopIcon
          id="calculator"
          icon={<CalculatorIcon className="w-12 h-12" />}
          label="Calculator"
          onClick={() => openApp('calculator')}
          position={getIconPosition('calculator')}
          onPositionChange={(x, y) => handleIconPositionChange('calculator', x, y)}
        />
        <DesktopIcon
          id="terminal"
          icon={<TerminalIcon className="w-12 h-12" />}
          label="Terminal"
          onClick={() => openApp('terminal')}
          position={getIconPosition('terminal')}
          onPositionChange={(x, y) => handleIconPositionChange('terminal', x, y)}
        />
        <DesktopIcon
          id="camera"
          icon={<Camera className="w-12 h-12" />}
          label="Camera"
          onClick={() => openApp('camera')}
          position={getIconPosition('camera')}
          onPositionChange={(x, y) => handleIconPositionChange('camera', x, y)}
        />
        <DesktopIcon
          id="photos"
          icon={<Image className="w-12 h-12" />}
          label="Photos"
          onClick={() => openApp('photos')}
          position={getIconPosition('photos')}
          onPositionChange={(x, y) => handleIconPositionChange('photos', x, y)}
        />
        <DesktopIcon
          id="settings"
          icon={<Settings className="w-12 h-12" />}
          label="Settings"
          onClick={() => openApp('settings')}
          position={getIconPosition('settings')}
          onPositionChange={(x, y) => handleIconPositionChange('settings', x, y)}
        />
      </div>

      {/* Windows */}
      {windows.map(window => (
        <WindowContainer
          key={window.id}
          id={window.id}
          title={window.title}
          isMinimized={window.isMinimized}
          isMaximized={window.isMaximized}
          position={{ x: window.x, y: window.y }}
          size={{ width: window.width, height: window.height }}
          zIndex={window.zIndex}
          onClose={() => closeWindow(window.id)}
          onMinimize={() => minimizeWindow(window.id)}
          onMaximize={() => maximizeWindow(window.id)}
          onPositionChange={(x, y) => updateWindowPosition(window.id, x, y)}
          onSizeChange={(width, height) => updateWindowSize(window.id, width, height)}
          onFocus={() => bringToFront(window.id)}
        >
          {window.component}
        </WindowContainer>
      ))}

      {/* Taskbar */}
      <Taskbar 
        windows={windows}
        currentTime={currentTime}
        onWindowClick={bringToFront}
        onAppOpen={openApp}
      />
    </div>
  );
};

export default Index;
