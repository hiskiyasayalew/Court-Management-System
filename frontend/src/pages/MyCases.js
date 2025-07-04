import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const MyCases = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [judgeDecision, setJudgeDecision] = useState(null); // 🔥 NEW

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
        setCases(userCases?.filter(Boolean) || []);
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
      setCases(cases.filter(c => c?.id !== caseId));
      if (selectedCase?.id === caseId) {
        setSelectedCase(null);
        setJudgeDecision(null);
      }
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
      setSelectedCase(null);
      setJudgeDecision(null);
    } catch (error) {
      console.error("Error clearing cases:", error);
      alert(error.message);
    }
  };

  const handleCaseClick = async (caseData) => {
    if (selectedCase && selectedCase.id === caseData.id) {
      setSelectedCase(null);
      setJudgeDecision(null);
      return;
    }

    setSelectedCase(caseData);
    try {
      const response = await fetch(`http://localhost:8080/api/judge/decision?caseId=${caseData.id}`);
      if (response.ok) {
        const decisions = await response.json();
        setJudgeDecision(decisions?.[0] || null); // take first if multiple
      } else {
        setJudgeDecision(null);
      }
    } catch (err) {
      console.error("Failed to fetch judge decision:", err);
      setJudgeDecision(null);
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
                {cases.filter(Boolean).map(c => (
                  <li
                    key={c.id}
                    className={`p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-150
                      ${selectedCase?.id === c.id ? 'bg-gray-100' : ''}`}
                    onClick={() => handleCaseClick(c)}
                    aria-expanded={selectedCase?.id === c.id}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg text-gray-800">{c.fullName}</h3>
                          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            {c.caseType}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(c.submittedAt).toLocaleString()}
                        </p>
                        <p className={`mt-2 text-sm font-medium ${
                          c.status === (t.submittedToProcess || 'Submitted to Process') 
                            ? 'text-orange-600' 
                            : 'text-green-600'
                        }`}>
                          {c.status}
                        </p>
                        {c.caseDescription && (
                          <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap truncate max-w-xl">
                            {c.caseDescription}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCase(c.id);
                          }}
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

            <AnimatePresence>
              {selectedCase && (
                <motion.div
                  key={selectedCase.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-lg p-8 mb-8 max-w-4xl mx-auto"
                >
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">
                    {t.caseDetails || "Case Details"} - {selectedCase.fullName}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 text-sm">
                    <div>
                      <p><strong>{t.caseId || "Case ID"}:</strong> {selectedCase.id}</p>
                      <p><strong>{t.caseType || "Case Type"}:</strong> {selectedCase.caseType}</p>
                      <p><strong>{t.submittedAt || "Submitted At"}:</strong> {new Date(selectedCase.submittedAt).toLocaleString()}</p>
                      <p><strong>{t.status || "Status"}:</strong> {selectedCase.status}</p>
                    </div>
                    <div>
                      {selectedCase.caseDescription && (
                        <>
                          <p><strong>{t.caseDescription || "Description"}:</strong></p>
                          <p className="whitespace-pre-wrap">{selectedCase.caseDescription}</p>
                        </>
                      )}
                      {selectedCase.evidenceSummary && (
                        <>
                          <p className="mt-4"><strong>{t.evidenceSummary || "Evidence Summary"}:</strong></p>
                          <p className="whitespace-pre-wrap">{selectedCase.evidenceSummary}</p>
                        </>
                      )}
                      {selectedCase.witnesses && (
                        <>
                          <p className="mt-4"><strong>{t.witnesses || "Witnesses"}:</strong></p>
                          <p className="whitespace-pre-wrap">{selectedCase.witnesses}</p>
                        </>
                      )}
                    </div>
                  </div>

                  {judgeDecision && (
                    <div className="mt-8 border-t pt-6">
                      <h4 className="text-xl font-semibold text-gray-800 mb-4">
                        {t.judgeDecision || "Judge Decision"}
                      </h4>
                      <p><strong>{t.assignedCourt || "Assigned Court"}:</strong> {judgeDecision.assignedCourt}</p>
                      <p><strong>{t.hearingDate || "Hearing Date"}:</strong> {new Date(judgeDecision.hearingDate).toLocaleString()}</p>
                      <p><strong>{t.status || "Status"}:</strong> {judgeDecision.status}</p>
                      {judgeDecision.assignedJudges && judgeDecision.assignedJudges.length > 0 && (
                        <>
                          <p><strong>{t.assignedJudges || "Assigned Judges"}:</strong></p>
                          <ul className="list-disc list-inside text-sm text-gray-700">
                            {judgeDecision.assignedJudges.map((judge, index) => (
                              <li key={index}>{judge}</li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

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
