import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        closeDropdown();
      }
    }

    function handleEsc(event) {
      if (event.key === 'Escape') {
        closeDropdown();
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
    <>
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto max-w-screen-xl flex flex-wrap justify-between items-center h-auto min-h-[4rem] px-4 sm:px-6 lg:px-8 py-2">
          {/* Logo */}
          <Link
            to="/"
            aria-label="Home - Online Court Case Management System Ethiopia"
            className="flex items-center gap-3 select-none"
          >
            <img
              src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c5f626e3-b255-47e7-b243-8847e1fbbfa8.png"
              alt="Judicial scales logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="text-gray-900 font-extrabold text-lg sm:text-xl whitespace-nowrap">
              Ethiopia CourtCase System
            </span>
          </Link>

          {/* Navigation */}
          <nav
            aria-label="Primary Navigation"
            className="flex items-center gap-4 sm:gap-6 text-sm font-semibold text-gray-700 mt-2 sm:mt-0"
          >
            {/* Login Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                ref={buttonRef}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                aria-controls="loginMenu"
                onClick={toggleDropdown}
                type="button"
                className="inline-flex items-center gap-1 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 rounded-md px-2 py-1"
              >
                Login
                <svg
                  className="w-4 h-4 stroke-current"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {dropdownOpen && (
                <div
                  id="loginMenu"
                  role="menu"
                  aria-labelledby="loginDropdownButton"
                  className="absolute left-0 sm:right-0 mt-2 w-[90vw] sm:w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
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
                      role="menuitem"
                      tabIndex={0}
                      onClick={closeDropdown}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Sign Up Button */}
            <Link
              to="/signup"
              className="px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-700 focus:ring-2 focus:ring-indigo-600 focus:outline-none text-sm"
              role="button"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-screen-xl text-center py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <h1 className="text-gray-900 text-3xl sm:text-4xl md:text-5xl font-extrabold max-w-4xl mx-auto leading-tight mb-6">
          Efficient & Transparent Online Court Case Management for Ethiopia
        </h1>
        <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
          Our system streamlines the judicial process by securely managing case records, schedules,
          and communications between judges, police officers, prosecutors, and citizens.
          Experience a modern, transparent, and accessible solution tailored to Ethiopian courts,
          enhancing justice delivery and case tracking efficiency across all judicial stakeholders.
        </p>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 text-gray-500 text-center text-xs sm:text-sm py-6 select-none">
        &copy; 2024 Ethiopia CourtCaseSys. All rights reserved.
      </footer>
    </>
  );
};

export default LandingPage;
