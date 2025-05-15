import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import homeimage from '../assets/lawsymbol2.webp';

const HomePage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0b3954] to-[#087e8b] text-gray-100 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#03314b] shadow-md flex justify-between items-center py-5 px-8 select-none">
        <div aria-label="Digital Court Management System description" className="text-white font-bold text-lg max-w-[180px]">
          {t.title}
        </div>
        <LanguageSwitcher /> {/* Add LanguageSwitcher here */}
        <div aria-label="Court logo" className="cursor-pointer transition-transform hover:rotate-15 hover:scale-105 duration-300">
          <img
            src={homeimage}
            alt="Court Logo"
            className="h-20 w-20 rounded-lg"
            draggable={false}
          />
        </div>
        <div>
          <button
            type="button"
            className="bg-[#f25c05] hover:bg-[#d14e00] focus:outline-none focus:ring-2 focus:ring-[#d14e00] text-white font-semibold px-6 py-2 rounded-full shadow-lg shadow-[#f25c05]/50 transition-colors"
            aria-label="Logout"
            onClick={() => {
              if (window.confirm(t.logoutConfirmation)) {
                alert(t.logoutSuccess);
                // Redirect or real logout logic here
              }
            }}
          >
            {t.logout}
          </button>
        </div>
      </header>

      {/* Main Section */}
      <main className="bg-[#f6f9fa] max-w-4xl mx-auto mt-11 mb-12 rounded-3xl p-14 text-gray-900 flex-grow shadow-xl">
        <h1 className="text-4xl font-extrabold mb-6 leading-tight">
          {t.welcomeMessage}
        </h1>

        <p className="text-lg text-gray-600 mb-12 leading-relaxed">
          {t.introText}
        </p>

        {/* Benefits Section */}
        <section aria-label="Benefits of Digital Court System" className="flex flex-wrap gap-8 mb-12">
          {t.benefits.map((text, idx) => (
            <article
              key={idx}
              tabIndex={0}
              aria-describedby={`benefit${idx + 1}desc`}
              className="flex items-start gap-4 bg-blue-100 rounded-2xl p-6 shadow-md text-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer flex-1 min-w-[280px]"
            >
              <svg
                className="h-9 w-9 flex-shrink-0"
                fill="#0369a1"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M5 13l4 4L19 7" stroke="#0369a1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              <p id={`benefit${idx + 1}desc`} className="font-semibold">
                {text}
              </p>
            </article>
          ))}
        </section>

        {/* Form Section */}
        <h2 className="text-2xl font-extrabold mb-6">{t.submitCaseTitle}</h2>
        <form noValidate aria-live="polite" aria-describedby="formInstructions">
          <p id="formInstructions" className="text-gray-500 mb-6 font-semibold">
            {t.formInstructions}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="flex flex-col">
              <label htmlFor="fullName" className="font-semibold text-gray-800 mb-2">
                {t.fullNameLabel} <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder={t.fullNamePlaceholder}
                required
                aria-required="true"
                className="rounded-lg border-2 p-3 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 transition border-gray-300 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="font-semibold text-gray-800 mb-2">
                {t.emailLabel} <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder={t.emailPlaceholder}
                required
                aria-required="true"
                className="rounded-lg border-2 p-3 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 transition border-gray-300 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="phone" className="font-semibold text-gray-800 mb-2">
                {t.phoneLabel}
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder={t.phonePlaceholder}
                pattern="^\+?\d{7,15}$"
                aria-describedby="phoneHelp"
                className="rounded-lg border-2 p-3 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 transition border-gray-300 focus:ring-blue-500"
              />
              <small id="phoneHelp" className="text-gray-500 mt-1">
                {t.phoneHelp}
              </small>
            </div>

            <div className="flex flex-col">
              <label htmlFor="dateOfIncident" className="font-semibold text-gray-800 mb-2">
                {t.dateOfIncidentLabel}
              </label>
              <input
                type="date"
                id="dateOfIncident"
                name="dateOfIncident"
                max={new Date().toISOString().split('T')[0]}
                aria-describedby="dateHelp"
                className="rounded-lg border-2 p-3 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 transition border-gray-300 focus:ring-blue-500"
              />
              <small id="dateHelp" className="text-gray-500 mt-1">{t.dateHelp}</small>
            </div>

            <div className="flex flex-col">
              <label htmlFor="caseType" className="font-semibold text-gray-800 mb-2">
                {t.caseTypeLabel} <span className="text-red-600">*</span>
              </label>
              <select
                id="caseType"
                name="caseType"
                required
                aria-required="true"
                className="rounded-lg border-2 p-3 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 transition border-gray-300 focus:ring-blue-500"
                defaultValue=""
              >
                <option value="" disabled>{t.selectCaseType}</option>
                <option value="criminal">{t.criminal}</option>
                <option value="civil">{t.civil}</option>
                <option value="traffic">{t.traffic}</option>
                <option value="family">{t.family}</option>
                <option value="others">{t.others}</option>
              </select>
            </div>

            <div className="flex flex-col md:col-span-2">
              <label htmlFor="caseDescription" className="font-semibold text-gray-800 mb-2">
                {t.caseDescriptionLabel} <span className="text-red-600">*</span>
              </label>
              <textarea
                id="caseDescription"
                name="caseDescription"
                placeholder={t.caseDescriptionPlaceholder}
                required
                aria-required="true"
                className="rounded-lg border-2 p-3 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 transition resize-y min-h-[100px]"
              />
            </div>

            <div className="flex flex-col md:col-span-2">
              <label htmlFor="idCardUpload" className="font-semibold text-gray-800 mb-2">
                {t.idCardUploadLabel} <span className="text-red-600">*</span>
              </label>
              <input
                type="file"
                id="idCardUpload"
                name="idCardUpload"
                accept="image/*,application/pdf"
                required
                aria-required="true"
                className="rounded-lg border-2 p-3 text-gray-900 bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 transition border-gray-300 focus:ring-blue-500"
              />
              <small className="text-gray-500 mt-1">{t.idCardUploadHelp}</small>
            </div>

            <div className="flex flex-col md:col-span-2">
              <label htmlFor="fileUpload" className="font-semibold text-gray-800 mb-2">
                {t.additionalFilesLabel} (Optional)
              </label>
              <input
                type="file"
                id="fileUpload"
                name="fileUpload"
                accept="image/*,application/pdf"
                multiple
                className="rounded-lg border-2 p-3 text-gray-900 bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 transition border-gray-300 focus:ring-blue-500"
              />
              <small className="text-gray-500 mt-1">{t.additionalFilesHelp}</small>
            </div>

            <div className="flex items-center md:col-span-2 mt-2">
              <input
                type="checkbox"
                id="agreement"
                name="agreement"
                required
                aria-required="true"
                className="w-5 h-5 mr-3 rounded border-gray-400 text-orange-600 focus:ring-orange-500 focus:outline-none"
              />
              <label htmlFor="agreement" className="font-semibold text-gray-800 select-none">
                {t.agreementText} <span className="text-red-600">*</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 rounded-full px-9 py-3 text-xl font-extrabold text-white shadow-lg transition-all flex justify-center items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 focus:ring-4 focus:ring-orange-400"
          >
            {t.submitCaseButton}
          </button>
        </form>
      </main>

      {/* Footer */}
      <footer className="bg-[#03314b] text-center py-4 font-semibold text-gray-300 select-none text-sm">
        &copy; 2024 Digital Court Management System. {t.allRightsReserved}
      </footer>
    </div>
  );
};

export default HomePage;