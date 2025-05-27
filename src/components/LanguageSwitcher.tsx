'use client';

import { useLanguage } from './LanguageContext';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ko' ? 'en' : 'ko');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
    >
      {language === 'ko' ? '🇰🇷 한국어' : '🇺🇸 English'}
    </button>
  );
}
