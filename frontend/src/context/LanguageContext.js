// src/context/LanguageContext.jsx
import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    signupTitle: "Create an Account, Join Us Today",
    loginTitle: "Hello, Welcome Back",
    username: "Username",
    usernameOrEmail: "Username",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    rememberMe: "Remember Me",
    forgotPassword: "Forgot Password?",
    alreadyHaveAccount: "Already Have An Account?",
    dontHaveAccount: "Don't Have An Account?",
    login: "Login",
    signup: "Signup",
    title: "Digital Court Management System",
    welcomeMessage: "Welcome to the Digital Court Management System",
    introText: "Experience a modern, efficient way to file and manage court cases digitally. Our platform provides a transparent and easy-to-use interface to submit your case details and documents directly to the authorities, ensuring a faster and more reliable judicial process.",
    benefits: [
      "Streamlined case submission with instant uploads",
      "Real-time case tracking with unique case numbers",
      "Secure and confidential document handling"
    ],
    submitCaseTitle: "Submit Your Case Details",
    formInstructions: "Please fill all required fields (*) and upload your ID card (Fayda). Additional files are optional.",
    fullNameLabel: "Full Name",
    fullNamePlaceholder: "John Doe",
    emailLabel: "Email Address",
    emailPlaceholder: "john@example.com",
    phoneLabel: "Phone Number",
    phonePlaceholder: "+1234567890",
    phoneHelp: "Include country code, e.g. +1234567890",
    dateOfIncidentLabel: "Date of Incident",
    dateHelp: "Provide if known",
    caseTypeLabel: "Type of Case",
    selectCaseType: "Select case type...",
    criminal: "Criminal",
    civil: "Civil",
    traffic: "Traffic",
    family: "Family",
    others: "Others",
    caseDescriptionLabel: "Case Description",
    caseDescriptionPlaceholder: "Provide detailed description...",
    idCardUploadLabel: "Upload ID Card (Fayda)",
    idCardUploadHelp: "Accepted: PDF, JPG, PNG",
    additionalFilesLabel: "Upload Additional Relevant Files",
    additionalFilesHelp: "Accepted: PDF, JPG, PNG",
    agreementText: "I acknowledge my data will be securely sent to police and court officials.",
    logout: "Logout",
    logoutConfirmation: "Are you sure you want to logout?",
    logoutSuccess: "Logged out successfully.",
    submitCaseButton: "Submit Case",
    allRightsReserved: "All rights reserved."

  },
  am: {
    signupTitle: "መለያ ፍጠር፣ ዛሬ ተቀላቅሉ",
    loginTitle: "ሰላም፣ እንኳን ደህና መጡ",
    username: "የተጠቃሚ ስም",
    usernameOrEmail: "የተጠቃሚ ስም",
    email: "ኢሜል",
    password: "የይለፍ ቃል",
    confirmPassword: "የይለፍ ቃልን ያረጋግጡ",
    rememberMe: "አስታውሰኝ",
    forgotPassword: "የይለፍ ቃል ረሱ?",
    alreadyHaveAccount: "መለያ አሎት?",
    dontHaveAccount: "መለያ የሎትም?",
    login: "ግባ",
    signup: "ይመዝገቡ",
     title: "ዲጂታል ፍርድ አስተዳዳሪ ስርዓት",
    welcomeMessage: "ወደ ዲጂታል ፍርድ አስተዳዳሪ ስርዓት እንኳን ደህና መጡ",
    introText: "የፍርድ ጉዳዮችን በዲጂታል መንገድ ለማመለክት የቀላል እና ወቅታዊ መረጃ ለማግኘት ይረዳል። ይህ መድረክ እንዲህ ያለውን የጉዳይ ዝርዝር እና ሰነዶችን በቀጥታ ወደ ተግቢው አካል ለመላክ ያስችላል፣ ይህም የፍርድ ሂደትን እንዲቀላጥፍ ይረዳል።",
    benefits: [
      "መረጃ በ ዲጂታል ምላክ።",
      "የ ፍርድ ሂደት መከታተል።",
      "ግልፀኝነት ያለው የ መረጃ አያያዝ።"
    ],
    submitCaseTitle: "የጉዳይ መረጃዎችን ይላኩ",
    formInstructions: "እባኮትን ወቅታዊ መረጃዎችን ይላኩ።",
    fullNameLabel: "የሙሉ ስም",
    fullNamePlaceholder: "ጆን ዶ",
    emailLabel: "የኢሜይል አድራሻ",
    emailPlaceholder: "john@example.com",
    phoneLabel: "የስልክ ቁጥር",
    phonePlaceholder: "+1234567890",
    phoneHelp: "የአገር ኮድ ጨምር፣ ይምረጡ +1234567890",
    dateOfIncidentLabel: "ዲርጊቱ የተፈጸመበት ቀን",
    dateHelp: "ካወቁ ይሙሉት",
    caseTypeLabel: "የጉዳይ ዓይነት",
    selectCaseType: "የጉዳይ ዓይነት ይምረጡ",
    criminal: "ወንጀል",
    civil: "ሥርዓት",
    traffic: "ትራፊክ",
    family: "የቤተሰብ",
    others: " ሌላ",
    caseDescriptionLabel: "የጉዳይ ዝርዝር",
    caseDescriptionPlaceholder: "ዝርዝር ይላኩ",
    idCardUploadLabel: "የፋይዳ ካርድ ይላኩ",
    idCardUploadHelp: " የፋይል አይነት  PDF, JPG, PNG",
    additionalFilesLabel: "ሌላ ጠቃሚ መረጃ ካለ ያስገቡ",
    additionalFilesHelp: "የተቀበለ ፋይል፣ PDF, JPG, PNG",
    agreementText: "መረጃዬ ደህንነቱን በጠበቀ መልኩ ለ ፖሊስ እና ፍርድ ቤት እንደሚላክ ተስማምቻለው",
    logout: "ውጣ",
    logoutConfirmation: "መውጣት ይፈልጋሉ?",
logoutSuccess: "በተሳካ ሁኔታ ወተዋል",
submitCaseButton: "ጉዳይ ይላኩ",
allRightsReserved: "በሙሉ መብቶች ይታወቃል።"
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
