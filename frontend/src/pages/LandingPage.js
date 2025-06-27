import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    image: 'https://images.pexels.com/photos/20389789/pexels-photo-20389789.jpeg',
    title: 'Efficient Online Court Management',
    description: 'Streamlining the judicial process for Ethiopia with transparency and security.',
  },
  {
    image: 'https://images.pexels.com/photos/6077326/pexels-photo-6077326.jpeg',
    title: 'Secure & Transparent Process',
    description: 'All your case data is safe, accessible, and easy to manage securely.',
  },
  {
    image: 'https://images.pexels.com/photos/8112201/pexels-photo-8112201.jpeg',
    title: 'Accessible for Everyone',
    description: 'Empowering judges, police, prosecutors, and citizens alike.',
  },
];

const faqs = [
  { question: 'How does the system work?', answer: 'It securely manages cases, schedules, and communication.' },
  { question: 'Who can access the system?', answer: 'Judges, police, prosecutors, and citizens with proper credentials.' },
  { question: 'Is my data safe?', answer: 'Yes, we use industry-standard security practices to keep your data safe.' },
];

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNav, setShowNav] = useState(true);
  const [faqOpen, setFaqOpen] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setShowNav(currentY < lastScrollY.current || currentY < 10);
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    }
    function handleEsc(event) {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
        if (buttonRef.current) buttonRef.current.focus();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }} className="relative">
      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
          showNav ? 'translate-y-0' : '-translate-y-full'
        } bg-white border-b border-gray-200`}
      >
        <div className="max-w-screen-xl mx-auto flex justify-between items-center px-4 py-3">
          <Link to="/" className="text-xl font-bold text-gray-900">
            Ethiopia CourtCase
          </Link>

          <nav className="flex items-center gap-4 relative">
            {/* Login Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                ref={buttonRef}
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-1"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                aria-controls="loginDropdown"
              >
                Login
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {dropdownOpen && (
                <div
                  id="loginDropdown"
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50"
                  role="menu"
                  aria-label="Login options"
                >
                  {[
                    { label: 'Login as Judge', path: '/login/judge' },
                    { label: 'Login as Police', path: '/login/police' },
                    { label: 'Login as Prosecutor', path: '/login/prosecutor' },
                    { label: 'Login as User', path: '/login' },
                    { label: 'Login as Admin', path: '/adminlogin' },
                  ].map(({ label, path }) => (
                    <Link
                      key={path}
                      to={path}
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex={0}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Sign Up Button */}
            <Link to="/signup" className="px-3 py-1 rounded bg-[#f25c05] text-white text-sm hover:bg-[#d14e00] transition">
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.img
            key={currentSlide}
            src={slides[currentSlide].image}
            alt={`Slide ${currentSlide + 1}`}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.7)' }}
          />
        </AnimatePresence>

        {/* Overlay & Text */}
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-4 z-10">
          <motion.h1
            key={currentSlide + '-title'}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-4xl sm:text-5xl text-white font-normal mb-4"
          >
            {slides[currentSlide].title}
          </motion.h1>
          <motion.p
            key={currentSlide + '-desc'}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="text-lg text-white max-w-2xl"
          >
            {slides[currentSlide].description}
          </motion.p>
        </div>
      </section>

      {/* 50/50 Sections */}
      <section className="relative grid grid-cols-1 md:grid-cols-2 max-w-screen-xl mx-auto px-4 py-16 items-center">
        <motion.img
          src="https://images.pexels.com/photos/38568/apple-imac-ipad-workplace-38568.jpeg"
          alt="Case Management"
          className="w-full rounded-lg pr-8"
          initial={{ scale: 1.1, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.5 }}
        />

        <div className="hidden md:block absolute left-1/2 top-1/16 h-1/2 border-l border-gray-300" />

        <motion.div
          className="md:pl-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Modern Case Management</h2>
          <p className="text-gray-600">
            Effectively manage all aspects of court cases, including scheduling hearings, tracking case progress, and facilitating secure, seamless communication between judges, attorneys, police, prosecutors, and other key stakeholders within the Ethiopian judiciary system.
          </p>
        </motion.div>
      </section>

      <section className="relative grid grid-cols-1 md:grid-cols-2 max-w-screen-xl mx-auto px-4 py-16 items-center">
        <motion.div
          className="md:pr-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            For Judges, Police, Prosecutors, and Citizens
          </h2>
          <p className="text-gray-600">
            Designed to provide full accessibility and transparency, enabling judges, police, prosecutors, and citizens to efficiently track case statuses, access relevant documents, and collaborate seamlessly throughout the judicial process.
          </p>
        </motion.div>

        <div className="hidden md:block absolute left-1/2 top-1/16 h-1/2 border-l border-gray-300" />

        <motion.img
          src="https://images.pexels.com/photos/15686924/pexels-photo-15686924.jpeg"
          alt="Stakeholders"
          className="w-full rounded-lg pl-8"
          initial={{ scale: 1.1, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.5 }}
        />
      </section>

      {/* Sliding Cards Section */}
      <section className="overflow-hidden py-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Explore More Features</h2>

        <motion.div
          className="flex w-[200%]"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 60, ease: 'linear', repeat: Infinity }}
        >
          {/* Original 4 unique cards */}
          {[
            {
              image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg',
              title: 'Secure Data Handling',
              description: 'Protect your data with advanced encryption and security protocols.',
            },
            {
              image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg',
              title: 'Real-Time Notifications',
              description: 'Stay updated with instant alerts and case status changes.',
            },
            {
              image: 'https://images.pexels.com/photos/267614/pexels-photo-267614.jpeg',
              title: 'User-Friendly Interface',
              description: 'Navigate easily through an intuitive and accessible design.',
            },
            {
              image: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg',
              title: 'Comprehensive Reporting',
              description: 'Generate detailed reports for better case management.',
            },
          ].map(({ image, title, description }, index) => (
            <div
              key={'orig-' + index}
              className="min-w-[300px] mx-4 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
              <img
                src={image}
                alt={title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            </div>
          ))}

          {/* Duplicate the same 4 cards for seamless loop */}
          {[
            {
              image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg',
              title: 'Secure Data Handling',
              description: 'Protect your data with advanced encryption and security protocols.',
            },
            {
              image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg',
              title: 'Real-Time Notifications',
              description: 'Stay updated with instant alerts and case status changes.',
            },
            {
              image: 'https://images.pexels.com/photos/267614/pexels-photo-267614.jpeg',
              title: 'User-Friendly Interface',
              description: 'Navigate easily through an intuitive and accessible design.',
            },
            {
              image: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg',
              title: 'Comprehensive Reporting',
              description: 'Generate detailed reports for better case management.',
            },
          ].map(({ image, title, description }, index) => (
            <div
              key={'dup-' + index}
              className="min-w-[300px] mx-4 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
              <img
                src={image}
                alt={title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="max-w-screen-md mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index}>
              <button
                onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                className="w-full text-left text-gray-800 font-semibold text-lg px-4 py-2 bg-gray-100 rounded-md"
                aria-expanded={faqOpen === index}
                aria-controls={`faq-content-${index}`}
              >
                {faq.question}
              </button>
              <AnimatePresence>
                {faqOpen === index && (
                  <motion.div
                    id={`faq-content-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden px-4 py-2 text-gray-600 bg-gray-50"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Parallax Section */}
      <section
        className="h-[50vh] bg-fixed bg-center bg-cover"
        style={{ backgroundImage: "url('https://images.pexels.com/photos/5710947/pexels-photo-5710947.jpeg')" }}
      >
        <div className="w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <h2 className="text-white text-4xl font-bold">Justice for All</h2>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-6 text-xs sm:text-sm">
        &copy; 2024 Ethiopia CourtCaseSystem. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;