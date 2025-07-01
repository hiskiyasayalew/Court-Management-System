import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

const translations = {

  en: {
    // App Info
    appName: "Ethiopia CourtCase",
    copyright: "© 2024 Ethiopia CourtCaseSystem. All rights reserved.",

    // Navigation
    login: "Login",
    signup: "Sign Up",
    username:"username",
    loginAs: {
      judge: "Login as Judge",
      police: "Login as Police",
      prosecutor: "Login as Prosecutor",
      user: "Login as User",
      admin: "Login as Admin"
    },
    myCases: "My Cases",
    appeal: "Appeal",
    backToHome: "Back to Home",
    logout: "Logout",
    logoutConfirmation: "Are you sure you want to logout?",

    // Auth
    usernameOrEmail: "Username or Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    loginNow: "Login now",
    register: "Register",
    firstName: "First Name",
    lastName: "Last Name",
    phoneNumber: "Phone Number",
    city: "City",
    subCity: "Sub-city",
    passwordMismatch: "Passwords do not match",
    signupSuccess: "Registration successful! Please login.",
    signupFail: "Registration failed. Please try again.",
    loginsucess: "Login successful!",
    invalidlogin: "Invalid username or password",

    // Validation Messages
    usernameRequired: "Username is required",
    emailRequired: "Email is required",
    invalidEmail: "Please enter a valid email",
    passwordRequired: "Password is required",
    passwordMinLength: "Password must be at least 6 characters",
    nameRequired: "Name is required",
    phoneRequired: "Phone number is required",
    cityRequired: "City is required",
    subCityRequired: "Sub-city is required",

    // Landing Page
    heroSlide1: {
      title: "Efficient Online Court Management",
      description: "Streamlining the judicial process for Ethiopia with transparency and security."
    },
    heroSlide2: {
      title: "Secure & Transparent Process",
      description: "All your case data is safe, accessible, and easy to manage securely."
    },
    heroSlide3: {
      title: "Accessible for Everyone",
      description: "Empowering judges, police, prosecutors, and citizens alike."
    },
    caseManagement: {
      title: "Modern Case Management",
      description: "Effectively manage all aspects of court cases, including scheduling hearings, tracking case progress, and facilitating secure communication between all stakeholders in the Ethiopian judiciary system."
    },
    stakeholders: {
      title: "For Judges, Police, Prosecutors, and Citizens",
      description: "Designed to provide full accessibility and transparency, enabling all parties to efficiently track case statuses, access documents, and collaborate throughout the judicial process."
    },
    features: {
      title: "Explore More Features"
    },
    feature1: {
      title: "Secure Data Handling",
      description: "Protect your data with advanced encryption and security protocols."
    },
    feature2: {
      title: "Real-Time Notifications",
      description: "Stay updated with instant alerts and case status changes."
    },
    feature3: {
      title: "User-Friendly Interface",
      description: "Navigate easily through an intuitive and accessible design."
    },
    feature4: {
      title: "Comprehensive Reporting",
      description: "Generate detailed reports for better case management."
    },
    faq1: {
      question: "How does the system work?",
      answer: "It securely manages cases, schedules, and communication between all parties in the judicial process."
    },
    faq2: {
      question: "Who can access the system?",
      answer: "Judges, police, prosecutors, and citizens with proper credentials can access different features based on their roles."
    },
    faq3: {
      question: "Is my data safe?",
      answer: "Yes, we use industry-standard security practices to keep all case data and communications secure."
    },
    justiceForAll: "Justice for All",

    // Home Page
    welcomeMessage: "Welcome to the Digital Court Platform",
    introText: "Submit your legal cases online and track their progress in real-time. Our digital platform makes justice accessible to everyone.",
    benefits: [
      "24/7 Case Submission",
      "Real-time Case Tracking",
      "Secure Document Upload",
      "Reduced Paperwork",
      "Faster Response Times"
    ],
    submitCase: "Submit a New Case",
    fullName: "Full Name",
    email: "Email",
    dateOfIncident: "Date of Incident",
    caseType: "Case Type",
    selectOption: "-- Select a Case Type --",
    criminal: "Criminal",
    civil: "Civil",
    family: "Family",
    landDispute: "Land Dispute",
    other: "Other",
    caseDescription: "Case Description",
    idUpload: "Upload ID (PDF/Image)",
    additionalFiles: "Additional Files (optional)",
    agreeTerms: "I agree to the terms and conditions",
    submit: "Submit Case",
    validationError: "Please fill all required fields and agree to terms.",
    caseSubmittedSuccess: "Case submitted successfully!",
    footerNote: "All rights reserved.",

    // My Cases
    submittedCasesTitle: "My Submitted Cases",
    noCases: "You haven't submitted any cases yet.",
    submittedToProcess: "Submitted to Process",
    delete: "Delete",
    clearAll: "Clear All",
    caseStatus: {
      submitted: "Submitted",
      inReview: "In Review",
      processed: "Processed",
      rejected: "Rejected"
    },

    // Appeal
    rejectedCases: "Rejected Cases",
    noRejectedCases: "You have no rejected cases.",
    appealButton: "Submit Appeal",
    appealFormTitle: "Appeal Form",
    appealReason: "Reason for Appeal",
    additionalEvidence: "Additional Evidence (optional)"
  },
  am: {
    // App Info
    appName: "ኢትዮጵያ ፍርድ ቤት ስርዓት",
    copyright: "© 2024 የኢትዮጵያ ፍርድ ቤት ስርዓት። ሁሉም መብቶች የተጠበቁ ናቸው።",

    // Navigation
    login: "ግባ",
    signup: "ይመዝገቡ",
     username:"መለያ ስም",
    loginAs: {
      judge: "እንደ ዳኛ ይግቡ",
      police: "እንደ ፖሊስ ይግቡ",
      prosecutor: "እንደ ዐቃቤ ህግ ይግቡ",
      user: "እንደ ተጠቃሚ ይግቡ",
      admin: "እንደ አስተዳዳሪ ይግቡ"
    },
    myCases: "የእኔ ጉዳዮች",
    appeal: "አግሎ መግባት",
    backToHome: "ወደ መነሻ ተመለስ",
    logout: "ውጣ",
    logoutConfirmation: "እርግጠኛ ነዎት መውጣት ይፈልጋሉ?",

    // Auth
    usernameOrEmail: "የተጠቃሚ ስም ወይም ኢሜይል",
    password: "የይለፍ ቃል",
    confirmPassword: "የይለፍ ቃል ያረጋግጡ",
    rememberMe: "አስታውሰኝ",
    forgotPassword: "የይለፍ ቃል ረሳኽው?",
    dontHaveAccount: "አካውንት የሎትም?",
    alreadyHaveAccount: "ቀድሞውኑ አካውንት አለዎት?",
    loginNow: "አሁን ይግቡ",
    register: "ይመዝገቡ",
    firstName: "ስም",
    lastName: "የአባት ስም",
    phoneNumber: "ስልክ ቁጥር",
    city: "ከተማ",
    subCity: "ክፍለ ከተማ",
    passwordMismatch: "የይለፍ ቃላቶቹ አይዛመዱም",
    signupSuccess: "ምዝገባ ተሳክቷል! እባክዎ ይግቡ።",
    signupFail: "ምዝገባ አልተሳካም። እባክዎ ደግመው ይሞክሩ።",
    loginsucess: "በተሳካ ሁኔታ ገብተዋል!",
    invalidlogin: "የተሳሳተ የተጠቃሚ ስም ወይም የይለፍ ቃል",

    // Validation Messages
    usernameRequired: "የተጠቃሚ ስም ያስፈልጋል",
    emailRequired: "ኢሜይል ያስፈልጋል",
    invalidEmail: "እባክዎ ትክክለኛ ኢሜይል ያስገቡ",
    passwordRequired: "የይለፍ ቃል ያስፈልጋል",
    passwordMinLength: "የይለፍ ቃል ቢያንስ 6 ቁምፊ ሊኖረው ይገባል",
    nameRequired: "ስም ያስፈልጋል",
    phoneRequired: "ስልክ ቁጥር ያስፈልጋል",
    cityRequired: "ከተማ ያስፈልጋል",
    subCityRequired: "ክፍለ ከተማ ያስፈልጋል",

    // Landing Page
    heroSlide1: {
      title: "ውጤታማ የመስመር ላይ ፍርድ ቤት አስተዳደር",
      description: "ለኢትዮጵያ ግልጽነት እና ደህንነት ያለው የፍትሕ ሂደት አስተዳደር።"
    },
    heroSlide2: {
      title: "ደህንነቱ የተጠበቀ እና ግልጽ ሂደት",
      description: "ሁሉም የጉዳይ ውሂብዎ ደህንነቱ የተጠበቀ፣ ተደራሽ እና በቀላሉ የሚያስተዳድር ነው።"
    },
    heroSlide3: {
      title: "ለሁሉም ተደራሽ",
      description: "ዳኞች፣ ፖሊስ፣ ዐቃቤ ህግ እና ዜጎች ሁሉ የሚጠቀሙበት።"
    },
    caseManagement: {
      title: "ዘመናዊ የጉዳይ አስተዳደር",
      description: "የፍርድ ቤት ጉዳዮችን በሙሉ ያስተዳድሩ፣ የመስማማት ቀኖችን ያቅዱ፣ የጉዳዮችን እድገት ይከታተሉ እና በኢትዮጵያ የፍትሕ ስርዓት ውስጥ ለሁሉም የባለድርሻ አካላት ደህንነቱ የተጠበቀ የግንኙነት ስርዓት ያቅዱ።"
    },
    stakeholders: {
      title: "ለዳኞች፣ ፖሊስ፣ ዐቃቤ ህግ እና ዜጎች",
      description: "ለሁሉም ወገኖች ሙሉ ተደራሽነት እና ግልጽነት ለመስጠት የተነደፈ፣ የጉዳዮችን ሁኔታ በብቃት ለመከታተል፣ ሰነዶችን ለማግኘት እና በፍትሕ ሂደቱ ውስጥ በጋራ ለመስራት።"
    },
    features: {
      title: "ተጨማሪ ባህሪያትን ያስሱ"
    },
    feature1: {
      title: "ደህንነቱ የተጠበቀ ውሂብ አስተዳደር",
      description: "ውሂብዎን የላቀ ኢንክሪፕሽን እና የደህንነት ፕሮቶኮሎች በመጠቀም ይጠብቁ።"
    },
    feature2: {
      title: "በቀጥታ ማሳወቂያዎች",
      description: "በፈጣን ማሳወቂያዎች እና የጉዳይ ሁኔታ ለውጦች የተዘመኑ ይሁኑ።"
    },
    feature3: {
      title: "ተጠቃሚ-ፈቃደኛ በይነገጽ",
      description: "በቀላል እና ተደራሽ ዲዛይን በኩል በቀላሉ ይንቀሳቀሱ።"
    },
    feature4: {
      title: "ሙሉ ሪፖርት",
      description: "ለተሻለ የጉዳይ አስተዳደር ዝርዝር ሪፖርቶችን ይፍጠሩ።"
    },
    faq1: {
      question: "ስርዓቱ እንዴት ይሠራል?",
      answer: "ጉዳዮችን፣ የመስማማት ቀኖችን እና በፍትሕ ሂደቱ ውስጥ በሁሉም ወገኖች መካከል ያለውን ግንኙነት በደህንነት ያስተዳድራል።"
    },
    faq2: {
      question: "ስርዓቱን ማን ሊያገለግል ይችላል?",
      answer: "ዳኞች፣ ፖሊስ፣ ዐቃቤ ህግ እና ዜጎች በተለያዩ ሚናቸው መሰረት የተለያዩ ባህሪያትን መድረስ ይችላሉ።"
    },
    faq3: {
      question: "ውሂቤ ደህንነቱ የተጠበቀ ነው?",
      answer: "አዎ፣ ሁሉም የጉዳይ ውሂብ እና ግንኙነቶች ደህንነታቸው የተጠበቀ እንዲሆን የኢንዱስትሪ ደረጃ የደህንነት ስራዎችን እንጠቀማለን።"
    },
    justiceForAll: "ፍትሕ ለሁሉም",

    // Home Page
    welcomeMessage: "ወደ ዲጂታል ፍርድ ቤት ስርዓት እንኳን በደህና መጡ",
    introText: "የህግ ጉዳዮችዎን በኦንላይን አስገቡ እና እድገታቸውን በቀጥታ ይከታተሉ። የእኛ ዲጂታል መድረክ ፍትሕ ለሁሉም ተደራሽ ያደርገዋል።",
    benefits: [
      "ጉዳይ አስገባት ሁልጊዜ",
      "ጉዳዮችን በቀጥታ መከታተል",
      "ደህንነቱ የተጠበቀ ሰነድ መጫን",
      "የወረቀት ስራ ቀንሷል",
      "ፈጣን ምላሽ"
    ],
    submitCase: "አዲስ ጉዳይ አስገባ",
    fullName: "ሙሉ ስም",
    email: "ኢሜይል",
    dateOfIncident: "የጉዳዩ ቀን",
    caseType: "የጉዳዩ አይነት",
    selectOption: "-- የጉዳዩን አይነት ይምረጡ --",
    criminal: "ወንጀል",
    civil: "ሲቪል",
    family: "ቤተሰብ",
    landDispute: "የመሬት ክርክር",
    other: "ሌላ",
    caseDescription: "የጉዳዩ መግለጫ",
    idUpload: "የመታወቂያ ካርድ ይጭኑ (ፒዲኤፍ/ምስል)",
    additionalFiles: "ተጨማሪ ፋይሎች (አማራጭ)",
    agreeTerms: "ከዚህ በታች ካሉት ውሎች ጋር ተስማምቻለሁ",
    submit: "ጉዳዩን አስገባ",
    validationError: "እባክዎ ሁሉንም አስፈላጊ መስኮች ይሙሉ እና ከውሎች ጋር ተስማምተው።",
    caseSubmittedSuccess: "ጉዳዩ በተሳካ ሁኔታ ቀርቧል!",
    footerNote: "ሁሉም መብቶች የተጠበቁ ናቸው።",

    // My Cases
    submittedCasesTitle: "የእኔ የቀረቡ ጉዳዮች",
    noCases: "እስካሁን ምንም ጉዳይ አላስገቡም።",
    submittedToProcess: "ለሂደት ቀርቧል",
    delete: "ሰርዝ",
    clearAll: "ሁሉንም አጥፋ",
    caseStatus: {
      submitted: "ቀርቧል",
      inReview: "በግምገማ ላይ",
      processed: "ተካሂዷል",
      rejected: "ተቀባይነት አላገኘም"
    },

    // Appeal
    rejectedCases: "የተቀባይነት ያላገኙ ጉዳዮች",
    noRejectedCases: "የተቀባይነት ያላገኙ ጉዳዮች የሉዎትም።",
    appealButton: "የግልፋት ማመልከቻ አስገባ",
    appealFormTitle: "የግልፋት ፎርም",
    appealReason: "ለግልፋት ምክንያት",
    additionalEvidence: "ተጨማሪ ማስረጃ (አማራጭ)"
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
