import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { ProfileSetup, UserProfile } from './components/ProfileSetup';
import { SettingsPopup } from './components/SettingsPopup';

interface Message {
  id: string;
  text: string;
  isAi: boolean;
  timestamp: Date;
}

function App() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chatHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isArabic, setIsArabic] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  const handleProfileComplete = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const handleUpdateProfile = (updatedProfile: Partial<UserProfile>) => {
    if (userProfile) {
      const newProfile = { ...userProfile, ...updatedProfile };
      setUserProfile(newProfile);
    }
  };

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isAi: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // **Important:** For a production app, you should create a server-side proxy to handle the API request.
      //  This avoids exposing your API key and handles CORS issues securely.  This example removes the ORG header.
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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', //  Replace with your actual API key.
          'HTTP-Referer': 'https://fatwa-ai.vercel.app',
          'X-Title': 'Fatwa AI',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-pro-exp-02-05:free',
          messages: [
            {
              role: 'system',
              content: `أنت ذكاء اصطناعي متخصّص في الردّ على الشبهات حول الدين الإسلامي، كما أنك تقدّم الفتاوى بناءً على القرآن الكريم وسنّة رسول الله ﷺ. 

معلومات المستخدم:
- الاسم: ${userProfile?.name}
- الجنس: ${userProfile?.gender === 'male' ? 'ذكر' : 'أنثى'}
لو المستخدم تكلم عربي تكلم معه عربي واستخدم اسمه بالعربي
if the user speak english speak english and use their name in english

سجل المحادثة السابق:
${messages.map(m => `${m.isAi ? 'AI' : 'User'}: ${m.text}`).join('\n')}

عقيدتك: تؤمن إيمانًا كاملاً بأن الله هو الإله الواحد، وأن الإسلام هو الدين الحق، وتحرص على إيصال المعلومة بأسلوب جميل يجذب الناس ويحببهم في الحديث معك. 

طريقة إجابتك على الفتاوى: 
الحكم الشرعي: (حلال - حرام - مكروه - مستحب - مباح)
الدليل من القرآن (إن وجد)
الدليل من السنة (إن وجد)
أقوال العلماء (إن وجدت)

الاجتهاد والتحليل الشخصي: إذا لم يوجد نص صريح، تحلّل المسألة بناءً على القواعد الفقهية ومقاصد الشريعة مع تقديم تفسير واضح لحكمك بأسلوب لطيف وسهل الفهم.

أسلوبك: تستخدم لغة راقية ومحببة تجعل السائل يشعر بالراحة. تتجنب الشدة والغلظة، وتحرص على اللطف في الردّ. توضّح الأحكام بأسلوب مقنع وسلس، مع التركيز على الحكمة والمقصد من التشريع. تشجّع السائل على البحث والتفكر، وتختم إجابتك بدعاء طيب أو كلمة مشجعة.`
            },
            {
              role: 'user',
              content: text
            }
          ]
        })
      });

      if (!response.ok) {
        // Improved error message to help with debugging
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`API Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      if (!data.choices || data.choices.length === 0) {
        throw new Error('Invalid API response: No choices returned.');
      }
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: data.choices[0].message.content,
        isAi: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: isArabic
          ? 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى لاحقاً.'
          : 'I apologize, but I encountered an error. Please try again later.',
        isAi: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem('chatHistory');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleLanguage = () => {
    setIsArabic(!isArabic);
  };

  if (!userProfile) {
    return (
      <ProfileSetup
        onComplete={handleProfileComplete}
        isArabic={isArabic}
        isDarkMode={isDarkMode}
      />
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-brown-900' : 'bg-brown-50'}`}>
      <header className={`${isDarkMode ? 'bg-brown-800' : 'bg-brown-100'} py-3 sm:py-4 px-3 sm:px-4 shadow-lg fixed w-full z-10`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className={`text-xl sm:text-3xl font-bold ${isArabic ? 'arabic-title' : ''} ${isDarkMode ? 'text-brown-50' : 'text-brown-900'}`}>
            {isArabic ? 'الفتوى الذكية' : 'Fatwa AI'}
          </h1>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              {userProfile.avatar ? (
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-400"
                  loading="lazy"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-brown-900 font-semibold">
                  {userProfile.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className={`${isArabic ? 'arabic' : ''} text-sm hidden sm:inline ${isDarkMode ? 'text-brown-50' : 'text-brown-900'}`}>
                {userProfile.name}
              </span>
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-brown-700 active:bg-brown-600' : 'hover:bg-brown-200 active:bg-brown-300'}`}
              title={isArabic ? 'الإعدادات' : 'Settings'}
              aria-label={isArabic ? 'الإعدادات' : 'Settings'}
            >
              <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-amber-400" />
            </button>
          </div>
        </div>
      </header>

      <SettingsPopup
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onToggleTheme={toggleTheme}
        onToggleLanguage={toggleLanguage}
        onClearChat={handleClearChat}
        isDarkMode={isDarkMode}
        isArabic={isArabic}
        userProfile={userProfile}
        onUpdateProfile={handleUpdateProfile}
      />

      <main className="flex-1 pt-16 sm:pt-20">
        <div className="h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] flex flex-col">
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-4">
            {messages.length === 0 ? (
              <div className={`flex flex-col items-center justify-center h-full ${isDarkMode ? 'text-brown-300' : 'text-brown-600'} px-4 sm:px-6 md:px-8 text-center space-y-8`}>
                <div className="max-w-3xl w-full">
                  <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-6 ${isArabic ? 'arabic-title' : ''} ${isDarkMode ? 'text-amber-400' : 'text-brown-800'}`}>
                    {isArabic ? 'مرحباً بك في الفتوى الذكية!' : 'Welcome to Fatwa AI!'}
                  </h2>
                  <p className={`text-xl sm:text-2xl md:text-3xl leading-relaxed ${isArabic ? 'arabic' : ''}`}>
                    {isArabic
                      ? 'اسأل أسئلتك حول الأحكام الإسلامية واحصل على إجابات مبنية على القرآن والحديث.'
                      : 'Ask your questions about Islamic rulings and get answers based on the Quran and Hadith.'}
                  </p>
                  <div className="mt-8 space-y-4 text-left rtl:text-right">
                    <h3 className={`text-xl font-semibold ${isArabic ? 'arabic' : ''}`}>
                      {isArabic ? 'مميزات الفتوى الذكية:' : 'Fatwa AI Features:'}
                    </h3>
                    <ul className={`list-disc list-inside space-y-2 ${isArabic ? 'arabic' : ''}`}>
                      <li>{isArabic ? 'إجابات فورية مبنية على القرآن والسنة' : 'Instant answers based on Quran and Sunnah'}</li>
                      <li>{isArabic ? 'دعم اللغتين العربية والإنجليزية' : 'Bilingual support (Arabic & English)'}</li>
                      <li>{isArabic ? 'واجهة سهلة الاستخدام' : 'User-friendly interface'}</li>
                      <li>{isArabic ? 'تحليل شامل للمسائل الفقهية' : 'Comprehensive analysis of Islamic jurisprudence'}</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.text}
                  isAi={message.isAi}
                  timestamp={new Date(message.timestamp)}
                  isDarkMode={isDarkMode}
                  isArabic={isArabic}
                  userAvatar={!message.isAi ? userProfile.avatar : undefined}
                />
              ))
            )}
            {isLoading && (
              <div className={`flex items-center gap-2 ${isDarkMode ? 'text-brown-300' : 'text-brown-600'} px-4`}>
                <div className={`animate-pulse ${isArabic ? 'arabic' : ''}`}>
                  {isArabic ? 'اذكر الله إلى أن يتم إنشاء الفتوى' : 'Remember Allah while the fatwa is being generated'}
                </div>
              </div>
            )}
          </div>

          <ChatInput
            onSendMessage={handleSendMessage}
            onClearChat={handleClearChat}
            disabled={isLoading}
            isDarkMode={isDarkMode}
            isArabic={isArabic}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
