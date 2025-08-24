import React, { useState } from 'react';
import { Upload, AlertTriangle } from 'lucide-react';

interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => void;
  isArabic: boolean;
  isDarkMode: boolean;
}

export interface UserProfile {
  name: string;
  gender: 'male' | 'female';
  avatar?: string;
}

export function ProfileSetup({ onComplete, isArabic, isDarkMode }: ProfileSetupProps) {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    gender: 'male',
  });
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        setProfile(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.name && profile.gender) {
      onComplete(profile);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${isDarkMode ? 'bg-brown-900' : 'bg-brown-50'}`}>
      <div className={`w-full max-w-md ${isDarkMode ? 'bg-brown-800' : 'bg-white'} rounded-2xl p-6 sm:p-8 shadow-xl`}>
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg transform rotate-12 hover:rotate-0 transition-transform duration-300`}>
              <span className="text-brown-900 font-bold text-2xl">إ</span>
            </div>
            <h1 className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent ${isArabic ? 'arabic-title' : ''}`}>
              {isArabic ? 'إرشاد' : 'IrshadAI'}
            </h1>
          </div>
          <p className={`text-sm sm:text-base ${isArabic ? 'arabic' : ''} ${isDarkMode ? 'text-brown-300' : 'text-brown-600'}`}>
            {isArabic 
              ? 'تم تطويره بواسطة علي محمود وأمير محمود ويوسف حاتم' 
              : 'Developed by Ali Mahmoud, Ameer Mahmoud & Yousef Hatim'}
          </p>
          <div className={`mt-6 p-4 rounded-xl ${isDarkMode ? 'bg-brown-700/50 border border-brown-600/50' : 'bg-brown-100/50 border border-brown-200/50'} flex items-start gap-3 backdrop-blur-sm`}>
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className={`text-sm ${isArabic ? 'arabic text-right' : ''} ${isDarkMode ? 'text-brown-200' : 'text-brown-600'}`}>
              {isArabic
                ? 'يرجى ملاحظة أن الذكاء الاصطناعي قد يخطئ. تحقق دائمًا من الإجابات مع مصادر موثوقة.'
                : 'Please note that AI can make mistakes. Always verify answers with trusted sources.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={`space-y-6 ${isArabic ? 'text-right' : ''}`}>
          <div>
            <label className={`block mb-2 font-medium ${isDarkMode ? 'text-brown-200' : 'text-brown-700'} ${isArabic ? 'arabic' : ''}`}>
              {isArabic ? 'الاسم' : 'Name'}
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full px-4 py-3 rounded-xl border ${
                isDarkMode 
                  ? 'bg-brown-700 border-brown-600 text-white placeholder-brown-400' 
                  : 'border-brown-200 text-brown-900 placeholder-brown-400'
              } focus:outline-none focus:ring-2 focus:ring-amber-400`}
              placeholder={isArabic ? 'أدخل اسمك' : 'Enter your name'}
              required
              dir={isArabic ? 'rtl' : 'ltr'}
            />
          </div>
          
          <div>
            <label className={`block mb-2 font-medium ${isDarkMode ? 'text-brown-200' : 'text-brown-700'} ${isArabic ? 'arabic' : ''}`}>
              {isArabic ? 'الجنس' : 'Gender'}
            </label>
            <select
              value={profile.gender}
              onChange={(e) => setProfile(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' }))}
              className={`w-full px-4 py-3 rounded-xl border ${
                isDarkMode 
                  ? 'bg-brown-700 border-brown-600 text-white' 
                  : 'border-brown-200 text-brown-900'
              } focus:outline-none focus:ring-2 focus:ring-amber-400`}
              required
              dir={isArabic ? 'rtl' : 'ltr'}
            >
              <option value="male">{isArabic ? 'ذكر' : 'Male'}</option>
              <option value="female">{isArabic ? 'أنثى' : 'Female'}</option>
            </select>
          </div>

          <div>
            <label className={`block mb-2 font-medium ${isDarkMode ? 'text-brown-200' : 'text-brown-700'} ${isArabic ? 'arabic' : ''}`}>
              {isArabic ? 'الصورة الشخصية (اختياري)' : 'Profile Picture (Optional)'}
            </label>
            <div className="flex items-center space-x-4">
              {avatarPreview && (
                <img 
                  src={avatarPreview} 
                  alt="Preview" 
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-amber-400"
                />
              )}
              <label className={`cursor-pointer flex items-center justify-center w-16 h-16 rounded-full border-2 border-dashed transition-colors ${
                isDarkMode 
                  ? 'border-brown-600 hover:border-brown-500 bg-brown-700/50' 
                  : 'border-brown-300 hover:border-brown-400 bg-brown-50'
              }`}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Upload className={`w-6 h-6 ${isDarkMode ? 'text-brown-400' : 'text-brown-500'}`} />
              </label>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-xl text-white font-medium transition-all transform hover:scale-105 active:scale-95 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700' 
                : 'bg-gradient-to-r from-brown-600 to-brown-700 hover:from-brown-700 hover:to-brown-800'
            } shadow-lg hover:shadow-xl active:shadow-md ${isArabic ? 'arabic' : ''}`}
          >
            {isArabic ? 'بدء المحادثة' : 'Start Chatting'}
          </button>
        </form>
      </div>
    </div>
  );
}