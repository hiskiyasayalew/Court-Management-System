import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CourtIcon from '../assets/justice-scale.png'; 

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const HomePage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfIncident: '',
    caseType: '',
    caseDescription: '',
    idCardUpload: null,
    fileUpload: [],
    agreement: false,
  });
  const [submissionStatus, setSubmissionStatus] = useState('');
  const [showNav, setShowNav] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setShowNav(currentY < lastScrollY.current || currentY < 10);
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      if (name === 'fileUpload') {
        setFormData((prev) => ({ ...prev, [name]: files ? Array.from(files) : [] }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: files ? files[0] : null }));
      }
    } else if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.userName) {
      alert("User not logged in.");
      setIsSubmitting(false);
      return;
    }

    const {
      fullName, email, phone, dateOfIncident,
      caseType, caseDescription, idCardUpload,
      fileUpload, agreement,
    } = formData;

    if (!fullName.trim() || !email.trim() || !caseType || !caseDescription.trim() || !idCardUpload || !agreement) {
      setSubmissionStatus(t.validationError || 'Please fill all required fields and agree to terms.');
      setIsSubmitting(false);
      return;
    }

    try {
      const data = new FormData();
      const caseData = {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        dateOfIncident,
        caseType,
        caseDescription: caseDescription.trim(),
        agreement,
        userName: user.userName
      };
      data.append('caseData', JSON.stringify(caseData));
      data.append('files', idCardUpload);
      if (fileUpload && fileUpload.length > 0) {
        fileUpload.forEach((file) => {
          data.append('files', file);
        });
      }

      const response = await fetch('http://localhost:8080/api/cases/submit', {
        method: 'POST',
        body: data
      });
      
      if (!response.ok) throw new Error(await response.text());
      
      setSubmissionStatus(t.caseSubmittedSuccess || 'Case submitted successfully!');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        dateOfIncident: '',
        caseType: '',
        caseDescription: '',
        idCardUpload: null,
        fileUpload: [],
        agreement: false
      });
    } catch (error) {
      console.error(error);
      setSubmissionStatus(error.message || 'Submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900 font-sans">
      {/* Header/Navbar */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${showNav ? 'translate-y-0' : '-translate-y-full'} bg-white border-b border-gray-200 shadow-sm`}>
        <div className="max-w-screen-xl mx-auto flex justify-between items-center px-3 sm:px-4 py-3">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-2">
            <img src={CourtIcon} alt="Court Icon" className="w-7 h-7 sm:w-8 sm:h-8" />
            <span className="text-gray-900 font-medium text-base sm:text-lg md:text-xl">Ethiopian Court Case System</span>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-md focus:outline-none text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <button 
              onClick={() => navigate('/mycases')} 
              className="bg-gray-100 text-gray-800 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              {t.myCases || 'My Cases'}
            </button>
            <button 
              onClick={() => navigate('/appeal')} 
              className="bg-gray-100 text-gray-800 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              {t.appeal || 'Appeal'}
            </button>
            <LanguageSwitcher />
            <button 
              onClick={() => {
                if (window.confirm(t.logoutConfirmation || "Are you sure you want to logout?")) {
                  localStorage.removeItem("user");
                  navigate('/login');
                }
              }} 
              className="bg-[#f25c05] hover:bg-[#d14e00] text-white font-medium px-4 py-1.5 rounded-lg transition-colors text-sm"
            >
              {t.logout || 'Logout'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white px-4 py-3 border-t border-gray-200 shadow-md">
            <div className="flex flex-col space-y-3">
              <button 
                onClick={() => {
                  navigate('/mycases');
                  setIsMobileMenuOpen(false);
                }} 
                className="w-full text-left bg-gray-100 text-gray-800 font-medium px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                {t.myCases || 'My Cases'}
              </button>
              <button 
                onClick={() => {
                  navigate('/appeal');
                  setIsMobileMenuOpen(false);
                }} 
                className="w-full text-left bg-gray-100 text-gray-800 font-medium px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                {t.appeal || 'Appeal'}
              </button>
              <div className="flex items-center justify-between pt-2">
                <LanguageSwitcher />
                <button 
                  onClick={() => {
                    if (window.confirm(t.logoutConfirmation || "Are you sure you want to logout?")) {
                      localStorage.removeItem("user");
                      navigate('/login');
                    }
                  }} 
                  className="bg-[#f25c05] hover:bg-[#d14e00] text-white font-medium px-4 py-1.5 rounded-lg transition-colors text-sm"
                >
                  {t.logout || 'Logout'}
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto mt-16 sm:mt-20 mb-12 rounded-xl p-4 sm:p-6 md:p-8 flex-grow w-full">
        {/* Welcome Section */}
        <motion.section 
          className="mb-8 sm:mb-12 text-center max-w-3xl mx-auto" 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }} 
          variants={fadeInUp}
        >
          <motion.h1 
            variants={fadeInUp} 
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gray-800"
          >
            {t.welcomeMessage || 'Welcome to the Ethiopian Court Case System'}
          </motion.h1>
          <motion.p 
            variants={fadeInUp} 
            className="text-base sm:text-lg text-gray-600 leading-relaxed"
          >
            {t.introText || 'Submit and manage your court cases online with our secure digital platform.'}
          </motion.p>
        </motion.section>

        {/* Benefits Section */}
        <motion.section 
          aria-label="Benefits of Digital Court System" 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8 sm:mb-12 max-w-5xl mx-auto" 
          variants={staggerContainer} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.3 }}
        >
          {(t.benefits || []).map((text, idx) => (
            <motion.article 
              key={idx} 
              variants={fadeInUp} 
              tabIndex={0} 
              className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            >
              <svg className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 mt-0.5" fill="none" stroke="#0369a1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" />
              </svg>
              <p className="font-medium text-sm sm:text-base text-gray-800">{text}</p>
            </motion.article>
          ))}
        </motion.section>

        {/* Parallax Banner */}
        <section className="h-40 sm:h-56 md:h-64 lg:h-72 bg-fixed bg-center bg-cover rounded-xl shadow-sm mb-8 sm:mb-12" 
          style={{ backgroundImage: "url('https://images.pexels.com/photos/6077326/pexels-photo-6077326.jpeg')" }}>
          <div className="w-full h-full bg-black/40 flex justify-center items-center rounded-xl">
            <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-bold text-center px-4">
              {t.justiceForAll || 'Justice for All'}
            </h2>
          </div>
        </section>

        {/* Form Section */}
        <motion.section 
          className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-sm mb-8 sm:mb-12 max-w-3xl mx-auto" 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.3 }} 
          variants={staggerContainer}
        >
          <motion.h2 
            variants={fadeInUp} 
            className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-gray-800"
          >
            {t.submitCase || 'Submit a New Case'}
          </motion.h2>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className="block font-medium text-gray-700 mb-1.5 text-sm sm:text-base">
                  {t.fullName || 'Full Name'} <span className="text-red-600">*</span>
                </label>
                <input 
                  type="text" 
                  name="fullName" 
                  value={formData.fullName} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1.5 text-sm sm:text-base">
                  {t.email || 'Email'} <span className="text-red-600">*</span>
                </label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1.5 text-sm sm:text-base">
                  {t.phone || 'Phone Number'}
                </label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1.5 text-sm sm:text-base">
                  {t.dateOfIncident || 'Date of Incident'}
                </label>
                <input 
                  type="date" 
                  name="dateOfIncident" 
                  value={formData.dateOfIncident} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1.5 text-sm sm:text-base">
                {t.caseType || 'Case Type'} <span className="text-red-600">*</span>
              </label>
              <select 
                name="caseType" 
                value={formData.caseType} 
                onChange={handleChange} 
                required 
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{t.selectOption || '-- Select a Case Type --'}</option>
                <option value="Criminal">{t.criminal || 'Criminal'}</option>
                <option value="Civil">{t.civil || 'Civil'}</option>
                <option value="Family">{t.family || 'Family'}</option>
                <option value="Land Dispute">{t.landDispute || 'Land Dispute'}</option>
                <option value="Other">{t.other || 'Other'}</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1.5 text-sm sm:text-base">
                {t.caseDescription || 'Case Description'} <span className="text-red-600">*</span>
              </label>
              <textarea 
                name="caseDescription" 
                value={formData.caseDescription} 
                onChange={handleChange} 
                rows={4} 
                required 
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              ></textarea>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1.5 text-sm sm:text-base">
                {t.idUpload || 'Upload ID (PDF/Image)'} <span className="text-red-600">*</span>
              </label>
              <input 
                type="file" 
                name="idCardUpload" 
                accept=".pdf,image/*" 
                onChange={handleChange} 
                required 
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1.5 text-sm sm:text-base">
                {t.additionalFiles || 'Additional Files (optional)'}
              </label>
              <input 
                type="file" 
                name="fileUpload" 
                multiple 
                accept=".pdf,image/*" 
                onChange={handleChange} 
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-start">
              <input 
                type="checkbox" 
                name="agreement" 
                checked={formData.agreement} 
                onChange={handleChange} 
                required 
                className="mt-1 mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-xs sm:text-sm text-gray-700">
                {t.agreeTerms || 'I agree to the terms and conditions.'} <span className="text-red-600">*</span>
              </label>
            </div>

            {submissionStatus && (
              <div className={`p-3 rounded-lg text-center font-medium text-sm sm:text-base ${
                submissionStatus.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {submissionStatus}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-4 py-3 rounded-lg transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t.submitting || 'Submitting...'}
                </>
              ) : (
                t.submit || 'Submit Case'
              )}
            </button>
          </form>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 text-center py-4 sm:py-5 text-xs sm:text-sm text-gray-600">
        <p>&copy; {new Date().getFullYear()} Ethiopian Court Case System. {t.footerNote || 'All rights reserved.'}</p>
      </footer>
    </div>
  );
};

export default HomePage;