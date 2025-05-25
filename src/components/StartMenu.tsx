
import React from 'react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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

interface StartMenuProps {
  children: React.ReactNode;
  onAppOpen: (appType: 'fileexplorer' | 'notes' | 'notepad' | 'calculator' | 'settings' | 'camera' | 'photos' | 'terminal') => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const apps = [
  { id: 'fileexplorer', name: 'File Explorer', icon: Folder },
  { id: 'notes', name: 'Notes', icon: File },
  { id: 'notepad', name: 'Notepad', icon: FileText },
  { id: 'calculator', name: 'Calculator', icon: CalculatorIcon },
  { id: 'terminal', name: 'Terminal', icon: TerminalIcon },
  { id: 'camera', name: 'Camera', icon: Camera },
  { id: 'photos', name: 'Photos', icon: Image },
  { id: 'settings', name: 'Settings', icon: Settings },
];

const StartMenu: React.FC<StartMenuProps> = ({ children, onAppOpen, open, onOpenChange }) => {
  const handleAppClick = (appId: string) => {
    console.log('App clicked:', appId);
    onAppOpen(appId as 'fileexplorer' | 'notes' | 'notepad' | 'calculator' | 'settings' | 'camera' | 'photos' | 'terminal');
    onOpenChange(false);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        side="top" 
        align="start" 
        className="w-80 p-0 bg-gray-900/95 backdrop-blur-xl border-white/20 mb-2 z-[9999]"
      >
        <div className="p-4">
          <h3 className="text-white/90 font-semibold mb-4">All Apps</h3>
          <div className="grid grid-cols-2 gap-2">
            {apps.map((app) => {
              const IconComponent = app.icon;
              return (
                <button
                  key={app.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAppClick(app.id);
                  }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors text-left w-full"
                >
                  <IconComponent className="w-8 h-8 text-white/90 flex-shrink-0" />
                  <span className="text-white/90 text-sm font-medium">{app.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default StartMenu;
