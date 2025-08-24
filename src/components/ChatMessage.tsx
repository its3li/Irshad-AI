import React from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  message: string;
  isAi: boolean;
  timestamp: Date;
  isDarkMode: boolean;
  isArabic: boolean;
  userAvatar?: string;
}

export function ChatMessage({ message, isAi, timestamp, isDarkMode, isArabic, userAvatar }: ChatMessageProps) {
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopy = async () => {
    const attribution = isArabic 
      ? '\n\nإرشاد من إرشاد - irshadai.vercel.app'
      : '\n\nGuidance by IrshadAI - irshadai.vercel.app';
    
    await navigator.clipboard.writeText(message + attribution);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const avatarElement = userAvatar ? (
    <img 
      src={userAvatar} 
      alt="User" 
      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shadow-lg ring-2 ring-amber-400 flex-shrink-0"
    />
  ) : null;

  return (
    <div
      className={cn(
        'flex gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl w-fit',
        'max-w-[90%] sm:max-w-[85%] md:max-w-[75%]',
        isAi ? 'mr-auto' : 'ml-auto',
        isDarkMode
          ? isAi ? 'bg-brown-800 text-brown-50' : 'bg-brown-700 text-brown-50'
          : isAi ? 'bg-brown-100 text-brown-900' : 'bg-brown-200 text-brown-900'
      )}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {!isArabic && avatarElement}
      <div className="flex-1 min-w-0 space-y-2">
        <div className={`prose ${isDarkMode ? 'prose-invert' : ''} max-w-none text-sm sm:text-base`}>
          <ReactMarkdown 
            className={isArabic ? 'arabic' : ''}
            remarkPlugins={[remarkGfm]}
          >
            {message}
          </ReactMarkdown>
        </div>
        <div className="flex items-center justify-between gap-2">
          <time className={`text-xs ${isDarkMode ? 'text-amber-400/70' : 'text-brown-500'}`}>
            {new Date(timestamp).toLocaleTimeString(isArabic ? 'ar-SA' : 'en-US')}
          </time>
          {isAi && (
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors ${
                isDarkMode 
                  ? 'hover:bg-brown-700 active:bg-brown-600' 
                  : 'hover:bg-brown-200 active:bg-brown-300'
              }`}
              title={isArabic ? 'نسخ الرسالة' : 'Copy message'}
            >
              {isCopied ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
              <span className={isArabic ? 'arabic' : ''}>
                {isCopied 
                  ? (isArabic ? 'تم النسخ' : 'Copied') 
                  : (isArabic ? 'نسخ' : 'Copy')}
              </span>
            </button>
          )}
        </div>
      </div>
      {isArabic && avatarElement}
    </div>
  );
}