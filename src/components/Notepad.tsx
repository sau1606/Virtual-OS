
import React, { useState, useEffect } from 'react';
import { FileText, Save, File } from 'lucide-react';

interface NotepadProps {
  onClose: () => void;
}

const Notepad: React.FC<NotepadProps> = ({ onClose }) => {
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('untitled.txt');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('os-notepad-current');
    if (saved) {
      const { content: savedContent, fileName: savedFileName } = JSON.parse(saved);
      setContent(savedContent);
      setFileName(savedFileName);
    }
  }, []);

  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [content]);

  const saveFile = () => {
    const fileData = {
      content,
      fileName,
      timestamp: Date.now()
    };

    // Save current file
    localStorage.setItem('os-notepad-current', JSON.stringify(fileData));
    
    // Save to file system
    const fileKey = `os-file-${fileName}`;
    localStorage.setItem(fileKey, content);
    
    setHasUnsavedChanges(false);
  };

  const newFile = () => {
    if (hasUnsavedChanges) {
      const shouldContinue = window.confirm('You have unsaved changes. Continue anyway?');
      if (!shouldContinue) return;
    }
    
    setContent('');
    setFileName('untitled.txt');
    setHasUnsavedChanges(false);
  };

  const openFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setContent(content);
          setFileName(file.name);
          setHasUnsavedChanges(false);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="h-full flex flex-col bg-white/5 backdrop-blur-sm">
      {/* Menu Bar */}
      <div className="p-3 border-b border-white/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-white/80" />
            <span className="text-white/90 font-medium">
              {fileName}{hasUnsavedChanges ? ' *' : ''}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={newFile}
            className="px-3 py-1 bg-white/10 text-white rounded text-sm hover:bg-white/20"
          >
            New
          </button>
          <button
            onClick={openFile}
            className="px-3 py-1 bg-white/10 text-white rounded text-sm hover:bg-white/20"
          >
            Open
          </button>
          <button
            onClick={saveFile}
            className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            <Save className="w-3 h-3" />
            Save
          </button>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="px-2 py-1 bg-white/10 text-white text-sm rounded border border-white/20 focus:border-white/40 outline-none"
            placeholder="File name"
          />
        </div>
      </div>

      {/* Text Editor */}
      <div className="flex-1 p-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full bg-transparent text-white resize-none outline-none font-mono text-sm leading-relaxed"
          placeholder="Start typing..."
        />
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 border-t border-white/10 text-white/60 text-xs">
        Lines: {content.split('\n').length} | Characters: {content.length}
      </div>
    </div>
  );
};

export default Notepad;
