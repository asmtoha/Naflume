import React, { useEffect, useMemo, useRef, useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const EMOJIS = ['✨','🙏','📚','✅','💡','❤️','🔥','🕋','⭐','🌙','📝','🎯'];

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showEmoji, setShowEmoji] = useState(false);

  useEffect(() => {
    if (!editorRef.current) return;
    // Only update DOM if external value truly differs from innerHTML
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const normalizeFonts = () => {
    if (!editorRef.current) return;
    const fonts = editorRef.current.querySelectorAll('font[size]');
    fonts.forEach((f) => {
      const size = (f as HTMLElement).getAttribute('size') || '';
      const span = document.createElement('span');
      // Map legacy font sizes to px; will be overridden by explicit px we set
      const pxMap: Record<string, number> = { '1': 10, '2': 13, '3': 16, '4': 18, '5': 24, '6': 28, '7': 32 };
      const px = pxMap[size] || 16;
      span.style.fontSize = px + 'px';
      span.innerHTML = (f as HTMLElement).innerHTML;
      f.parentNode?.replaceChild(span, f);
    });
  };

  const applyFontPx = (px: number) => {
    // Use execCommand to wrap selection, then normalize to span with px size
    document.execCommand('fontSize', false, '7');
    normalizeFonts();
    if (!editorRef.current) return;
    // Update the most recent <span> created by normalizeFonts at selection
    // As a simple approach, set font-size on the parent element of selection if inside editor
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      let el = range.commonAncestorContainer as HTMLElement;
      if (el.nodeType === Node.TEXT_NODE) el = el.parentElement as HTMLElement;
      if (el && editorRef.current.contains(el)) {
        (el as HTMLElement).style.fontSize = px + 'px';
      }
    }
    onChange(editorRef.current.innerHTML);
  };

  const onInput = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const onPaste: React.ClipboardEventHandler<HTMLDivElement> = (e) => {
    // Allow rich paste but clean up Office/Google Docs extra styles minimally
    e.preventDefault();
    const html = e.clipboardData.getData('text/html') || '';
    const text = e.clipboardData.getData('text/plain');
    const content = html || text.replace(/\n/g, '<br>');
    document.execCommand('insertHTML', false, content);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const insertEmoji = (emoji: string) => {
    document.execCommand('insertText', false, emoji);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
    setShowEmoji(false);
  };

  return (
    <div className="border rounded-lg">
      <div className="flex flex-wrap items-center gap-2 px-2 py-2 border-b bg-gray-50 rounded-t-lg">
        <button type="button" onClick={() => exec('bold')} className="px-2 py-1 text-sm rounded hover:bg-gray-100 font-semibold">B</button>
        <button type="button" onClick={() => exec('italic')} className="px-2 py-1 text-sm rounded hover:bg-gray-100 italic">I</button>
        <button type="button" onClick={() => exec('underline')} className="px-2 py-1 text-sm rounded hover:bg-gray-100 underline">U</button>
        <span className="mx-1 w-px h-5 bg-gray-200" />
        <div className="flex items-center gap-1">
          <label className="text-xs text-gray-500">Size</label>
          <button type="button" onClick={() => applyFontPx(14)} className="px-2 py-1 text-sm rounded hover:bg-gray-100">S</button>
          <button type="button" onClick={() => applyFontPx(16)} className="px-2 py-1 text-sm rounded hover:bg-gray-100">N</button>
          <button type="button" onClick={() => applyFontPx(22)} className="px-2 py-1 text-sm rounded hover:bg-gray-100">L</button>
          <select
            className="px-1 py-1 text-sm border rounded"
            onChange={(e) => applyFontPx(parseInt(e.target.value, 10))}
            defaultValue="16"
          >
            <option value="14">14px</option>
            <option value="16">16px</option>
            <option value="18">18px</option>
            <option value="20">20px</option>
            <option value="24">24px</option>
            <option value="28">28px</option>
            <option value="32">32px</option>
          </select>
        </div>
        <button type="button" onClick={() => exec('formatBlock', 'blockquote')} className="px-2 py-1 text-sm rounded hover:bg-gray-100">❝</button>
        <button type="button" onClick={() => exec('formatBlock', 'pre')} className="px-2 py-1 text-sm rounded hover:bg-gray-100">{`</>`}</button>
        <span className="mx-1 w-px h-5 bg-gray-200" />
        <button type="button" onClick={() => exec('insertUnorderedList')} className="px-2 py-1 text-sm rounded hover:bg-gray-100">• List</button>
        <button type="button" onClick={() => exec('insertOrderedList')} className="px-2 py-1 text-sm rounded hover:bg-gray-100">1. List</button>
        <button type="button" onClick={() => {
          const url = prompt('Enter URL');
          if (url) exec('createLink', url);
        }} className="px-2 py-1 text-sm rounded hover:bg-gray-100">Link</button>
        <div className="relative">
          <button type="button" onClick={() => setShowEmoji((s) => !s)} className="px-2 py-1 text-sm rounded hover:bg-gray-100">😊</button>
          {showEmoji ? (
            <div className="absolute z-10 mt-2 p-2 bg-white border rounded shadow flex gap-1">
              {EMOJIS.map((e) => (
                <button key={e} type="button" className="px-1" onClick={() => insertEmoji(e)}>{e}</button>
              ))}
            </div>
          ) : null}
        </div>
        <button type="button" onClick={() => exec('removeFormat')} className="ml-auto px-2 py-1 text-sm rounded hover:bg-gray-100">Clear</button>
      </div>
      <div
        ref={editorRef}
        className="min-h-[160px] max-h-[400px] overflow-auto p-3 focus:outline-none"
        contentEditable
        suppressContentEditableWarning
        onInput={onInput}
        onPaste={onPaste}
        data-placeholder={placeholder || 'Write rich content...'}
        style={{ whiteSpace: 'pre-wrap' }}
      />
      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;


