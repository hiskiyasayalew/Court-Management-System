import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import homeimage from '../assets/lawsymbol2.webp';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [cases, setCases] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfIncident: '',
    caseType: '',
    caseDescription: '',
    idCardUpload: null,
    fileUpload: null,
    agreement: false,
  });
  const [submissionStatus, setSubmissionStatus] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      if (name === 'fileUpload') {
        setFormData((prev) => ({ ...prev, [name]: files ? Array.from(files) : null }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: files ? files[0] : null }));
      }
    } else if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { fullName, email, caseType, caseDescription, idCardUpload, agreement } = formData;

    if (!fullName.trim() || !email.trim() || !caseType || !caseDescription.trim() || !idCardUpload || !agreement) {
      setSubmissionStatus(t.validationError || 'Please fill all required fields and agree to terms.');
      return;
    }

    const newCase = {
      id: Date.now().toString(),
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      dateOfIncident: formData.dateOfIncident,
      caseType: formData.caseType,
      caseDescription: formData.caseDescription.trim(),
      idCardUploadName: formData.idCardUpload?.name || '',
      additionalFileNames: formData.fileUpload ? formData.fileUpload.map((f) => f.name) : [],
      agreement: formData.agreement,
      status: t.submittedToProcess || 'Submitted to Process',
      submittedAt: new Date().toISOString(),
    };

    setCases((prev) => [newCase, ...prev]);
    setSubmissionStatus(t.caseSubmittedSuccess || 'Case submitted successfully!');
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      dateOfIncident: '',
      caseType: '',
      caseDescription: '',
      idCardUpload: null,
      fileUpload: null,
      agreement: false,
    });
  };

  const onLogout = () => {
    if (window.confirm(t.logoutConfirmation)) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0b3954] to-[#087e8b] text-gray-100 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#03314b] shadow-md flex flex-col md:flex-row justify-between items-center py-5 px-6 md:px-12 select-none">
        <div aria-label={t.title} className="text-white font-bold text-xl max-w-[220px] text-center md:text-left">
          {t.title}
        </div>
        <LanguageSwitcher />
        <div aria-label="Court logo" className="cursor-pointer transition-transform hover:rotate-12 hover:scale-110 duration-300 mb-3 md:mb-0">
          <img src={homeimage} alt="Court Logo" className="h-16 w-16 md:h-20 md:w-20 rounded-lg" draggable={false} />
        </div>
        <button
          type="button"
          className="bg-[#f25c05] hover:bg-[#d14e00] focus:outline-none focus:ring-2 focus:ring-[#d14e00] text-white font-semibold px-6 py-2 rounded-full shadow-lg shadow-[#f25c05]/50 transition-colors"
          aria-label={t.logout}
          onClick={onLogout}
        >
          {t.logout}
        </button>
      </header>

      {/* Main Content */}
      <main className="bg-[#f6f9fa] max-w-7xl mx-auto mt-8 mb-12 rounded-3xl p-8 md:p-14 text-gray-900 flex-grow shadow-xl">
        {/* Hero */}
        <section className="mb-12 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            {t.welcomeMessage}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            {t.introText}
          </p>
        </section>

        {/* Benefits Section */}
        <section aria-label="Benefits of Digital Court System" className="flex flex-wrap justify-center gap-8 mb-14 max-w-6xl mx-auto">
          {(t.benefits || []).map((text, idx) => (
            <article
              key={idx}
              tabIndex={0}
              aria-describedby={`benefit${idx + 1}desc`}
              className="flex items-center gap-4 bg-blue-100 rounded-3xl p-5 shadow-md text-blue-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer min-w-[250px]"
            >
              <svg
                className="h-8 w-8 flex-shrink-0"
                fill="none"
                stroke="#0369a1"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
              <p id={`benefit${idx + 1}desc`} className="font-semibold text-lg">
                {text}
              </p>
            </article>
          ))}
        </section>

        {/* Case Submission Form */}
        <section aria-label="Case Submission Form" className="max-w-4xl mx-auto mb-14">
          <h2 className="text-3xl font-extrabold mb-6 text-center">{t.submitCaseTitle}</h2>
          <form noValidate onSubmit={handleSubmit} aria-live="polite" aria-describedby="formInstructions" className="space-y-6">
            <p id="formInstructions" className="text-gray-600 font-semibold text-center mb-6">
              {t.formInstructions}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label={t.fullNameLabel}
                name="fullName"
                type="text"
                placeholder={t.fullNamePlaceholder}
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <InputField
                label={t.emailLabel}
                name="email"
                type="email"
                placeholder={t.emailPlaceholder}
                value={formData.email}
                onChange={handleChange}
                required
              />
              <InputField
                label={t.phoneLabel}
                name="phone"
                type="text"
                placeholder={t.phonePlaceholder}
                value={formData.phone}
                onChange={handleChange}
                pattern="^\\+?\\d{7,15}$"
                helpText={t.phoneHelp}
              />
              <InputField
                label={t.dateOfIncidentLabel}
                name="dateOfIncident"
                type="date"
                value={formData.dateOfIncident}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                helpText={t.dateHelp}
              />
              <SelectField
                label={t.caseTypeLabel}
                name="caseType"
                value={formData.caseType}
                onChange={handleChange}
                options={t.caseTypes}
                required
              />
              <TextAreaField
                label={t.caseDescriptionLabel}
                name="caseDescription"
                value={formData.caseDescription}
                onChange={handleChange}
                placeholder={t.caseDescriptionPlaceholder}
                required
                rows={4}
              />
              <FileInputField
                label={t.idCardUploadLabel}
                name="idCardUpload"
                onChange={handleChange}
                required
                accept="image/*,application/pdf"
                currentFile={formData.idCardUpload}
                helpText={t.idCardHelp}
              />
              <FileInputField
                label={t.fileUploadLabel}
                name="fileUpload"
                onChange={handleChange}
                multiple
                accept="image/*,application/pdf"
                currentFile={formData.fileUpload}
                helpText={t.fileUploadHelp}
              />
              <CheckboxField
                label={t.agreementLabel}
                name="agreement"
                checked={formData.agreement}
                onChange={handleChange}
                required
              />
            </div>

            {submissionStatus && (
              <p
                className={
                  submissionStatus.toLowerCase().includes('success') ? 'text-center font-semibold text-green-600' : 'text-center font-semibold text-red-600'
                }
                role="alert"
              >
                {submissionStatus}
              </p>
            )}

            <button
              type="submit"
              className="w-full md:w-auto bg-[#f25c05] hover:bg-[#d14e00] text-white font-bold py-3 px-8 rounded-full shadow-md shadow-[#f25c05]/60 transition-colors focus:outline-none focus:ring-2 focus:ring-[#d14e00]"
            >
              {t.submitButton}
            </button>
          </form>
        </section>

        {/* Submitted Cases Section */}
        <section aria-label="Submitted Cases" className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-6 text-center">{t.submittedCasesTitle}</h2>
          {cases.length === 0 ? (
            <p className="text-center text-gray-700 italic">{t.noCases}</p>
          ) : (
            <ul className="space-y-4 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-xl shadow-inner border border-gray-300">
              {cases.map(({ id, fullName, caseType, submittedAt, status }) => (
                <li
                  key={id}
                  tabIndex={0}
                  className="bg-white p-4 rounded-xl shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#f25c05] transition"
                  aria-label={`Case submitted by ${fullName}, type ${caseType}, status ${status}`}
                >
                  <p className="font-semibold text-lg">{fullName}</p>
                  <p className="text-sm text-gray-600">{caseType}</p>
                  <p className="text-sm text-gray-500">{new Date(submittedAt).toLocaleString()}</p>
                  <p
                    className={`mt-1 font-semibold ${
                      status === (t.submittedToProcess || 'Submitted to Process') ? 'text-orange-600' : 'text-green-700'
                    }`}
                  >
                    {status}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#03314b] text-gray-300 text-center py-6 select-none">
        <p>
          &copy; {new Date().getFullYear()} {t.title}. {t.footerNote}
        </p>
      </footer>
    </div>
  );
};

const InputField = ({ label, name, type = 'text', placeholder, value, onChange, required, pattern, helpText }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="mb-1 font-semibold text-gray-800">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      pattern={pattern}
      className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f25c05] focus:border-[#f25c05]"
    />
    {helpText && <small className="text-gray-500 mt-1">{helpText}</small>}
  </div>
);

const SelectField = ({ label, name, value, onChange, options, required }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="mb-1 font-semibold text-gray-800">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f25c05] focus:border-[#f25c05]"
    >
      <option value="">{/* Empty option for placeholder */}</option>
      {options.map((opt, i) => (
        <option key={i} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const TextAreaField = ({ label, name, value, onChange, placeholder, required, rows }) => (
  <div className="flex flex-col col-span-full">
    <label htmlFor={name} className="mb-1 font-semibold text-gray-800">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={rows || 3}
      className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f25c05] focus:border-[#f25c05] resize-y"
    />
  </div>
);

const FileInputField = ({ label, name, onChange, required, accept, multiple, currentFile, helpText }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="mb-1 font-semibold text-gray-800">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <input
      id={name}
      name={name}
      type="file"
      onChange={onChange}
      required={required}
      accept={accept}
      multiple={multiple}
      className="rounded-lg border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#f25c05] focus:border-[#f25c05]"
      aria-describedby={`${name}Help`}
    />
    {currentFile && !multiple && (
      <small id={`${name}Help`} className="text-gray-600 mt-1">
        Current file: {currentFile.name}
      </small>
    )}
    {currentFile && multiple && Array.isArray(currentFile) && currentFile.length > 0 && (
      <small id={`${name}Help`} className="text-gray-600 mt-1">
        {currentFile.length} file(s) selected
      </small>
    )}
    {helpText && <small className="text-gray-500 mt-1">{helpText}</small>}
  </div>
);

const CheckboxField = ({ label, name, checked, onChange, required }) => (
  <div className="flex items-center gap-3">
    <input
      id={name}
      name={name}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      required={required}
      className="h-5 w-5 rounded border-gray-300 text-[#f25c05] focus:ring-[#f25c05]"
    />
    <label htmlFor={name} className="font-semibold text-gray-800 select-none cursor-pointer">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
  </div>
);

export default HomePage;

