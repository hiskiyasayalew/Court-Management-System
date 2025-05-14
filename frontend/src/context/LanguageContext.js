// src/context/LanguageContext.jsx
import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    signupTitle: "Create an Account, Join Us Today",
    loginTitle: "Hello, Welcome Back",
    username: "Username",
    usernameOrEmail: "Username Or Email",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    rememberMe: "Remember Me",
    forgotPassword: "Forgot Password?",
    alreadyHaveAccount: "Already Have An Account?",
    dontHaveAccount: "Don't Have An Account?",
    login: "Login",
    signup: "Signup"
  },
  am: {
    signupTitle: "መለያ ፍጠር፣ ዛሬ ተቀላቅሉ",
    loginTitle: "ሰላም፣ እንኳን ደህና መጡ",
    username: "የተጠቃሚ ስም",
    usernameOrEmail: "የተጠቃሚ ስም ወይም ኢሜል",
    email: "ኢሜል",
    password: "የይለፍ ቃል",
    confirmPassword: "የይለፍ ቃልን ያረጋግጡ",
    rememberMe: "አስታውሰኝ",
    forgotPassword: "የይለፍ ቃል ረሱ?",
    alreadyHaveAccount: "መለያ አሎት?",
    dontHaveAccount: "መለያ የሎትም?",
    login: "ግባ",
    signup: "ይመዝገቡ"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'am' : 'en'));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
