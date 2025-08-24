import React, { useState } from 'react';
import { Moon, Sun, Languages, Trash2, X, Upload, AlertTriangle, User } from 'lucide-react';

interface SettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
  onClearChat: () => void;
  isDarkMode: boolean;
  isArabic: boolean;
  userProfile: {
    name: string;
    avatar?: string;
    gender: 'male' | 'female';
  };
  onUpdateProfile: (profile: { name: string; avatar?: string }) => void;
}

export function SettingsPopup({
  isOpen,
  onClose,
  onToggleTheme,
  onToggleLanguage,
  onClearChat,
  isDarkMode,
  isArabic,
  userProfile,
  onUpdateProfile,
}: SettingsPopupProps) {
  const [newName, setNewName] = useState(userProfile.name);
  const [avatarPreview, setAvatarPreview] = useState(userProfile.avatar);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    onUpdateProfile({
      name: newName,
      avatar: avatarPreview,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-3 touch-none overflow-y-auto">
      <div 
        className={`${isDarkMode ? 'bg-brown-800/95 text-white' : 'bg-white/95 text-brown-900'} rounded-xl w-full max-w-[95%] sm:max-w-md shadow-2xl relative animate-in fade-in slide-in-from-top-4 duration-300 space-y-4 sm:space-y-6 backdrop-blur-sm border ${isDarkMode ? 'border-brown-700/50' : 'border-brown-200/50'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-brown-700/10 flex items-center justify-between">
          <h2 className={`text-lg sm:text-xl font-bold ${isArabic ? 'text-right' : ''} bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent`}> 
            {isArabic ? 'الإعدادات' : 'Settings'}
          </h2>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-all duration-200 transform hover:scale-110 ${
              isDarkMode ? 'hover:bg-brown-700 active:bg-brown-600' : 'hover:bg-brown-100 active:bg-brown-200'
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-3 sm:px-4 space-y-4 sm:space-y-6">
          {/* Profile Section */}
          <div className={`space-y-3 ${isArabic ? 'text-right' : ''}`}>
            <h3 className="text-sm font-semibold text-amber-400"> 
              {isArabic ? 'الملف الشخصي' : 'Profile'}
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative group">
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt={newName}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400 transition-transform duration-200 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                    <User className="h-6 w-6 text-brown-900" />
                  </div>
                )}
                <label className="absolute -bottom-1 -right-1 p-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 cursor-pointer transform transition-all duration-200 hover:scale-110 active:scale-95">
                  <Upload className="h-3 w-3 text-brown-900" />
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
              <div className="flex w-full gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className={`flex-1 px-3 py-1.5 rounded-lg border text-sm transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-brown-700/50 border-brown-600 text-white focus:bg-brown-700' 
                      : 'bg-white border-brown-200 text-brown-900 focus:bg-brown-50'
                  } focus:outline-none focus:ring-2 focus:ring-amber-400`}
                  dir={isArabic ? 'rtl' : 'ltr'}
                />
                <button
                  onClick={handleSaveProfile}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-brown-900' 
                      : 'bg-gradient-to-r from-brown-600 to-brown-700 hover:from-brown-700 hover:to-brown-800 text-white'
                  } shadow-lg hover:shadow-xl active:shadow-md whitespace-nowrap`}
                >
                  {isArabic ? 'حفظ' : 'Save'}
                </button>
              </div>
            </div>
          </div>

          {/* AI Warning */}
          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-brown-700/50' : 'bg-brown-100/50'} flex items-start gap-2 backdrop-blur-sm border ${isDarkMode ? 'border-brown-600/50' : 'border-brown-200/50'}`}>
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5 animate-pulse" />
            <p className={`text-xs ${isArabic ? 'arabic text-right' : ''} ${isDarkMode ? 'text-brown-200' : 'text-brown-600'}`}>
              {isArabic
                ? 'يرجى ملاحظة أن الذكاء الاصطناعي قد يخطئ. تحقق دائمًا من الإجابات مع مصادر موثوقة.'
                : 'Please note that AI can make mistakes. Always verify answers with trusted sources.'}
            </p>
          </div>

          {/* Toggle Section */}
          <div className="space-y-1">
            <button
              onClick={() => {
                onToggleTheme();
                onClose();
              }}
              className={`w-full flex items-center justify-start gap-2 p-2 rounded-lg text-sm transition-all duration-200 transform hover:scale-102 ${
                isDarkMode 
                  ? 'hover:bg-brown-700/70 active:bg-brown-600/70' 
                  : 'hover:bg-brown-100/70 active:bg-brown-200/70'
              }`}
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-amber-400" />}
              <span>{isDarkMode ? (isArabic ? 'الوضع النهاري' : 'Light Mode') : (isArabic ? 'الوضع الليلي' : 'Dark Mode')}</span>
            </button>
            <button
              onClick={() => {
                onToggleLanguage();
                onClose();
              }}
              className={`w-full flex items-center justify-start gap-2 p-2 rounded-lg text-sm transition-all duration-200 transform hover:scale-102 ${
                isDarkMode 
                  ? 'hover:bg-brown-700/70 active:bg-brown-600/70' 
                  : 'hover:bg-brown-100/70 active:bg-brown-200/70'
              }`}
            >
              <Languages className="h-4 w-4 text-amber-400" />
              <span>{isArabic ? 'English' : 'العربية'}</span>
            </button>
            <button
              onClick={() => {
                onClearChat();
                onClose();
              }}
              className="w-full flex items-center justify-start gap-2 p-2 rounded-lg text-sm text-red-500 hover:bg-red-100/10 active:bg-red-200/10 transition-all duration-200 transform hover:scale-102"
            >
              <Trash2 className="h-4 w-4" />
              <span>{isArabic ? 'مسح المحادثة' : 'Clear Chat'}</span>
            </button>
          </div>

          {/* Developers Section */}
          <div className={`mt-2 pt-3 border-t ${isDarkMode ? 'border-brown-700/50' : 'border-brown-200/50'}`}>
            <div className={`flex items-center justify-center ${isArabic ? 'flex-row-reverse' : 'flex-row'} gap-1.5`}>
              {['علي محمود', 'أمير محمود', 'يوسف حاتم'].map((name, index) => (
                <React.Fragment key={name}>
                  <span className={`text-xs font-medium ${isArabic ? 'arabic' : ''} ${isDarkMode ? 'text-amber-400' : 'text-brown-600'} hover:opacity-80 transition-opacity`}>
                    {isArabic ? name : name === 'علي محمود' ? 'Ali Mahmoud' : name === 'أمير محمود' ? 'Ameer Mahmoud' : 'Yousef Hatem'}
                  </span>
                  {index < 2 && <span className={`text-xs ${isDarkMode ? 'text-brown-500' : 'text-brown-400'}`}>•</span>}
                </React.Fragment>
              ))}
            </div>
            <p className={`text-[10px] text-center mt-1 ${isArabic ? 'arabic' : ''} ${isDarkMode ? 'text-brown-500' : 'text-brown-400'}`}>
              {isArabic ? 'مطورو إرشاد' : 'IrshadAI Developers'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}