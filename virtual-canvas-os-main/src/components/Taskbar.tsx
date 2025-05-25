
import React, { useState } from 'react';
import { 
  Folder, 
  FileText, 
  Calculator as CalculatorIcon,
  File,
  Settings,
  Camera,
  Image,
  Terminal,
  Grid3X3
} from 'lucide-react';
import StartMenu from './StartMenu';

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

interface TaskbarProps {
  windows: AppWindow[];
  currentTime: Date;
  onWindowClick: (id: string) => void;
  onAppOpen: (appType: 'fileexplorer' | 'notes' | 'notepad' | 'calculator' | 'settings' | 'camera' | 'photos' | 'terminal') => void;
}

const Taskbar: React.FC<TaskbarProps> = ({ windows, currentTime, onWindowClick, onAppOpen }) => {
  const [startMenuOpen, setStartMenuOpen] = useState(false);

  const getAppIcon = (id: string) => {
    switch (id) {
      case 'fileexplorer':
        return <Folder className="w-5 h-5" />;
      case 'notes':
        return <File className="w-5 h-5" />;
      case 'notepad':
        return <FileText className="w-5 h-5" />;
      case 'calculator':
        return <CalculatorIcon className="w-5 h-5" />;
      case 'terminal':
        return <Terminal className="w-5 h-5" />;
      case 'settings':
        return <Settings className="w-5 h-5" />;
      case 'camera':
        return <Camera className="w-5 h-5" />;
      case 'photos':
        return <Image className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const handleAppOpen = (appType: 'fileexplorer' | 'notes' | 'notepad' | 'calculator' | 'settings' | 'camera' | 'photos' | 'terminal') => {
    console.log('Opening app from taskbar:', appType);
    onAppOpen(appType);
  };

  const handleWindowClick = (windowId: string) => {
    console.log('Window clicked:', windowId);
    onWindowClick(windowId);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-black/30 backdrop-blur-xl border-t border-white/10 z-[1000]">
      <div className="flex items-center justify-between h-full px-4">
        {/* Windows Start Button */}
        <div className="flex items-center gap-2">
          <StartMenu 
            onAppOpen={handleAppOpen} 
            open={startMenuOpen} 
            onOpenChange={setStartMenuOpen}
          >
            <button
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Start Menu"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Start button clicked, current state:', startMenuOpen);
                setStartMenuOpen(!startMenuOpen);
              }}
            >
              <Grid3X3 className="w-6 h-6 text-white/90" />
            </button>
          </StartMenu>

          {/* Quick Access Apps */}
          <button
            onClick={(e) => {
              e.preventDefault();
              handleAppOpen('fileexplorer');
            }}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="File Explorer"
          >
            <Folder className="w-6 h-6 text-white/90" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleAppOpen('notes');
            }}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Notes"
          >
            <File className="w-6 h-6 text-white/90" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleAppOpen('notepad');
            }}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Notepad"
          >
            <FileText className="w-6 h-6 text-white/90" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleAppOpen('calculator');
            }}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Calculator"
          >
            <CalculatorIcon className="w-6 h-6 text-white/90" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleAppOpen('terminal');
            }}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Terminal"
          >
            <Terminal className="w-6 h-6 text-white/90" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleAppOpen('camera');
            }}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Camera"
          >
            <Camera className="w-6 h-6 text-white/90" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleAppOpen('photos');
            }}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Photos"
          >
            <Image className="w-6 h-6 text-white/90" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleAppOpen('settings');
            }}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="w-6 h-6 text-white/90" />
          </button>
        </div>

        {/* Running Apps */}
        <div className="flex items-center gap-2">
          {windows.map(window => (
            <button
              key={window.id}
              onClick={(e) => {
                e.preventDefault();
                handleWindowClick(window.id);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                window.isMinimized 
                  ? 'bg-white/5 text-white/60' 
                  : 'bg-white/20 text-white/90'
              } hover:bg-white/30`}
            >
              {getAppIcon(window.id)}
              <span className="text-sm font-medium hidden sm:inline">
                {window.title}
              </span>
            </button>
          ))}
        </div>

        {/* System Time */}
        <div className="text-white/90 text-sm font-medium">
          {currentTime.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
};

export default Taskbar;
