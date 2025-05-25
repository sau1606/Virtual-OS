
import React from 'react';
import { Rnd } from 'react-rnd';

interface DesktopIconProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  position: { x: number; y: number };
  onPositionChange: (x: number, y: number) => void;
  id: string;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ 
  icon, 
  label, 
  onClick, 
  position, 
  onPositionChange,
  id 
}) => {
  return (
    <Rnd
      size={{ width: 80, height: 100 }}
      position={position}
      onDragStop={(e, d) => onPositionChange(d.x, d.y)}
      bounds="parent"
      dragHandleClassName="desktop-icon-handle"
    >
      <div 
        className="desktop-icon-handle flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-all duration-200 cursor-pointer group w-full h-full"
        onDoubleClick={onClick}
      >
        <div className="text-white/90 group-hover:text-white transition-colors group-hover:scale-110 transform duration-200">
          {icon}
        </div>
        <span className="text-white/80 text-xs font-medium group-hover:text-white transition-colors text-center leading-tight">
          {label}
        </span>
      </div>
    </Rnd>
  );
};

export default DesktopIcon;
