
import React, { useState, useRef, useEffect } from 'react';
import { Terminal } from 'lucide-react';

interface TerminalAppProps {
  onClose: () => void;
}

interface TerminalCommand {
  command: string;
  output: string[];
  timestamp: Date;
}

const TerminalApp: React.FC<TerminalAppProps> = ({ onClose }) => {
  const [currentPath, setCurrentPath] = useState('/');
  const [commandHistory, setCommandHistory] = useState<TerminalCommand[]>([
    {
      command: 'Welcome to Virtual OS Terminal',
      output: ['Type "help" for available commands'],
      timestamp: new Date()
    }
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
    inputRef.current?.focus();
  }, [commandHistory]);

  const getFileSystem = () => {
    const saved = localStorage.getItem('os-filesystem');
    return saved ? JSON.parse(saved) : [];
  };

  const saveFileSystem = (fs: any[]) => {
    localStorage.setItem('os-filesystem', JSON.stringify(fs));
  };

  const executeCommand = (cmd: string) => {
    const parts = cmd.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output: string[] = [];

    switch (command) {
      case 'help':
        output = [
          'Available commands:',
          '  ls - list directory contents',
          '  cd <path> - change directory',
          '  mkdir <name> - create directory',
          '  pwd - print working directory',
          '  clear - clear terminal',
          '  touch <filename> - create file',
          '  help - show this help'
        ];
        break;

      case 'pwd':
        output = [currentPath];
        break;

      case 'ls':
        const fs = getFileSystem();
        const currentItems = getCurrentDirectoryItems(fs, currentPath);
        if (currentItems.length === 0) {
          output = ['Directory is empty'];
        } else {
          output = currentItems.map(item => 
            `${item.type === 'folder' ? 'd' : '-'}  ${item.name}`
          );
        }
        break;

      case 'cd':
        if (args.length === 0) {
          setCurrentPath('/');
          output = ['Changed to root directory'];
        } else {
          const newPath = resolvePath(currentPath, args[0]);
          if (directoryExists(getFileSystem(), newPath)) {
            setCurrentPath(newPath);
            output = [`Changed to ${newPath}`];
          } else {
            output = [`cd: ${args[0]}: No such directory`];
          }
        }
        break;

      case 'mkdir':
        if (args.length === 0) {
          output = ['mkdir: missing operand'];
        } else {
          const dirName = args[0];
          const fs = getFileSystem();
          const newDir = {
            name: dirName,
            type: 'folder',
            path: `${currentPath}${currentPath.endsWith('/') ? '' : '/'}${dirName}`,
            children: []
          };
          
          const updatedFs = addToFileSystem(fs, currentPath, newDir);
          saveFileSystem(updatedFs);
          output = [`Directory '${dirName}' created`];
        }
        break;

      case 'touch':
        if (args.length === 0) {
          output = ['touch: missing operand'];
        } else {
          const fileName = args[0];
          const fs = getFileSystem();
          const newFile = {
            name: fileName,
            type: 'file',
            path: `${currentPath}${currentPath.endsWith('/') ? '' : '/'}${fileName}`,
            content: ''
          };
          
          const updatedFs = addToFileSystem(fs, currentPath, newFile);
          saveFileSystem(updatedFs);
          output = [`File '${fileName}' created`];
        }
        break;

      case 'clear':
        setCommandHistory([]);
        return;

      case '':
        output = [];
        break;

      default:
        output = [`${command}: command not found`];
    }

    const newCommand: TerminalCommand = {
      command: cmd,
      output,
      timestamp: new Date()
    };

    setCommandHistory(prev => [...prev, newCommand]);
  };

  const getCurrentDirectoryItems = (fs: any[], path: string) => {
    if (path === '/') return fs;
    
    const pathParts = path.split('/').filter(p => p);
    let current = fs;
    
    for (const part of pathParts) {
      const folder = current.find(item => item.name === part && item.type === 'folder');
      if (folder && folder.children) {
        current = folder.children;
      } else {
        return [];
      }
    }
    
    return current;
  };

  const directoryExists = (fs: any[], path: string) => {
    if (path === '/') return true;
    
    const pathParts = path.split('/').filter(p => p);
    let current = fs;
    
    for (const part of pathParts) {
      const folder = current.find(item => item.name === part && item.type === 'folder');
      if (folder && folder.children) {
        current = folder.children;
      } else {
        return false;
      }
    }
    
    return true;
  };

  const resolvePath = (currentPath: string, relativePath: string) => {
    if (relativePath.startsWith('/')) return relativePath;
    if (relativePath === '..') {
      const parts = currentPath.split('/').filter(p => p);
      parts.pop();
      return '/' + parts.join('/');
    }
    if (relativePath === '.') return currentPath;
    
    return `${currentPath}${currentPath.endsWith('/') ? '' : '/'}${relativePath}`;
  };

  const addToFileSystem = (fs: any[], targetPath: string, newItem: any) => {
    if (targetPath === '/') {
      return [...fs, newItem];
    }
    
    return fs.map(item => {
      if (item.path === targetPath && item.type === 'folder') {
        return {
          ...item,
          children: [...(item.children || []), newItem]
        };
      }
      if (item.children) {
        return {
          ...item,
          children: addToFileSystem(item.children, targetPath, newItem)
        };
      }
      return item;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentCommand);
      setCurrentCommand('');
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const commands = commandHistory.filter(h => h.command !== 'Welcome to Virtual OS Terminal');
      if (commands.length > 0 && historyIndex < commands.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commands[commands.length - 1 - newIndex].command);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const commands = commandHistory.filter(h => h.command !== 'Welcome to Virtual OS Terminal');
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commands[commands.length - 1 - newIndex].command);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentCommand('');
      }
    }
  };

  return (
    <div className="h-full bg-black text-green-400 font-mono text-sm flex flex-col">
      <div className="flex items-center gap-2 p-2 bg-gray-900 border-b border-gray-700">
        <Terminal className="w-4 h-4" />
        <span className="text-white text-xs">Terminal</span>
      </div>
      
      <div 
        ref={terminalRef}
        className="flex-1 p-4 overflow-auto"
        onClick={() => inputRef.current?.focus()}
      >
        {commandHistory.map((cmd, index) => (
          <div key={index} className="mb-2">
            {cmd.command !== 'Welcome to Virtual OS Terminal' && (
              <div className="flex">
                <span className="text-blue-400">user@virtual-os</span>
                <span className="text-white">:</span>
                <span className="text-purple-400">{currentPath}</span>
                <span className="text-white">$ </span>
                <span>{cmd.command}</span>
              </div>
            )}
            {cmd.output.map((line, lineIndex) => (
              <div key={lineIndex} className="ml-0">
                {line}
              </div>
            ))}
          </div>
        ))}
        
        <div className="flex">
          <span className="text-blue-400">user@virtual-os</span>
          <span className="text-white">:</span>
          <span className="text-purple-400">{currentPath}</span>
          <span className="text-white">$ </span>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent outline-none flex-1 text-green-400"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default TerminalApp;
