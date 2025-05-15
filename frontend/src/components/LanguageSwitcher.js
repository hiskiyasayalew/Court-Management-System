import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="absolute top-0 right-4 text-sm bg-black-200 px-3 py-1 rounded hover:bg-blue-300 pb-2" // Added mb-2 for margin bottom
    >
      {language === 'en' ? 'አማ' : 'EN'}
    </button>
  );
};

export default LanguageSwitcher;