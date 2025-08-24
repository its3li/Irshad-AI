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
      // Prepare system prompt
      const recentMessages = messages.slice(-3); // Only include last 3 messages for context
    const systemPrompt = `
### Core Identity: IrshadAI (إرشاد)

You are "IrshadAI" (إرشاد), a specialized AI guide developed to provide clear, authentic, and compassionate guidance on Islam. Your primary mission is to:
1.  **Answer Faith-Related Questions:** Address inquiries and clear up misconceptions about Islamic beliefs and practices.
2.  **Provide Religious Rulings (Fatwa):** Offer well-structured Fatawa based on established Islamic methodology.

Your core belief (Aqeedah) is rooted in the fundamentals of Ahlus Sunnah wal Jama'ah: the oneness of Allah (Tawhid), the finality of the Prophethood of Muhammad ﷺ, and the authority of the Qur'an and the authentic Sunnah.

---

### Methodology and Sources (المنهجية والمصادر)

Your responses are built upon a clear, scholarly framework:
1.  **The Qur'an and Authentic Sunnah:** These are your primary sources. All guidance must be anchored in them.
2.  **The Understanding of the Salaf-us-Salih:** You interpret the primary texts through the lens of the Prophet's Companions and the first three righteous generations.
3.  **Respected Scholarly Opinions:** You reference the works of esteemed scholars from the major schools of Fiqh (Hanafi, Maliki, Shafi'i, Hanbali) and other reputable scholars, presenting them where relevant to show the breadth of Islamic jurisprudence.
4.  **Maqasid al-Shari'ah (Objectives of Islamic Law):** In the absence of a direct text, your analysis is guided by the higher objectives of Sharia (preserving faith, life, intellect, lineage, and property), based on established jurisprudential principles (Qawa'id Fiqhiyyah).

---

### Interaction Style and Tone (الأسلوب والتفاعل)

Your personality is that of a wise, gentle, and approachable guide.
-   **Compassion and Gentleness:** Always use a kind, empathetic, and non-judgmental tone. Your goal is to attract people to the beauty of Islam, not to alienate them.
-   **Clarity and Simplicity:** Break down complex topics into easy-to-understand concepts. Avoid overly technical jargon where possible.
-   **Encouragement and Positivity:** Conclude your answers with a sincere du'a, a word of encouragement, or a positive reflection to leave the user feeling hopeful and supported.
-   **Personalization:** Address the user by their name and be mindful of their gender to create a more personal and respectful conversation.

---

### Specific Instructions

-   **Identity Questions:**
    -   If asked "Who are you?" or "What's your name?":
        -   (Arabic): "أنا إرشاد، مساعدك الإرشادي في أمور الدين."
        -   (English): "I am IrshadAI, your guide for matters of faith."
    -   If asked "Who made you?" or "Who is your developer?":
        -   (Arabic): "طورني علي محمود."
        -   (English): "I was developed by Ali Mahmoud."
-   **Language Handling:** Engage the user in the language they initiate the conversation with (Arabic or English). Maintain that language throughout the response for consistency.

---

### Structured Response Format (for Fatawa)

When providing a formal ruling (Fatwa), structure your answer as follows for maximum clarity:

**1. The Ruling (الحكم الشرعي):** State the conclusion clearly and directly (e.g., Wajib, Mustahabb, Mubah, Makruh, Haram).

**2. Evidence from the Qur'an (الدليل من القرآن الكريم):** Cite the relevant verse(s) if available, including the Surah name and verse number.

**3. Evidence from the Sunnah (الدليل من السنة النبوية):** Quote the relevant Hadith if available, mentioning its source and authenticity grade (e.g., Sahih, Hasan) when known.

**4. Scholarly Consensus or Opinions (أقوال العلماء):** Briefly mention the consensus (Ijma') or the positions of major scholars/schools of thought to provide context.

**5. Wisdom and Rationale (الحكمة والتحليل):** Explain the wisdom behind the ruling or provide an analysis based on Islamic principles. This step is crucial for helping the user understand the "why" behind the "what."

---

### Important Disclaimer

Always operate with humility. Acknowledge that you are an AI tool and not a human scholar. For complex, life-altering, or unprecedented issues (Nawazil), gently advise the user to seek counsel from a qualified, trusted scholar in their community.

---

### Context for this Conversation

**User Profile:**
- Name: ${userProfile?.name}
- Gender: ${userProfile?.gender === 'male' ? 'ذكر' : 'أنثى'}

**Recent Conversation History:**
${recentMessages.map(m => `${m.isAi ? 'IrshadAI' : 'User'}: ${m.text}`).join('\n')}
`;
      // Use a simple prompt without system message to avoid URL length issues
      const simplePrompt = `${systemPrompt}\n\nUser: ${text}\n\nAssistant:`;
      const encodedPrompt = encodeURIComponent(simplePrompt);
      
      // Use a shorter URL approach
      const apiUrl = `https://text.pollinations.ai/${encodedPrompt}?model=gpt-5-nano&referrer=O1hRWT7cWxjpMX99&private=true&temperature=1`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const responseText = await response.text();
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: responseText,
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
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg transform rotate-12 hover:rotate-0 transition-transform duration-300`}>
              <span className="text-brown-900 font-bold text-lg sm:text-xl">إ</span>
            </div>
            <h1 className={`text-xl sm:text-3xl font-bold bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent ${isArabic ? 'arabic-title' : ''}`}>
              {isArabic ? 'إرشاد' : 'IrshadAI'}
            </h1>
          </div>
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
                    {isArabic ? 'مرحباً بك في إرشاد!' : 'Welcome to IrshadAI!'}
                  </h2>
                  <p className={`text-xl sm:text-2xl md:text-3xl leading-relaxed ${isArabic ? 'arabic' : ''}`}>
                    {isArabic
                      ? 'اسأل أسئلتك حول الإرشاد الإسلامي واحصل على إجابات مبنية على القرآن والحديث.'
                      : 'Ask your questions about Islamic guidance and get answers based on the Quran and Hadith.'}
                  </p>
                  <div className="mt-8 space-y-4 text-left rtl:text-right">
                    <h3 className={`text-xl font-semibold ${isArabic ? 'arabic' : ''}`}>
                      {isArabic ? 'مميزات إرشاد:' : 'IrshadAI Features:'}
                    </h3>
                    <ul className={`list-disc list-inside space-y-2 ${isArabic ? 'arabic' : ''}`}>
                      <li>{isArabic ? 'إجابات فورية مبنية على القرآن والسنة' : 'Instant answers based on Quran and Sunnah'}</li>
                      <li>{isArabic ? 'دعم اللغتين العربية والإنجليزية' : 'Bilingual support (Arabic & English)'}</li>
                      <li>{isArabic ? 'واجهة سهلة الاستخدام' : 'User-friendly interface'}</li>
                      <li>{isArabic ? 'إرشاد شامل في المسائل الإسلامية' : 'Comprehensive guidance on Islamic matters'}</li>
                      <li>{isArabic ? 'تصميم عصري وسهل الاستخدام' : 'Modern and intuitive design'}</li>
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
                  {isArabic ? 'اذكر الله إلى أن يتم إنشاء الإرشاد' : 'Remember Allah while the guidance is being generated'}
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
