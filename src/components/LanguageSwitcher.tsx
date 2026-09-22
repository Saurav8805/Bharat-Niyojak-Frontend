'use client';

import { useState } from 'react';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const [language, setLanguage] = useState('en');

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    
    // Set Google Translate cookie
    const langMap: { [key: string]: string } = {
      en: '/en/en',
      hi: '/en/hi',
      mr: '/en/mr'
    };
    
    document.cookie = `googtrans=${langMap[lang]}; path=/`;
    
    // Reload page to apply translation
    window.location.reload();
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' }
  ];

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
        <Globe className="w-5 h-5" />
        <span className="hidden sm:block text-sm font-medium">
          {languages.find(l => l.code === language)?.name || 'English'}
        </span>
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
              language === lang.code ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
            }`}
          >
            <span className="text-xl">{lang.flag}</span>
            <span className="font-medium">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
