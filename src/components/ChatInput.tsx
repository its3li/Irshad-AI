import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onClearChat: () => void;
  disabled?: boolean;
  isDarkMode: boolean;
  isArabic: boolean;
}

export function ChatInput({ onSendMessage, disabled, isDarkMode, isArabic }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
      // Reset height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      // Calculate new height (capped at ~4 lines)
      const newHeight = Math.min(textarea.scrollHeight, 96); // 24px * 4 lines = 96px
      textarea.style.height = `${newHeight}px`;
    }
  };

  // Adjust height on input change
  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  // Handle Enter key (with Shift+Enter for new line)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={`border-t ${isDarkMode ? 'border-brown-700 bg-brown-800' : 'border-brown-200 bg-white'} p-3 sm:p-6 shadow-lg`}>
      <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-4 max-w-4xl mx-auto items-end" dir={isArabic ? 'rtl' : 'ltr'}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isArabic ? 'اكتب سؤالك حول الأحكام الإسلامية...' : 'Ask your question about Islamic rulings...'}
          placeholder={isArabic ? 'اكتب سؤالك حول الإرشاد الإسلامي...' : 'Ask your question about Islamic guidance...'}
          className={`chat-input flex-1 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 resize-none overflow-y-auto ${
            isDarkMode 
              ? 'bg-brown-700 text-brown-50 placeholder-brown-400/50 focus:ring-amber-400' 
              : 'bg-brown-50 text-brown-900 placeholder-brown-500/50 focus:ring-amber-500'
          } border-none focus:outline-none focus:ring-2 transition-shadow text-sm sm:text-base min-h-[48px] sm:min-h-[56px] max-h-24`}
          dir={isArabic ? 'rtl' : 'ltr'}
          disabled={disabled}
          rows={1}
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className={`p-3 sm:p-4 rounded-full transition-all flex-shrink-0 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 active:from-amber-600 active:to-amber-800' 
              : 'bg-gradient-to-r from-brown-600 to-brown-700 hover:from-brown-700 hover:to-brown-800 active:from-brown-800 active:to-brown-900'
          } text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:shadow-md`}
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}