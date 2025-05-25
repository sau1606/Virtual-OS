
import React from 'react';
import { Rnd } from 'react-rnd';
import { Monitor, Minus, Square, X } from 'lucide-react';

interface WindowContainerProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onPositionChange: (x: number, y: number) => void;
  onSizeChange: (width: number, height: number) => void;
  onFocus: () => void;
}

const WindowContainer: React.FC<WindowContainerProps> = ({
  id,
  title,
  children,
  isMinimized,
  isMaximized,
  position,
  size,
  zIndex,
  onClose,
  onMinimize,
  onMaximize,
  onPositionChange,
  onSizeChange,
  onFocus
}) => {
  if (isMinimized) return null;

  const windowStyle = isMaximized 
    ? { 
        position: 'fixed' as const, 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh',
        zIndex: zIndex + 1000
      }
    : undefined;

  if (isMaximized) {
    return (
      <div style={windowStyle}>
        <div 
          className="h-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden"
          onClick={onFocus}
        >
          <div className="window-header bg-white/10 backdrop-blur-sm px-4 py-3 flex items-center justify-between border-b border-white/10 cursor-move">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-white/80" />
              <span className="text-white/90 font-medium text-sm">{title}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMinimize();
                }}
                className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-colors flex items-center justify-center"
                title="Minimize"
              >
                <Minus className="w-2 h-2 text-yellow-900" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMaximize();
                }}
                className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 transition-colors flex items-center justify-center"
                title="Restore"
              >
                <Square className="w-2 h-2 text-green-900" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-colors flex items-center justify-center"
                title="Close"
              >
                <X className="w-2 h-2 text-red-900" />
              </button>
            </div>
          </div>
          <div className="h-full overflow-hidden" style={{ height: 'calc(100% - 60px)' }}>
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Rnd
      size={size}
      position={position}
      onDragStop={(e, d) => onPositionChange(d.x, d.y)}
      onResizeStop={(e, direction, ref, delta, position) => {
        onSizeChange(parseInt(ref.style.width), parseInt(ref.style.height));
        onPositionChange(position.x, position.y);
      }}
      style={{ zIndex }}
      dragHandleClassName="window-header"
      bounds="parent"
      minWidth={250}
      minHeight={200}
    >
      <div 
        className="h-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl overflow-hidden"
        onClick={onFocus}
      >
        <div className="window-header bg-white/10 backdrop-blur-sm px-4 py-3 flex items-center justify-between border-b border-white/10 cursor-move">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-white/80" />
            <span className="text-white/90 font-medium text-sm">{title}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMinimize();
              }}
              className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-colors flex items-center justify-center"
              title="Minimize"
            >
              <Minus className="w-2 h-2 text-yellow-900" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMaximize();
              }}
              className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 transition-colors flex items-center justify-center"
              title="Maximize"
            >
              <Square className="w-2 h-2 text-green-900" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-colors flex items-center justify-center"
              title="Close"
            >
              <X className="w-2 h-2 text-red-900" />
            </button>
          </div>
        </div>
        <div className="h-full overflow-hidden">
          {children}
        </div>
      </div>
    </Rnd>
  );
};

export default WindowContainer;
