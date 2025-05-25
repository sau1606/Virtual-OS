
import React from 'react';
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from '@/components/ui/context-menu';
import { RefreshCw, Settings, Folder, FileText, Monitor, Palette, ArrowUpDown, Grid3X3 } from 'lucide-react';

interface DesktopContextMenuProps {
  children: React.ReactNode;
  onRefresh: () => void;
  onOpenSettings: () => void;
  onCreateFolder: () => void;
  onCreateFile: () => void;
  onDisplaySettings: () => void;
  onWallpaperChange: (wallpaper: string) => void;
  currentWallpaper: string;
}

const wallpapers = [
  { id: 'default', name: 'Default Gradient', url: 'gradient' },
  { id: 'nature1', name: 'Mountain Lake', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&h=1080&fit=crop' },
  { id: 'nature2', name: 'Forest Path', url: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=1920&h=1080&fit=crop' },
  { id: 'nature3', name: 'Ocean View', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&h=1080&fit=crop' },
];

const DesktopContextMenu: React.FC<DesktopContextMenuProps> = ({
  children,
  onRefresh,
  onOpenSettings,
  onCreateFolder,
  onCreateFile,
  onDisplaySettings,
  onWallpaperChange,
  currentWallpaper
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64 bg-white/90 backdrop-blur-sm border border-white/20">
        <ContextMenuSub>
          <ContextMenuSubTrigger className="flex items-center gap-2 cursor-pointer">
            <ArrowUpDown className="w-4 h-4" />
            Sort by
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem className="flex items-center gap-2 cursor-pointer">
              Name
            </ContextMenuItem>
            <ContextMenuItem className="flex items-center gap-2 cursor-pointer">
              Size
            </ContextMenuItem>
            <ContextMenuItem className="flex items-center gap-2 cursor-pointer">
              Date modified
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        
        <ContextMenuSub>
          <ContextMenuSubTrigger className="flex items-center gap-2 cursor-pointer">
            <Grid3X3 className="w-4 h-4" />
            View
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem className="flex items-center gap-2 cursor-pointer">
              Large icons
            </ContextMenuItem>
            <ContextMenuItem className="flex items-center gap-2 cursor-pointer">
              Medium icons
            </ContextMenuItem>
            <ContextMenuItem className="flex items-center gap-2 cursor-pointer">
              Small icons
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        <ContextMenuItem onClick={onRefresh} className="flex items-center gap-2 cursor-pointer">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuSub>
          <ContextMenuSubTrigger className="flex items-center gap-2 cursor-pointer">
            <Folder className="w-4 h-4" />
            New
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem onClick={onCreateFolder} className="flex items-center gap-2 cursor-pointer">
              <Folder className="w-4 h-4" />
              Folder
            </ContextMenuItem>
            <ContextMenuItem onClick={onCreateFile} className="flex items-center gap-2 cursor-pointer">
              <FileText className="w-4 h-4" />
              Text Document
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        <ContextMenuSub>
          <ContextMenuSubTrigger className="flex items-center gap-2 cursor-pointer">
            <Palette className="w-4 h-4" />
            Change Wallpaper
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            {wallpapers.map((wallpaper) => (
              <ContextMenuItem 
                key={wallpaper.id}
                onClick={() => onWallpaperChange(wallpaper.url)} 
                className={`flex items-center gap-2 cursor-pointer ${
                  currentWallpaper === wallpaper.url ? 'bg-blue-100' : ''
                }`}
              >
                {wallpaper.name}
              </ContextMenuItem>
            ))}
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuItem onClick={onDisplaySettings} className="flex items-center gap-2 cursor-pointer">
          <Monitor className="w-4 h-4" />
          Display Settings
        </ContextMenuItem>

        <ContextMenuItem onClick={onOpenSettings} className="flex items-center gap-2 cursor-pointer">
          <Settings className="w-4 h-4" />
          Settings
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default DesktopContextMenu;
