import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const MyCases = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);

  useEffect(() => {
    const fetchUserCases = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.userName) return;

      try {
        const response = await fetch(`http://localhost:8080/api/cases/by-user?userName=${user.userName}`);
        if (!response.ok) throw new Error("Failed to fetch user cases");
        const userCases = await response.json();
        setCases(userCases);
      } catch (error) {
        console.error("Error loading cases:", error);
      }
    };
    fetchUserCases();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-200 text-gray-900 font-sans p-8">
      <h2 className="text-3xl font-extrabold mb-6 text-center">{t.submittedCasesTitle}</h2>
      {cases.length === 0 ? (
        <p className="text-center text-gray-700 italic">{t.noCases}</p>
      ) : (
        <ul className="space-y-4 max-h-96 overflow-y-auto p-4 bg-gray-300 rounded-xl shadow-inner border border-gray-400">
          {cases.map(({ id, fullName, caseType, submittedAt, status }) => (
            <li key={id} className="bg-white p-4 rounded-xl shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#f25c05] transition">
              <p className="font-semibold text-lg">{fullName}</p>
              <p className="text-sm text-gray-600">{caseType}</p>
              <p className="text-sm text-gray-500">{new Date(submittedAt).toLocaleString()}</p>
              <p className={`mt-1 font-semibold ${status === (t.submittedToProcess || 'Submitted to Process') ? 'text-orange-600' : 'text-green-700'}`}>{status}</p>
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-center mt-4">
        <button 
          onClick={() => navigate('/home')} 
          className="bg-[#03314b] text-white font-bold px-3 py-1 rounded-full shadow-md text-sm"
        >
          {t.backToHome || 'Back to Home'}
        </button>
      </div>
    </div>
  );
};

export default MyCases;