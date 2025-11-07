import React, { useRef, useState, useEffect } from 'react';

interface EnhancedRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const EnhancedRichTextEditor: React.FC<EnhancedRichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start writing...',
  className = ''
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      console.log('EnhancedRichTextEditor: Content changed:', content);
      onChange(content);
    }
  };

  const execCommand = (command: string, value?: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      handleInput();
    }
  };

  const insertHeading = (level: number) => {
    if (editorRef.current) {
      editorRef.current.focus();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const heading = document.createElement(`h${level}`);
        
        // Add proper styling for different heading sizes
        const headingStyles = {
          1: 'font-size: 2em; font-weight: bold; margin: 0.67em 0;',
          2: 'font-size: 1.5em; font-weight: bold; margin: 0.75em 0;',
          3: 'font-size: 1.17em; font-weight: bold; margin: 0.83em 0;',
          4: 'font-size: 1em; font-weight: bold; margin: 1.12em 0;',
          5: 'font-size: 0.83em; font-weight: bold; margin: 1.5em 0;'
        };
        
        heading.style.cssText = headingStyles[level as keyof typeof headingStyles] || '';
        heading.textContent = `Heading ${level}`;
        
        // If there's selected text, use it instead
        if (!selection.isCollapsed) {
          heading.textContent = selection.toString();
          range.deleteContents();
        }
        
        range.insertNode(heading);
        selection.removeAllRanges();
        selection.addRange(range);
        handleInput();
      } else {
        // Fallback to execCommand
        execCommand('formatBlock', `h${level}`);
      }
    }
  };

  const toggleFormat = (command: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false);
      handleInput();
    }
  };

  const insertCodeBlock = () => {
    const codeBlock = '<pre><code>Your code here</code></pre>';
    execCommand('insertHTML', codeBlock);
  };

  const insertQuote = () => {
    const quote = '<blockquote>Your quote here</blockquote>';
    execCommand('insertHTML', quote);
  };

  const insertList = (ordered: boolean = false) => {
    const listTag = ordered ? 'ol' : 'ul';
    const listItem = `<li>List item</li>`;
    const list = `<${listTag}>${listItem}</${listTag}>`;
    execCommand('insertHTML', list);
  };

  const insertIcon = () => {
    const icon = '🔖'; // Default icon, you can customize this
    execCommand('insertText', icon);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      if (editorRef.current) {
        editorRef.current.focus();
        const selection = window.getSelection();
        
        if (selection && !selection.isCollapsed) {
          // If text is selected, create link with selected text
          const range = selection.getRangeAt(0);
          const link = document.createElement('a');
          link.href = url;
          link.textContent = selection.toString();
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          
          range.deleteContents();
          range.insertNode(link);
          selection.removeAllRanges();
          selection.addRange(range);
          handleInput();
        } else {
          // If no text selected, insert link with URL as text
          const link = document.createElement('a');
          link.href = url;
          link.textContent = url;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          
          const range = selection?.getRangeAt(0) || document.createRange();
          range.insertNode(link);
          selection?.removeAllRanges();
          selection?.addRange(range);
          handleInput();
        }
      }
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      const img = `<img src="${url}" alt="Image" style="max-width: 100%; height: auto;" />`;
      execCommand('insertHTML', img);
    }
  };

  const insertTable = () => {
    const table = `
      <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Header 1</th>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Header 2</th>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">Cell 1</td>
          <td style="border: 1px solid #ddd; padding: 8px;">Cell 2</td>
        </tr>
      </table>
    `;
    execCommand('insertHTML', table);
  };

  const insertHorizontalRule = () => {
    execCommand('insertHTML', '<hr style="margin: 20px 0;" />');
  };

  const ToolbarButton: React.FC<{
    onClick: () => void;
    title: string;
    children: React.ReactNode;
    active?: boolean;
  }> = ({ onClick, title, children, active = false }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded hover:bg-gray-100 transition-colors ${
        active ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
      }`}
    >
      {children}
    </button>
  );

  const ToolbarSeparator = () => <div className="w-px h-6 bg-gray-300 mx-1" />;

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap items-center gap-1">
        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <ToolbarButton onClick={() => toggleFormat('bold')} title="Bold">
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton onClick={() => toggleFormat('italic')} title="Italic">
            <em>I</em>
          </ToolbarButton>
          <ToolbarButton onClick={() => toggleFormat('underline')} title="Underline">
            <u>U</u>
          </ToolbarButton>
          <ToolbarButton onClick={() => toggleFormat('strikeThrough')} title="Strikethrough">
            <s>S</s>
          </ToolbarButton>
        </div>

        <ToolbarSeparator />

        {/* Headings */}
        <div className="flex items-center gap-1">
          <ToolbarButton onClick={() => insertHeading(1)} title="Heading 1">
            H1
          </ToolbarButton>
          <ToolbarButton onClick={() => insertHeading(2)} title="Heading 2">
            H2
          </ToolbarButton>
          <ToolbarButton onClick={() => insertHeading(3)} title="Heading 3">
            H3
          </ToolbarButton>
          <ToolbarButton onClick={() => insertHeading(4)} title="Heading 4">
            H4
          </ToolbarButton>
          <ToolbarButton onClick={() => insertHeading(5)} title="Heading 5">
            H5
          </ToolbarButton>
        </div>

        <ToolbarSeparator />

        {/* Lists */}
        <div className="flex items-center gap-1">
          <ToolbarButton onClick={() => insertList(false)} title="Bullet List">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => insertList(true)} title="Numbered List">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <path d="M3 6h1v4"/>
              <path d="M3 10h2"/>
              <path d="M4 18H3v-4"/>
              <path d="M3 14h2"/>
            </svg>
          </ToolbarButton>
        </div>

        <ToolbarSeparator />

        {/* Special Elements */}
        <div className="flex items-center gap-1">
          <ToolbarButton onClick={insertQuote} title="Quote">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
            </svg>
          </ToolbarButton>
          <ToolbarButton onClick={insertCodeBlock} title="Code Block">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16,18 22,12 16,6"/>
              <polyline points="8,6 2,12 8,18"/>
            </svg>
          </ToolbarButton>
        </div>

        <ToolbarSeparator />

        {/* Media & Links */}
        <div className="flex items-center gap-1">
          <ToolbarButton onClick={insertLink} title="Insert Link">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </ToolbarButton>
          <ToolbarButton onClick={insertImage} title="Insert Image">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21,15 16,10 5,21"/>
            </svg>
          </ToolbarButton>
        </div>

        <ToolbarSeparator />

        {/* Table & Layout */}
        <div className="flex items-center gap-1">
          <ToolbarButton onClick={insertTable} title="Insert Table">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
            </svg>
          </ToolbarButton>
          <ToolbarButton onClick={insertHorizontalRule} title="Horizontal Rule">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"/>
            </svg>
          </ToolbarButton>
        </div>

        <ToolbarSeparator />

        {/* Icons & Special */}
        <div className="flex items-center gap-1">
          <ToolbarButton onClick={insertIcon} title="Insert Icon">
            😊
          </ToolbarButton>
        </div>

        <ToolbarSeparator />

        {/* Text Alignment */}
        <div className="flex items-center gap-1">
          <ToolbarButton onClick={() => toggleFormat('justifyLeft')} title="Align Left">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="21" y1="10" x2="7" y2="10"/>
              <line x1="21" y1="6" x2="3" y2="6"/>
              <line x1="21" y1="14" x2="3" y2="14"/>
              <line x1="21" y1="18" x2="7" y2="18"/>
            </svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => toggleFormat('justifyCenter')} title="Align Center">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="10" x2="6" y2="10"/>
              <line x1="21" y1="6" x2="3" y2="6"/>
              <line x1="21" y1="14" x2="3" y2="14"/>
              <line x1="18" y1="18" x2="6" y2="18"/>
            </svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => toggleFormat('justifyRight')} title="Align Right">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="10" x2="17" y2="10"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="14" x2="21" y2="14"/>
              <line x1="3" y1="18" x2="17" y2="18"/>
            </svg>
          </ToolbarButton>
        </div>

        <ToolbarSeparator />

        {/* Clear Formatting */}
        <div className="flex items-center gap-1">
          <ToolbarButton onClick={() => toggleFormat('removeFormat')} title="Clear Formatting">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7V4h16v3"/>
              <path d="M5 9v10h14V9"/>
              <path d="M9 9v10"/>
              <path d="M15 9v10"/>
            </svg>
          </ToolbarButton>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`min-h-64 p-4 focus:outline-none ${
          isFocused ? 'ring-2 ring-blue-500' : ''
        }`}
        style={{ minHeight: '200px' }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      <style dangerouslySetInnerHTML={{
        __html: `
          [contenteditable]:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af;
            pointer-events: none;
          }
          [contenteditable] h1 {
            font-size: 2em !important;
            font-weight: bold !important;
            margin: 0.67em 0 !important;
            display: block !important;
          }
          [contenteditable] h2 {
            font-size: 1.5em !important;
            font-weight: bold !important;
            margin: 0.75em 0 !important;
            display: block !important;
          }
          [contenteditable] h3 {
            font-size: 1.17em !important;
            font-weight: bold !important;
            margin: 0.83em 0 !important;
            display: block !important;
          }
          [contenteditable] h4 {
            font-size: 1em !important;
            font-weight: bold !important;
            margin: 1.12em 0 !important;
            display: block !important;
          }
          [contenteditable] h5 {
            font-size: 0.83em !important;
            font-weight: bold !important;
            margin: 1.5em 0 !important;
            display: block !important;
          }
          [contenteditable] a {
            color: #2563eb !important;
            text-decoration: underline !important;
          }
          [contenteditable] a:hover {
            color: #1d4ed8 !important;
          }
          [contenteditable] blockquote {
            border-left: 4px solid #e5e7eb !important;
            padding-left: 1rem !important;
            margin: 1rem 0 !important;
            font-style: italic !important;
            color: #6b7280 !important;
          }
          [contenteditable] pre {
            background-color: #f3f4f6 !important;
            padding: 1rem !important;
            border-radius: 0.375rem !important;
            overflow-x: auto !important;
            margin: 1rem 0 !important;
          }
          [contenteditable] code {
            background-color: #f3f4f6 !important;
            padding: 0.25rem 0.5rem !important;
            border-radius: 0.25rem !important;
            font-family: 'Courier New', monospace !important;
          }
          [contenteditable] ul, [contenteditable] ol {
            margin: 1rem 0 !important;
            padding-left: 2rem !important;
          }
          [contenteditable] li {
            margin: 0.25rem 0 !important;
          }
          [contenteditable] table {
            border-collapse: collapse !important;
            width: 100% !important;
            margin: 1rem 0 !important;
          }
          [contenteditable] th, [contenteditable] td {
            border: 1px solid #d1d5db !important;
            padding: 0.5rem !important;
            text-align: left !important;
          }
          [contenteditable] th {
            background-color: #f9fafb !important;
            font-weight: bold !important;
          }
        `
      }} />
    </div>
  );
};

export default EnhancedRichTextEditor;
