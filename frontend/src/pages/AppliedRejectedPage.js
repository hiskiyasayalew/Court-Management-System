import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AppliedRejectedPage = () => {
  const navigate = useNavigate();
  const [approvedCases, setApprovedCases] = useState([]);
  const [rejectedCases, setRejectedCases] = useState([]);
  const [view, setView] = useState('approved');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        // Fetch approved cases
        const approvedResponse = await fetch("http://localhost:8080/api/police/approved-cases");
        if (!approvedResponse.ok) throw new Error('Failed to fetch approved cases');
        const approvedData = await approvedResponse.json();
        setApprovedCases(approvedData);
        
        // Fetch rejected cases
        const rejectedResponse = await fetch("http://localhost:8080/api/police/rejected-cases");
        if (!rejectedResponse.ok) throw new Error('Failed to fetch rejected cases');
        const rejectedData = await rejectedResponse.json();
        setRejectedCases(rejectedData);
      } catch (err) {
        console.error("Error loading cases:", err);
        setError('Failed to load cases. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      {/* Header with navigation */}
      <header className="mb-6 sm:mb-8">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <motion.button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base"
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </motion.button>
          
          <motion.button
            onClick={() => navigate('/home')}
            className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-300 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Home
          </motion.button>
        </div>
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-2">
          Case Decisions
        </h1>
        <p className="text-center text-gray-600 text-sm sm:text-base">
          View approved and rejected cases
        </p>
      </header>

      {/* View toggle buttons */}
      <div className="flex justify-center mb-5 sm:mb-6 md:mb-8">
        <div className="bg-gray-100 p-1 rounded-lg flex">
          <motion.button
            onClick={() => setView('approved')}
            className={`px-4 py-2 rounded-md text-sm sm:text-base font-medium transition-colors ${
              view === 'approved' 
                ? 'bg-white text-blue-700 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Approved ({approvedCases.length})
          </motion.button>
          <motion.button
            onClick={() => setView('rejected')}
            className={`px-4 py-2 rounded-md text-sm sm:text-base font-medium transition-colors ${
              view === 'rejected' 
                ? 'bg-white text-red-700 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Rejected ({rejectedCases.length})
          </motion.button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <motion.div 
          className="bg-red-50 text-red-700 p-3 rounded-lg mb-5 text-center text-sm sm:text-base"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <motion.div 
            className="h-10 w-10 bg-blue-600 rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 1.5
            }}
          />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {view === 'approved' ? (
            <>
              {approvedCases.length === 0 ? (
                <motion.div 
                  className="bg-white p-6 rounded-xl shadow-sm text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-gray-400 mb-3">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base">No approved cases found.</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {approvedCases.map((c) => (
                    <motion.div
                      key={c.id}
                      className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500 hover:shadow-md transition-shadow"
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <h2 className="text-lg font-semibold text-gray-800 mb-2 truncate">{c.fullName}</h2>
                      <div className="flex items-center mb-3">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                          {c.caseType}
                        </span>
                        <span className="ml-auto text-xs text-gray-500">
                          {new Date(c.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>ID: {c.id}</span>
                        <span>{new Date(c.submittedAt).toLocaleTimeString()}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {rejectedCases.length === 0 ? (
                <motion.div 
                  className="bg-white p-6 rounded-xl shadow-sm text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-gray-400 mb-3">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base">No rejected cases found.</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {rejectedCases.map((c) => (
                    <motion.div
                      key={c.id}
                      className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500 hover:shadow-md transition-shadow"
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <h2 className="text-lg font-semibold text-gray-800 mb-2 truncate">{c.fullName}</h2>
                      <div className="flex items-center mb-3">
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                          {c.caseType}
                        </span>
                        <span className="ml-auto text-xs text-gray-500">
                          {new Date(c.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>ID: {c.id}</span>
                        <span>{new Date(c.submittedAt).toLocaleTimeString()}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AppliedRejectedPage;