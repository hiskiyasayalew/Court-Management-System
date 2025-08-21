import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const AppealPage = () => {
  const { t } = useLanguage();
  const [appeals, setAppeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppeals = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.userName) {
        setError('User not found. Please log in again.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:8080/api/appeals/by-user?userName=${user.userName}`);
        if (!response.ok) throw new Error('Failed to fetch appeals');
        const appealsData = await response.json();
        setAppeals(appealsData);
        setError('');
      } catch (error) {
        console.error('Error fetching appeals:', error);
        setError('Failed to load appeals. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppeals();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-3 sm:p-4 shadow-sm">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-gray-900 font-bold text-xl sm:text-2xl">{t.title || 'Court Case Management'}</div>

          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3">
            <LanguageSwitcher className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-lg shadow-sm text-sm" />

            <button
              onClick={() => navigate('/mycases')}
              className="bg-gray-100 text-gray-900 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-200 shadow-sm text-sm transition-colors"
            >
              {t.myCases || 'My Cases'}
            </button>
            <button
              onClick={() => navigate('/home')}
              className="bg-gray-100 text-gray-900 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-200 shadow-sm text-sm transition-colors"
            >
              {t.backToHome || 'Back to Home'}
            </button>
            <button
              onClick={() => {
                if (window.confirm(t.logoutConfirmation || 'Are you sure you want to logout?')) {
                  localStorage.removeItem('user');
                  navigate('/login');
                }
              }}
              className="bg-[#f25c05] hover:bg-[#d14e00] text-white font-medium px-4 py-1.5 rounded-lg shadow transition-colors text-sm"
            >
              {t.logout || 'Logout'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6 md:p-8 max-w-screen-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-800">
          {t.appealedCases || 'Appealed Cases'}
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg text-red-700 text-center max-w-md mx-auto">
            {error}
          </div>
        ) : appeals.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-center max-w-md mx-auto">
            <p className="text-gray-700 mb-4">{t.noRejectedCases || 'No appealed cases found.'}</p>
            <button
              onClick={() => navigate('/mycases')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              View My Cases
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4 sm:gap-5 md:gap-6">
            {appeals.map(({ id, caseId, reason, status, assignedProsecutor, submittedAt }) => (
              <div key={id} className="bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-3">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Case ID: {caseId}</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    status?.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' :
                    status?.toLowerCase() === 'rejected' ? 'bg-red-100 text-red-800' :
                    status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {t.caseStatus?.[status?.toLowerCase()] || status || 'Unknown Status'}
                  </span>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Appeal Reason:</h3>
                  <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg">{reason || 'No reason provided'}</p>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 text-sm text-gray-700">
                  <div>
                    <span className="font-medium">Prosecutor:</span>
                    <p className="truncate">{assignedProsecutor || 'Not assigned'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Submitted:</span>
                    <p>{submittedAt ? new Date(submittedAt).toLocaleString() : 'N/A'}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium">
                    {t.appealSubmitted || 'Appeal Submitted'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-8 py-4 px-4 text-center text-xs text-gray-500 border-t border-gray-200">
        <p>&copy; {new Date().getFullYear()} Court Case Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AppealPage;