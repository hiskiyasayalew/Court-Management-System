import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const AppealPage = () => {
  const { t } = useLanguage();
  const [appeals, setAppeals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppeals = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.userName) return;

      try {
        const response = await fetch(`http://localhost:8080/api/appeals/by-user?userName=${user.userName}`);
        if (!response.ok) throw new Error('Failed to fetch appeals');
        const appealsData = await response.json();
        setAppeals(appealsData);
      } catch (error) {
        console.error('Error fetching appeals:', error);
      }
    };

    fetchAppeals();
  }, []);

  return (
    <div className="min-h-screen bg-gray-200 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-gray-300 border-b border-gray-400 p-3 sm:p-4">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <div className="text-gray-900 font-bold text-lg sm:text-xl md:text-2xl">{t.title}</div>

          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 md:gap-4">
            <LanguageSwitcher className="bg-white text-gray-800 px-3 py-1 rounded-full shadow-sm" />

            <button
              onClick={() => navigate('/mycases')}
              className="bg-gray-300 text-gray-900 font-semibold px-3 py-1 sm:px-4 sm:py-2 rounded-full hover:bg-gray-400 shadow-md text-xs sm:text-sm md:text-base"
            >
              {t.myCases}
            </button>
            <button
              onClick={() => navigate('/home')}
              className="bg-gray-300 text-gray-900 font-semibold px-3 py-1 sm:px-4 sm:py-2 rounded-full hover:bg-gray-400 shadow-md text-xs sm:text-sm md:text-base"
            >
              {t.backToHome}
            </button>
            <button
              onClick={() => {
                if (window.confirm(t.logoutConfirmation)) {
                  localStorage.removeItem('user');
                  navigate('/login');
                }
              }}
              className="bg-[#f25c05] hover:bg-[#d14e00] text-white font-semibold px-4 py-1 sm:px-5 sm:py-2 rounded-full shadow-lg shadow-[#f25c05]/50 transition-colors text-xs sm:text-sm md:text-base"
            >
              {t.logout}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6 md:p-8">
       <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6 md:mb-8">Appealed Cases</h1>


        {appeals.length === 0 ? (
          <p className="text-center italic text-gray-700 text-sm sm:text-base">{t.noRejectedCases}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto">
            {appeals.map(({ id, caseId, reason, status, assignedProsecutor, submittedAt }) => (
              <div key={id} className="bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                  <div>
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold">Case ID: {caseId}</h2>
                    <p className="text-xs sm:text-sm text-gray-600">Reason: {reason}</p>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-blue-600">
                    {t.caseStatus?.[status?.toLowerCase()] || status}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-gray-700 mt-1 sm:mt-2 md:mt-3">
                  Prosecutor: {assignedProsecutor || 'N/A'}
                </p>

                <p className="text-xs sm:text-sm text-gray-700 mt-1 sm:mt-2 md:mt-3">
                  Submitted: {submittedAt ? new Date(submittedAt).toLocaleString() : 'N/A'}
                </p>

                <div className="mt-2 sm:mt-3 md:mt-4 flex justify-end">
                  <button
                    disabled
                    className="bg-gray-400 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full font-semibold text-xs sm:text-sm md:text-base cursor-not-allowed"
                  >
                    {t.appealSubmitted}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AppealPage;
