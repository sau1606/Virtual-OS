
import React, { useState, useEffect } from 'react';
import { Folder, FileText, Plus, Trash, File } from 'lucide-react';

interface FileSystemItem {
  name: string;
  type: 'file' | 'folder';
  path: string;
  content?: string;
  children?: FileSystemItem[];
}

interface FileExplorerProps {
  onClose: () => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ onClose }) => {
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>([]);
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [showNewItemInput, setShowNewItemInput] = useState(false);
  const [newItemType, setNewItemType] = useState<'file' | 'folder'>('file');

  useEffect(() => {
    loadFileSystem();
  }, []);

  const loadFileSystem = () => {
    const saved = localStorage.getItem('os-filesystem');
    if (saved) {
      setFileSystem(JSON.parse(saved));
    } else {
      const defaultFS: FileSystemItem[] = [
        {
          name: 'Documents',
          type: 'folder',
          path: '/Documents',
          children: [
            { name: 'welcome.txt', type: 'file', path: '/Documents/welcome.txt', content: 'Welcome to the virtual OS!' }
          ]
        },
        {
          name: 'Desktop',
          type: 'folder',
          path: '/Desktop',
          children: []
        }
      ];
      setFileSystem(defaultFS);
      localStorage.setItem('os-filesystem', JSON.stringify(defaultFS));
    }
  };

  const saveFileSystem = (newFS: FileSystemItem[]) => {
    localStorage.setItem('os-filesystem', JSON.stringify(newFS));
    setFileSystem(newFS);
  };

  const getCurrentFolder = (): FileSystemItem[] => {
    if (currentPath === '/') return fileSystem;
    
    const pathParts = currentPath.split('/').filter(p => p);
    let current = fileSystem;
    
    for (const part of pathParts) {
      const folder = current.find(item => item.name === part && item.type === 'folder');
      if (folder && folder.children) {
        current = folder.children;
      }
    }
    
    return current;
  };

  const createNewItem = () => {
    if (!newItemName.trim()) return;

    const newItem: FileSystemItem = {
      name: newItemName,
      type: newItemType,
      path: `${currentPath}${currentPath.endsWith('/') ? '' : '/'}${newItemName}`,
      content: newItemType === 'file' ? '' : undefined,
      children: newItemType === 'folder' ? [] : undefined
    };

    const updateFileSystem = (items: FileSystemItem[], path: string): FileSystemItem[] => {
      if (path === '/') {
        return [...items, newItem];
      }
      
      return items.map(item => {
        if (item.path === path && item.type === 'folder') {
          return {
            ...item,
            children: [...(item.children || []), newItem]
          };
        }
        if (item.children) {
          return {
            ...item,
            children: updateFileSystem(item.children, path)
          };
        }
        return item;
      });
    };

    const newFS = updateFileSystem(fileSystem, currentPath);
    saveFileSystem(newFS);
    setNewItemName('');
    setShowNewItemInput(false);
  };

  const deleteItem = (itemPath: string) => {
    const deleteFromFS = (items: FileSystemItem[]): FileSystemItem[] => {
      return items.filter(item => item.path !== itemPath).map(item => ({
        ...item,
        children: item.children ? deleteFromFS(item.children) : undefined
      }));
    };

    const newFS = deleteFromFS(fileSystem);
    saveFileSystem(newFS);
    setSelectedItem(null);
  };

  const navigateToFolder = (folderPath: string) => {
    setCurrentPath(folderPath);
    setSelectedItem(null);
  };

  const goBack = () => {
    if (currentPath === '/') return;
    const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
    setCurrentPath(parentPath);
  };

  const currentItems = getCurrentFolder();

  return (
    <div className="h-full flex flex-col bg-white/5 backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-white font-semibold">File Explorer</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white"
          >
            ×
          </button>
        </div>
        
        {/* Navigation */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={goBack}
            disabled={currentPath === '/'}
            className="px-3 py-1 bg-white/10 rounded disabled:opacity-50 text-white text-sm"
          >
            Back
          </button>
          <span className="text-white/80 text-sm">{currentPath}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              setNewItemType('folder');
              setShowNewItemInput(true);
            }}
            className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-200 rounded text-sm hover:bg-blue-500/30"
          >
            <Plus className="w-3 h-3" />
            Folder
          </button>
          <button
            onClick={() => {
              setNewItemType('file');
              setShowNewItemInput(true);
            }}
            className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-200 rounded text-sm hover:bg-green-500/30"
          >
            <Plus className="w-3 h-3" />
            File
          </button>
          {selectedItem && (
            <button
              onClick={() => deleteItem(selectedItem)}
              className="flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-200 rounded text-sm hover:bg-red-500/30"
            >
              <Trash className="w-3 h-3" />
              Delete
            </button>
          )}
        </div>

        {showNewItemInput && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder={`New ${newItemType} name`}
              className="flex-1 px-2 py-1 bg-white/10 text-white placeholder-white/50 rounded text-sm"
              autoFocus
            />
            <button
              onClick={createNewItem}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowNewItemInput(false);
                setNewItemName('');
              }}
              className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* File List */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-1 gap-2">
          {currentItems.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                if (item.type === 'folder') {
                  navigateToFolder(item.path);
                } else {
                  setSelectedItem(item.path);
                }
              }}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                selectedItem === item.path
                  ? 'bg-white/20'
                  : 'hover:bg-white/10'
              }`}
            >
              {item.type === 'folder' ? (
                <Folder className="w-5 h-5 text-blue-300" />
              ) : (
                <FileText className="w-5 h-5 text-white/80" />
              )}
              <span className="text-white/90 text-sm">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;
