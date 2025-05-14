// src/components/LanguageSwitcher.jsx
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="absolute top-4 right-4 text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
    >
      {language === 'en' ? 'አማ' : 'EN'}
    </button>
  );
};

export default LanguageSwitcher;
