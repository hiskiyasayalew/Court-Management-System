// src/pages/Signup.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import signupimage from '../assets/lawsymbol2.webp';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const Signup = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-4 relative">
      <LanguageSwitcher />
      <main className="max-w-6xl w-full flex flex-col md:flex-row items-center md:items-start justify-center gap-12 md:gap-24">
        <section className="flex-shrink-0 max-w-md md:max-w-lg">
          <img src={signupimage} alt="Illustration" className="w-full h-auto" />
        </section>

        <section className="w-full max-w-sm">
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-6">
            {t.signupTitle}
          </h1>
          <form className="space-y-4">
            <input type="text" placeholder={t.username} className="w-full border-b border-gray-300 text-gray-400 placeholder-gray-400 pb-2" />
            <input type="email" placeholder={t.email} className="w-full border-b border-gray-300 text-gray-400 placeholder-gray-400 pb-2" />
            <input type="password" placeholder={t.password} className="w-full border-b border-gray-300 text-gray-400 placeholder-gray-400 pb-2" />
            <input type="password" placeholder={t.confirmPassword} className="w-full border-b border-gray-300 text-gray-400 placeholder-gray-400 pb-2" />
            <button type="submit" className="w-full bg-blue-400 text-white font-semibold py-2 rounded mt-4 hover:bg-blue-500 transition">
              {t.signup}
            </button>
          </form>
          <p className="text-xs text-gray-700 mt-6">
            {t.alreadyHaveAccount}{' '}
            <Link to="/" className="text-blue-500 font-semibold hover:underline">{t.login}</Link>
          </p>
        </section>
      </main>
    </div>
  );
};

export default Signup;
