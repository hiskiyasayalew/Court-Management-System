import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const MyCases = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserCases = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.userName) {
        setError(t.userNotAuthenticated || "User not authenticated");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/cases/by-user?userName=${user.userName}`);
        if (!response.ok) throw new Error(t.fetchCasesFailed || "Failed to fetch user cases");
        const userCases = await response.json();
        setCases(userCases);
      } catch (error) {
        console.error("Error loading cases:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserCases();
  }, [t]);

  const deleteCase = async (caseId) => {
    if (!window.confirm(t.confirmDeleteCase || "Are you sure you want to delete this case?")) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/cases/${caseId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(t.deleteCaseFailed || "Failed to delete case");
      setCases(cases.filter(c => c.id !== caseId));
    } catch (error) {
      console.error("Error deleting case:", error);
      alert(error.message);
    }
  };

  const clearAllCases = async () => {
    if (!window.confirm(t.confirmClearAllCases || "Are you sure you want to delete ALL your cases?")) return;
    
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.userName) return;

    try {
      const response = await fetch(`http://localhost:8080/api/cases/clear?userName=${user.userName}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(t.clearCasesFailed || "Failed to clear cases");
      setCases([]);
    } catch (error) {
      console.error("Error clearing cases:", error);
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f25c05] mx-auto mb-4"></div>
          <p className="text-gray-700">{t.loading || "Loading your cases..."}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">{t.error || "Error"}</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => navigate('/home')}
            className="bg-[#f25c05] hover:bg-[#d14e00] text-white font-semibold px-4 py-2 rounded transition"
          >
            {t.backToHome || "Back to Home"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
          {t.submittedCasesTitle || "Your Submitted Cases"}
        </h2>

        {cases.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-gray-600">{t.noCases || "You haven't submitted any cases yet."}</p>
            <button
              onClick={() => navigate('/submit-case')}
              className="mt-4 bg-[#f25c05] hover:bg-[#d14e00] text-white font-semibold px-4 py-2 rounded transition"
            >
              {t.submitNewCase || "Submit New Case"}
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <ul className="divide-y divide-gray-200 max-h-[calc(100vh-300px)] overflow-y-auto">
                {cases.map(({ id, fullName, caseType, submittedAt, status, caseDescription }) => (
                  <li
                    key={id}
                    className="p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg text-gray-800">{fullName}</h3>
                          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            {caseType}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(submittedAt).toLocaleString()}
                        </p>
                        <p className={`mt-2 text-sm font-medium ${
                          status === (t.submittedToProcess || 'Submitted to Process') 
                            ? 'text-orange-600' 
                            : 'text-green-600'
                        }`}>
                          {status}
                        </p>
                        {caseDescription && (
                          <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                            {caseDescription}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => deleteCase(id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-semibold transition"
                          aria-label={t.deleteCase || "Delete case"}
                        >
                          {t.delete || 'Delete'}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <button
                onClick={clearAllCases}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded transition text-sm sm:text-base"
              >
                {t.clearAll || 'Clear All Cases'}
              </button>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/submit-case')}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded transition text-sm sm:text-base"
                >
                  {t.submitNewCase || 'Submit New Case'}
                </button>
                <button
                  onClick={() => navigate('/home')}
                  className="bg-[#f25c05] hover:bg-[#d14e00] text-white font-semibold px-4 py-2 rounded transition text-sm sm:text-base"
                >
                  {t.backToHome || 'Back to Home'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyCases;