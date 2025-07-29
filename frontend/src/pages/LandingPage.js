import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CourtIcon from '../assets/court-icon.jpg'; // Ensure to place the image in your assets folder

// Local GIFs
import GavelGif from "./Gavel.gif";
import SystemGif from "./system.gif";
import LoadingGif from "./Loading Files.gif";

const slides = [
  {
    image: "https://images.pexels.com/photos/20389789/pexels-photo-20389789.jpeg",
    title: "Efficient Online Court Management",
    description: "Streamlining the judicial process for Ethiopia with transparency and security.",
  },
  {
    image: "https://images.pexels.com/photos/6077326/pexels-photo-6077326.jpeg",
    title: "Secure & Transparent Process",
    description: "All your case data is safe, accessible, and easy to manage securely.",
  },
  {
    image: "https://images.pexels.com/photos/8112201/pexels-photo-8112201.jpeg",
    title: "Accessible for Everyone",
    description: "Empowering judges, police, prosecutors, and citizens alike.",
  },
];
const faqs = [
  {
    question: "What is the Ethiopian CourtCase Management System?",
    answer:
      "It is a digital platform designed to streamline court case processes in Ethiopia, making the judicial system more transparent and accessible.",
  },
  {
    question: "Who can use this platform?",
    answer:
      "Judges, police officers, prosecutors, citizens, and administrators can access and use the system based on their roles.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. The system employs strict security measures to ensure that all user data and case information is protected.",
  },
  {
    question: "Can I file or track a case online?",
    answer:
      "Yes, citizens and legal professionals can file new cases and track the progress of existing ones through their respective dashboards.",
  },
];

const LandingPage = () => {
  const [loadingStep, setLoadingStep] = useState(0); // 0 = Loading, 1 = System, 2 = Gavel, 3 = Done
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNav, setShowNav] = useState(true);
  const [faqOpen, setFaqOpen] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const timers = [
      setTimeout(() => setLoadingStep(1), 2000),
      setTimeout(() => setLoadingStep(2), 4000),
      setTimeout(() => {
        setLoadingStep(3);
        document.body.style.overflow = "auto";
      }, 6000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % slides.length),
      4000
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setShowNav(currentY < lastScrollY.current || currentY < 10);
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };
    const handleEsc = (event) => {
      if (event.key === "Escape") setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const backgroundColor = "rgb(255, 186, 100)";

  const getGif = () => {
    if (loadingStep === 0) return LoadingGif;
    if (loadingStep === 1) return SystemGif;
    return GavelGif;
  };

  return (
    <>
      {/* Multi-step PRELOADER */}
      <AnimatePresence>
        {loadingStep < 3 && (
          <motion.div
            key={`preloader-${loadingStep}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 flex flex-col justify-center items-center z-[9999]"
            style={{ backgroundColor }}
          >
            <img
  src={getGif()}
  alt="Loading..."
  className="w-40 h-40 sm:w-48 sm:h-48 object-contain"
/>

           <p className="mt-4 text-gray-800 text-lg font-light text-center font-[Poppins]">
  Loading...
</p>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Page Content */}
      {loadingStep >= 3 && (
        <div className="font-sans relative">
        {/* NAVBAR */}
        <header
          className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
            showNav ? "translate-y-0" : "-translate-y-full"
          } bg-white border-b border-gray-200 shadow-sm`}
        >
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 text-lg sm:text-xl font-bold text-gray-900">
              <img src={CourtIcon} alt="Court Icon" className="w-8 h-8" />

  <span className="hidden sm:inline">Ethiopia CourtCase System</span>
</Link>

            <nav className="flex items-center gap-3 sm:gap-4 relative">
              {/* DROPDOWN */}
              <div className="relative" ref={dropdownRef}>
                <button
                  ref={buttonRef}
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5"
                >
                  Login
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-md shadow-lg z-50 py-1">
                    {[
                      { label: "Judge", path: "/login/judge" },
                      { label: "Police", path: "/login/police" },
                      { label: "Prosecutor", path: "/login/prosecutor" },
                      { label: "User", path: "/login" },
                      { label: "Admin", path: "/adminlogin" },
                    ].map(({ label, path }) => (
                      <Link
                        key={path}
                        to={path}
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Sign Up */}
              <Link
                to="/signup"
                className="px-2 py-1 sm:px-3 sm:py-1.5 rounded bg-[#f25c05] text-white text-xs sm:text-sm hover:bg-[#d14e00] transition"
              >
                Sign Up
              </Link>
            </nav>
          </div>
        </header>

        {/* HERO SLIDER */}
        <section className="relative h-[60vh] sm:h-screen w-full overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.img
              key={currentSlide}
              src={slides[currentSlide].image}
              alt={`Slide ${currentSlide + 1}`}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "brightness(0.7)" }}
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-4 z-10">
            <motion.h1
              key={currentSlide + "-title"}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="text-2xl sm:text-4xl md:text-5xl text-white font-bold mb-2 sm:mb-4"
            >
              {slides[currentSlide].title}
            </motion.h1>
            <motion.p
              key={currentSlide + "-desc"}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.9, duration: 1 }}
              className="text-sm sm:text-lg text-white max-w-md sm:max-w-2xl"
            >
              {slides[currentSlide].description}
            </motion.p>
          </div>
        </section>

        {/* FEATURES SECTIONS */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <motion.img
              src="https://images.pexels.com/photos/38568/apple-imac-ipad-workplace-38568.jpeg"
              alt="Case Management"
              className="w-full rounded-lg shadow-md"
              initial={{ scale: 1.1, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.5 }}
            />

            <motion.div
              className="md:pl-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              viewport={{ once: true, amount: 0.5 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Modern Case Management
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Effectively manage all aspects of court cases, including scheduling
                hearings, tracking case progress, and facilitating secure, seamless
                communication between judges, attorneys, police, prosecutors, and
                other key stakeholders within the Ethiopian judiciary system.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center mt-12 sm:mt-16">
            <motion.div
              className="md:pr-8 order-1 md:order-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              viewport={{ once: true, amount: 0.5 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                For Judges, Police, Prosecutors, and Citizens
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Designed to provide full accessibility and transparency, enabling
                judges, police, prosecutors, and citizens to efficiently track case
                statuses, access relevant documents, and collaborate seamlessly
                throughout the judicial process.
              </p>
            </motion.div>

            <motion.img
              src="https://images.pexels.com/photos/15686924/pexels-photo-15686924.jpeg"
              alt="Stakeholders"
              className="w-full rounded-lg shadow-md order-2 md:order-1"
              initial={{ scale: 1.1, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.5 }}
            />
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="max-w-screen-md mx-auto px-4 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-6 sm:mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() =>
                    setFaqOpen(faqOpen === index ? null : index)
                  }
                  className="w-full text-left text-gray-800 font-medium sm:font-semibold text-sm sm:text-base px-4 py-3 bg-gray-50 hover:bg-gray-100 transition"
                  aria-expanded={faqOpen === index}
                >
                  {faq.question}
                </button>
                <AnimatePresence>
                  {faqOpen === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 py-2 text-gray-600 text-sm sm:text-base bg-white"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* PARALLAX SECTION */}
        <section
          className="h-[40vh] sm:h-[50vh] bg-fixed bg-center bg-cover"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/5710947/pexels-photo-5710947.jpeg')",
          }}
        >
          <div className="w-full h-full bg-black/50 flex justify-center items-center">
            <h2 className="text-white text-2xl sm:text-4xl font-bold">
              Justice for All
            </h2>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-gray-900 text-gray-400 text-center py-6 text-xs sm:text-sm">
          &copy; {new Date().getFullYear()} Ethiopia CourtCaseSystem. All rights
          reserved.
        </footer>
     </div>
      )}
    </>
  );
};

export default LandingPage;
