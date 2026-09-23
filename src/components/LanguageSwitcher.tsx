'use client';

import { useState } from 'react';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const [language, setLanguage] = useState('en');
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    setIsOpen(false);
    
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
    <div className="relative">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-xs sm:text-sm font-medium"
        title="Change Language"
        aria-label="Change Language"
      >
        <Globe className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary-600" />
        <span className="hidden sm:inline-block">
          {languages.find(l => l.code === language)?.name || 'English'}
        </span>
      </button>
      
      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-primary-50 transition-colors text-xs ${
                  language === lang.code ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-700'
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                <span className="flex-1">{lang.name}</span>
                {language === lang.code && (
                  <span className="text-primary-600 text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
