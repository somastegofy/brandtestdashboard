import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Undo,
  Redo
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Enter text...',
  className = '',
  onFocus,
  onBlur
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });

  const updateContent = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  }, [onChange]);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateContent();
  }, [updateContent]);

  const handleSelection = useCallback(() => {
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const editorRect = editorRef.current.getBoundingClientRect();
        
        setToolbarPosition({
          top: rect.top - editorRect.top - 40,
          left: rect.left - editorRect.left + rect.width / 2
        });
        setShowToolbar(true);
      } else if (isFocused) {
        const selection = window.getSelection();
        if (selection && editorRef.current) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          const editorRect = editorRef.current.getBoundingClientRect();
          
          setToolbarPosition({
            top: rect.top - editorRect.top + 5,
            left: rect.left - editorRect.left + 20
          });
          setShowToolbar(true);
        }
      }
    }
  }, [isFocused]);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (editorRef.current && !editorRef.current.contains(e.target as Node)) {
        setShowToolbar(false);
        setIsFocused(false);
        if (onBlur) onBlur();
      }
    };

    const handleMouseUp = () => {
      setTimeout(handleSelection, 10);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleSelection, onBlur]);

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
    setTimeout(() => {
      if (editorRef.current) {
        const selection = window.getSelection();
        if (selection && editorRef.current.contains(selection.anchorNode)) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          const editorRect = editorRef.current.getBoundingClientRect();
          
          setToolbarPosition({
            top: rect.top - editorRect.top + 5,
            left: rect.left - editorRect.left + 20
          });
          setShowToolbar(true);
        }
      }
    }, 10);
  };

  const handleInput = () => {
    updateContent();
  };

  const ToolbarButton: React.FC<{
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
    isActive?: boolean;
  }> = ({ onClick, icon, title, isActive = false }) => (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
        isActive ? 'bg-gray-300' : ''
      }`}
    >
      {icon}
    </button>
  );

  const isCommandActive = (command: string): boolean => {
    return document.queryCommandState(command);
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={editorRef}
        contentEditable
        onFocus={handleFocus}
        onInput={handleInput}
        onMouseUp={handleSelection}
        className={`min-h-[80px] w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
          isFocused ? 'border-blue-500' : ''
        }`}
        style={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
      
      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>

      {(showToolbar || isFocused) && (
        <div
          className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-1 flex items-center gap-0.5"
          style={{
            top: showToolbar ? `${toolbarPosition.top}px` : '8px',
            left: showToolbar ? `${toolbarPosition.left}px` : '20px',
            transform: showToolbar ? 'translateX(-50%)' : 'none',
            marginTop: showToolbar ? '-8px' : '0'
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="flex items-center gap-0.5 border-r border-gray-200 pr-1">
            <ToolbarButton
              onClick={() => execCommand('undo')}
              icon={<Undo className="w-4 h-4" />}
              title="Undo"
            />
            <ToolbarButton
              onClick={() => execCommand('redo')}
              icon={<Redo className="w-4 h-4" />}
              title="Redo"
            />
          </div>

          <div className="flex items-center gap-0.5 border-r border-gray-200 pr-1 pl-1">
            <ToolbarButton
              onClick={() => execCommand('bold')}
              icon={<Bold className="w-4 h-4" />}
              title="Bold"
              isActive={isCommandActive('bold')}
            />
            <ToolbarButton
              onClick={() => execCommand('italic')}
              icon={<Italic className="w-4 h-4" />}
              title="Italic"
              isActive={isCommandActive('italic')}
            />
            <ToolbarButton
              onClick={() => execCommand('underline')}
              icon={<Underline className="w-4 h-4" />}
              title="Underline"
              isActive={isCommandActive('underline')}
            />
          </div>

          <div className="flex items-center gap-0.5 border-r border-gray-200 pr-1 pl-1">
            <ToolbarButton
              onClick={() => execCommand('justifyLeft')}
              icon={<AlignLeft className="w-4 h-4" />}
              title="Align Left"
              isActive={isCommandActive('justifyLeft')}
            />
            <ToolbarButton
              onClick={() => execCommand('justifyCenter')}
              icon={<AlignCenter className="w-4 h-4" />}
              title="Align Center"
              isActive={isCommandActive('justifyCenter')}
            />
            <ToolbarButton
              onClick={() => execCommand('justifyRight')}
              icon={<AlignRight className="w-4 h-4" />}
              title="Align Right"
              isActive={isCommandActive('justifyRight')}
            />
            <ToolbarButton
              onClick={() => execCommand('justifyFull')}
              icon={<AlignJustify className="w-4 h-4" />}
              title="Justify"
              isActive={isCommandActive('justifyFull')}
            />
          </div>

          <div className="flex items-center gap-0.5 pl-1">
            <ToolbarButton
              onClick={() => execCommand('insertUnorderedList')}
              icon={<List className="w-4 h-4" />}
              title="Bullet List"
              isActive={isCommandActive('insertUnorderedList')}
            />
            <ToolbarButton
              onClick={() => execCommand('insertOrderedList')}
              icon={<ListOrdered className="w-4 h-4" />}
              title="Numbered List"
              isActive={isCommandActive('insertOrderedList')}
            />
          </div>
        </div>
      )}
    </div>
  );
};

