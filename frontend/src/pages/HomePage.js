import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.userName) {
      alert("User not logged in.");
      return;
    }
    const {
      fullName, email, phone, dateOfIncident,
      caseType, caseDescription, idCardUpload,
      fileUpload, agreement,
    } = formData;

    if (!fullName.trim() || !email.trim() || !caseType || !caseDescription.trim() || !idCardUpload || !agreement) {
      setSubmissionStatus(t.validationError || 'Please fill all required fields and agree to terms.');
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
      setFormData({ fullName: '', email: '', phone: '', dateOfIncident: '', caseType: '', caseDescription: '', idCardUpload: null, fileUpload: [], agreement: false });
    } catch (error) {
      console.error(error);
      setSubmissionStatus(error.message || 'Submission failed.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-200 text-gray-900 font-sans">
      <header className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${showNav ? 'translate-y-0' : '-translate-y-full'} bg-gray-300 border-b border-gray-400`}>
        <div className="max-w-screen-xl mx-auto flex justify-between items-center px-4 py-3">
          <div className="text-gray-900 font-bold text-xl">{t.title}</div>
          <LanguageSwitcher />
          <div className="flex gap-4 items-center">
            <button onClick={() => navigate('/mycases')} className="bg-gray-300 text-gray-900 font-semibold px-4 py-2 rounded-full hover:bg-gray-400 shadow-md">
              {t.myCases || 'My Cases'}
            </button>
            <button 
              type="button" 
              onClick={() => {
                if (window.confirm(t.logoutConfirmation || "Are you sure you want to logout?")) {
                  localStorage.removeItem("user"); // Remove user from local storage
                  navigate('/login'); // Navigate to the login page
                }
              }} 
              className="bg-[#f25c05] hover:bg-[#d14e00] text-white font-semibold px-6 py-2 rounded-full shadow-lg shadow-[#f25c05]/50 transition-colors"
            >
              {t.logout}
            </button>
          </div>
        </div>
      </header>

      <main className="bg-gray-200 max-w-7xl mx-auto mt-8 mb-12 rounded-3xl p-8 md:p-14 flex-grow shadow-xl z-0">
        <motion.section className="mb-12 text-center max-w-4xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">{t.welcomeMessage}</motion.h1>
          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-gray-700 leading-relaxed">{t.introText}</motion.p>
        </motion.section>

        <motion.section aria-label="Benefits of Digital Court System" className="flex flex-wrap justify-center gap-8 mb-14 max-w-6xl mx-auto" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          {(t.benefits || []).map((text, idx) => (
            <motion.article key={idx} variants={fadeInUp} tabIndex={0} className="flex items-center gap-4 bg-gray-300 rounded-3xl p-5 shadow-md text-gray-900 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer min-w-[250px]">
              <svg className="h-8 w-8" fill="none" stroke="#0369a1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
              <p className="font-semibold text-lg">{text}</p>
            </motion.article>
          ))}
        </motion.section>

        {/* Parallax banner */}
        <section className="h-[50vh] bg-fixed bg-center bg-cover rounded-3xl shadow-md mb-16" style={{ backgroundImage: "url('https://images.pexels.com/photos/6077326/pexels-photo-6077326.jpeg')" }}>
          <div className="w-full h-full bg-black/40 flex justify-center items-center">
            <h2 className="text-white text-4xl font-bold">{t.justiceForAll || 'Justice for All'}</h2>
          </div>
        </section>

        {/* Form section */}
        <motion.section className="bg-gray-300 p-8 rounded-3xl shadow-xl mb-16 max-w-4xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}>
          <motion.h2 variants={fadeInUp} className="text-3xl font-bold mb-6 text-center text-gray-900">
            {t.submitCase || 'Submit a New Case'}
          </motion.h2>

          <form onSubmit={handleSubmit} className="space-y-6 text-gray-800">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold">{t.fullName || 'Full Name'}</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full px-4 py-2 rounded border border-gray-400" />
              </div>
              <div>
                <label className="block font-semibold">{t.email || 'Email'}</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 rounded border border-gray-400" />
              </div>
              <div>
                <label className="block font-semibold">{t.phone || 'Phone Number'}</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 rounded border border-gray-400" />
              </div>
              <div>
                <label className="block font-semibold">{t.dateOfIncident || 'Date of Incident'}</label>
                <input type="date" name="dateOfIncident" value={formData.dateOfIncident} onChange={handleChange} className="w-full px-4 py-2 rounded border border-gray-400" />
              </div>
            </div>

            <div>
              <label className="block font-semibold">{t.caseType || 'Case Type'}</label>
              <select name="caseType" value={formData.caseType} onChange={handleChange} required className="w-full px-4 py-2 rounded border border-gray-400">
                <option value="">{t.selectOption || '-- Select a Case Type --'}</option>
                <option value="Criminal">{t.criminal || 'Criminal'}</option>
                <option value="Civil">{t.civil || 'Civil'}</option>
                <option value="Family">{t.family || 'Family'}</option>
                <option value="Land Dispute">{t.landDispute || 'Land Dispute'}</option>
                <option value="Other">{t.other || 'Other'}</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold">{t.caseDescription || 'Case Description'}</label>
              <textarea name="caseDescription" value={formData.caseDescription} onChange={handleChange} rows={4} required className="w-full px-4 py-2 rounded border border-gray-400"></textarea>
            </div>

            <div>
              <label className="block font-semibold">{t.idUpload || 'Upload ID (PDF/Image)'}</label>
              <input type="file" name="idCardUpload" accept=".pdf,image/*" onChange={handleChange} required className="w-full px-4 py-2 rounded border border-gray-400" />
            </div>

            <div>
              <label className="block font-semibold">{t.additionalFiles || 'Additional Files (optional)'}</label>
              <input type="file" name="fileUpload" multiple accept=".pdf,image/*" onChange={handleChange} className="w-full px-4 py-2 rounded border border-gray-400" />
            </div>

            <div className="flex items-center">
              <input type="checkbox" name="agreement" checked={formData.agreement} onChange={handleChange} required className="mr-2" />
              <label className="text-sm">{t.agreeTerms || 'I agree to the terms and conditions.'}</label>
            </div>

            {submissionStatus && (
              <div className="text-center font-semibold text-red-600">{submissionStatus}</div>
            )}

            <button type="submit" className="bg-[#03314b] hover:bg-[#022534] text-white font-bold px-6 py-3 rounded-full shadow-md mx-auto block">
              {t.submit || 'Submit Case'}
            </button>
          </form>
        </motion.section>
      </main>

      <footer className="bg-gray-300 text-gray-900 text-center py-6 select-none">
        <p>&copy; {new Date().getFullYear()} {t.title}. {t.footerNote}</p>
      </footer>
    </div>
  );
};

export default HomePage;